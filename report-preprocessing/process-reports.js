import parseArgs from 'command-line-args'
import dotenv from 'dotenv'
import shellExec from 'shell-exec'
import * as url from 'node:url'

import { prepareCompanyMap, extractPdfNameInfo } from './utils.js'
import { buildOneIndex } from './build-index.js'
import path from 'path'
import fs from 'fs'

function buildIgnoreList (ignoreFileList) {
  const ignoreList = new Map()
  for (const ignoreFile of ignoreFileList) {
    const ignoreContent = JSON.parse(fs.readFileSync(ignoreFile, 'utf8'))
    for (const ignore of ignoreContent) {
      const id = `${ignore.id}-${ignore.year}`
      ignoreList.set(id, ignore)
    }
  }
  return ignoreList
}

async function main (argPayload) {
  const reportDefPath = `./report/result.${Date.now()}.json`
  const companyMap = await prepareCompanyMap()
  const resultList = []
  const ignoreList = buildIgnoreList(argPayload.ignore || [])

  for (const reportName of argPayload.src) {
    const { companyId, year } = extractPdfNameInfo(reportName)

    if (!companyId) {
      console.error(`***** Cannot find company ID for ${reportName} *****`)
      continue
    }
    if (ignoreList.has(`${companyId}-${year}`)) {
      console.info(`***** skip ${companyId} - ${year} as it's existed *****`)
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
      year,
      totalPage
    })
    // in case of script crash
    fs.writeFileSync(reportDefPath, JSON.stringify(resultList, null, 2))
  }
  
  if (resultList.length === 0) {
    console.info('No report processed')
    return
  }
  fs.writeFileSync(reportDefPath, JSON.stringify(resultList, null, 2))
  console.info(`Check company list in ${reportDefPath}`)
}

const modulePath = url.fileURLToPath(import.meta.url)
if (process.argv[1] === modulePath) {
  dotenv.config()
  const argOpts = [
    { name: 'src', alias: 's', type: String, multiple: true },
    { name: 'ignore', alias: 'i', type: String, multiple: true }
  ]
    
  const argPayload = parseArgs(argOpts)

  if (!argPayload.src) {
    console.error(`usage: node ${process.argv[1]} -s <source file> <source file> ...`)
    process.exit(1)
  }

  main(argPayload)
}

