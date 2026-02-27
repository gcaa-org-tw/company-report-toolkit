import fs from 'fs'
import path from 'path'
import CsvReadableStream from 'csv-reader'
import AutoDetectDecoderStream from 'autodetect-decoder-stream'
import ora from 'ora'
import dayjs from 'dayjs'
import { app } from '../src/app'
import { reportPath } from '../src/services/report/report.shared'
import { reportFieldPath } from '../src/services/report-field/report-field.shared'
import { fieldMetaPath } from '../src/services/field-meta/field-meta.shared'
import { companyPath } from '../src/services/company/company.shared'

const isDryRun = process.argv.includes('--dry-run')
const csvArg = process.argv.slice(2).find(a => !a.startsWith('--'))
if (!csvArg) {
  console.error('Usage: npx ts-node seeds/seed-prefill-report-field.ts <path-to-csv> [--dry-run]')
  process.exit(1)
}
const CSV_PATH = path.resolve(csvArg)

interface ParsedRow {
  reportId: number
  fieldId: number
  value?: string
  unit?: string
  notes?: string
  pageIndex?: number
}

interface ParseError {
  rowNumber: number
  message: string
}

function extractPageIndex(pageRef: string): number | undefined {
  const match = pageRef.match(/p\.(\d+)/i)
  return match ? parseInt(match[1], 10) : undefined
}

function buildNotes(comment: string, pageRef: string): string | undefined {
  const parts: string[] = []
  const trimmedComment = comment.trim()
  const trimmedPageRef = pageRef.trim()
  if (trimmedComment) parts.push(trimmedComment)
  if (trimmedPageRef && trimmedPageRef !== 'NA') parts.push(`參考頁數：${trimmedPageRef}`)
  return parts.length > 0 ? parts.join('\n\n') : undefined
}

