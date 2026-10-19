# Duoc UC - Escuela de Informática y Telecomunicaciones
## Especificación de Requisitos de Software (ERS)

---

### Proyecto: Forte & Piano — Tienda Online de Instrumentos Musicales
* **Estándar:** Conforme a **IEEE 830-1998**
* **Revisión:** 2.0 (Actualización por migración a React + TypeScript y Testing Unitario)
* **Fecha:** Octubre 2026
* **Asignatura:** Desarrollo de Software / Programación Frontend (DSY1104)

---

## Ficha del Documento

| Fecha | Revisión | Autor | Modificación |
|---|---|---|---|
| 07/09/2026 | 1.0 | Equipo de Desarrollo Frontend Duoc UC | Creación y estructuración completa del documento ERS inicial para la aplicación Forte & Piano bajo arquitectura Flask, HTML5, JavaScript Vanilla y DataTables. |
| 19/10/2026 | **2.0** | Equipo de Desarrollo Frontend Duoc UC | **Actualización integral de la ERS por migración de arquitectura:** Retiro del microservidor Flask y transición a Single Page Application (SPA) con **React 18**, **TypeScript estricto**, **Vite**, **React-Bootstrap** y **React Router DOM v6**. Reemplazo de jQuery DataTables por componente propio reactivo `<DataTable>`. Inclusión formal de la suite de pruebas unitarias automatizadas con **Karma** y **Jasmine** (27 casos de prueba verificados al 100%). |

### Documento validado por las partes:

| Por el Cliente / Docente Evaluador | Por el Equipo Suministrador / Desarrolladores |
|---|---|
| **Firma:** ___________________________ | **Firma:** ___________________________ |
| **Nombre:** Docente Evaluador DSY1104 | **Nombre:** Representante Equipo de Desarrollo (Integrantes 1, 2 y 3) |

---

# 1. Introducción

El presente documento formaliza la **Especificación de Requisitos de Software (ERS)** actualizada para la plataforma de comercio electrónico **Forte & Piano**, desarrollada en estricta conformidad con el estándar **IEEE 830-1998**. Provee el marco de diseño funcional, arquitectónico y técnico necesario tanto para los evaluadores académicos como para el equipo de desarrollo.

### 1.1. Propósito
El propósito de esta ERS es definir y detallar de manera formal, medible y no ambigua los requerimientos funcionales, requerimientos no funcionales, reglas de negocio, interfaces del sistema y especificaciones de calidad para la aplicación web **Forte & Piano**, tras culminar exitosamente el proceso de migración tecnológica desde una arquitectura clásica basada en plantillas Jinja/Flask hacia una arquitectura moderna basada en componentes con **React + TypeScript + Vite**.

Este documento está dirigido a:
- **Equipo de desarrollo frontend de Duoc UC:** Responsable del diseño, refactorización a componentes, control de estado y pruebas unitarias.
- **Docentes y evaluadores de la asignatura DSY1104:** Encargados de la verificación de requerimientos, auditoría de código y validación del cumplimiento de la pauta académica.
- **Usuarios y administradores:** Interesados en la operatividad, seguridad y rendimiento de la plataforma.

---

### 1.2. Ámbito del Sistema
* **Nombre del Sistema:** Forte & Piano — Tienda Online de Pianos, Teclados y Accesorios Musicales.

#### Lo que el sistema hace:
1. **Tienda Pública:** Provee una experiencia de usuario moderna, fluida y sin recargas de página (*Single Page Application*), compuesta por catálogo de productos con filtros dinámicos en tiempo real, ficha de detalle de producto con control de stock, carrito de compras reactivo con persistencia local, artículos de blog temático con rutas dinámicas (`/blog/:slug`), sección de servicios y formulario de contacto con validación sintáctica.
2. **Autenticación y Seguridad:** Dispone de un módulo de autenticación con control de acceso basado en roles (**Administrador**, **Vendedor**, **Cliente**), registro con validación algorítmica de RUN chileno (módulo 11) y selección dependiente en cascada de regiones y comunas, además de un componente de protección declarativa de rutas (`<RutaProtegida>`).
3. **Panel Administrativo:** Provee un backoffice para la administración de catálogo y usuarios, reemplazando dependencias de jQuery por un componente propio y controlado `<DataTable>` con capacidades de búsqueda en vivo, ordenación por columnas y paginación reactiva, además de un panel de métricas con detección automática de productos en nivel de stock crítico.
4. **Persistencia Simulada:** Almacena y sincroniza toda la información en el navegador cliente mediante la API de `localStorage` en formato JSON, conectada a los componentes a través de Contextos (`AuthContext`, `CartContext`) y hooks personalizados (`useColeccion`).
5. **Calidad y Verificación Automatizada:** Incorpora una suite completa de pruebas unitarias automatizadas utilizando **Karma** y **Jasmine** ejecutadas en **Chrome Headless**, validando las reglas de negocio, utilidades de validación, lógica de compras y componentes administrativos.

