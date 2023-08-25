import Airtable from 'airtable'

const STATS_TABLE = '欄位填答統計'

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

  return {
    base: atBase,
    getPendingFields
  }
}
