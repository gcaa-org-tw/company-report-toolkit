import fs from 'fs'
import path from 'path'
import CsvReadableStream from 'csv-reader'
import AutoDetectDecoderStream from 'autodetect-decoder-stream'
import { app } from '../src/app'
import { fieldMetaPath } from '../src/services/field-meta/field-meta.shared'

function getDataType(humanType: string) {
  if (humanType === '有／無') {
    return 'boolean'
  } else if (humanType === '數值') {
    return 'number'
  }

  return 'string'
}

function seed () {
  const metaService = app.service(fieldMetaPath)
  const tasks: Array<Promise<any>> = []
  const dataPromises: Array<Promise<void>> = []
  
  const jobPromise = new Promise((resolve, reject) => {
    fs
      .createReadStream(path.join(__dirname, './field-meta.csv'))
      .pipe(new AutoDetectDecoderStream())
      .pipe(new CsvReadableStream({ asObject: true }))
      .on('data', (data: any) => {
        const dataPromise = (async () => {
          const id = Number.parseInt(data.欄位編號)
          const name = data.收集欄位
          const historyColumnName = data.ESG檢測儀欄位名稱
          const keywords = Object.keys(data)
            .filter((key) => key.includes('關鍵字'))
            .map((key) => data[key].trim())
            .filter(Boolean)
          const description = data.欄位說明
          const dataType = getDataType(data.欄位類型)
          const numberStep = data.數值最小單位.toString() || '1'
          const defaultUnit = (data.匯出單位 as string).trim()
          const units = (data.單位備選 as string)
            .split(/[\/／]/)
            .map(unit => unit.trim())
            .filter(unit => !!unit && unit !== 'NA')

          const unitTransformer = (data.單位換算 as string)
            .split(/[\/／]/)
            .map(unit => Number.parseFloat(unit.trim()))
            .filter(unit => !!unit)

          const isCustomUnit = units.length === 1 && units[0] === '自填'

          const existing = await metaService.find({ query: { id, $limit: 0 }})
          const payload = {
            name,
            historyColumnName,
            keywords,
            description,
            dataType,
            numberStep,
            units,
            defaultUnit,
            unitTransformer,
            isCustomUnit
          } as any
          if (existing.total) {
            tasks.push(
              metaService.patch(id, payload)
            )
          } else {
            tasks.push(
              metaService.create({
                id,
                ...payload
              })
            )
          }
        })()
        dataPromises.push(dataPromise)
      })
      .on('error', (err: any) => {
        console.error('CSV parsing error:', err)
        reject(err)
      })
      .on('end', () => {
        resolve(null)
      })
  })

  jobPromise.then(async () => {
    await Promise.all(dataPromises)
    await Promise.all(tasks)
    console.log(`Seeded ${tasks.length} field meta`)
    // shutdown app as knex.destroy print error XD
    process.exit(0)
  }).catch(err => {
    console.error('Seed error:', err)
    process.exit(1)
  })
}

seed()