#### Lo que el sistema NO hace:
- No requiere ni depende de un backend en Python o servidor WSGI Flask (la aplicación compila a archivos estáticos HTML/JS/CSS mediante Vite).
- No procesa pagos bancarios reales ni transferencias con pasarelas financieras externas (la compra se confirma y registra de forma simulada vía SweetAlert2).
- No implementa persistencia en bases de datos relacionales en la nube (la persistencia es 100% cliente en `localStorage`).

---

### 1.3. Definiciones, Acrónimos y Abreviaturas
* **ERS:** Especificación de Requisitos de Software (*Software Requirements Specification*).
* **IEEE:** *Institute of Electrical and Electronics Engineers*.
* **SPA:** *Single Page Application* (Aplicación web de una sola página que no recarga el navegador al navegar).
* **CRUD:** *Create, Read, Update, Delete* (Operaciones fundamentales de persistencia de datos).
* **DOM / Virtual DOM:** *Document Object Model* y el árbol virtual optimizado en memoria gestionado por React.
* **TypeScript:** Superset tipado de JavaScript que proporciona verificación estática de tipos en tiempo de compilación.
* **Vite:** Herramienta de compilación y servidor de desarrollo ultra-rápido basado en módulos ES nativos y Rollup.
* **React-Bootstrap:** Adaptación oficial de Bootstrap 5 reescrita como componentes puros de React.
* **Context API / Hook:** Mecanismos nativos de React para gestión de estado global y reutilización de lógica con estado.
* **Karma:** Ejecutor de pruebas (*test runner*) que levanta navegadores reales o *headless* para ejecutar suites de tests.
* **Jasmine:** Framework de desarrollo guiado por comportamiento (BDD) para pruebas y aserciones en JavaScript/TypeScript.
* **RUN:** Rol Único Nacional (cédula de identidad chilena validada con algoritmo módulo 11).
* **Stock Crítico:** Umbral numérico mínimo de inventario configurado por producto que dispara alertas visuales en el panel administrativo.

---

### 1.4. Referencias
* **Estándar IEEE 830-1998:** Práctica recomendada por la IEEE para especificaciones de requisitos de software.
* **Documentación Oficial de React 18:** https://react.dev/
* **Documentación Oficial de TypeScript 5:** https://www.typescriptlang.org/
* **Documentación Oficial de Vite:** https://vitejs.dev/
* **Documentación Oficial de React-Bootstrap:** https://react-bootstrap.netlify.app/
* **Documentación Oficial de Karma Runner & Jasmine:** https://karma-runner.github.io/ y https://jasmine.github.io/
* **Pauta de Evaluación DSY1104:** Escuela de Informática y Telecomunicaciones, Duoc UC.

---

### 1.5. Visión General del Documento
El documento continúa en la **Sección 2 (Descripción General)**, donde se aborda la perspectiva del producto, la arquitectura tecnológica migrada, las funciones generales y restricciones; y concluye en la **Sección 3 (Requisitos Específicos)**, donde se detallan los requisitos funcionales, requisitos no funcionales, especificación formal de pruebas unitarias y matriz de trazabilidad.

---

# 2. Descripción General

### 2.1. Perspectiva del Producto
El sistema **Forte & Piano** es una aplicación web centrada 100% en el frontend. Su arquitectura original basada en servidor Flask (despacho síncrono de plantillas Jinja con recargas de página completas) fue **completamente retirada y reemplazada** por una arquitectura **Single Page Application (SPA)** modular.

