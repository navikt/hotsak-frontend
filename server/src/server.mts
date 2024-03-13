import { app } from './app.mjs'
import { logger } from './logging.mjs'

const port = +(process.env.PORT || '3002')

app.listen(port, () => logger.info(`hotsak-frontend lytter på port: ${port}`))
