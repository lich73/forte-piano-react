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
    console.log('  DESGLOSE DE TESTS UNITARIOS - FORTE & PIANO (Carpeta: tests_varios)')
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
      { 'reporter:desglose': ['type', DesgloseReporter] }
    ],
    frameworks: ['vite', 'jasmine'],
    client: {
      jasmine: {
        random: false
      }
    },
    files: [
      // Tests antiguos (integrante1, integrante2, integrante3) desactivados temporalmente:
      // { pattern: 'src/__tests__/integrante*/**/*.spec.ts', type: 'module', watched: false, served: false },
      // { pattern: 'src/__tests__/integrante*/**/*.spec.tsx', type: 'module', watched: false, served: false },

      // Solo ejecutar los 5 nuevos tests de la carpeta tests_varios (en orden 1 al 5):
      {
        pattern: 'src/__tests__/tests_varios/**/*.spec.tsx',
        type: 'module',
        watched: false,
        served: false
      },
      {
        pattern: 'src/__tests__/tests_varios/**/*.spec.ts',
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
    reporters: ['desglose'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_ERROR
  })
}