```
+-----------------------------------------------------------------------------------+
|                           NAVEGADOR CLIENTE (SPA)                                 |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                             REACT ROUTER DOM                                |  |
|  |     / (Home)  |  /productos  |  /carrito  |  /login  |  /admin/* (Protegido) |  |
|  +-----------------------------------------------------------------------------+  |
|                                         |                                         |
|  +-----------------------------------------------------------------------------+  |
|  |                           COMPONENTES & LAYOUTS                             |  |
|  |     Layout Público (Navbar / Footer)  |  AdminLayout (Sidebar / Offcanvas)  |  |
|  |     ProductCard | NewsCard | DataTable Reutilizable | RutaProtegida          |  |
|  +-----------------------------------------------------------------------------+  |
|                                         |                                         |
|  +-----------------------------------------------------------------------------+  |
|  |                        ESTADO GLOBAL & HOOKS (REACT)                        |  |
|  |     AuthContext (Sesión / Roles)  |  CartContext (Carrito / Stock)          |  |
|  |     useProductos  |  useTablasMaestras  |  useNoticias  |  useColeccion     |  |
|  +-----------------------------------------------------------------------------+  |
|                                         |                                         |
|  +-----------------------------------------------------------------------------+  |
|  |                         MOTOR DE PERSISTENCIA LOCAL                         |  |
|  |     HTML5 localStorage (fortepiano_usuarios, fortepiano_productos, etc.)     |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

Toda la navegación se gestiona en el cliente mediante **React Router DOM v6** sin recargar la página. La reactividad se logra mediante el ciclo de vida de React, eliminando totalmente la manipulación manual de cadenas HTML o `document.getElementById()`.

---

### 2.2. Funciones del Producto
A nivel macro, el sistema ofrece tres subsistemas principales:

1. **Subsistema Tienda Pública:**
   - **Home:** Hero Carousel animado con 4 diapositivas promocionales, sección de productos destacados y últimas noticias.
   - **Catálogo de Instrumentos:** Búsqueda en tiempo real por texto y filtrado simultáneo por categoría con renderizado de tarjetas interactivas.
   - **Ficha Técnica de Producto:** Vista detallada que valida en tiempo real la disponibilidad de inventario e impide exceder el stock físico.
   - **Carrito de Compras:** Gestión reactiva con incrementos/decrementos (+/-), remoción con confirmación modal, cálculo instantáneo de subtotales/totales y badge sincronizado en el Navbar en tiempo real.
   - **Portal Informativo:** Secciones "Nosotros" con acordeón temático para preguntas frecuentes, "Servicios" musicales, "Blog" y formulario controlado de "Contacto".
   - **Autoservicio de Clientes:** Registro con validación sintáctica estricta e inicio de sesión seguro.

2. **Subsistema de Administración:**
   - **Dashboard Administrativo:** Indicadores cuantitativos (total productos, total usuarios, total mensajes) y tabla de alertas de instrumentos con stock igual o inferior al stock crítico.
   - **Mantenedor de Catálogo:** Tabla interactiva `<DataTable>` con búsqueda, ordenación y paginación; visualización de fichas en modal SweetAlert2; y formulario de creación/edición con detección de códigos duplicados.
   - **Mantenedor de Usuarios (Solo Administrador):** Gestión CRUD de cuentas con validación de RUN, roles y selector en cascada Región → Comuna.
   - **Control de Acceso Declarativo:** Componente `<RutaProtegida>` que intercepta accesos a `/admin` o `/admin/usuarios` redirigiendo a `/login` ante sesiones inexistentes o roles no autorizados.

3. **Subsistema de Testing y Calidad:**
   - Ejecución automatizada de **27 pruebas unitarias con Karma y Jasmine** integradas en el ciclo de construcción del proyecto mediante `npm test`.

---

### 2.3. Características de los Usuarios

| Rol / Perfil | Nivel Técnico Requerido | Permisos y Responsabilidades en el Sistema |
|---|---|---|
| **Administrador** (Rol 1) | Instrucción técnica o profesional; dominio en navegación y gestión de datos. | **Acceso total e irrestricto:** Gestión completa de usuarios (CRUD), catálogo general de instrumentos y accesorios (CRUD), consulta de mensajes de contacto y métricas de inventario crítico. |
| **Vendedor** (Rol 2) | Nociones operativas de inventario y atención a clientes. | **Acceso restringido a catálogo:** Visualización de métricas generales y consulta del catálogo en **solo lectura** (sin botones de creación, edición ni eliminación de productos). Acceso totalmente bloqueado al módulo de usuarios. |
| **Cliente** (Rol 3) | Público general con conocimientos básicos en navegación web. | **Acceso exclusivo a tienda pública:** Navegación por catálogo, lectura de blog y servicios, interacción con carrito de compras, emisión de mensajes de contacto y auto-registro de cuenta. |

---

### 2.4. Restricciones Técnicas del Sistema

1. **Lenguaje y Tipado:** Uso obligatorio de **TypeScript en modo estricto (`strict: true`)**. Queda prohibido el uso indiscriminado de `any`. Toda entidad de datos (`Producto`, `Usuario`, `Sesion`, `ItemCarrito`, etc.) debe estar tipada en `src/types/index.ts`.
2. **Framework de Interfaz:** Construcción declarativa con **React 18** y **React-Bootstrap 2.10+**. Prohibido el uso de manipulación directa del DOM (`innerHTML`, `appendChild`, `classList`, `document.getElementById`) o jQuery.
3. **Persistencia de Datos:** Exclusivamente en el navegador cliente mediante `localStorage` bajo las claves prefijadas `fortepiano_*`:
   - `fortepiano_usuarios`, `fortepiano_productos`, `fortepiano_categorias`, `fortepiano_regiones`, `fortepiano_comunas`, `fortepiano_roles`, `fortepiano_carrito`, `fortepiano_contactos`, `fortepiano_blog`, `fortepiano_sesion`.
4. **Componentes Administrativos:** Prohibido el uso de la librería jQuery DataTables. Las tablas interactivas deben implementarse mediante el componente nativo reutilizable `<DataTable>`.
5. **Testing Automatizado:** Implementación obligatoria de pruebas unitarias con **Karma**, **Jasmine** y **karma-vite** ejecutables vía terminal con `npm test` sobre navegadores *headless*.
6. **Empaquetado:** Compilación estática limpia mediante **Vite** ejecutando `npm run build` con 0 errores y 0 advertencias de tipos.

---

### 2.5. Suposiciones y Dependencias
- Se asume que el usuario dispone de un navegador web moderno con soporte para ECMAScript 2020+ y API Web Storage habilitada (Chrome 90+, Edge 90+, Firefox 88+, Safari 14+).
- Se requiere un entorno local con **Node.js v18.0.0 o superior** y **npm v9.0.0 o superior** para el desarrollo, compilación y ejecución de tests.
- La ejecución de pruebas unitarias locales presupone la presencia de Google Chrome para la instanciación de Chrome Headless por parte de Karma.

---

### 2.6. Requisitos Futuros
- Conexión de los hooks de datos hacia un backend RESTful con Node.js/Express o Python/FastAPI con base de datos PostgreSQL.
- Integración de pasarelas de pago reales como Webpay Plus (Transbank) o Stripe.
- Módulo de autenticación con tokens JWT y recuperación de contraseñas por correo electrónico transaccional.

---

# 3. Requisitos Específicos

## 3.1. Requisitos Comunes de las Interfaces

### 3.1.1. Interfaces de Usuario
- **Identidad Visual:** Diseño oscuro de gama alta (*Dark Theme*), con fondo negro carbón (`--forte-bg: #111111`), paneles gris antracita (`--forte-panel: #262626`) y acentos en oro clásico (`--forte-gold: #c5a059`).
- **Tipografía:** Encabezados en fuente serif clásica **Playfair Display** y cuerpos de texto en fuente legible sin remates **Inter** (cargadas vía Google Fonts en `index.html`).
- **Diseño Responsivo:** Rejilla flexible de React-Bootstrap (`Container`, `Row`, `Col`) adaptable a resoluciones móviles (desde 360px), tablets y pantallas de escritorio.
- **Diálogos y Notificaciones:** Cuadros modales interactivos y alertas asíncronas con **SweetAlert2** estilizado en modo oscuro.

