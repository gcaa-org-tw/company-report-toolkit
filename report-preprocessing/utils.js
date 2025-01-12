import csvtojson from 'csvtojson'
import path from 'path'

export async function prepareCompanyMap () {
  const rows = await csvtojson().fromFile('./companyList.csv')
  const companyMap = rows.reduce((acc, row) => {
    acc.name[row.公司名稱] = row.統編
    acc.abbr[row.公司簡稱] = row.統編
    acc.id[row.統編] = row.公司簡稱
    return acc
  }, {name: {}, abbr: {}, id: {}})
  return companyMap
}

export function extractPdfNameInfo(fileName) {
  // reportName = <stockId>_<twYear>_<companyId>.pdf (<股票代號>_<資料年份(民國)>_<統一編號>.pdf)
  // example: 1102_112_03244509.pdf
  const [stockId, twYear, companyId] = path.parse(fileName).name.split('_').map(s => s.trim())
  const year = Number(twYear) + 1911

  return { stockId, twYear, companyId, year }
}