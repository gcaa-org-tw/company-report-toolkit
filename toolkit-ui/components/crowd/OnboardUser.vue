<template lang="pug">
.onboardCrowd.center.mw7.pa4.mt5.br2.ba.b--moon-gray.lh-copy
  .onboardCrowd__init(v-if="isOnIntro")
    h1.mt0.f4.f3-ns 歡迎參與標記原型工具測試！
    p
      | 接下來，我們將隨機挑選幾個 ESG 裡的重要欄位，例如碳排放、員工人數，請你協助從報告書中，找到答案。
      | 另外，我們也會找一些其他人已經標記過的欄位，請你確認他們的標記是否正確。
      | 這些欄位的難度不一，有些非常簡單，有些則需要費心判讀，所以如果發現找不到答案，請不要灰心，可以跳到下一題。
      strong 在今天活動結束後，我們會計算所有人的積分，並且發放紀念品給前幾名的參與者。
    p
      | 由於測試需要閱讀 PDF，請盡量使用 12" 螢幕以上的裝置，才能順利操作標記工具。
      | 如果你手邊的螢幕太小，也歡迎直接來找我們借用筆電。
    p
      | 在填答結束後，會請你填寫使用心得的問卷，問卷的填答資料，會以 CC0 的方式授權公開，請記得不要填寫敏感資訊 🥹。
      | 最後，除了問卷外，也歡迎隨時找我們聊聊，提供你的使用心得，或是對於工具的建議。
    .bb.ph4.b--moon-gray.mv4
    form(@submit.prevent="prepareQuestions")
      label.db.mb3(for="userId")
        .dark-gray.f6.mb1 請輸入你的暱稱，作為統計積分計算使用
        input(v-model.trim="userId" type="text")
      button.pv2.ph4(type="submit" :disabled="!canStartPrepare || isOnLoadingRecords")
        | {{ loadingLabel }}
  .onboardCrowd__empty(v-else-if="hasNoPendingJobs")
    h1.mt0.f4.f3-ns 所有題目都已經被標記完成！
    p 請期待本日的成果報告，或來找我們聊聊你的使用心得。
  .onboardCrowd__ready(v-else)
    h1.mt0.f4.f3-ns 抽籤完成！以下是想請你協助標記的題目：
    .mv3(v-if="fieldsToSubmit.length")
      .mb2.f4 要
        strong 標記
        | 的報告書與欄位
      .flex.items-center.f6.gray(v-for="field in fieldsToSubmit" :key="field.label")
        .flex-none.mr2.fw5 {{ field.company.name }}
        .flex-auto.b {{ field.category }} | {{ field.label }}
    .mv4(v-if="fieldsToVerify.length")
      .mb2.f4 要
        strong 驗證
        | 的報告書與欄位
      .flex.items-center.f6.gray(v-for="field in fieldsToVerify" :key="field.label")
        .flex-none.mr2.fw5 {{ field.company.name }}
        .flex-auto.b {{ field.category }} | {{ field.label }}
    button.pv2.ph4(@click="kickoff") 開始標記與驗證
</template>
<script setup lang="ts">
import _ from 'lodash'
import fieldMap from '~/assets/field-map.yml'
import reportMap from '~/assets/report-list.yml'

const emit = defineEmits(['userId', 'tasks'])

const airtable = useAirtable()

const isOnIntro = ref(true)
const isOnLoadingRecords = ref(false)
const hasNoPendingJobs = ref(false)

const userId = ref('')
const fieldsToSubmit = ref([])
const fieldsToVerify = ref([])

const loadingLabel = computed(() => {
  if (!isOnLoadingRecords.value) {
    return '載入題庫'
  } else {
    return '機器人正在幫忙抽籤中... 🤖'
  }
})

const canStartPrepare = computed(() => {
  return userId.value.length > 0
})

async function prepareQuestions () {
  isOnLoadingRecords.value = true
  let pendingRecords = []
  try {
    pendingRecords = await airtable.getPendingFields(userId.value)
  } catch (err) {
    alert(err)
  }

  await new Promise((resolve) => {
    // do simple random backoff, so to avoid Airtable rate limit
    setTimeout(resolve, 300 + Math.random() * 2000)
  })

  let pendingVerifications = []
  try {
    pendingVerifications = await airtable.getPendingVerifications(userId.value)
  } catch (err) {
    alert(err)
  }

  const submissionTasks = findSomeSubmissionTasks(pendingRecords)
  const verificationTasks = findSomeVerificationTasks(pendingVerifications)

  isOnIntro.value = false

  if (!submissionTasks.length && !verificationTasks.length) {
    hasNoPendingJobs.value = true
  } else {
    fieldsToSubmit.value = submissionTasks
    fieldsToVerify.value = verificationTasks
  }
  isOnLoadingRecords.value = false
}

const allFields = fieldMap.flatMap((category) => {
  return category.fields.map((field) => {
    return {
      category: category.category,
      ...field
    }
  })
})

function findSomeVerificationTasks (pendingRecords, nVerify = 6) {
  // 決定驗證的欄位，以同公司為優先
  const topRecordPool = _.shuffle(pendingRecords.slice(0, nVerify * 3))
  const topCompanies = _.uniq(topRecordPool.map(r => r.get('公司統編')))
  const companyWeight = topCompanies.reduce((acc, id, weight) => {
    acc[id] = weight
    return acc
  }, {})

  topRecordPool.sort((a, b) => {
    return companyWeight[a.get('公司統編')] - companyWeight[b.get('公司統編')]
  })

  const normalizedRecords = topRecordPool
    .slice(0, nVerify)
    .map((record) => {
      const company = reportMap[0].reports.find(r => r.id === record.get('公司統編'))
      const targetField = allFields.find((field) => {
        return field.label === record.get('欄位標籤')
      })
      return {
        company,
        year: record.get('報告書年份'),
        data: record,
        ...targetField
      }
    })

  return normalizedRecords
}

function findSomeSubmissionTasks (pendingRecords, nSubmit = 2) {
  const reportedCompanies = _.shuffle(_.uniq(pendingRecords.map(r => r.get('公司統編'))))
  const year = reportMap[0].year
  const allCompanies = reportMap[0].reports.map(r => r.id)
  const nonReportedCompanies = _.shuffle(_.difference(allCompanies, reportedCompanies))

  // 決定判讀的公司與欄位，先以沒人做過的公司為優先
  const potentialCompanies = nonReportedCompanies.length ? nonReportedCompanies : reportedCompanies
  const company = potentialCompanies[0]

  const reportedFields = pendingRecords
    .filter(r => r.get('公司統編') === company)
    .map(r => r.get('欄位標籤'))

  const nonReportedFields = _.shuffle(_.difference(allFields, reportedFields))

  const companyInfo = reportMap[0].reports.find(r => r.id === company)
  const taskFields = nonReportedFields
    .slice(0, nSubmit)
    .map((field) => {
      return {
        company: companyInfo,
        year,
        ...field
      }
    })

  return taskFields
}

function kickoff () {
  emit('userId', userId.value)
  emit('tasks', {
    submissions: fieldsToSubmit.value,
    verifications: fieldsToVerify.value
  })
}

</script>