### 3.1.2. Interfaces de Software y Dependencias
* **Runtime:** Node.js v18+.
* **Empaquetador:** Vite v5.4.
* **Librerías Core:** React v18.3, React-DOM v18.3, React-Router-DOM v6.26.
* **Componentes Gráficos:** React-Bootstrap v2.10, Bootstrap v5.3, Bootstrap-Icons v1.11.
* **Alertas:** SweetAlert2 v11.14.
* **Herramientas de Test:** Karma v6.4, Jasmine-Core v7.0, Karma-Jasmine v5.1, Karma-Vite v1.0, Karma-Chrome-Launcher v3.2.

---

## 3.2. Catálogo de Requisitos Funcionales (RF)

### [RF01] Inicialización de Datos Semilla y Persistencia Reactiva
* **Actores:** Sistema / Navegador.
* **Descripción:** Al iniciar la aplicación, el sistema verifica la existencia de las colecciones base en `localStorage`. Si alguna no existe, invoca automáticamente `inicializarDatos()` desde `src/data/seed.ts`, poblando roles (Administrador, Vendedor, Cliente), categorías de instrumentos, regiones y comunas chilenas, usuarios de prueba preconfigurados, catálogo de instrumentos con imágenes y noticias iniciales del blog.
* **Implementación:** Hooks `useColeccion<T>` y `useEffect` en el componente raíz.

