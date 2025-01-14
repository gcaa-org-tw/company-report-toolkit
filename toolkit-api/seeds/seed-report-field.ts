import fs from 'fs'
import path from 'path'
import { parse } from 'yaml'
import ora from 'ora'
import { app } from '../src/app'
import { reportPath } from '../src/services/report/report.shared'
import { reportFieldPath } from '../src/services/report-field/report-field.shared'
import { fieldMetaPath } from '../src/services/field-meta/field-meta.shared'

async function seed () {
  const reportService = app.service(reportPath)
  const metaService = app.service(fieldMetaPath)
  const fieldService = app.service(reportFieldPath)

  const spinner = ora('Generating all tasks...').start()

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

  spinner.succeed(`Going to seed ${tasks.length} report fields, split into ${chunkedTasks.length} chunks`)

  spinner.start('Seeding report fields...')
  let doneCount = 0
  for(const chunk of chunkedTasks) {
    doneCount += 1
    const progress = Math.round(doneCount / chunkedTasks.length * 100)
    spinner.text = `[${progress}%] Seeding report fields... (${doneCount}/${chunkedTasks.length})`
    await Promise.all(chunk.map((newTask) => {
      return fieldService.create(newTask)
    }))
  }

  spinner.succeed(`Seeded ${tasks.length} report fields`)

  // init report stats
  const nFields = metaList.length
  await Promise.all(reports.map((report) => {
    return reportService.patch(report.id, {
      totalFields: nFields,
      answeredFields: 0,
      isVerified: false
    })
  }))
  spinner.succeed(`Initialized ${reports.length} report stats`)

  // shutdown app as knex.destroy print error XD
  process.exit(0)
}

seed()
