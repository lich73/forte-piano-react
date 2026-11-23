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

// Reporter personalizado para mostrar en consola el desglose detallado de cada test
function DesgloseReporter() {
  this.adapters = []
  let contador = 0

  this.onRunStart = () => {
    contador = 0
    console.log('\n==========================================================================')
    console.log('  DESGLOSE DE TESTS UNITARIOS - FORTE & PIANO (Carpeta: __tests__)')
    console.log('==========================================================================\n')
  }

  this.onSpecComplete = (_browser, result) => {
    contador++
    const categoria = result.suite.join(' > ')
    const descripcion = result.description
    const tiempo = result.time != null ? `${result.time} ms` : '0 ms'

    if (result.skipped) {
      console.log(`  ${contador}. [OMITIDO] ${categoria}`)
      console.log(`     └─ ${descripcion}\n`)
    } else if (result.success) {
      console.log(`  \x1b[32m✔ TEST #${contador} [PASÓ]\x1b[0m — \x1b[1m${categoria}\x1b[0m (${tiempo})`)
      console.log(`     └─ ${descripcion}\n`)
    } else {
      console.log(`  \x1b[31m✖ TEST #${contador} [FALLÓ]\x1b[0m — \x1b[1m${categoria}\x1b[0m (${tiempo})`)
      console.log(`     └─ ${descripcion}`)
      if (result.log && result.log.length > 0) {
        result.log.forEach((err) => console.log(`        \x1b[31m${err.trim()}\x1b[0m`))
      }
      console.log('')
    }
  }

  this.onRunComplete = (_browsers, results) => {
    const total = results.success + results.failed
    const colorResumen = results.failed === 0 ? '\x1b[32m' : '\x1b[31m'
    console.log('==========================================================================')
    console.log(
      `  ${colorResumen}RESULTADO FINAL: ${results.success} de ${total} tests PASARON correctamente (${results.failed} fallidos)\x1b[0m`
    )
    console.log('==========================================================================\n')
  }
}

module.exports = (config) => {
  config.set({
    plugins: [
      'karma-vite',
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-coverage',
      { 'reporter:desglose': ['type', DesgloseReporter] }
    ],
    frameworks: ['vite', 'jasmine'],
    vite: {
      coverage: {
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/__tests__/**', 'node_modules/**'],
        extension: ['.ts', '.tsx']
      },
      config: {
        server: {
          preTransformRequests: false
        }
      }
    },
    client: {
      jasmine: {
        random: false
      }
    },
    files: [
      // Unicos tests del proyecto: 5 pruebas unitarias en src/__tests__ (orden 1 al 5)
      {
        pattern: 'src/__tests__/*.spec.tsx',
        type: 'module',
        watched: false,
        served: false
      },
      {
        pattern: 'src/__tests__/*.spec.ts',
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
    reporters: ['desglose', 'coverage'],
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'text' },
        { type: 'text-summary' },
        { type: 'html' },
        { type: 'lcovonly' },
        { type: 'json' },
        { type: 'json-summary' }
      ]
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_ERROR
  })
}
