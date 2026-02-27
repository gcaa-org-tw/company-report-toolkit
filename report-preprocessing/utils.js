import csvtojson from 'csvtojson'
import path from 'path'

export async function prepareCompanyMap () {
  const rows = await csvtojson().fromFile('./companyList.csv')
  const companyMap = rows.reduce((acc, row) => {
    acc.name[row.公司名稱] = row.統編
    acc.abbr[row.公司簡稱] = row.統編
    acc.stockId[row.股票代碼] = row.統編
    acc.id[row.統編] = row.公司簡稱
    return acc
  }, {name: {}, abbr: {}, stockId: {}, id: {}})
  return companyMap
}

export function extractPdfNameInfo(fileName, companyMap) {
  // Supports multiple formats:
  // 1. <year>_<stockId>_<companyNameAndMeta>.pdf (year is 西元/Western year)
  //    example: 2024_1102_台泥公司年報.pdf
  // 2. <companyId>-<companyName>-<dummy info>.pdf
  //    example: 03244509-台泥-2024年報.pdf
  // 3. Legacy: <stockId>_<twYear>_<companyId>.pdf (twYear is 民國 year)
  //    example: 1102_112_03244509.pdf
  
  const baseName = path.parse(fileName).name
  
  // Format 2: <companyId>-<companyName>-<dummy info>.pdf
  if (baseName.includes('-')) {
    const parts = baseName.split('-')
    const companyId = parts[0].trim()
    
    // Try to extract year from the last part (e.g., "2024年報.pdf" -> 2024)
    const lastPart = parts[parts.length - 1]
    const yearMatch = lastPart.match(/(\d{4})/)
    const year = yearMatch ? Number(yearMatch[1]) : undefined
    
    return { companyId, stockId: undefined, year }
  }
  
  // Underscore-based formats (1 and 3)
  if (baseName.includes('_')) {
    const parts = baseName.split('_').map(s => s.trim())
    
    if (parts.length >= 3) {
      const part1 = parts[0]
      const part2 = parts[1]
      const part3 = parts[2]
      
      // Format 1: <year>_<stockId>_<companyNameAndMeta>.pdf
      // year is 4 digits starting with 19 or 20 (Western year)
      if (part1.length === 4 && /^(19|20)\d{2}$/.test(part1)) {
        const year = Number(part1)
        const stockId = part2
        
        // Lookup companyId from stockId
        const companyId = companyMap.stockId[stockId]
        if (!companyId) {
          throw new Error(`Company ID not found for stock ID: ${stockId}`)
        }
        
        return { companyId, stockId, year }
      }
    }
  }
  
  throw new Error(`Unable to parse filename format: ${fileName}`)
}