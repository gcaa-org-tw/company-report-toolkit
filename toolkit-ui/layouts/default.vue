<template lang="pug">
.gcaa
  .gcaa__header.flex.justify-between.items-center.ph2.pv3.bb.b--moon-gray
    nuxt-link.black.fw5.no-underline(to="/") 企業永續報告書閱讀器
    nuxt-link.gray.no-underline(to="/call-for-g0ver") 登入後台
  main
    slot
</template>
<script setup lang="ts">
</script>
<style lang="scss">
.gcaa {
  &__header {
    height: $bannerHeight;
  }
}
</style>