### [RF02] Registro de Clientes con Validación Estricta
* **Actores:** Cliente.
* **Descripción:** Formulario interactivo en `/registro` para dar de alta una cuenta con rol Cliente (`rolId: 3`).
* **Reglas de Validación de Entrada:**
  - **RUN:** Obligatorio, longitud de 7 a 9 caracteres sin puntos ni guión. Validación algorítmica de dígito verificador mediante algoritmo módulo 11. Verificación de no duplicidad en la colección existente de usuarios.
  - **Nombre y Apellidos:** Requeridos. Nombre máx. 50 caracteres; apellidos máx. 100 caracteres.
  - **Correo Electrónico:** Requerido, máx. 100 caracteres. Validación de lista blanca de dominios permitidos: `@duoc.cl`, `@profesor.duoc.cl` y `@gmail.com`.
  - **Contraseña:** Requerida, longitud estricta de 4 a 10 caracteres.
  - **Región y Comuna:** Selección en cascada dependiente (al seleccionar una región, el selector de comunas se habilita y filtra las comunas asociadas a dicha región).
  - **Dirección:** Requerida, máx. 300 caracteres.
* **Salida:** Inserción en `fortepiano_usuarios`, confirmación con SweetAlert2 y redirección a `/login`.

### [RF03] Autenticación, Sesión Global y Redirección por Rol
* **Actores:** Cliente, Vendedor, Administrador.
* **Descripción:** Formulario en `/login` gestionado por `AuthContext`. Comprueba credenciales contra `fortepiano_usuarios`.
* **Reglas de Negocio:**
  - Si las credenciales no coinciden: exhibe alerta de error "Credenciales incorrectas".
  - Si la cuenta tiene estado `"Inactivo"`: bloquea el acceso mostrando alerta "Cuenta inactiva".
  - Si las credenciales son válidas y el usuario está activo: almacena la entidad `Sesion` en `localStorage`, actualiza el estado global y redirige:
    - Roles 1 (Administrador) y 2 (Vendedor) $\rightarrow$ redirige a `/admin`.
    - Rol 3 (Cliente) $\rightarrow$ redirige a la tienda `/`.
* **Salida:** Navbar dinámico que oculta botones de login/registro y muestra el menú de usuario conectado con opción de "Cerrar sesión".

### [RF04] Catálogo de Instrumentos con Filtrado Reactivo
* **Actores:** Cliente, Vendedor, Administrador.
* **Descripción:** Vista en `/productos` que consume el hook `useProductos`. Presenta la grilla de instrumentos mediante tarjetas reutilizables `<ProductCard>`.
* **Comportamiento:**
  - Input de búsqueda con filtrado instantáneo en tiempo real sobre el nombre del instrumento.
  - Selector de categoría con opciones alimentadas desde `fortepiano_categorias`.
  - En cada tarjeta: imagen, insignia de categoría, precio formateado en pesos chilenos (`formatearPrecio`), indicador de existencias y botones para "Ver detalle" y "Añadir al carrito" (este último se deshabilita automáticamente si el stock es 0).

### [RF05] Detalle de Instrumento y Control de Existencias
* **Actores:** Cliente, Vendedor, Administrador.
* **Descripción:** Vista en `/producto-detalle?codigo=XYZ` con migas de pan (*Breadcrumbs*) y ficha técnica completa.
* **Reglas de Negocio:**
  - Control de entrada numérico para cantidad con valor mínimo 1 y valor máximo fijado estrictamente en el stock disponible del instrumento.
  - Si el producto tiene stock 0, se visualiza la insignia "Sin stock" y se bloquea el botón de compra.

### [RF06] Operatoria y Persistencia del Carrito de Compras
* **Actores:** Cliente.
* **Descripción:** Gestión centralizada mediante `CartContext` con sincronización en tiempo real.
* **Reglas de Negocio:**
  - Al añadir un producto, verifica que la suma entre lo ya contenido en el carrito y la nueva cantidad no supere el stock del producto; de superarlo, previene la acción con alerta modal de "Stock insuficiente".
  - En la vista `/carrito`: permite alterar unidades mediante botones `+` y `-`, recalcula subtotales y total global al instante, y provee botón para remover productos previa confirmación modal.
  - Botón "Vaciar carrito" con confirmación de SweetAlert2.
  - Botón "Finalizar compra": valida carrito con ítems, solicita confirmación con el total a pagar y vacía el carrito confirmando el éxito de la orden.
  - Badge rojo en el Navbar con el total acumulado de unidades visible en toda la aplicación.

