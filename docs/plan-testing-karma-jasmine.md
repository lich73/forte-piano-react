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
Karma se configura en la raíz del proyecto para reconocer TypeScript, JSX y módulos ES a través de Vite:
```javascript
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'vite'],
    files: [
      { pattern: 'src/**/*.spec.ts', type: 'module' },
      { pattern: 'src/**/*.spec.tsx', type: 'module' }
    ],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-vite'
    ],
    browsers: ['ChromeHeadless'], // Ideal para terminal sin abrir ventana
    singleRun: true,
    reporters: ['progress']
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

## 3. Distribución del Plan: 2 Tests por Integrante

Cada integrante desarrollará **2 suites de prueba unitarias** asociadas a sus componentes y módulos correspondientes:

```
src/
├── __tests__/
│   ├── integrante1/
│   │   ├── validaciones.spec.ts        # Test 1 (Validaciones de negocio)
│   │   └── auth-context.spec.ts        # Test 2 (Autenticación y Sesión)
│   ├── integrante2/
│   │   ├── formato-precio.spec.ts      # Test 3 (Formato de moneda chilena)
│   │   └── cart-context.spec.ts        # Test 4 (Lógica de Carrito y Stock)
│   └── integrante3/
│       ├── datatable.spec.ts           # Test 5 (Filtro y ordenación DataTable)
│       └── contacto-val.spec.ts        # Test 6 (Validación formulario Contacto)
```

---

### Detalle de Tests por Integrante

###  Integrante 1 (Arquitectura & Seguridad)
*Ya puede empezar inmediatamente.*

#### Test 1: Algoritmo de Validación de RUN y Reglas de Correo
* **Archivo:** `src/__tests__/integrante1/validaciones.spec.ts`
* **Módulo evaluado:** `src/utils/validaciones.ts` (`validarRun`, `validarCorreo`, `validarPassword`)
* **Casos de prueba a verificar:**
  1. `validarRun()` debe retornar `true` para un RUN chileno válido con dígito verificador correcto (ej. `123456785` o `112223339`), y `false` para RUNs con dígito incorrecto o longitud inválida.
  2. `validarCorreo()` debe aceptar únicamente dominios permitidos (`@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`) y rechazar dominios no autorizados (ej. `@hotmail.com` o texto vacío).

#### Test 2: Proveedor de Autenticación (`AuthContext` y Sesión)
* **Archivo:** `src/__tests__/integrante1/auth-context.spec.ts`
* **Módulo evaluado:** `src/context/AuthContext.tsx`
* **Casos de prueba a verificar:**
  1. Credenciales válidas de usuario activo deben crear la sesión en `localStorage` con su `rolId` y nombre correcto.
  2. Credenciales inválidas o cuenta marcada como `'Inactivo'` deben rechazar el login con `exito: false` y mantener la sesión en `null`.

---

###  Integrante 2 (E-Commerce & Estado Global)
*Ya puede empezar inmediatamente.*

#### Test 3: Formateo de Precios y Manejo de Moneda Local
* **Archivo:** `src/__tests__/integrante2/formato-precio.spec.ts`
* **Módulo evaluado:** `src/utils/formato.ts` (`formatearPrecio`)
* **Casos de prueba a verificar:**
  1. `formatearPrecio(699990)` debe retornar el formato con separador de miles chileno `"$699.990"`.
  2. Debe manejar correctamente valores en `0` (`"$0"`) y números decimales redondeados.

#### Test 4: Lógica de Carrito y Límite de Stock Disponible
* **Archivo:** `src/__tests__/integrante2/cart-context.spec.ts`
* **Módulo evaluado:** `src/context/CartContext.tsx`
* **Casos de prueba a verificar:**
  1. Agregar un producto dentro del stock debe incrementar `totalItems` y calcular el subtotal correctamente.
  2. Intentar agregar una cantidad superior al `producto.stock` o agregar un producto agotado (`stock: 0`) debe ser bloqueado y no modificar el carrito.

---

###  Integrante 3 (Contenidos & Panel Administrativo)
*Puede iniciar en cuanto complete o maquete sus componentes.*

#### Test 5: Componente de Búsqueda y Orden en `<DataTable>`
* **Archivo:** `src/__tests__/integrante3/datatable.spec.ts`
* **Módulo evaluado:** `src/components/common/DataTable.tsx`
* **Casos de prueba a verificar:**
  1. El filtro de búsqueda por texto debe reducir la lista de registros a solo aquellos que coincidan con el término ingresado.
  2. El ordenamiento por columna debe alternar ascendentemente y descendentemente según la columna seleccionada.

#### Test 6: Validación de Formulario de Contacto
* **Archivo:** `src/__tests__/integrante3/contacto-val.spec.ts`
* **Módulo evaluado:** `src/pages/Contacto.tsx`
* **Casos de prueba a verificar:**
  1. El formulario debe rechazar el envío si el comentario está vacío o supera los 500 caracteres permitidos.
  2. Un envío válido debe registrar el mensaje en la colección `fortepiano_contactos` de `localStorage` con la fecha actual.

---

## 4. Convención de Ramas y Commits para Tests

Cada integrante creará su rama para testing desde `migracion-react`:

1. **Integrante 1:**
   * Rama: `test-integrante-1-auth-validaciones`
   * Commit: `test(auth): agregar pruebas unitarias para validaciones y auth context con karma/jasmine`
2. **Integrante 2:**
   * Rama: `test-integrante-2-formato-carrito`
   * Commit: `test(cart): agregar pruebas unitarias para formateo y logica de carrito con karma/jasmine`
3. **Integrante 3:**
   * Rama: `test-integrante-3-datatable-contacto`
   * Commit: `test(admin): agregar pruebas unitarias para datatable y contacto con karma/jasmine`
