<template lang="pug">
.emptyPage(ref="page")
</template>
<script setup lang="ts">

const page = ref(null)
const emit = defineEmits(['visible'])

const isVisible = useElementVisibility(page)

let visibleTimer = null
const VISIBLE_AFTER = 300

function mayBeVisible () {
  clearTimeout(visibleTimer)
  visibleTimer = setTimeout(() => {
    emit('visible', true)
  }, VISIBLE_AFTER)
}

watch(isVisible, (newVal) => {
  if (newVal) {
    mayBeVisible()
  } else {
    clearTimeout(visibleTimer)
  }
})

</script>
