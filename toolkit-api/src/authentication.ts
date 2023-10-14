// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'

import { oauth, OAuthProfile, OAuthStrategy } from '@feathersjs/authentication-oauth'

import type { Application } from './declarations'
import { Params, Query } from '@feathersjs/feathers'

declare module './declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService
  }
}

class Auth0Strategy extends OAuthStrategy {
  async getEntityData(profile: OAuthProfile, existing: any, params: Params<Query>) {
    const baseData = await super.getEntityData(profile, existing, params)

    return {
      ...baseData,
      id: baseData.auth0Id,
      email: profile.email,
      name: profile.name,
    }
  }
}


export const authentication = (app: Application) => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('auth0', new Auth0Strategy())

  app.use('authentication', authentication)
  app.configure(oauth())
}
