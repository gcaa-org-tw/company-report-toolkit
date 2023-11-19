<template>
  <div class="gcaa">
    <div class="gcaa__header flex justify-between items-center ph2 pv3 bb b--moon-gray">
      <NuxtLink :to="homepage" class="black fw5 no-underline">
        工人智慧補完計畫 | 透明足跡
      </NuxtLink>
      <div v-if="user" class="flex items-center">
        <NuxtLink v-if="isAdmin" to="/profession/stats" class="gray dim no-underline mr3">
          統計資料
        </NuxtLink>
        <NuxtLink v-if="isAdmin" to="/profession/admin" class="gray dim no-underline mr3">
          網站設定
        </NuxtLink>
        <button class="pa0 bw0 bg-white pointer gray dim" @click="logout">
          登出
        </button>
        <div
          class="gcaa__avatar br-100 ml3 bg-moon-gray"
          :class="{'gcaa__avatar--admin': isAdmin}"
        >
          <img class="w-100 br-100" :src="avatar" :title="user.name" />
        </div>
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
import { useAuth } from '~/composables/useProfessionApi'
const route = useRoute()
const { user, isAdmin, avatar } = useAuth()

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
    padding: 0.25rem;

    &--admin {
      background-image: linear-gradient(315deg, #f06543 0%, #ffbe3d 74%);
    }
  }
}
</style>
