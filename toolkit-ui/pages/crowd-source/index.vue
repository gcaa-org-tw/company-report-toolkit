<template lang="pug">
.crowdLanding
  onboard-crowd(
    v-if="!canStartTest"
    @user-id="userId = $event"
    @tasks="handleTaskDeliver"
  )
  crowd-field-editor(
    v-else-if="!isSubmissionDone"
    :user-id="userId"
    :fields="fieldsToSubmit"
    @complete="isSubmissionDone = true"
  )
  crowd-goto-verify(
    v-else-if="!canStartVerify"
    @continue="canStartVerify = true"
  )
  crowd-field-editor(
    v-else-if="!isVerificationDone"
    :user-id="userId"
    :fields="fieldsToVerify"
    :is-submission="false"
    @complete="isVerificationDone = true"
  )
  crowd-thanks(v-else @start-over="startOver")
</template>
<script setup lang="ts">
const userId = ref('')
const fieldsToSubmit = ref([])
const isSubmissionDone = ref(false)

const canStartVerify = ref(false)
const fieldsToVerify = ref([])
const isVerificationDone = ref(false)

function handleTaskDeliver ({ submissions, verifications }) {
  fieldsToSubmit.value = submissions
  fieldsToVerify.value = verifications

  if (!submissions.length) {
    isSubmissionDone.value = true
    canStartVerify.value = true
  }

  if (!verifications.length) {
    canStartVerify.value = true
    isVerificationDone.value = true
  }
}

const canStartTest = computed(() => {
  return userId.value && (fieldsToSubmit.value.length || isSubmissionDone.value)
})

function startOver () {
  userId.value = ''
  fieldsToSubmit.value = []
  isSubmissionDone.value = false

  fieldsToVerify.value = []
  isVerificationDone.value = false
  canStartVerify.value = false
}

</script>
<style lang="scss" scoped>
.crowdLanding {}
</style>
