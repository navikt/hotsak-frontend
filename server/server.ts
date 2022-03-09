import cookieParser from 'cookie-parser'
import express, { Response } from 'express'
import { Client, generators } from 'openid-client'

import auth from './auth/authSupport'
import azure from './auth/azure'
import config from './config'
import logger from './logging'
import path from 'path'
import setupProxy from './reverse-proxy'
import { ipAddressFromRequest } from './requestData'
import { sessionStore } from './sessionStore'
import { AuthError, HotsakRequest } from './types'
import onBehalfOf from './auth/onBehalfOf'

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
    process.exit(1)
  })

app.get('/isalive', (_, res) => res.send('alive'))
app.get('/isready', (_, res) => {
  res.send('ready for action')
})

app.get('/settings.js', (req, res) => {
  res.type('.js')
  res.send(`
    window.appSettings = {
      USE_MSW: ${process.env.USE_MSW},
      MILJO: '${process.env.NAIS_CLUSTER_NAME}'
    }
  `)
})

const setUpAuthentication = () => {
  app.get('/login', (req: HotsakRequest, res: Response) => {
    const session = req.session
    session.nonce = generators.nonce()
    session.state = generators.state()
    if (azureClient === null) {
      console.log('Azure client er null')
    }
    const url = azureClient!.authorizationUrl({
      scope: config.oidc.scope,
      redirect_uri: auth.redirectUrl(req),
      response_type: config.oidc.responseType[0],
      prompt: 'select_account',
      response_mode: 'form_post',
      nonce: session.nonce,
      state: session.state,
    })
    res.redirect(url)
  })
  app.get('/logout', (req: HotsakRequest, res: Response) => {
    azureClient!.revoke(req.session.hotsakToken).finally(() => {
      req.session.destroy(() => {})
      res.clearCookie('hotsak')
      res.redirect(302, config.oidc.logoutUrl)
    })
  })

  app.post('/oauth2/callback', (req: HotsakRequest, res: Response) => {
    const session = req.session
    auth
      .validateOidcCallback(req, azureClient!, config.oidc)
      .then((tokens: string[]) => {
        const [accessToken, idToken, refreshToken] = tokens
        res.cookie('hotsak', `${idToken}`, {
          secure: true,
          sameSite: true,
        })
        session.hotsakToken = accessToken
        session.refreshToken = refreshToken
        session.user = auth.valueFromClaim('NAVident', idToken)
        res.redirect(303, '/')
      })
      .catch((err: AuthError) => {
        logger.error(`Error caught during login: ${err.statusCode} ${err.message} (se sikkerLog for detaljer)`)
        logger.sikker.error(`Error caught during login: ${err.message} ${JSON.stringify(err)}`, err)
        logger.sikker.error(`Error caught during login (tmp log): ${err.message} ${err}`, err)

        session.destroy(() => {})
        res.sendStatus(err.statusCode)
      })
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
    if (
      auth.isValidIn({ seconds: 5, token: req.session!.hotsakToken })
    ) {
      next()
    } else {
      if (req.session!.hotsakToken) {
        const name = auth.valueFromClaim('name', req.session!.hotsakToken)
        logger.info(`No valid session found for ${name}, connecting via ${ipAddressFromRequest(req)}`)
        logger.sikker.info(
          `No valid session found for ${name}, connecting via ${ipAddressFromRequest(req)}`,
          logger.requestMeta(req)
        )
      }
      if (req.originalUrl === '/' || req.originalUrl.startsWith('/static')) {
        res.redirect('/login')
      } else {
        // these are xhr's, let the client decide how to handle
        res.clearCookie('hotsak')
        res.sendStatus(401)
      }
    }
  }
})

const _onBehalfOf = onBehalfOf(config.oidc)
setupProxy(app, _onBehalfOf, config)

const distPath = __dirname + '/../client'
const htmlPath = path.join(distPath, 'index.html')

console.log('distpath', distPath)
console.log('htmlPath', htmlPath)

app.use(express.static(__dirname + '/../client'))
app.use('/*', express.static(htmlPath))

app.listen(port, () => logger.info(`hm-saksbehandling backend listening on port ${port}`))
