import fs from 'fs'
import path from 'path'
import { parse } from 'yaml'
import { app } from '../src/app'
import { reportPath } from '../src/services/report/report.shared'

async function seed () {
  const reportService = app.service(reportPath)
  const seedPath = path.join(__dirname, './report-list.yml')
  const reportList = parse(fs.readFileSync(seedPath, 'utf8')) as any[]
  const tasks = reportList.flatMap(({ year, reports }: { year: number, reports: any[] }) => {
    return reports.map((report) => {
      // tax ID must be 8 digits
      const companyId = report.id.padStart(8, '0')
      return new Promise(async (resolve) => {
        const existing = await reportService.find({ query: { companyId, year, $limit: 0 }})
        if (existing.total) {
          resolve(false)
          return
        }
        await reportService.create({
          year,
          companyId,
          totalPages: report.totalPage,
          pageOffset: report.pageOffset || 0
        })
        resolve(true)
      })
    })
  })
  const results = await Promise.all(tasks)
  const successCount = results.filter(Boolean).length
  console.log(`Seeded ${successCount} reports`)
  // shutdown app as knex.destroy print error XD
  process.exit(0)
}

seed()
