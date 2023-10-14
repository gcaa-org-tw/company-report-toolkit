<template lang="pug">
.mw6.center.ba.b--moon-gray.pa4.f4.lh-copy.mt4.mt6-ns
  div(v-if="user")
      h1.f3.f2-ns 哈囉 {{ user.value.name }}！
      p
        | 你應該是新來的朋友？
        | 請先點選下面的按鈕，登錄系統，就可以開始標記囉！
      p
        | 你現在使用的信箱是：&nbsp;
        strong {{ user.value.email }}
      .mt4.flex
        .w-50.pr2
          button.pv2.w-100.pointer(@click="logout") 換一個信箱
        .w-50.pl2
          a(:href="registerUrl" rel="noopener noreferrer")
            button.pointer.pv2.w-100 登錄系統
</template>
<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { startLogin, DEFAULT_SOCKET_URL, useLogout } from '~/composables/useProfessionApi'

const auth0 = useAuth0()
const user = ref<any>(undefined)
const config = useRuntimeConfig()

const registerUrl = computed(() => {
  const base = config.public.apiEndpoint || DEFAULT_SOCKET_URL
  return `${base}oauth/auth0`
})

onMounted(async () => {
  if (auth0) {
    await startLogin()
    user.value = auth0.user
  }
})

const logout = useLogout()
</script>
