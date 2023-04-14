import auth from './auth/authSupport.mjs'
import azure from './auth/azure.mjs'
import onBehalfOf from './auth/onBehalfOf.mjs'
import config from './config.mjs'
import logger from './logging.mjs'
import { ipAddressFromRequest } from './requestData.mjs'
import setupProxy from './reverse-proxy.mjs'
import { sessionStore } from './sessionStore.mjs'
import cookieParser from 'cookie-parser'
import express from 'express'
import { BaseClient } from 'openid-client'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const port = config.server.port

app.use(/\/((?!api).)*/, express.json())
app.use(/\/((?!api).)*/, express.urlencoded({ extended: false }))

app.use(cookieParser())
app.use(sessionStore(config))

let azureClient: BaseClient | null = null
azure
  .setup(config.oidc)
  .then((client) => {
    if (client) {
      azureClient = client
    }
  })
  .catch((err) => {
    logger.error(`Failed to discover OIDC provider properties: ${err}`)
    throw new Error(`Failed to discover OIDC provider properties: ${err}`)
  })

app.get('/isalive', (_, res) => res.send('alive'))
app.get('/isready', (_, res) => {
  res.send('ready for action')
})

app.get('/settings.js', (req, res) => {
  const appSettings = {
    USE_MSW: process.env.USE_MSW === 'true',
    MILJO: process.env.NAIS_CLUSTER_NAME,
  }
  res.type('.js')
  res.send(`window.appSettings = ${JSON.stringify(appSettings)}`)
})

const setUpAuthentication = () => {
  app.get('/login', (req, res) => {
    res.redirect(`/oauth2/login`)
  })
  app.get('/logout', (req, res) => {
    res.redirect(`/oauth2/logout`)
  })
}

setUpAuthentication()

// Protected routes
app.use('/*', async (req, res, next) => {
  if (process.env.NODE_ENV === 'development' || process.env.USE_MSW === 'true') {
    res.cookie('hotsak', auth.createTokenForTest(), {
      secure: false,
      sameSite: true,
    })
    next()
  } else {
    if (auth.isValidIn({ seconds: 5, token: req.headers['authorization']?.split(' ')[1] })) {
      // todo: hente ut relevante felt frå access-token og legge i cookie, må dette gjeras kvar gong eller bare om cookie ikkje finnes?
      res.cookie('hotsak', `${req.headers['authorization']?.split(' ')[1]}`, {
        secure: true,
        sameSite: true,
      })
      next()
    } else {
      if (req.headers['authorization']?.split(' ')[1]) {
        const name = auth.valueFromClaim('name', req.headers['authorization']?.split(' ')[1])
        logger.info(`No valid token found for ${name}, connecting via ${ipAddressFromRequest(req)}`)
        logger.sikker.info(
          `No valid token found for ${name}, connecting via ${ipAddressFromRequest(req)}`,
          logger.requestMeta(req)
        )
      }
      if (req.originalUrl === '/' || req.originalUrl.startsWith('/static')) {
        res.redirect('/login')
      } else {
        res.clearCookie('hotsak')
        res.sendStatus(401)
      }
    }
  }
})

// todo: removee signature etc
const createCookieFromToken = (token: string) =>
  `${Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')}.${Buffer.from(
    JSON.stringify({
      name: 'Silje Saksbehandler',
      email: 'dev@nav.no',
      NAVident: 'S112233',
      oid: '23ea7485-1324-4b25-a763-assdfdfa',
    })
  ).toString('base64')}.bogussignature`

const _onBehalfOf = onBehalfOf(config.oidc)
setupProxy(app, _onBehalfOf, config)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = __dirname + '/../../client/dist'
const htmlPath = path.join(distPath, 'index.html')

app.use(express.static(distPath))
app.use('/*', express.static(htmlPath))

app.listen(port, () => logger.info(`Hotsak frontend backend listening on port ${port}`))
