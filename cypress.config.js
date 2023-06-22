const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '5ibpbg',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
