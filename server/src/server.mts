import { app } from './app.mjs'
import { logger } from './logging.mjs'

if (process.env.USE_MSW === 'true' && process.env.NAIS_CLUSTER_NAME === 'prod-gcp') {
  logger.stdout.error('USE_MSW = "true" i prod-gcp!')
  process.exit(1)
}

const port = +(process.env.PORT || '3002')

app.listen(port, () => logger.stdout.info(`hotsak-frontend lytter på port: ${port}`))
