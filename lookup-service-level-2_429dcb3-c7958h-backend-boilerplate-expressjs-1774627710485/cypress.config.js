const { defineConfig } = require('cypress')

module.exports = defineConfig({
  env: {
    apiUrl: 'http://localhost:3000',
  },
  e2e: {
    setupNodeEvents(on, config) {},
    supportFile: false,
  },
})