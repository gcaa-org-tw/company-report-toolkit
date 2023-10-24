<template lang="pug">
.gcaa
  .gcaa__header.flex.justify-between.items-center.ph2.pv3.bb.b--moon-gray
    nuxt-link.black.fw5.no-underline(:to="homepage") 工人智慧補完計畫 | 透明足跡
    nuxt-link.gray.no-underline(to="/call-for-g0ver") 登入後台
  main
    slot
</template>
<script setup lang="ts">
const route = useRoute()

const homepage = computed(() => {
  if (route.name === 'index') {
    return '/'
  } else if (route.name?.toString().startsWith('profession')) {
    return '/profession'
  } else {
    return '/crowd'
  }
})
</script>
<style lang="scss">
.gcaa {
  &__header {
    height: $bannerHeight;
  }
}
</style>
