<template lang="pug">
.modal-overlay(v-if="showModal").fixed.top-0.left-0.w-100.h-100.flex.items-center.justify-center.z-50
  .bg-white.border.border-gray-300.rounded
    .modal-content.pa4
      h3 「機器人正在甦醒中，請起來喝個水，稍待片刻」
</template>
<script setup lang="ts">
import { computed } from 'vue'
const { feathers } = useProfessionApi()
const showModal = computed(() => !feathers.isAPIReady.value)
</script>
<style lang="scss">
.modal-overlay {
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent background overlay */
}
</style>
