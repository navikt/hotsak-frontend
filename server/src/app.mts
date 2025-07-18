import { logger } from './logging.mjs'
import { ipAddressFromRequest } from './ipAddressFromRequest.mjs'
import { reverseProxy } from './reverseProxy.mjs'
import express, { ErrorRequestHandler } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { getToken, validateAzureToken } from '@navikt/oasis'
import { tryDecodeJwt } from './tryDecodeJwt.mjs'

const app = express()

app.use(/\/((?!api).)*/, express.json())
app.use(/\/((?!api).)*/, express.urlencoded({ extended: false }))

app.get('/isalive', (_, res) => {
  res.type('text/plain')
  res.send('ALIVE')
})

app.get('/isready', (_, res) => {
  res.type('text/plain')
  res.send('READY')
})

app.get('/settings.js', (_, res) => {
  const appSettings = {
    USE_MSW: process.env.USE_MSW === 'true',
    MILJO: process.env.NAIS_CLUSTER_NAME,
    FARO_URL: process.env.FARO_URL,
    IMAGE_PROXY_URL: process.env.IMAGE_PROXY_URL,
  }
  res.type('.js')
  res.send(`window.appSettings = ${JSON.stringify(appSettings)}`)
})

// Protected routes
app.use('/{*splat}', async (req, res, next) => {
  if (process.env.USE_MSW === 'true') {
    logger.stdout.debug('USE_MSW = "true", ingen validering av token')
    return next()
  }

  const token = getToken(req)
  if (!token) {
    logger.stdout.debug("Token mangler, redirect til '/oauth2/login'")
    return res.redirect('/oauth2/login')
  }

  const validation = await validateAzureToken(token)
  if (validation.ok) {
    return next()
  }

  const navIdent = tryDecodeJwt(token).NAVident || 'unknown'
  const message = `Ugyldig token for navIdent: ${navIdent}, koblet til via: ${ipAddressFromRequest(req)}`
  logger.stdout.warn(new Error(message, { cause: validation.error }))

  res.sendStatus(401)
})

reverseProxy(app)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = __dirname + '/../../client/dist'
const htmlPath = path.join(distPath, 'index.html')

app.use(express.static(distPath))
app.use('/{*splat}', express.static(htmlPath))

const errorRequestHandler: ErrorRequestHandler = (err, _, res) => {
  logger.stdout.error(err)
  let message = 'unknown'
  if (typeof err === 'string') {
    message = err
  } else if (err instanceof Error) {
    message = err.message
  }
  res.type('text/plain')
  res.status(500).send(message)
}

app.use(errorRequestHandler)

export { app }
