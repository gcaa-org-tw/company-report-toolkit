<template lang="pug">
.emptyPage.flex.items-center.justify-center.ba.b--light-gray.center(ref="page")
  i.fa-solid.fa-book.fa-beat-fade.fa-xl
</template>
<script setup lang="ts">

const page = ref(null)
const emit = defineEmits(['visible'])

const isVisible = useElementVisibility(page)

watch(isVisible, (newVal) => {
  if (newVal) {
    emit('visible', true)
  }
})

</script>
