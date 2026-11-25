/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig, loadEnv, type ProxyOptions } from 'vite'

import type { Proxy } from './proxy'
import { devTokenPlugin } from './vite-dev-token-plugin.mts'
import { htmlPlugin } from './vite-html-plugin.mjs'
import { middlewarePlugin } from './vite-middleware-plugin.mjs'

const API_PREFIXES = ['/api', '/db-scheduler', '/db-scheduler-api']

// https://vitejs.dev/config/
export default defineConfig((env) => {
  const useCopilotE2eEnvironment = process.env.COPILOT_E2E === 'true'
  const envDir = useCopilotE2eEnvironment
    ? false
    : process.env.VITE_ENV_DIR
      ? resolve(process.cwd(), process.env.VITE_ENV_DIR)
      : process.cwd()
  const miljovariabler = useCopilotE2eEnvironment ? process.env : loadEnv(env.mode, envDir)

  const { VITE_API_PROXY, VITE_GRUNNDATA_PROXY, VITE_ALTERNATIVPRODUKTER_PROXY, VITE_API_URL } = miljovariabler
  const proxy: Proxy = {
    api: VITE_API_PROXY === 'true',
    grunndata: VITE_GRUNNDATA_PROXY === 'true',
    alternativprodukter: VITE_ALTERNATIVPRODUKTER_PROXY === 'true',
  }

  // The Authorization header is set by devTokenPlugin, not here
  const apiProxy: ProxyOptions = {
    target: VITE_API_URL,
    changeOrigin: true,
    configure(p) {
      p.on('proxyReq', (proxyReq) => proxyReq.removeHeader('cookie'))
    },
  }

  return {
    base: '/',
    envDir,
    plugins: [
      ...(proxy.api ? [devTokenPlugin({ prefixes: API_PREFIXES, envDir, mode: env.mode })] : []),
      middlewarePlugin({ development: env.mode === 'test' || env.mode === 'development', proxy }),
      htmlPlugin({ development: env.mode === 'test' || env.mode === 'development', proxy }),
      react(),
    ],
    build: {
      manifest: true,
      sourcemap: true,
    },
    server: {
      port: 3001,
      proxy: {
        '/gotenberg': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite(path) {
            return path.replace(/^\/gotenberg/, '')
          },
        },
        ...(proxy.api ? Object.fromEntries(API_PREFIXES.map((prefix) => [prefix, apiProxy])) : {}),
        ...(proxy.grunndata
          ? {
              '/grunndata-api': {
                target: 'https://hm-grunndata-search.intern.dev.nav.no',
                changeOrigin: true,
                rewrite(path) {
                  return path.replace(/^\/grunndata-api/, '')
                },
              },
            }
          : {}),
        ...(proxy.alternativprodukter
          ? {
              '/alternativprodukter-api': {
                target: 'http://localhost:9000',
                changeOrigin: true,
                rewrite(path) {
                  return path.replace(/^\/alternativprodukter-api/, '')
                },
              },
            }
          : {}),
      },
      strictPort: true,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: 'src/setupTests.ts',
      exclude: ['e2e/**', 'node_modules/**'],
    },
  }
})
