import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import pdf2html from 'pdf2html'
import yaml from 'js-yaml'
import { prepareCompanyMap, extractPdfNameInfo } from './utils.js'
import ora from 'ora'

const pdfOptions = {
  maxBuffer: 1024 * 1024 * 50,
  text: true
}

// Function to get total pages of a PDF
async function getTotalPages(pdfPath) {
  const pages = await pdf2html.pages(pdfPath, pdfOptions)
  return pages.length
}



// Main function
async function main() {
  const pdfFiles = process.argv.slice(2)
  if (pdfFiles.length === 0) {
    console.error('No PDF files provided.')
    process.exit(1)
  }

  const spinner = ora('Preparing company map...').start()
  const companyMap = await prepareCompanyMap()
  spinner.succeed('Company map prepared!')

  const reportsPerYear = {}
  const totalReports = pdfFiles.length
  let processed = 0
  spinner.start(`Processing 0/${totalReports} PDFs...`)

  for (const pdfFile of pdfFiles) {
    const { companyId, year } = extractPdfNameInfo(pdfFile)

    try {
      const totalPages = await getTotalPages(pdfFile)
      processed += 1
      spinner.text = `Processing ${processed}/${totalReports}`
      const companyInfo = {
        id: companyId,
        name: companyMap.id[companyId],
        totalPages: totalPages
      }

      if (!reportsPerYear[year]) {
        reportsPerYear[year] = []
      }

      reportsPerYear[year].push(companyInfo)
    } catch (err) {
      console.error(`Failed to get total pages for ${pdfFile}: ${err.message}`)
    }
  }

  spinner.succeed(`Processed ${processed}`)
  spinner.start('Writing report list...')

  const output = []

  for (const year in reportsPerYear) {
    output.push({
      year: Number(year),
      reports: reportsPerYear[year]
    })
  }

  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  fs.writeFileSync(
    path.join(__dirname, 'report-list.yml'),
    yaml.dump(output)
  )
  spinner.succeed('All done! Check report-list.yml for the result.')
}

main()