<template lang="pug">
.mw6.center.ba.b--moon-gray.pa4.f4.lh-copy.mt4.mt6-ns
  .center.mw8.lh-copy
    h1.tc.f3.f1-ns 登入碰到問題了嗎？
    p.f4 請聯絡綠盟的工程師，我們會盡快為您處理！
    p.gray.f6(v-if="errorMsg")
      | 錯誤訊息： {{ errorMsg }}
</template>
<script setup lang="ts">
const { query } = useRoute()

const errorMsg = computed(() => {
  return query?.error || ''
})
</script>
