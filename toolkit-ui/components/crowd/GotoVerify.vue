7<template lang="pug">
.gotoVerify.center.mw7.pa4.mt5.br2.ba.b--moon-gray.lh-copy
  h1.mt0.f4.f3-ns 完成一半了！
  p
    | 所有的標記任務都已完成，接下來，就輪到幫忙驗證其他人標注的資料囉～
  .flex.items-center.mt4
    button.thankYou__button.br2.pv2.ph3.pointer.ba.b--dark-green.bg-dark-green.white.mr3(@click="next")
      | 我準備好了，開始驗證資料
</template>
<script setup lang="ts">
const emit = defineEmits(['continue'])

function next () {
  emit('continue')
}
</script>
