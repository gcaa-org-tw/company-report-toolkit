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
  const jobPromise = new Promise((resolve) => {
    const tasks: Array<Promise<any>> = []
    fs
      .createReadStream(path.join(__dirname, './field-meta.csv'))
      .pipe(new AutoDetectDecoderStream())
      .pipe(new CsvReadableStream({ asObject: true }))
      .on('data', async (data: any) => {
        const id = Number.parseInt(data.欄位編號)
        const name = data.收集欄位
        const keywords = Object.keys(data)
          .filter((key) => key.includes('關鍵字'))
          .map((key) => data[key].trim())
          .filter(Boolean)
        const description = data.欄位說明
        const dataType = getDataType(data.欄位類型)
        const units = (data.單位備選 as string)
          .split('／')
          .map(unit => unit.trim())
          .filter(unit => !!unit && unit !== 'NA' && unit !== '無')

        const existing = await metaService.find({ query: { id, $limit: 0 }})
        resolve(null)
        if (existing.total) {
          tasks.push(
            metaService.patch(id, {
              name,
              keywords,
              description,
              dataType,
              units
            })
          )
        } else {
          tasks.push(
            metaService.create({
              id,
              name,
              keywords,
              description,
              dataType,
              units
            })
          )
        }
      })
      .on('end', async () => {
        await jobPromise
        await Promise.all(tasks)
        console.log(`Seeded ${tasks.length} field meta`)
        // shutdown app as knex.destroy print error XD
        process.exit(0)
      })
    })
}

seed()
