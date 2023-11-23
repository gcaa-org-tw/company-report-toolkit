import _ from 'lodash'
import { Application, feathers } from '@feathersjs/feathers'
import feathersSocketioClient from '@feathersjs/socketio-client'
import socketio from 'socket.io-client'
import authentication from '@feathersjs/authentication-client'
import { userSchema } from '~/libs/feathers/services/users/users.schema'
import { reportFieldMethods } from '~/libs/feathers/services/report-field/report-field.shared'
import { useAuth0 } from '@auth0/auth0-vue'
import { RuntimeConfig } from 'nuxt/schema'

export const DEFAULT_SOCKET_URL = 'http://localhost:3030/'

export function startLogin (auth0: any = undefined, route: any = undefined) {
  // when called from other use inside onMounted, auth0 and route must be provided
  auth0 = auth0 || useAuth0()
  route = route || useRoute()

  return new Promise<void>((resolve) => {
    const flag = setInterval(() => {
      if (auth0 && !auth0.isLoading.value) {
        if (!auth0.isAuthenticated.value) {
          auth0.loginWithRedirect({
            appState: { target: route.fullPath }
          })
        }

        clearInterval(flag)
        resolve(auth0)
      }
    }, 50)
  })
}

export function useLogout () {
  const auth0 = useAuth0()
  const config = useRuntimeConfig()
  const baseUrl = config.app.baseURL || ''
  return () => {
    if (auth0) {
      const redirectUrl = `${window.location.origin}${baseUrl}`
      auth0.logout({
        logoutParams: {
          returnTo: redirectUrl
        }
      })
    }
  }
}

async function initFeathersClient (
  accessToken: string,
  endpoint: string,
  router: any
) {
  const socket = socketio(endpoint)
  const socketClient = feathersSocketioClient(socket)
  const feathersApp = feathers()

  // Setup the transport (Rest, Socket, etc.) here
  feathersApp.configure(socketClient)

  // Available options are listed in the "Options" section
  feathersApp.configure(authentication({}))

  const authClient = feathersApp.authentication

  await authClient.setAccessToken(accessToken)
  try {
    await feathersApp.authenticate()
  } catch {
    router.push({ name: 'auth-register' })
    return undefined
  }

  feathersApp.use('report-field', socketClient.service('report-field'), {
    methods: reportFieldMethods
  })

  return feathersApp
}

async function initUser (feathersApp: Application, auth0: any) {
  // feathers.find return only current user
  const userId = _.get(auth0, 'user.value.sub')
  user.value = await feathersApp.service('users').get(userId)
}

export class FeathersApp {
  private application!: Application

  private ready = ref(false)

  public isReady = computed(() => this.ready.value)
  public jwtToken = ref('')
  public apiEndpoint = ref('')

  public async init (token: string, config: RuntimeConfig, router: any, auth0: any) {
    if (!this.application) {
      const endpoint = config.public.apiEndpoint || DEFAULT_SOCKET_URL
      const ret = await initFeathersClient(token, endpoint, router)
      if (!ret) {
        return
      }
      this.application = ret
      this.jwtToken.value = token
      this.ready.value = true
      this.apiEndpoint.value = endpoint

      initUser(this.application, auth0)
    }
  }

  public get app () {
    return this.application
  }
}

let _feathersApp: FeathersApp | undefined
const user = ref<typeof userSchema | undefined>()

export function useAuth () {
  const auth0 = useAuth0()

  const avatar = computed(() => {
    if (!auth0 || !auth0.isAuthenticated?.value) {
      return undefined
    }
    return auth0.user.value?.picture
  })

  const isAdmin = computed(() => {
    return user.value && user.value.role === 'admin'
  })

  const isCollaborator = computed(() => {
    if (isAdmin.value) {
      return true
    }
    return !!user.value && user.value.role === 'collaborator'
  })

  return { user, isAdmin, isCollaborator, avatar }
}

export function useProfessionApi () {
  const auth0 = useAuth0()
  const config = useRuntimeConfig()
  const route = useRoute()
  const router = useRouter()

  const token = ref('')

  const registerState = getRegisterState()
  if (!_feathersApp) {
    _feathersApp = new FeathersApp()
  }
  const feathersApp = _feathersApp

  async function initApi () {
    if (feathersApp.isReady.value) {
      return
    }
    if (auth0) {
      await startLogin(auth0, route)
      if (auth0.isAuthenticated.value) {
        token.value = await auth0.getAccessTokenSilently()
        feathersApp.init(token.value, config, router, auth0)
      }
    }
  }

  if (registerState.isOnRegister && !registerState.isRegisterOk) {
    router.replace({
      name: 'auth-error',
      query: { error: registerState.error }
    })
  } else if (registerState.isRegisterOk) {
    router.replace({
      name: 'profession',
      hash: ''
    })
    onMounted(initApi)
  } else if (registerState.isOnAuth0Login) {
    watchOnce(
      () => route.query.code,
      (newCode, oldCode) => {
        if (!newCode && oldCode) {
          // auth0 init done
          initApi()
        }
      }
    )
  } else {
    onMounted(initApi)
  }

  const { user, isAdmin, isCollaborator } = useAuth()

  return { user, token, feathers: feathersApp, isAdmin, isCollaborator }
}

// As API don't have RS256 keys, a successful registration will return this error:
const USER_REG_PREFIX = '#error='
const USER_REG_OK_MSG = `${USER_REG_PREFIX}secretOrPrivateKey must be an asymmetric key when using RS256`

export function getRegisterState () {
  const { hash, query } = useRoute()
  const isOnAuth0Login = !!query.code
  const isOnRegister = hash.startsWith(USER_REG_PREFIX)
  const isRegisterOk = hash.startsWith(USER_REG_OK_MSG)
  let error = ''

  if (isOnRegister && !isRegisterOk) {
    error = hash.replace(USER_REG_PREFIX, '')
  }

  return { isOnAuth0Login, isOnRegister, isRegisterOk, error }
}
