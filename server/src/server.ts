import auth from './auth/authSupport'
import azure from './auth/azure'
import onBehalfOf from './auth/onBehalfOf'
import config from './config'
import logger from './logging'
import { ipAddressFromRequest } from './requestData'
import setupProxy from './reverse-proxy'
import { sessionStore } from './sessionStore'
import { HotsakRequest } from './types'
import cookieParser from 'cookie-parser'
import express, { Response } from 'express'
import { Client } from 'openid-client'
import path from 'path'

const app = express()
const port = config.server.port

app.use(/\/((?!api).)*/, express.json())
app.use(/\/((?!api).)*/, express.urlencoded({ extended: false }))

app.use(cookieParser())
app.use(sessionStore(config))

let azureClient: Client | null = null
azure
  .setup(config.oidc)
  .then((client: Client) => {
    azureClient = client
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
  app.get('/login', (req: HotsakRequest, res: Response) => {
    res.redirect(`/oauth2/login`)
  })
  app.get('/logout', (req: HotsakRequest, res: Response) => {
    res.redirect(`/oauth2/logout`)
  })
}

setUpAuthentication()

// Protected routes
app.use('/*', async (req: HotsakRequest, res, next) => {
  if (process.env.NODE_ENV === 'development' || process.env.NAIS_CLUSTER_NAME === 'labs-gcp') {
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

const distPath = __dirname + '/../../client/dist'
const htmlPath = path.join(distPath, 'index.html')

console.log('distPath', distPath)
console.log('htmlPath', htmlPath)

app.use(express.static(distPath))
app.use('/*', express.static(htmlPath))

app.listen(port, () => logger.info(`hm-saksbehandling backend listening on port ${port}`))
