<template lang="pug">
.industryCard.br2.ba.b--moon-gray.pa3.flex.flex-column.items-center.justify-center
  .industryCard__title.f4.fw6.tc.mb3 {{ industryStats.name }}
  .industryCard__total.f2.tc.mb3 {{ industryStats.total }} 本
  profession-field-progress(
    :progress="industryStats"
  )
</template>
<script lang="ts" setup>
import type { IndustryStats } from '~/utils/industryStats'

defineProps<{
  industryStats: IndustryStats
}>()

</script>
<style lang="scss">
</style>
