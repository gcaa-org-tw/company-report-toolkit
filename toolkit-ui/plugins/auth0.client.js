import { createAuth0 } from '@auth0/auth0-vue'

export default defineNuxtPlugin((nuxtApp) => {
  const publicConfig = nuxtApp.$config.public
  nuxtApp.vueApp.use(
    createAuth0({
      domain: publicConfig.auth0Domain,
      clientId: publicConfig.auth0ClientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https://crt.gcaa.org.tw'
      }
    })
  )
})
