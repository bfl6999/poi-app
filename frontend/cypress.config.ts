// cypress.config.ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8100',
    includeShadowDom: true,            
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents (on, config) {
      
    }
  }
})
