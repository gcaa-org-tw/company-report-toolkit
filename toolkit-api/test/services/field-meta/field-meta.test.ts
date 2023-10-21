// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app'

describe('field-meta service', () => {
  it('registered the service', () => {
    const service = app.service('field-meta')

    assert.ok(service, 'Registered the service')
  })
})
