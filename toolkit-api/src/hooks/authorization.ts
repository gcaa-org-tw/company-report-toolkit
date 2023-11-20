import { HookContext } from '../declarations'
import { Forbidden } from '@feathersjs/errors'

import { UserRole } from '../services/users/users.schema'

const ROLES_ORDER = [ 'admin', 'collaborator', 'visitor' ]

const INDEX_ABOVE_COLLABORATOR = ROLES_ORDER.indexOf('collaborator')

export function atLeastCollaborator (context: HookContext) {
  const { user } = context.params
  const errMsg = '帳號權限不足，請找管理員調整權限 🧙'
  if (!user) {
    return
  }
  const roleOrder = ROLES_ORDER.indexOf(user.role)
  if (roleOrder < 0 || roleOrder > INDEX_ABOVE_COLLABORATOR) {
    throw new Forbidden(errMsg)
  }
}

export function mustBeAdmin (context: HookContext) {
  const { user } = context.params
  if (user && user.role !== 'admin') {
    throw new Forbidden('泥不是管理員，不能這樣做 🧙')
  }
}
