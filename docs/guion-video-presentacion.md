# Guión de Presentación Modular (Grabación Individual)
## Proyecto: Migración de Forte & Piano a React + TypeScript y Tests con Karma/Jasmine

Este guión está dividido en **3 bloques completamente independientes**, diseñado para que **cada integrante grabe su parte por separado** desde su computadora y luego simplemente unan los 3 clips en un editor de video (CapCut, Premiere, DaVinci, Clipchamp, etc.).

Cada bloque incluye:
- **Tiempo estimado:** ~1 minuto y 40 segundos por integrante (Total: ~5 minutos).
- **Indicaciones visuales:** Qué mostrar en pantalla (código o navegador).
- **Frase de entrada y frase de transición/salida:** Para que al unir los clips el video fluya con total naturalidad y coherencia.

---

## 🎬 PARTE 1: INTEGRANTE 1 — Arquitectura, Routing, Autenticación y Tests
* **Duración aproximada:** 1:40 min
* **Rol:** Introducción general, Setup base, Layouts, Login, Registro, Rutas Protegidas y Tests de Seguridad.

### 🎥 Qué mostrar en pantalla durante la grabación:
1. *(0:00 - 0:25)* Portada de la tienda `http://localhost:5173/` navegando por el Home.
2. *(0:25 - 0:55)* El código de `src/App.tsx`, mostrando la estructura de `<Layout>` y `<AdminLayout>`, y luego la pantalla de Login y Registro en el navegador.
3. *(0:55 - 1:15)* El formulario de Registro mostrando el selector dependiente de Región a Comuna, y la prueba de entrar a `/admin` sin sesión mostrando la alerta de SweetAlert2 "Acceso restringido".
4. *(1:15 - 1:40)* El archivo de test `src/__tests__/integrante1/validaciones.spec.ts` y la terminal ejecutando `npm test`.

---

### 🎙️ Lo que debe decir el Integrante 1 (Texto para leer/locutar):

> *"Estimado profesor y compañeros, un cordial saludo. Mi nombre es Patricio y hoy les presentamos la migración de nuestra tienda de instrumentos musicales, **Forte & Piano**, desde una arquitectura monolítica basada en Flask hacia una **Single Page Application** moderna desarrollada con **React, TypeScript y Vite**, estilizada mediante componentes de **React-Bootstrap**.*
>
> *En este proyecto, estuve a cargo de la **configuración del entorno base**, la **arquitectura de navegación** y el **subsistema de autenticación y control de acceso**.*
>
> *En la base técnica, configuré el tooling con Vite y TypeScript en modo estricto para asegurar un desarrollo con tipado seguro (*type-safety*), migrando los assets estáticos y estilos globales. Para la navegación, diseñé una arquitectura de doble layout desacoplado: por un lado, el **Layout Público**, compuesto por un Navbar reactivo y Footer; y por otro, el **AdminLayout**, que integra una barra lateral fija en escritorio y un menú Offcanvas responsivo optimizado para dispositivos móviles.*
>
> *En el área de seguridad, implementé el `AuthContext` utilizando la Context API para centralizar el estado global de la sesión con persistencia en `localStorage`. Desarrollé la vista de **Login**, que aplica control de acceso basado en roles (**RBAC**): redirige automáticamente a administradores y vendedores al panel `/admin`, y a los clientes a la tienda pública. En la vista de **Registro**, implementé la carga reactiva de comunas sujeta a la región seleccionada y la validación de unicidad de RUN. Además, para proteger las rutas privadas, construí el componente guard `<RutaProtegida>`, que intercepta accesos no autorizados y emite notificaciones modales con SweetAlert2.*
>
> *En cuanto al aseguramiento de calidad con **Karma y Jasmine**, diseñé dos suites de pruebas unitarias:*
> 1. *`validaciones.spec.ts`: donde verifiqué mediante pruebas paramétricas la función `validarRun()`, que calcula el dígito verificador chileno con el algoritmo Módulo 11, junto con el filtrado estricto de correos restringido a dominios autorizados como `@duoc.cl` o `@gmail.com`.*
> 2. *`auth-context.spec.ts`: donde validé el ciclo de vida de la sesión, comprobando la persistencia de credenciales válidas y el rechazo inmediato de claves incorrectas o cuentas inactivas.*
>
> *A continuación, mi compañero les explicará cómo resolvimos la capa de datos reactiva, el catálogo de productos y el carrito de compras."*

