import { FieldMeta } from '~/libs/feathers/services/field-meta/field-meta.shared'

export function useFieldMeta () {
  const { feathers } = useProfessionApi()
  const fieldMetaList = ref<FieldMeta[]>([])
  const fieldMetaMap = computed(() => {
    const map = new Map<string, FieldMeta>()
    fieldMetaList.value.forEach((fieldMeta) => {
      map.set(fieldMeta.id, fieldMeta)
    })
    return map
  })

  async function fileMetaResp () {
    const resp = await feathers.app.service('field-meta').find({
      query: {
        // we have 50+ fields in some reports, so we need to increase the limit
        $limit: 100,
        $sort: {
          id: 1
        }
      }
    })
    fieldMetaList.value = resp.data
  }

  watch(feathers.isReady, async (isReady) => {
    if (isReady) {
      await fileMetaResp()
    }
  })

  return { fieldMetaList, fieldMetaMap }
}
