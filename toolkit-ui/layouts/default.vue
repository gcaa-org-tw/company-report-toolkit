<template>
<div class="gcaa">
  <div class="gcaa__header flex justify-between items-center ph2 pv3 bb b--moon-gray">
    <nuxt-link class="black fw5 no-underline" to="/">{{ $t('project_desc') }}</nuxt-link>
    <nuxt-link class="gray no-underline" to="/call-for-g0ver">登入後台</nuxt-link>
    <form>
      <select v-model="locale">
        <option value="zh_TW">中文</option>
        <option value="en">English</option>
      </select>
    </form>
  </div>
  <main>
    <slot></slot>
  </main>
</div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
</script>

<style lang="scss">
.gcaa {
  &__header {
    height: $bannerHeight;
  }
}
</style>
