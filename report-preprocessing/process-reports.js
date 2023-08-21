import parseArgs from 'command-line-args'
import csvtojson from 'csvtojson'
import dotenv from 'dotenv'
import shellExec from 'shell-exec'
import * as url from 'node:url'

import { buildOneIndex } from './build-index.js'
import path from 'path'
import fs from 'fs'

async function prepareCompanyMap () {
  const rows = await csvtojson().fromFile('./companyList.csv')
  const companyMap = rows.reduce((acc, row) => {
    acc.name[row.公司名稱] = row.統編
    acc.abbr[row.公司簡稱] = row.統編
    acc.id[row.統編] = row.公司簡稱
    return acc
  }, {name: {}, abbr: {}, id: {}})
  return companyMap
}

async function main (argPayload) {
  const companyMap = await prepareCompanyMap()
  const resultList = []

  for (const reportName of argPayload.src) {
    // reportName = <company name>-<year>.pdf
    const [name, year] = path.parse(reportName).name.split('-').map(s => s.trim())
    const companyId = companyMap.name[name] || companyMap.abbr[name]
    if (!companyId) {
      console.error(`***** Cannot find company ID for ${reportName} *****`)
      continue
    }
    console.info(`== Processing ${reportName} for ${companyId}[${year}]`)
    const totalPage = await buildOneIndex({
      src: reportName,
      companyId,
      year
    })

    console.info('Splitting and minifying')
    const cmd = `./split-n-minify.sh "${reportName}" ./report/${year}/${companyId}`
    const consoleOutput = await shellExec.default(cmd)

    // avoid potential \r or special characters
    console.info(consoleOutput.stdout.split('\n').map(s => s.trim()).join('\n'))

    console.info('Done')

    resultList.push({
      id: companyId,
      name: companyMap.id[companyId],
      totalPage
    })
  }

  fs.writeFileSync('./report/result.json', JSON.stringify(resultList, null, 2))
  console.info('Check company list in ./report/result.json')
}

const modulePath = url.fileURLToPath(import.meta.url)
if (process.argv[1] === modulePath) {
  dotenv.config()
  const argOpts = [
    { name: 'src', alias: 's', type: String, multiple: true }
  ]
    
  const argPayload = parseArgs(argOpts)

  if (argOpts.some(arg => !(arg.name in argPayload))) {
    console.error(`usage: node ${process.argv[1]} -s <source file> -s <source file> ...`)
    process.exit(1)
  }

  main(argPayload)
}

