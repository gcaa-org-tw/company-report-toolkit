import { useAuth0 } from '@auth0/auth0-vue'

export function useAuth () {
  const auth0 = useAuth0()
  const user = computed(() => {
    if (auth0 && auth0.isAuthenticated.value) {
      return auth0.user.value
    }
    return undefined
  })

  return { user, auth0 }
}
