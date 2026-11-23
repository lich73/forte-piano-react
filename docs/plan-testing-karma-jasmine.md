# Plan de Testing Unitario con Karma y Jasmine
## Proyecto: Forte & Piano (React + TypeScript)

Este documento detalla la estrategia, configuración técnica y distribución de pruebas unitarias para el equipo de 3 integrantes, utilizando **Karma** como ejecutor de pruebas (*test runner*) y **Jasmine** como framework de aserciones.

---

## 1. Respuesta a la duda del Integrante 1

> **¿Puedo empezar a hacer tests unitarios aunque el Integrante 3 no haya terminado su parte?**

**Sí, absolutamente.** 
Las pruebas unitarias (*unit tests*) tienen como principio fundamental probar piezas de código de forma **aislada e independiente** del resto del sistema. 

Dado que las fases del **Integrante 1** (Fase 0, 1 y 5: Auth, Login, Registro, validaciones) y del **Integrante 2** (Fase 2, 4 y 7: Storage, Catálogo, Detalle, Carrito y Contextos) ya están completamente mergeadas y operativas en `migracion-react`, el Integrante 1 puede desarrollar y ejecutar sus tests de inmediato sin depender de lo que falte del Integrante 3.

---

## 2. Configuración Técnica: Karma + Jasmine en React/Vite

### Paquetes necesarios
Para ejecutar tests unitarios con Karma y Jasmine en un proyecto con Vite y TypeScript:
```bash
npm install -D karma jasmine-core karma-jasmine karma-chrome-launcher karma-vite @types/jasmine
```

### Archivo de configuración: `karma.conf.cjs`
Karma se configura en la raíz del proyecto para reconocer TypeScript, JSX y módulos ES a través de Vite, e incluye medición de cobertura con `karma-coverage`:
```javascript
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'vite'],
    files: [
      { pattern: 'src/__tests__/*.spec.tsx', type: 'module', watched: false, served: false },
      { pattern: 'src/__tests__/*.spec.ts', type: 'module', watched: false, served: false }
    ],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-vite',
      'karma-coverage'
    ],
    vite: {
      coverage: {
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/__tests__/**', 'node_modules/**'],
        extension: ['.ts', '.tsx']
      }
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
    reporters: ['coverage'],
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
    }
  })
}
```

### Script en `package.json`
```json
"scripts": {
  "test": "karma start karma.conf.cjs"
}
```

---

## 3. Suite Vigente: 5 Tests Unitarios en `src/__tests__/`

La carpeta `src/__tests__/` es la **única ubicación de tests** del proyecto. Las antiguas suites `integrante1`, `integrante2` e `integrante3` fueron eliminadas para evitar duplicidad y mantener una sola fuente de verdad.

```
src/
├── __tests__/
│   ├── 1-render.spec.tsx     # Render  → Footer
│   ├── 2-props.spec.tsx      # Props   → NewsCard
│   ├── 3-state.spec.tsx      # State   → Productos (soloOfertas)
│   ├── 4-event.spec.tsx      # Event   → ProductCard + CartContext
│   └── 5-entorno.spec.ts     # Entorno → seed.ts + claves.ts
```

---

### Detalle de los 5 Tests

#### Test 1: Render de un componente de layout
* **Archivo:** `src/__tests__/1-render.spec.tsx`
* **Módulo evaluado:** `src/components/layout/Footer.tsx`
* **Caso de prueba:**
  1. Renderiza `<Footer>` dentro de `<MemoryRouter>` usando `createRoot` y `act`.
  2. Comprueba que existe el elemento `<footer>` y que el texto contiene el nombre de la tienda y sus enlaces.

#### Test 2: Recepción de props en un componente de contenido
* **Archivo:** `src/__tests__/2-props.spec.tsx`
* **Módulo evaluado:** `src/components/common/NewsCard.tsx`
* **Caso de prueba:**
  1. Construye un objeto `Noticia` de prueba y lo pasa como prop `noticia`.
  2. Verifica que el DOM muestra el título, la fecha y el resumen recibidos.

#### Test 3: Actualización de estado local
* **Archivo:** `src/__tests__/3-state.spec.tsx`
* **Módulo evaluado:** `src/pages/Productos.tsx`
* **Caso de prueba:**
  1. Renderiza `<Productos>` dentro de `<CartProvider>` y `<MemoryRouter>`.
  2. Verifica el texto inicial del botón `#btnFiltroOfertas` ("Ver productos en oferta").
  3. Hace clic y comprueba que el estado `soloOfertas` cambia a `true` reflejándose en "Viendo solo ofertas".

#### Test 4: Ejecución de eventos y persistencia
* **Archivo:** `src/__tests__/4-event.spec.tsx`
* **Módulos evaluados:** `src/components/common/ProductCard.tsx`, `src/context/CartContext.tsx`
* **Caso de prueba:**
  1. Inicializa la semilla con `inicializarDatos()` y toma el producto `PD-001`.
  2. Renderiza `<ProductCard>` dentro de `<CartProvider>`.
  3. Dispara el `click` del botón `button[title="Añadir al carrito"]`.
  4. Comprueba que `localStorage['fortepiano_carrito']` contiene el producto con cantidad `1`.

#### Test 5: Verificación del entorno y semillas
* **Archivo:** `src/__tests__/5-entorno.spec.ts`
* **Módulos evaluados:** `src/data/seed.ts`, `src/storage/claves.ts`
* **Caso de prueba:**
  1. Verifica la disponibilidad de `window`, `document` y `localStorage`.
  2. Ejecuta `inicializarDatos()`.
  3. Comprueba que las colecciones de roles, productos y usuarios quedan cargadas en `localStorage` usando `FORTEPIANO_KEYS`.

---

## 4. Convención de Ramas y Commits para Tests

La suite se mantiene en una sola rama de testing desde `main`:

* **Rama:** `test/suite-unitaria-react`
* **Commit:** `test(frontend): consolidar los 5 tests unitarios en src/__tests__ con cobertura karma`

> Los archivos de las suites antiguas se conservan únicamente en el historial de Git y pueden recuperarse con `git log -- src/__tests__/integrante*` si se necesitan como referencia.
