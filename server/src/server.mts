import { app } from './app.mjs'
import { logger } from './logging.mjs'
import { custom } from 'openid-client'

if (process.env.USE_MSW === 'true' && process.env.NAIS_CLUSTER_NAME === 'prod-gcp') {
  logger.stdout.error('USE_MSW = "true" i prod-gcp!')
  process.exit(1)
}

custom.setHttpOptionsDefaults({
  timeout: 5000,
})

const port = +(process.env.PORT || '3002')

app.listen(port, () => logger.stdout.info(`hotsak-frontend lytter på port: ${port}`))
