// karma.conf.cjs
const fs = require('fs')

// Asegurar ruta de Chrome en Windows si no está definida en el entorno
if (!process.env.CHROME_BIN) {
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ]
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      process.env.CHROME_BIN = p
      break
    }
  }
}

module.exports = (config) => {
  config.set({
    plugins: ['karma-vite', 'karma-jasmine', 'karma-chrome-launcher'],
    frameworks: ['vite', 'jasmine'],
    files: [
      {
        pattern: 'src/**/*.spec.ts',
        type: 'module',
        watched: false,
        served: false
      },
      {
        pattern: 'src/**/*.spec.tsx',
        type: 'module',
        watched: false,
        served: false
      }
    ],
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    },
    singleRun: true,
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO
  })
}
