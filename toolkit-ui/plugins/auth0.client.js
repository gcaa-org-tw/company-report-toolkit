import { createAuth0 } from '@auth0/auth0-vue'

export default defineNuxtPlugin((nuxtApp) => {
  const appConfig = nuxtApp.$config.app || {}
  const publicConfig = nuxtApp.$config.public || {}
  const baseUrl = appConfig.baseUrl || ''
  const redirectUrl = `${window.location.origin}${baseUrl}`
  nuxtApp.vueApp.use(
    createAuth0({
      domain: publicConfig.auth0Domain,
      clientId: publicConfig.auth0ClientId,
      authorizationParams: {
        redirect_uri: redirectUrl,
        audience: 'https://crt.gcaa.org.tw'
      }
    })
  )
})
