import Airtable from 'airtable'

const STATS_TABLE = '欄位填答統計'

export const useAirtable = () => {
  const { public: { airtableBase, airtableKey } } = useRuntimeConfig()

  const atBase = new Airtable({ apiKey: airtableKey }).base(airtableBase)

  const getPendingFields = (userId: string) => {
    console.log('???', userId)
    atBase(STATS_TABLE).select({
      filterByFormula: `AND({相關填答者} is '${userId}')`,
      view: '尚待驗證'
    }).firstPage((err, records) => {
      // TODO: handle error
      if (err) {
        console.error(err)
        return
      }
      records.forEach((record) => {
        console.log(userId, record.get('相關填答者'), record)
      })

      if (!records?.length) {
        console.log('no pending fields')
      }
    })
  }

  return {
    base: atBase,
    getPendingFields
  }
}
