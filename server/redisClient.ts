import redis from 'redis'

import logger from './logging'
import { RedisConfig } from './types'

const init = (config: RedisConfig) => {
  const redisClient = redis.createClient({
    host: config.host,
    port: config.port ? +config.port : undefined,
    password: config.password,
  })
  redisClient.on('connect', () => {
    logger.info('Redis client connected')
  })

  redisClient.on('ready', () => {
    logger.info('Redis client ready')
  })

  redisClient.on('error', (err) => {
    logger.error('Redis error: ', err)
  })

  return redisClient
}

export default { init }
