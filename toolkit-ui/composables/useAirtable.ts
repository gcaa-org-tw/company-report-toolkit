import Airtable from 'airtable'

const STATS_TABLE = '欄位填答統計'
const SUBMISSION_TABLE = '填答紀錄'

export const useAirtable = () => {
  const { public: { airtableBase, airtableKey } } = useRuntimeConfig()

  const atBase = new Airtable({ apiKey: airtableKey }).base(airtableBase)

  const getPendingFields = (userId: string) => {
    return new Promise((resolve, reject) => {
      atBase(STATS_TABLE).select({
        // TODO: find a way to filter by array
        // filterByFormula: `AND({相關填答者} is '${userId}')`,
        view: '尚待驗證'
      }).firstPage((err, records) => {
        // 100 records is enough for now
        if (err) {
          // TODO: handle rate limit XD
          reject(err)
          return
        }
        const pendingRecords = records?.filter((record) => {
          const reporters = record.get('相關填答者') as string[]
          return !reporters || !reporters.every(reporter => reporter === userId)
        })

        resolve(pendingRecords)
      })
    })
  }

  const submitField = ({ userId, companyId, year, field, value, unit = '', notes = '', page = 0, keyword = '' }) => {
    const fields: any = {
      填答者暱稱: userId,
      公司統編: companyId,
      報告書年份: year,
      欄位標籤: field,
      數值: value
    }
    if (unit) { fields.單位 = unit }
    if (notes) { fields.補充資訊 = notes }
    if (page) { fields.答案頁次 = page }
    if (keyword) { fields.答案關鍵字 = keyword }

    return new Promise((resolve, reject) => {
      atBase(SUBMISSION_TABLE).create([{
        fields
      }], (err, records) => {
        if (err) {
          reject(err)
        } else {
          resolve(records[0])
        }
      })
    })
  }

  return {
    base: atBase,
    getPendingFields,
    submitField
  }
}
