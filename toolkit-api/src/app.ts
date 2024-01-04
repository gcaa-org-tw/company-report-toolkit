// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import 'dotenv/config.js'
import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { koa, rest, bodyParser, errorHandler, parseAuthentication, cors, serveStatic } from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'
import mount from 'koa-mount'
import Router from 'koa-router'

import { configurationValidator } from './configuration'
import type { Application } from './declarations'
import { logError } from './hooks/log-error'
import { rdb } from './rdb'
import { authentication } from './authentication'
import { services } from './services/index'
import { channels } from './channels'
import { getCache } from './utils/downloaderCache'
import { NotFound } from '@feathersjs/errors'

const app: Application = koa(feathers())

// Load our app configuration (see config/ folder)
app.configure(configuration(configurationValidator))

// Set up Koa middleware
app.use(cors())
app.use(serveStatic(app.get('public')))
app.use(errorHandler())
app.use(parseAuthentication())
app.use(bodyParser())

// Configure services and transports
app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: app.get('origins')
    }
  })
)
app.configure(rdb)
app.configure(authentication)
app.configure(services)
app.configure(channels)

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

const download = new Router()
download.get('/:id', async (ctx: any) => {
  const { id } = ctx.params
  const fileMeta = getCache(id)
  if (!fileMeta) {
    throw new NotFound('File not found')
  }

  const fileName = encodeURIComponent(fileMeta.name)
  
  ctx.response.set('content-type', 'text/csv');
  ctx.response.set('content-disposition', `attachment; filename*=utf-8''${fileName}`);
  ctx.body = fileMeta.content
})

app.use(mount('/file', download.middleware()))

export { app }