### [RF07] Difusión Musical y Detalle Dinámico de Blog
* **Actores:** Cliente, Público General.
* **Descripción:** Listado en `/blog` con artículos informativos sobre pianos y técnica musical. Permite ingresar al artículo íntegro mediante la ruta dinámica `/blog/:slug` (`BlogDetalle.tsx`), cargando el contenido largo, imágenes de apoyo y botón de retorno.

### [RF08] Servicios Musicales Institucionales
* **Actores:** Cliente, Público General.
* **Descripción:** Vista en `/servicios` que detalla los 3 servicios clave de la empresa: Afinación y Regulación a domicilio, Clases de Piano personalizadas y Transporte especializado con seguro.

### [RF09] Formulario de Contacto y Feedback
* **Actores:** Cliente, Público General.
* **Descripción:** Vista en `/contacto` con campos Nombre (máx. 100 car.), Correo (validado) y Comentario (máx. 500 car.). Al enviar satisfactoriamente, almacena el registro en `fortepiano_contactos`, limpia el formulario y despliega SweetAlert2 de confirmación.

### [RF10] Panel Administrativo de Catálogo (CRUD)
* **Actores:** Administrador, Vendedor.
* **Descripción:** Vista en `/admin/productos` sobre el componente `<DataTable>`.
* **Reglas de Negocio:**
  - Si el usuario es **Vendedor (Rol 2)**: Opera en modo solo lectura. Oculta el botón "Nuevo instrumento" y las acciones de editar y eliminar; solo dispone del botón "Ver".
  - Si el usuario es **Administrador (Rol 1)**: Dispone de acceso completo.
  - Formulario `/admin/productos/form`: Valida código único (mínimo 3 caracteres), nombre, precio (>= 0), stock (entero >= 0) y categoría. Si el stock asignado es menor o igual al stock crítico, emite una advertencia visual.
  - Eliminación: Requiere confirmación modal obligatoria con SweetAlert2.

### [RF11] Panel Administrativo de Usuarios (CRUD)
* **Actores:** Administrador.
* **Descripción:** Vista en `/admin/usuarios` sobre `<DataTable>`.
* **Reglas de Negocio:**
  - Acceso restringido exclusivamente a cuentas con rol Administrador (`rolId: 1`).
  - Permite listar, ver ficha en modal, editar roles/datos y eliminar cuentas (con confirmación modal).
  - Formulario `/admin/usuarios/form`: Valida RUN único con algoritmo módulo 11, correo permitido, contraseñas de 4 a 10 caracteres y selección dependiente Región → Comuna.

### [RF12] Enrutamiento Declarativo y Protección de Rutas
* **Actores:** Sistema.
* **Descripción:** Mediante el componente `<RutaProtegida>`, cualquier intento de acceder a `/admin/*` sin sesión activa o con rol no autorizado (ej. Cliente) dispara automáticamente una alerta modal de "Acceso restringido" y redirige hacia `/login`. De igual forma, las rutas exclusivas de administración de usuarios quedan restringidas solo al rol 1.

---

## 3.3. Requisitos No Funcionales (RNF)

### 3.3.1. Requisitos de Rendimiento
* **RNF01 — Carga Inicial y Navegación:** El bundle de producción generado por Vite no debe superar los 500 kB en su fragmento principal de lógica JavaScript (comprimido con Gzip). La navegación entre vistas debe ser instantánea (< 50 milisegundos), al realizarse en memoria sin petición de nuevas páginas al servidor.
* **RNF02 — Persistencia Local:** Las operaciones de lectura y serialización JSON hacia `localStorage` deben ejecutarse en menos de 20 milisegundos.

### 3.3.2. Seguridad
* **RNF03 — Sanitización y XSS:** Eliminación de vulnerabilidades de Cross-Site Scripting (XSS) al erradicar el uso de `innerHTML`; React escapa automáticamente cualquier contenido renderizado en JSX.
* **RNF04 — Validación en Capa Cliente:** Validación estricta con expresiones regulares de RUN chileno, correos institucionales autorizados y contraseñas seguras previo a la inserción en el almacén de datos.
* **RNF05 — Confirmación de Operaciones Destructivas:** Cualquier acción de borrado físico o vaciado de colecciones exige confirmación modal asíncrona de dos pasos con SweetAlert2.

