<template lang="pug">
.crowdLanding
  onboard-crowd(
    v-if="!canStartTest"
    @user-id="userId = $event"
    @fields-to-submit="fieldsToSubmit = $event"
  )
  crowd-field-submitter(
    v-else
    :user-id="userId"
    :fields-to-submit="fieldsToSubmit"
  )
</template>
<script setup lang="ts">
const userId = ref('')
const fieldsToSubmit = ref([])

const canStartTest = computed(() => {
  return userId.value && fieldsToSubmit.value.length
})
</script>
<style lang="scss" scoped>
.crowdLanding {}
</style>
