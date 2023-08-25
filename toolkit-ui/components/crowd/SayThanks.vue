<template lang="pug">
.thankYou.center.mw7.pa4.mt5.br2.ba.b--moon-gray.lh-copy
  h1.mt0.f4.f3-ns 感謝參與標記原型工具測試！
  p
    | 所有任務都已經完成。在離開前，請填寫一份問卷，讓我們了解你的使用心得。
  p
    | 如果想要多參與一些測試，也歡迎點下「再來一輪」，我們會重新抽籤。記得使用同樣的暱稱，才能累計積分呦 🤓
  p
    | 如果對這個專案有更多想法，除了找我們聊聊之外，也歡迎：
  ul
    li 讀讀
      a(href="https://g0v.hackmd.io/@ddio-io/open-csr-report" target="_blank" rel="noopener") 專案共筆
    li 翻翻
      a(href="https://github.com/gcaa-org-tw/company-report-toolkit/" target="_blank" rel="noopener") Github 上的程式碼
    li 查看
      a(href="https://airtable.com/appsREnwMpxAZmaRv/shrhubstEzdWYZWfh" target="_blank" rel="noopener") 標注狀況與問卷結果
  .flex.items-center.mv4
    button.thankYou__button.pointer.bg-green.white.mr3(@click="startOver") 再來一輪
    nuxt-link.thankYou__button.bg-dark-green.white.no-underline(:to="surveyUrl" target="_blank" rel="noopener") 填寫問卷
</template>
<script setup lang="ts">
const emit = defineEmits(['start-over'])

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
})

const surveyUrl = computed(() => {
  const base = 'https://airtable.com/appsREnwMpxAZmaRv/shrjkPKD0t0J5hxP2?prefill_%E4%BD%BF%E7%94%A8%E8%80%85%E6%9A%B1%E7%A8%B1='
  return base + encodeURIComponent(props.userId)
})

function startOver () {
  emit('start-over')
}
</script>
<style lang="scss" scoped>
.thankYou {
  &__button {
    border-radius: 0.25rem;
    padding: 0.5rem 1.5rem;
    border: none;
    outline: none;
    height: 2.5rem;
    display: flex;
    align-items: center;
  }
}
</style>
