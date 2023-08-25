import Airtable from 'airtable'

const STATS_TABLE = '欄位填答統計'
const SUBMISSION_TABLE = '填答紀錄'
const VERIFICATION_TABLE = '驗證紀錄'
const TRACK_USAGE_TABLE = '行為追蹤'

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

  const getPendingVerifications = (userId: string) => {
    return new Promise((resolve, reject) => {
      atBase(SUBMISSION_TABLE).select({
        view: '待驗證紀錄'
      }).firstPage((err, records) => {
        // 100 records is enough for now
        if (err) {
          reject(err)
          return
        }
        const pendingVerification = records?.filter((record) => {
          const reporter = record.get('填答者暱稱') as string || ''
          return reporter !== userId
        })

        resolve(pendingVerification)
      })
    })
  }

  const verifyField = ({ userId, submissionId, result }) => {
    const fields: any = {
      驗證者暱稱: userId,
      填答紀錄: [submissionId],
      驗證結果: result
    }

    return new Promise((resolve, reject) => {
      atBase(VERIFICATION_TABLE).create([{
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

  const sendTrackUsage = ({
    userId,
    companyId,
    year,
    field,
    isOnVerify,
    searchKeyword,
    isPredefined = undefined,
    clickPages,
    viewPages,
    answerPage
  }) => {
    const fields: any = {
      填答者暱稱: userId,
      公司統編: companyId,
      報告書年份: year,
      欄位標籤: field,
      是否為驗證時: isOnVerify
    }

    if (searchKeyword) { fields.關鍵字 = searchKeyword }
    if (isPredefined !== undefined) { fields.是否自訂關鍵字 = !isPredefined }
    if (clickPages.length) { fields.點選過的頁次 = clickPages.join(',') }
    if (viewPages.length) { fields.瀏覽過的頁次 = viewPages.join(',') }
    if (answerPage) { fields.答案頁次 = answerPage }

    return new Promise((resolve, reject) => {
      atBase(TRACK_USAGE_TABLE).create([{
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
    getPendingVerifications,
    submitField,
    verifyField,

    sendTrackUsage
  }
}
