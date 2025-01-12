import path from 'path'
import pdf2html from 'pdf2html'
import yaml from 'js-yaml'
import { prepareCompanyMap, extractPdfNameInfo } from './utils.js'

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

  const companyMap = await prepareCompanyMap()
  const reportsPerYear = {}

  for (const pdfFile of pdfFiles) {
    const { companyId, year } = extractPdfNameInfo(pdfFile)

    try {
      const totalPages = await getTotalPages(pdfFile)
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

  const output = []

  for (const year in reportsPerYear) {
    output.push({
      year: year,
      reports: reportsPerYear[year]
    })
  }

  console.log(yaml.dump(output))
}

main()