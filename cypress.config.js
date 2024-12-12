const { defineConfig } = require('cypress')
const fs = require('fs');
const path = require('path');


module.exports = defineConfig({
  projectId: 'c1sz9q',
  e2e: {
    baseUrl: process.env.BASE_URL || 'http://localhost:8080', // adjustable baseUrl
    testIsolation: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        logToFile({ filename, message }) {
          try {
            const logFilePath = path.join(__dirname, './log', filename);

            fs.appendFileSync(logFilePath, `${message}\n`, 'utf8');
            return null;
          } catch (error) {
            console.error(`Error writing to log file: ${error.message}`);
            return null;
          }
        },

        clearLogFile(filename) {
          const logDir = path.join(__dirname, 'log');
          if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir); // Ensure the log directory exists
          }
      
          const logFilePath = path.join(logDir, filename); // Correct path
          if (fs.existsSync(logFilePath)) {
            fs.truncateSync(logFilePath, 0); // Clears the file content
          }
          return null;
        },
      });
    },
  },
})