### 3.3.3. Fiabilidad y Tolerancia a Fallos
* **RNF06 — Robustez de Tipos:** El 100% del código de la aplicación debe compilar bajo TypeScript con cero errores de tipo (`noImplicitAny`, `strictNullChecks`), evitando errores en tiempo de ejecución de tipo `TypeError: Cannot read properties of undefined`.
* **RNF07 — Recuperación de Almacén:** Ante un `localStorage` vacío o corrupto, el sistema reinicializa automáticamente las semillas por defecto desde `seed.ts` sin interrumpir la experiencia de usuario.

### 3.3.4. Mantenibilidad y Estructura del Código
* **RNF08 — Arquitectura Modular y Cohesiva:** Separación estricta de responsabilidades en el directorio `src/`:
  - `types/`: Contratos de interfaces de dominio.
  - `storage/`: Claves y hooks genéricos de persistencia.
  - `context/`: Estados globales transversales (`AuthContext`, `CartContext`).
  - `hooks/`: Lógica de negocio reutilizable (`useProductos`, `useTablasMaestras`, etc.).
  - `utils/`: Funciones puras de validación, formateo y alertas.
  - `components/`: Componentes atómicos reutilizables (`Navbar`, `Footer`, `DataTable`, `ProductCard`, `NewsCard`).
  - `pages/`: Vistas de nivel superior y pantallas administrativas.

### 3.3.5. Portabilidad
* **RNF09 — Compatibilidad Multiplataforma:** La aplicación debe funcionar de manera idéntica en Google Chrome, Mozilla Firefox, Microsoft Edge y Safari en sistemas operativos Windows, macOS y GNU/Linux.

---

## 3.4. Especificación Formal de Pruebas Unitarias (Karma + Jasmine)

### 3.4.1. Marco y Entorno de Testing
* **Test Runner:** **Karma v6.4** configurado en `karma.conf.cjs`.
* **Framework BDD:** **Jasmine v5.1 / v7.0** (`describe`, `it`, `expect`).
* **Transformador:** **karma-vite** para procesar módulos TypeScript y JSX en tiempo real.
* **Navegador de Ejecución:** **Chrome Headless** (automatización en consola sin interfaz gráfica).
* **Comando de Ejecución:** `npm test`.

---

### 3.4.2. Matriz de Pruebas Unitarias (27 Casos de Prueba Verificados)

| Integrante Responsable | Suite de Pruebas (Archivo) | Módulo Evaluado | Casos de Prueba Implementados (`it`) | Resultado de Ejecución |
|---|---|---|---|---|
| **Integrante 1** | `src/__tests__/integrante1/validaciones.spec.ts` | `src/utils/validaciones.ts` | 1. Validación de RUNs chilenos válidos con algoritmo módulo 11.<br>2. Rechazo de RUNs con dígito verificador erróneo.<br>3. Rechazo de RUNs con longitud o caracteres inválidos.<br>4. Aceptación exclusiva de correos con dominios permitidos (`@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`).<br>5. Rechazo de correos no autorizados (`@hotmail.com`, etc.).<br>6. Rechazo de correos vacíos o mayores a 100 caracteres.<br>7. Validación de contraseña en rango 4 a 10 caracteres.<br>8. Rechazo de contraseñas fuera de rango. | **100% SUCCESS** |
| **Integrante 1** | `src/__tests__/integrante1/auth-context.spec.ts` | `src/context/AuthContext.tsx` | 9. Inicio de sesión exitoso con credenciales correctas y persistencia de `Sesion` en `localStorage`.<br>10. Rechazo de autenticación con contraseña incorrecta o cuenta con estado `'Inactivo'`. | **100% SUCCESS** |
| **Integrante 2** | `src/__tests__/integrante2/formato-precio.spec.ts` | `src/utils/formato.ts` | 11. Formateo de precio con separador de miles chileno (`$699.990`).<br>12. Manejo consistente de valor cero (`$0`) y redondeos. | **100% SUCCESS** |
| **Integrante 2** | `src/__tests__/integrante2/cart-context.spec.ts` | `src/context/CartContext.tsx` | 13. Inicialización de carrito vacío en `localStorage`.<br>14. Adición de producto dentro del stock incrementa `totalItems`.<br>15. Cálculo correcto de subtotales por producto y total de compra.<br>16. Bloqueo de compra si la cantidad solicitada excede el stock del producto.<br>17. Bloqueo de adición para productos sin stock disponible (`stock: 0`).<br>18. Modificación de cantidades mediante deltas `+` y `-`.<br>19. Vaciado completo del carrito de compras. | **100% SUCCESS** |
| **Integrante 3** | `src/__tests__/integrante3/datatable.spec.ts` | `src/components/common/DataTable.tsx` | 20. Filtrado de registros en tiempo real ante texto de búsqueda coincidente.<br>21. Estado sin resultados si ningún registro coincide.<br>22. Ordenación de columnas en orden ascendente (A-Z / menor a mayor).<br>23. Alternancia de ordenación a orden descendente (Z-A / mayor a menor).<br>24. Paginación correcta respetando el número de filas por página. | **100% SUCCESS** |
| **Integrante 3** | `src/__tests__/integrante3/contacto-val.spec.ts` | `src/pages/Contacto.tsx` | 25. Rechazo de formulario si faltan campos obligatorios.<br>26. Rechazo de comentarios que excedan el límite de 500 caracteres.<br>27. Registro exitoso de mensaje en la colección `fortepiano_contactos` de `localStorage` con fecha actual. | **100% SUCCESS** |

