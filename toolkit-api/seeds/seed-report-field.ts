import fs from 'fs'
import path from 'path'
import { parse } from 'yaml'
import { app } from '../src/app'
import { reportPath } from '../src/services/report/report.shared'
import { reportFieldPath } from '../src/services/report-field/report-field.shared'
import { fieldMetaPath } from '../src/services/field-meta/field-meta.shared'

async function seed () {
  const reportService = app.service(reportPath)
  const metaService = app.service(fieldMetaPath)
  const fieldService = app.service(reportFieldPath)

  const reports = await reportService.find({ paginate: false })
  const metaList = await metaService.find({ paginate: false })

  const tasks = reports.flatMap((report) => {
    return metaList.map((meta) => {
      return {
        reportId: report.id,
        fieldId: meta.id
      }
    })
  })

  // separate tasks into chunks
  const chunkSize = 100
  const chunkedTasks: any[][] = tasks.reduce((acc: any[][], task) => {
    const lastChunk = acc[acc.length - 1]
    if (lastChunk.length < chunkSize) {
      lastChunk.push(task)
    } else {
      acc.push([task])
    }
    return acc
  }, [[]])

  console.log(`Seeding ${chunkedTasks.length} chunks of ${chunkSize} tasks`)
  let doneCount = 0
  for(const chunk of chunkedTasks) {
    doneCount += 1
    if (doneCount % 10 === 0) {
      console.log(`Done ${doneCount} chunks`)
    }
    await Promise.all(chunk.map((newTask) => {
      return fieldService.create(newTask)
    }))
  }

  console.log(`Seeded ${tasks.length} report fields`)
  // shutdown app as knex.destroy print error XD
  process.exit(0)
}

seed()
