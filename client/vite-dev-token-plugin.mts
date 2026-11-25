import { loadEnv, type Plugin } from 'vite'

const REFRESH_MARGIN_MS = 5 * 60_000
const DEFAULT_TOKEN_URL =
  'https://azure-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp:teamdigihot:hm-saksbehandling'

export interface DevTokenPluginOptions {
  /** Path prefixes that should get an Authorization header */
  prefixes: string[]
  /** Same envDir as in vite.config. false = read from process.env */
  envDir: string | false
  mode: string
}

interface CachedToken {
  token: string
  exp: number
}

function readEnv(envDir: string | false, mode: string): Record<string, string | undefined> {
  // Not VITE_-prefixed: VITE_* variables are exposed to the client via import.meta.env
  return envDir === false ? process.env : loadEnv(mode, envDir, ['AZURE_TOKEN_GENERATOR_', 'API_TOKEN'])
}

function expiresAt(token: string): number {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()).exp * 1000
}

function extractToken(body: string): string | undefined {
  const text = body.trim()
  if (text.startsWith('{')) {
    const json = JSON.parse(text)
    return json.access_token ?? json.token
  }
  return /^[\w-]+\.[\w-]+\.[\w-]+$/.test(text) ? text : undefined
}

export function devTokenPlugin({ prefixes, envDir, mode }: DevTokenPluginOptions): Plugin {
  let cached: CachedToken | undefined
  let inflight: Promise<string> | undefined

  async function fetchToken(): Promise<string> {
    // Re-read the env file on every refresh, so a new cookie works without restarting Vite
    const env = readEnv(envDir, mode)
    const cookie = env.AZURE_TOKEN_GENERATOR_COOKIE
    const tokenUrl = env.AZURE_TOKEN_GENERATOR_URL ?? DEFAULT_TOKEN_URL

    if (!cookie) {
      // Fallback: static token, as before
      if (env.API_TOKEN) return env.API_TOKEN
      throw new Error('Set AZURE_TOKEN_GENERATOR_COOKIE (or API_TOKEN) in .env.local')
    }

    const res = await fetch(tokenUrl, {
      headers: { Cookie: cookie },
      redirect: 'manual', // an expired session shows up as a redirect to login
    })
    const token = res.status === 200 ? extractToken(await res.text()) : undefined
    if (!token) {
      throw new Error(
        `The Wonderwall session has expired (HTTP ${res.status}). Log in at ${tokenUrl} ` +
          'and copy io.nais.wonderwall.session into AZURE_TOKEN_GENERATOR_COOKIE in .env.local'
      )
    }
    return token
  }

  async function getToken(): Promise<string> {
    if (cached && cached.exp - REFRESH_MARGIN_MS > Date.now()) return cached.token
    inflight ??= fetchToken()
      .then((token) => {
        const exp = expiresAt(token)
        if (exp < Date.now()) throw new Error('The token has expired (API_TOKEN?). Get a new one.')
        cached = { token, exp }
        console.log(`✅ Dev token valid until ${new Date(exp).toLocaleTimeString()}`)
        return token
      })
      .finally(() => (inflight = undefined))
    return inflight
  }

  return {
    name: 'dev-token',
    apply: 'serve',
    configureServer(server) {
      getToken().catch((e: Error) => console.warn(`⚠️  ${e.message}`))

      // Runs before Vite's built-in middlewares, including server.proxy
      server.middlewares.use(async (req, res, next) => {
        if (!prefixes.some((prefix) => req.url?.startsWith(prefix))) return next()
        try {
          req.headers.authorization = `Bearer ${await getToken()}`
          next()
        } catch (e) {
          res.statusCode = 401
          res.end(`dev-token: ${(e as Error).message}`)
        }
      })
    },
  }
}