#### Evidencia de Ejecución en Consola (`npm test`):
```text
> forte-piano-react@1.0.0 test
> karma start karma.conf.cjs

INFO [karma-server]: Karma v6.4.4 server started at http://localhost:9876/
INFO [launcher]: Starting browser ChromeHeadless
INFO [Chrome Headless 155.0.0.0 (Windows 10)]: Connected on socket with id 86775637
Chrome Headless 155.0.0.0 (Windows 10): Executed 27 of 27 SUCCESS (0.072 secs / 0.063 secs)
TOTAL: 27 SUCCESS
```

---

## 3.5. Matriz de Trazabilidad Requisitos vs. Pruebas Unitarias

| Requisito Funcional | Módulos de Código Fuente | Pruebas Unitarias de Verificación (Karma + Jasmine) |
|---|---|---|
| **RF01** (Semillas y Persistencia) | `src/data/seed.ts`, `src/storage/useColeccion.ts` | `cart-context.spec.ts` (Validación de lectura y persistencia en localStorage) |
| **RF02** (Registro de Clientes) | `src/pages/Registro.tsx`, `src/utils/validaciones.ts` | `validaciones.spec.ts` (Casos 1 al 8: RUN, email, password) |
| **RF03** (Login y Sesión) | `src/pages/Login.tsx`, `src/context/AuthContext.tsx` | `auth-context.spec.ts` (Casos 9 y 10: login, credenciales, estado inactivo) |
| **RF04 / RF05** (Catálogo y Precios) | `src/pages/Productos.tsx`, `src/utils/formato.ts` | `formato-precio.spec.ts` (Casos 11 y 12: formato moneda es-CL) |
| **RF06** (Carrito y Stock) | `src/pages/Carrito.tsx`, `src/context/CartContext.tsx` | `cart-context.spec.ts` (Casos 13 al 19: límites de stock, subtotales, totales) |
| **RF09** (Contacto) | `src/pages/Contacto.tsx` | `contacto-val.spec.ts` (Casos 25 al 27: validaciones, longitud, guardado) |
| **RF10 / RF11** (Admin DataTables) | `src/components/common/DataTable.tsx` | `datatable.spec.ts` (Casos 20 al 24: búsqueda, ordenación, paginación) |
| **RF12** (Rutas Protegidas) | `src/components/common/RutaProtegida.tsx` | `auth-context.spec.ts` (Control de roles y autorización de sesión) |

---

# 4. Conclusiones y Estado del Proyecto
La versión 2.0 de esta Especificación de Requisitos de Software refleja con máxima fidelidad técnica la realidad del repositorio migrado:
1. Se alcanzó **paridad funcional total (100%)** respecto a las pantallas y requerimientos de la versión original.
2. Se eliminó la dependencia de servidor Python/Flask, convirtiendo el proyecto en una **SPA estática optimizada de alto rendimiento**.
3. Se modernizó el código fuente con **TypeScript estricto** y componentes reutilizables de **React-Bootstrap**, erradicando por completo el código espagueti y las manipulaciones imperativas del DOM.
4. Se incorporó una arquitectura formal de **Testing Unitario con Karma y Jasmine**, garantizando que el 100% de los 27 casos de prueba críticos del sistema pasen satisfactoriamente en entornos de integración continua (*Chrome Headless*).
