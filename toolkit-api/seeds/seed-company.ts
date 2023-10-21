import fs from 'fs'
import path from 'path'
import CsvReadableStream from 'csv-reader'
import AutoDetectDecoderStream from 'autodetect-decoder-stream'
import { app } from '../src/app'
import { companyPath } from '../src/services/company/company.shared'

function seed () {
  const companyService = app.service(companyPath)
  const jobPromise = new Promise((resolve) => {
    const tasks: Array<Promise<any>> = []
    fs
      .createReadStream(path.join(__dirname, './company-list.csv'))
      .pipe(new AutoDetectDecoderStream())
      .pipe(new CsvReadableStream({ asObject: true }))
      .on('data', async (data: any) => {
        const existing = await companyService.find({ query: { id: data.tax_code, $limit: 0 }})
        resolve(null)
        if (existing.total) return
        tasks.push(
          companyService.create({
            id: data.tax_code,
            name: data.name,
            abbreviation: data.name_abbr,
            industry: data.industry,
            stockCode: data.stock_code
          })
        )
      })
      .on('end', async () => {
        await jobPromise
        await Promise.all(tasks)
        console.log(`Seeded ${tasks.length} companies`)
        // shutdown app as knex.destroy print error XD
        process.exit(0)
      })
    })
}

seed()
