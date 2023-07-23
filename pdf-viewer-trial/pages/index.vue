<template lang="pug">
main.main
  .pa2
    .ba.b--gray.pa2
      .main__control
        control-panel
  .main__reader
</template>
<script setup lang="ts">
</script>
<style lang="scss">
.main {
  display: grid;
  grid-template-columns: 1fr 3fr;

  &__control {
    height: calc(100vh - 2rem);
    overflow-y: auto;
    overflow-x: hidden;
  }

  &__reader {
    max-height: 100vh;
    overflow-y: auto;
  }
}
</style>
