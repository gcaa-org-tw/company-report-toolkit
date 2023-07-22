<script setup lang="ts">
const route = useRoute()

const year = ref(route.params.year)
const companyId = ref(route.params.companyId)

</script>

<template lang="pug">
.mw8.bg-yellow.mv5.center.pa3
  h1 Company!
  p {{ year }} - {{ companyId }} xx
  interpellation-src-viewer(
    :start-page="23"
  )
</template>
