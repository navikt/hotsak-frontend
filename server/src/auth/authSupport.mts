import { logger } from '../logging.mjs'

interface IsValidInProps {
  seconds: number
  token?: string
}

const isValidIn = ({ seconds, token }: IsValidInProps): boolean => {
  if (!token) return false
  const timeToCheck = Math.floor(Date.now() / 1000) + seconds
  const expirationTime = parseInt(claimsFrom(token)['exp'] as string)
  return timeToCheck < expirationTime
}

const isMemberOf = (token: string, group?: string): boolean => {
  const claims = claimsFrom(token)
  const groups = claims['groups'] as string[]
  return groups.filter((element: string) => element === group).length === 1
}

const valueFromClaim = (claim: string, token?: string): string => {
  if (token === undefined) {
    logger.info(`No token, cannot extract claim value '${claim}'`)
    return 'unknown value'
  }
  try {
    return (claimsFrom(token)[claim] as string) || 'unknown value'
  } catch (err) {
    logger.error(`error while extracting value from claim '${claim}': ${err}`)
    return 'unknown value'
  }
}
const claimsFrom = (token: string): any => {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}

const createTokenForTest = () =>
  `${Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')}.${Buffer.from(
    JSON.stringify({
      name: 'Silje Saksbehandler',
      email: 'silje.saksbehandler@nav.no',
      NAVident: 'S112233',
      oid: '23ea7485-1324-4b25-a763-assdfdfa',
    })
  ).toString('base64')}.bogussignature`

export default {
  isValidIn,
  isMemberOf,
  valueFromClaim,
  createTokenForTest,
}