---

## 🎬 PARTE 2: INTEGRANTE 2 — Estado Global, Catálogo, Carrito y Tests
* **Duración aproximada:** 1:40 min
* **Rol:** Persistencia reactiva (`useColeccion`), Contexto de Carrito, Catálogo, Detalle de Producto y Tests E-Commerce.

### 🎥 Qué mostrar en pantalla durante la grabación:
1. *(0:00 - 0:25)* Código de `src/storage/useColeccion.ts` y `src/context/CartContext.tsx`.
2. *(0:25 - 0:55)* Navegador en `http://localhost:5173/`: El Hero Carousel deslizándose y luego la página de Catálogo (`/productos`) escribiendo en el buscador y cambiando el selector de categorías.
3. *(0:55 - 1:20)* Página de Detalle de Producto (`/producto-detalle?codigo=...`), aumentando la cantidad hasta el stock límite y haciendo clic en "Añadir al carrito", mostrando cómo se actualiza el badge rojo en el Navbar en tiempo real.
4. *(1:20 - 1:40)* Pantalla del Carrito (`/carrito`) sumando/restando cantidades, código de `src/__tests__/integrante2/` y la terminal ejecutando `npm test`.

---

### 🎙️ Lo que debe decir el Integrante 2 (Texto para leer/locutar):

> *"¡Hola! Mi nombre es [Nombre Integrante 2]. Continuando con la presentación de nuestro proyecto, mis responsabilidades abarcaron la **Fase 2 (Capa de datos y contextos)**, la **Fase 4 (Catálogo y Carrito)** y la **Fase 7 (Pulido de componentes React-Bootstrap)**.*
>
> *Uno de los requerimientos centrales era mantener `localStorage` como base de datos simulada pero sin manipular el DOM a mano. Para lograrlo, creé el hook genérico `useColeccion<T>`, que conecta cualquier colección guardada directamente con el estado de React. Sobre este hook construí el `CartContext`, que administra la lista de productos del carrito, los subtotales, el total acumulado y el control estricto de inventario.*
>
> *En la parte visual del e-commerce:*
> * *Implementé el **Home** utilizando el componente `<Carousel>` de React-Bootstrap con 4 banners promocionales y la sección de productos destacados.*
> * *Construí la página de **Catálogo**, incorporando un buscador en tiempo real por texto y un selector dinámico de categorías que filtra los instrumentos musicales al instante.*
> * *Desarrollé la página de **Detalle de Producto**, asegurando que el selector de cantidad no permita pedir más unidades de las disponibles en stock y deshabilitando la compra si el producto está agotado.*
> * *Y finalmente la pantalla del **Carrito de compras**, que actualiza el badge del Navbar en vivo sin recargar la página, permite modificar cantidades con botones `+` y `-`, y confirma la compra o vaciado mediante modales de SweetAlert2.*
>
> *Para mis **pruebas unitarias con Karma y Jasmine**, implementé:*
> 1. *El test de formateo (`formato-precio.spec.ts`), que verifica que cualquier valor numérico se convierta al formato de moneda chilena con separador de miles correcto, por ejemplo `$699.990`, controlando además valores en cero.*
> 2. *El test de lógica de compra (`cart-context.spec.ts`), que comprueba que añadir productos actualice la cantidad y los subtotales, y que el sistema bloquee intentos de compra cuando no hay stock suficiente.*
>
> *Ahora, mi compañero les presentará las páginas públicas de contenido y el panel administrativo."*

---

