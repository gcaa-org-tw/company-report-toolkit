<template lang="pug">
.gcaa
  .gcaa__header.flex.justify-between.items-center.ph2.pv3.bb.b--moon-gray
    nuxt-link.black.fw5.no-underline(to="/") 工人智慧補完計畫 | 透明足跡
    nuxt-link.gray.no-underline(to="/call-for-g0ver") 登入後台
  main
    slot
    HealthModal
</template>
<script setup lang="ts">
import HealthModal from '@/components/HealthModal.vue'
</script>
<style lang="scss">
.gcaa {
  &__header {
    height: $bannerHeight;
  }
}
</style>