async function seed() {
  const reportService = app.service(reportPath)
  const metaService = app.service(fieldMetaPath)
  const companyService = app.service(companyPath)
  const rdbClient = app.get('rdbClient')

  const spinner = ora('Loading reports, companies, and field-metas...').start()

  // Load all companies and build stockCode → taxCode (companyId) map
  const companies = await companyService.find({ paginate: false }) as any[]
  const stockToTaxMap = new Map<string, string>()
  for (const company of companies) {
    if (company.stockCode) {
      stockToTaxMap.set(company.stockCode.trim(), company.id)
    }
    // also index by tax code itself for direct matches
    stockToTaxMap.set(company.id, company.id)
  }

  // Load all reports into a lookup map keyed by "year-companyId"
  const reports = await reportService.find({ paginate: false }) as any[]
  const reportMap = new Map<string, any>()
  for (const report of reports) {
    const key = `${report.year}-${report.companyId}`
    reportMap.set(key, report)
  }

  // Load all field-metas into a lookup map keyed by id
  const fieldMetas = await metaService.find({ paginate: false }) as any[]
  const fieldMetaSet = new Set<number>()
  const fieldMetaTypeMap = new Map<number, string>()
  for (const meta of fieldMetas) {
    fieldMetaSet.add(meta.id)
    fieldMetaTypeMap.set(meta.id, meta.dataType)
  }

  spinner.succeed(`Loaded ${companies.length} companies, ${reports.length} reports, ${fieldMetas.length} field-metas`)

  // Parse CSV and validate all rows
  spinner.start('Parsing CSV...')
  const validRows: ParsedRow[] = []
  const errors: ParseError[] = []
  const skippedCompanies = new Map<string, number>() // rawCompanyCode → skip count

  await new Promise<void>((resolve, reject) => {
    let rowNumber = 0
    fs.createReadStream(CSV_PATH)
      .pipe(new AutoDetectDecoderStream())
      .pipe(new CsvReadableStream({ asObject: true }))
      .on('data', (data: any) => {
        rowNumber++

        // Validate and parse 欄位編號 (fatal)
        const rawFieldId = (data['欄位編號'] ?? '').toString().trim()
        if (!rawFieldId) {
          errors.push({ rowNumber, message: `Blank 欄位編號 (row data: 年份=${data['西元年份']}, 公司=${data['公司簡稱']})` })
          return
        }
        const fieldId = parseInt(rawFieldId, 10)
        if (isNaN(fieldId)) {
          errors.push({ rowNumber, message: `Non-integer 欄位編號: "${rawFieldId}" (年份=${data['西元年份']}, 公司=${data['公司簡稱']})` })
          return
        }

        // Validate field-meta exists (fatal)
        if (!fieldMetaSet.has(fieldId)) {
          errors.push({ rowNumber, message: `No field-meta found for 欄位編號=${fieldId} (年份=${data['西元年份']}, 公司=${data['公司簡稱']})` })
          return
        }

        // Look up report — unresolvable company codes are skipped (non-fatal)
        // 公司代碼 may be a stock code (e.g. "1101") or a tax ID directly ("04388145")
        const year = (data['西元年份'] ?? '').toString().trim()
        const rawCompanyCode = (data['公司代碼'] ?? '').toString().trim()
        // Resolve: stock code → tax ID, or direct tax ID match
        const companyId = stockToTaxMap.get(rawCompanyCode) ?? stockToTaxMap.get(rawCompanyCode.padStart(8, '0'))
        const key = `${year}-${companyId}`
        const report = companyId ? reportMap.get(key) : undefined
        if (!report) {
          skippedCompanies.set(rawCompanyCode, (skippedCompanies.get(rawCompanyCode) ?? 0) + 1)
          return
        }

        // Map value: trim; empty string → undefined
        // For boolean fields, transform True/False → 是/否 to match UI convention
        const rawValue = (data['欄位數值'] ?? '').toString().trim()
        let value: string | undefined = rawValue || undefined
        if (value !== undefined && fieldMetaTypeMap.get(fieldId) === 'boolean') {
          if (value === 'True') value = '是'
          else if (value === 'False') value = '否'
        }

        // Map unit: trim; "NA" or empty → undefined
        const rawUnit = (data['欄位單位'] ?? '').toString().trim()
        const unit = (rawUnit && rawUnit !== 'NA') ? rawUnit : undefined

        // Map pageIndex: extract first p.XX match
        const rawPageRef = (data['參考頁數'] ?? '').toString().trim()
        const pageIndex = extractPageIndex(rawPageRef)

        // Map notes: combine 補充說明 and 參考頁數
        const rawComment = (data['補充說明'] ?? '').toString()
        const notes = buildNotes(rawComment, rawPageRef)

        validRows.push({ reportId: report.id, fieldId, value, unit, notes, pageIndex })
      })
      .on('error', reject)
      .on('end', resolve)
  })

  if (errors.length > 0) {
    spinner.fail(`Parsing complete: ${validRows.length} valid rows, ${errors.length} fatal errors`)
    for (const err of errors) {
      console.error(`  Row ${err.rowNumber}: ${err.message}`)
    }
    console.error('\nAborting due to fatal errors. Fix the CSV and re-run.')
    process.exit(1)
  }

  const totalSkipped = [...skippedCompanies.values()].reduce((a, b) => a + b, 0)
  if (skippedCompanies.size > 0) {
    spinner.warn(`Parsed ${validRows.length} valid rows; skipped ${totalSkipped} rows (no matching report):`)
    for (const [code, count] of skippedCompanies) {
      console.warn(`  公司代碼="${code}": ${count} rows skipped`)
    }
  } else {
    spinner.succeed(`Parsed ${validRows.length} valid rows, 0 errors`)
  }

  if (isDryRun) {
    console.log('\nDry-run mode: no DB writes.')
    console.log(`Summary: ${validRows.length} rows ready to insert into report-field.`)
    process.exit(0)
  }

  // Truncate report-field table
  spinner.start('Truncating report-field table...')
  await rdbClient('report-field').delete()
  spinner.succeed('Truncated report-field table')

  // Build insert records with all required columns
  const now = dayjs().toISOString()
  const insertRecords = validRows.map((row) => ({
    reportId: row.reportId,
    fieldId: row.fieldId,
    value: row.value ?? null,
    unit: row.unit ?? null,
    notes: row.notes ?? null,
    pageIndex: row.pageIndex ?? null,
    timeSpentInSeconds: 0,
    hasAdminEdited: false,
    updatedAt: now,
    createdAt: now
  }))

  // Insert in chunks of 100
  const chunkSize = 100
  const chunks: (typeof insertRecords)[] = []
  for (let i = 0; i < insertRecords.length; i += chunkSize) {
    chunks.push(insertRecords.slice(i, i + chunkSize))
  }

  spinner.start(`Inserting ${insertRecords.length} records...`)
  let insertedCount = 0
  for (let i = 0; i < chunks.length; i++) {
    await rdbClient('report-field').insert(chunks[i])
    insertedCount += chunks[i].length
    const progress = Math.round((i + 1) / chunks.length * 100)
    spinner.text = `[${progress}%] Inserting records... (${insertedCount}/${insertRecords.length})`
  }
  spinner.succeed(`Inserted ${insertedCount} records`)

  // Update report stats: count answered fields (value OR notes non-null) per report
  spinner.start('Updating report stats...')
  const reportAnsweredMap = new Map<number, number>()
  const reportIdSet = new Set<number>()
  for (const row of validRows) {
    reportIdSet.add(row.reportId)
    if (row.value !== undefined || row.notes !== undefined) {
      reportAnsweredMap.set(row.reportId, (reportAnsweredMap.get(row.reportId) ?? 0) + 1)
    }
  }

  let updatedReports = 0
  for (const reportId of reportIdSet) {
    const answeredFields = reportAnsweredMap.get(reportId) ?? 0
    await reportService.patch(reportId, {
      answeredFields,
      totalFields: 70,
      hasSetPageOffset: true,
      pageOffset: 0
    })
    updatedReports++
  }
  spinner.succeed(`Updated stats for ${updatedReports} reports (totalFields=70)`)

  // shutdown app as knex.destroy print error XD
  process.exit(0)
}

seed().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
