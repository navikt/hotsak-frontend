import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
    baseUrl: 'http://localhost:3001',
    viewportWidth: 1600,
    viewportHeight: 1200,
    defaultCommandTimeout: 20000,
  },
})
