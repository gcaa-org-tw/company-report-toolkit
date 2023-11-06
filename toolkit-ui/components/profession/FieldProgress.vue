<template lang="pug">
.fieldProgress.w-100
  .flex.mb1
    .filedProgress__cell(
      v-for="item in progressItems"
      :key="item.title"
      :style="{width: item.width}"
      :title="item.title"
    )
      .f6.gray {{ item.abbr }}
  .fieldProgress__bar.br-pill.overflow-hidden.flex
    .filedProgress__cell.flex.items-center(
      v-for="item in progressItems"
      :key="item.title"
      :style="{width: item.width}"
      :class="[item.bg]"
    )
      .f6.white {{ item.value }}
</template>
<script lang="ts" setup>
export interface FieldProgress {
  total: number
  totalFields?: number
  answered: number
  answeredFields?: number
  isVerified?: number
}
const props = withDefaults(defineProps<{
  progress: FieldProgress,
  isIndustry?: boolean
}>(), {
  isIndustry: true
})

const MIN_WIDTH = 0.08

const progressItems = computed(() => {
  const ret = []
  const total = props.progress.total || props.progress.totalFields || 1
  const minCount = Math.ceil(total * MIN_WIDTH)
  const isVerified = props.isIndustry ? props.progress.isVerified || 0 : 0
  const answered = (props.progress.answered || props.progress.answeredFields || 0) - isVerified
  const remaining = total - answered - isVerified

  const isVerifiedWidth = isVerified ? Math.max(isVerified, minCount) : 0
  const answeredWidth = answered ? Math.max(answered, minCount) : 0
  const remainingWidth = total - isVerifiedWidth - answeredWidth

  if (isVerified) {
    ret.push({
      abbr: '驗',
      title: '已驗證',
      value: isVerified,
      width: `${isVerifiedWidth / total * 100}%`,
      bg: 'bg-green'
    })
  }
  if (answered) {
    ret.push({
      abbr: '判',
      title: '判讀完成',
      value: answered,
      width: `${answeredWidth / total * 100}%`,
      bg: 'bg-gold'
    })
  }
  if (remaining) {
    ret.push({
      abbr: '待',
      title: '待判讀',
      value: remaining,
      width: `${remainingWidth / total * 100}%`,
      bg: 'bg-moon-gray'
    })
  }
  return ret
})

</script>
<style lang="scss" scoped>
.filedProgress {
  &__cell {
    padding-left: 0.25rem;
    &:not(:last-child) {
      flex-shrink: 0;
    }
    &:last-child {
      flex-grow: 1;
    }
  }

  &__bar {
    height: 1rem;
  }
}
</style>
