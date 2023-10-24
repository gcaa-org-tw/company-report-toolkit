<template lang="pug">
.fieldProgress.w-100
  .flex.mb1
    .filedProgress__cell(
      v-for="item in progressItems"
      :key="item.title"
      :style="{width: item.width}"
    )
      .f6.gray {{ item.title }}
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
  answered: number
  isVerified?: number
}
const props = withDefaults(defineProps<{
  progress: FieldProgress,
  showVerified?: boolean
}>(), {
  showVerified: true
})

const progressItems = computed(() => {
  const ret = []
  const total = props.progress.total || 1
  const isVerified = props.showVerified ? props.progress.isVerified || 0 : 0
  const answered = (props.progress.answered || 0) - isVerified
  const remaining = total - answered - isVerified

  if (isVerified) {
    ret.push({
      title: '驗',
      value: isVerified,
      width: `${isVerified / total * 100}%`,
      bg: 'bg-green'
    })
  }
  if (answered) {
    ret.push({
      title: '判',
      value: answered,
      width: `${answered / total * 100}%`,
      bg: 'bg-gold'
    })
  }
  if (remaining) {
    ret.push({
      title: '待',
      value: remaining,
      width: `${remaining / total * 100}%`,
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