## 🎬 PARTE 3: INTEGRANTE 3 — Contenidos, Panel Admin, QA, Tests y Cierre
* **Duración aproximada:** 1:40 min
* **Rol:** Páginas informativas, Reemplazo de jQuery DataTables, Panel Administrativo CRUD, Verificación QA, Tests y Conclusión final.

### 🎥 Qué mostrar en pantalla durante la grabación:
1. *(0:00 - 0:25)* Páginas públicas: `Nosotros` abriendo las preguntas frecuentes (Accordion dark), `Servicios`, `Blog` y `Contacto`.
2. *(0:25 - 1:00)* Panel administrativo `http://localhost:5173/admin`: Dashboard con contadores y alertas de stock crítico; luego `AdminProductos` interactuando con el `<DataTable>` (buscando en el filtro, ordenando columnas y mostrando paginación).
3. *(1:00 - 1:25)* Código de `src/components/common/DataTable.tsx` y código de sus tests en `src/__tests__/integrante3/`.
4. *(1:25 - 1:40)* Demostración final: Terminal ejecutando `npm test` con todos los tests pasando en verde, luego `npm run build` mostrando compilación exitosa y pantalla final.

---

### 🎙️ Lo que debe decir el Integrante 3 (Texto para leer/locutar):

> *"¡Hola! Mi nombre es [Nombre Integrante 3]. Para culminar con la migración de Forte & Piano, mis tareas correspondieron a la **Fase 3 (Páginas de contenido)**, la **Fase 6 (Panel administrativo)** y las **Fases 8 y 9 (QA y Build final)**.*
>
> *En la sección pública, migré las páginas informativas:*
> * ***Nosotros**, incorporando un acordeón estilizado con tema oscuro para las preguntas frecuentes.*
> * ***Servicios**, detallando afinación, clases y transporte especializado.*
> * ***Blog y Noticia Detalle**, unificando las publicaciones en una sola ruta dinámica `/blog/:slug`.*
> * *Y el formulario de **Contacto**, que valida los campos y registra los mensajes recibidos.*
>
> *En el área de administración, enfrentamos uno de los mayores desafíos del proyecto: **reemplazar jQuery DataTables**, ya que manipulaba el DOM directamente y generaba conflictos con React. En su lugar, construí desde cero un componente propio y reutilizable llamado `<DataTable>` sobre React-Bootstrap, que ofrece búsqueda en tiempo real, ordenación clicable por columnas y paginación controlada por estado.*
>
> *Con este componente armé el **AdminDashboard** (que destaca los instrumentos en nivel crítico de inventario), el mantenedor de **Productos** (con modo solo lectura para vendedores y acciones completas para administradores) y el mantenedor de **Usuarios** con creación y edición completa.*
>
> *Mis **pruebas unitarias con Karma y Jasmine** abarcaron:*
> 1. *El test del componente `<DataTable>` (`datatable.spec.ts`), validando que el filtro por texto reduzca las filas visibles con exactitud y que la ordenación alterne correctamente de forma ascendente y descendente.*
> 2. *El test del formulario de Contacto (`contacto-val.spec.ts`), comprobando que se rechacen comentarios vacíos o que excedan los 500 caracteres, y que los envíos válidos se guarden en `localStorage`.*
>
> *Para cerrar, ejecutamos en nuestra terminal `npm test`, donde podemos comprobar que todas las pruebas unitarias pasan limpiamente en Chrome Headless, y con `npm run build`, verificamos que TypeScript compila con cero advertencias y genera el paquete de producción listo para desplegar.*
>
> *Con esto damos por concluida la migración exitosa de Forte & Piano. ¡Muchas gracias por su atención!"*

---

## 💡 Consejos para la Edición Final
1. **Resolución:** Graben sus pantallas a 1080p (Full HD) con el navegador maximizado.
2. **Audio:** Usen audífonos con micrófono o hablen claro y pausado cerca del micrófono.
3. **Unión:** Simplemente coloquen el Clip 1, Clip 2 y Clip 3 en línea de tiempo. Gracias a las frases de transición iniciales y finales, el video sonará como una sola presentación coordinada de 5 minutos.
