const fs = require('fs')

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

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'vite'],
    files: [
      { pattern: 'src/**/*.spec.ts', type: 'module', watched: false, served: false },
      { pattern: 'src/**/*.spec.tsx', type: 'module', watched: false, served: false }
    ],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-vite'
    ],
    browsers: ['ChromeHeadless'],
    singleRun: true,
    reporters: ['progress']
  })
}
