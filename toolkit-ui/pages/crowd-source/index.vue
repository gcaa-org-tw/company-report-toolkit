<template lang="pug">
.crowdLanding
  onboard-crowd(
    v-if="!canStartTest"
    @user-id="userId = $event"
    @tasks="handleTaskDeliver"
  )
  crowd-field-submitter(
    v-else-if="!isAllCompleted"
    :user-id="userId"
    :fields-to-submit="fieldsToSubmit"
    @complete-all-submission="isAllCompleted = true"
  )
  crowd-thanks(v-else @start-over="startOver")
</template>
<script setup lang="ts">
const userId = ref('')
const fieldsToSubmit = ref([])
const fieldsToVerify = ref([])
const isAllCompleted = ref(false)

function handleTaskDeliver ({ submissions, verifications }) {
  fieldsToSubmit.value = submissions
  fieldsToVerify.value = verifications
}

const canStartTest = computed(() => {
  return userId.value && fieldsToSubmit.value.length
})

function startOver () {
  userId.value = ''
  fieldsToSubmit.value = []
  isAllCompleted.value = false
}

</script>
<style lang="scss" scoped>
.crowdLanding {}
</style>
