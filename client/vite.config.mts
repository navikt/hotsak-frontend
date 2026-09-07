/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'

import type { Proxy } from './proxy'
import { htmlPlugin } from './vite-html-plugin.mjs'
import { middlewarePlugin } from './vite-middleware-plugin.mjs'

// https://vitejs.dev/config/
export default defineConfig((env) => {
  const useCopilotE2eEnvironment = process.env.COPILOT_E2E === 'true'
  const envDir = useCopilotE2eEnvironment
    ? false
    : process.env.VITE_ENV_DIR
      ? resolve(process.cwd(), process.env.VITE_ENV_DIR)
      : process.cwd()
  const miljovariabler = useCopilotE2eEnvironment ? process.env : loadEnv(env.mode, envDir)

  const { VITE_API_PROXY, VITE_GRUNNDATA_PROXY, VITE_ALTERNATIVPRODUKTER_PROXY, VITE_OBO_TOKEN, VITE_API_URL } =
    miljovariabler
  const proxy: Proxy = {
    api: VITE_API_PROXY === 'true',
    grunndata: VITE_GRUNNDATA_PROXY === 'true',
    alternativprodukter: VITE_ALTERNATIVPRODUKTER_PROXY === 'true',
  }
  return {
    base: '/',
    envDir,
    plugins: [
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
        ...(proxy.api
          ? {
              '/api': {
                target: VITE_API_URL,
                changeOrigin: true,
                headers: {
                  Authorization: `Bearer ${VITE_OBO_TOKEN}`,
                },
              },
              '/db-scheduler': {
                target: VITE_API_URL,
                changeOrigin: true,
                headers: {
                  Authorization: `Bearer ${VITE_OBO_TOKEN}`,
                },
              },
              '/db-scheduler-api': {
                target: VITE_API_URL,
                changeOrigin: true,
                headers: {
                  Authorization: `Bearer ${VITE_OBO_TOKEN}`,
                },
              },
            }
          : {}),
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
