<template>
  <div class="gcaa">
    <div class="gcaa__header flex justify-between items-center ph2 pv3 bb b--moon-gray">
      <NuxtLink :to="homepage" class="black fw5 no-underline">
        工人智慧補完計畫 | 透明足跡
      </NuxtLink>
      <div v-if="user" class="flex items-center">
        <button class="pa0 bw0 bg-white pointer dim" @click="logout">
          登出
        </button>
        <img class="gcaa__avatar br-pill ml2" :src="user.picture" :title="user.nickname" />
      </div>
      <template v-else>
        <NuxtLink to="/call-for-g0ver" class="gray no-underline">
          登入後台
        </NuxtLink>
      </template>
    </div>
    <main>
      <slot />
      <NuxtSnackbar />
    </main>
  </div>
</template>
<script setup lang="ts">
const route = useRoute()
const { user } = useAuth()

const homepage = computed(() => {
  if (route.name === 'index') {
    return '/'
  } else if (route.name?.toString().startsWith('profession')) {
    return '/profession'
  } else {
    return '/crowd'
  }
})

const logout = useLogout()

</script>
<style lang="scss">
.gcaa {
  &__header {
    height: $bannerHeight;
  }
  &__avatar {
    height: 2.5rem;
    width: 2.5rem;
  }
}
</style>
