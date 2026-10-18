# Plan de Acción para Migración Grupal: Forte & Piano (Flask a React + TypeScript)

Basado en la pauta oficial de migración (Fases 0 a 9) y diseñado para un **equipo de 3 integrantes**.

---

## 1. Organización del Equipo y Roles

| Integrante | Rol Principal | Fases Asignadas | Enfoque |
|---|---|---|---|
| **Integrante 1** | Arquitectura & Seguridad | **Fase 0, Fase 1, Fase 5** | Configuración base, shell/layout público y privado, routing inicial, autenticación y rutas protegidas. |
| **Integrante 2** | Estado Global & E-Commerce | **Fase 2, Fase 4, Fase 7** | Modelos tipados, contextos (Auth/Cart), hooks de datos, catálogo, detalle de producto, carrito y pulido con React-Bootstrap. |
| **Integrante 3** | Contenidos, Backoffice & QA | **Fase 3, Fase 6, Fase 8, Fase 9** | Páginas informativas (Nosotros, Servicios, Blog, Contacto), panel administrativo completo (Dashboard, CRUDs, DataTable) y verificación final. |

---

## 2. Estrategia de Git y Ramas (Flujo Colaborativo)

- **Rama principal de integración del proyecto React:** `migracion-react`
- Cada integrante trabajará en una rama específica por fase partiendo de `migracion-react`:
  ```bash
  git checkout migracion-react
  git pull origin migracion-react # si aplica
  git checkout -b fase-<numero>-<nombre-descriptivo>
  ```
- **Convención de Commits:** Utilizar formato convencional:
  - `feat(...)`: Para nueva funcionalidad o componente.
  - `fix(...)`: Para corrección de errores.
  - `chore(...)`: Para configuración de herramientas o dependencias.
- **Flujo de Integración:**
  1. Al terminar su fase, el integrante ejecuta `npm run build` para asegurar cero errores de TypeScript.
  2. Realiza los commits correspondientes en su rama.
  3. Hace merge de su rama hacia `migracion-react`.
  4. El siguiente integrante actualiza `migracion-react` antes de iniciar la siguiente fase dependiente.

---

## 3. Matriz de Dependencias entre Fases

```
[Fase 0: Base técnica] (Integrante 1) - COMPLETADA PARCIALMENTE
          │
          ▼
[Fase 1: Esqueleto & Rutas] (Integrante 1)
          │
          ▼
[Fase 2: Tipos, Storage & Contextos] (Integrante 2)
          │
     ┌────┴────────────────────────┐
     ▼                             ▼
[Fase 3: Contenidos]        [Fase 4: Catálogo & Carrito]
(Integrante 3)              (Integrante 2)
     │                             │
     └─────────────┬───────────────┘
                   ▼
[Fase 5: Autenticación & Roles] (Integrante 1)
                   │
                   ▼
[Fase 6: Panel Administrativo & DataTable] (Integrante 3)
                   │
                   ▼
[Fase 7: Pulido Widgets React-Bootstrap] (Integrante 2)
                   │
                   ▼
[Fase 8: Verificación Manual - Checklist Anexo C] (Integrante 3 + Equipo)
                   │
                   ▼
[Fase 9: Build de Producción y Entrega] (Los 3 Integrantes)
```

---

## 4. Desglose Detallado Fase por Fase

### Fase 0 — Base Técnica (Configuración & Assets)
- **Responsable:** Integrante 1
- **Rama:** `migracion-react` (completada la instalación base) / `fase-0-assets`
- **Tareas restantes:**
  1. Copiar `static/img/**` hacia `public/img/**` manteniendo la estructura de carpetas (`banners/`, `blog/`, `productos/`, `logo.png`).
  2. Copiar `static/css/estilos.css` hacia `src/estilos.css`.
  3. Crear `src/main.tsx` importando los CSS en orden:
     - `bootstrap/dist/css/bootstrap.min.css`
     - `bootstrap-icons/font/bootstrap-icons.css`
     - `./estilos.css`
- **Commit esperado:** `chore(setup): configurar assets publicos y estilos globales`

---

### Fase 1 — Esqueleto de Navegación & Routing
- **Responsable:** Integrante 1
- **Rama:** `fase-1-esqueleto-rutas`
- **Tareas:**
  1. Crear `src/components/layout/Navbar.tsx` (maquetado inicial con `<Navbar>`, `<Nav>`, enlaces con `<NavLink>`).
  2. Crear `src/components/layout/Footer.tsx`.
  3. Crear `src/components/layout/Layout.tsx` (`<Navbar />`, `<main><Outlet /></main>`, `<Footer />`).
  4. Crear `src/components/layout/AdminSidebar.tsx`, `AdminOffcanvas.tsx` y `AdminLayout.tsx`.
  5. Configurar `src/App.tsx` con `<BrowserRouter>` y `<Routes>` con páginas placeholder que muestren un `<h1>` temporal para verificar la navegación completa.
- **Commit esperado:** `feat(layout): implementar shell publico, admin layout y router inicial`

---

### Fase 2 — Capa de Datos, Storage y Contextos
- **Responsable:** Integrante 2
- **Rama:** `fase-2-capa-datos-contextos`
- **Tareas:**
  1. `src/types/index.ts`: Tipar estrictamente `Producto`, `Usuario`, `Sesion`, `ItemCarrito`, `Categoria`, `Region`, `Comuna`, `Rol`, `Noticia`, `Mensaje`.
  2. `src/storage/claves.ts`: Exportar constante `FORTEPIANO_KEYS`.
  3. `src/storage/useColeccion.ts`: Hook genérico `useColeccion<T>(clave)`.
  4. `src/data/seed.ts`: Datos iniciales de prueba (roles, categorías, regiones, comunas, usuarios, productos, noticias).
  5. `src/utils/validaciones.ts`: Algoritmo módulo 11 de RUN, validación de correo con dominios permitidos, longitud de contraseñas, etc.
  6. `src/utils/formato.ts`: `formatearPrecio`.
  7. `src/utils/alertas.ts`: Envoltorios de SweetAlert2 (`confirmarEliminar`, `exito`, `error`).
  8. `src/context/AuthContext.tsx`: Proveedor de autenticación (`sesion`, `login`, `logout`).
  9. `src/context/CartContext.tsx`: Proveedor de carrito (`carrito`, `totalItems`, `total`, `agregar`, `cambiarCantidad`, `eliminar`, `vaciar`, `finalizarCompra`).
  10. Inicializar `seed` mediante `useEffect` en `App.tsx`.
- **Commit esperado:** `feat(data): crear modelos tipados, storage reactivo y contextos globales`

---

### Fase 3 — Páginas Públicas de Contenido
- **Responsable:** Integrante 3
- **Rama:** `fase-3-paginas-contenido`
- **Tareas:**
  1. `src/pages/Nosotros.tsx`: Contenido institucional y preguntas frecuentes con `<Accordion data-bs-theme="dark">`.
  2. `src/pages/Servicios.tsx`: Servicios de la tienda (Afinación, Clases, Transporte).
  3. `src/hooks/useNoticias.ts` y `src/components/common/NewsCard.tsx`.
  4. `src/pages/Blog.tsx`: Banner superior y grilla de artículos con `NewsCard`.
  5. `src/pages/BlogDetalle.tsx`: Detalle unificado de noticia en ruta dinámica `/blog/:slug`.
  6. `src/pages/Contacto.tsx`: Formulario controlado con validaciones en tiempo real y guardado en colección de contactos.
- **Commit esperado:** `feat(pages): implementar nosotros, servicios, blog y contacto`

---

### Fase 4 — Catálogo y Carrito de Compras
- **Responsable:** Integrante 2
- **Rama:** `fase-4-catalogo-carrito`
- **Tareas:**
  1. `src/hooks/useProductos.ts`: Funciones de filtrado por nombre, categoría y destacados.
  2. `src/components/common/ProductCard.tsx`: Tarjeta con badges, stock e interacción de compra.
  3. `src/pages/Home.tsx`: Hero con `<Carousel>` de react-bootstrap (4 banners), productos destacados y últimas novedades.
  4. `src/pages/Productos.tsx`: Catálogo completo con buscador en vivo y selector de categoría (`useTablasMaestras`).
  5. `src/pages/ProductoDetalle.tsx`: Lectura de `?codigo=` mediante `useSearchParams`, selector de cantidad con tope de stock y botón añadir.
  6. `src/pages/Carrito.tsx`: Listado de items con botones `+` / `-`, eliminación con SweetAlert2, resumen de compra y flujo de finalizar pedido.
  7. Conectar el badge contador del carrito en `Navbar.tsx` en tiempo real.
- **Commit esperado:** `feat(shop): implementar home, catalogo reactivo, detalle de producto y carrito`

---

### Fase 5 — Autenticación y Control de Acceso
- **Responsable:** Integrante 1
- **Rama:** `fase-5-autenticacion-roles`
- **Tareas:**
  1. `src/pages/Login.tsx`: Formulario controlado con validación de credenciales, bloqueo de cuentas inactivas y redirección por rol (`/admin` para rol 1 y 2, `/` para rol 3).
  2. `src/pages/Registro.tsx`: Formulario completo con validación módulo 11, unicidad de RUN, selector en cascada Región → Comuna y registro automático.
  3. `src/components/common/RutaProtegida.tsx`: Envoltorio de rutas para restringir acceso por array de roles con alerta de "Acceso restringido" y redirección a `/login`.
  4. Actualizar `Navbar.tsx` para alternar entre "Iniciar sesión/Registrarse" y menú de usuario activo con botón de cerrar sesión.
- **Commit esperado:** `feat(auth): implementar login, registro dependiente y rutas protegidas por rol`

---

### Fase 6 — Panel Administrativo & DataTable
- **Responsable:** Integrante 3
- **Rama:** `fase-6-panel-admin`
- **Tareas:**
  1. `src/components/common/DataTable.tsx`: Tabla reactiva propia con buscador, ordenamiento por columnas, paginación y mensaje "Mostrando X de Y registros".
  2. `src/pages/admin/AdminDashboard.tsx`: Tarjetas de resumen (productos, usuarios [oculta para vendedor], mensajes) y tabla de alertas de stock crítico.
  3. `src/pages/admin/AdminProductos.tsx`: Tabla administrativa con acciones Ver (modal Swal), Editar y Eliminar (con confirmación). Vendedor en modo solo lectura.
  4. `src/pages/admin/AdminProductoForm.tsx`: Formulario de creación/edición de producto con validación de código único y alerta si queda bajo stock crítico.
  5. `src/hooks/useUsuarios.ts`.
  6. `src/pages/admin/AdminUsuarios.tsx`: Gestión CRUD de usuarios (exclusivo Administrador).
  7. `src/pages/admin/AdminUsuarioForm.tsx`: Formulario de creación/edición de usuarios con selector dependiente de región y comuna.
- **Commit esperado:** `feat(admin): implementar dashboard, datatable generico y mantenedores crud`

---

### Fase 7 — Pulido de Componentes React-Bootstrap
- **Responsable:** Integrante 2
- **Rama:** `fase-7-react-bootstrap-polish`
- **Tareas:**
  1. Asegurar que ningún componente use JavaScript imperativo de Bootstrap ni manipulación directa de DOM.
  2. Configurar `<Offcanvas>` del panel admin con estado `show` / `onHide`.
  3. Validar `<NavDropdown>` y `<Accordion>` con tema oscuro (`data-bs-theme="dark"`).
- **Commit esperado:** `refactor(ui): migrar todos los componentes interactivos a react-bootstrap nativo`

---

### Fase 8 — Verificación Manual Completa (Checklist Anexo C)
- **Responsable:** Integrante 3 (Validado por los 3 integrantes)
- **Rama:** `fase-8-qa-verificacion`
- **Tareas:**
  - [ ] Home: Carrusel avanza y botones llevan a las rutas correctas; se muestran destacados y noticias.
  - [ ] Catálogo: Filtro por texto y categoría en tiempo real; botón deshabilitado si está sin stock.
  - [ ] Detalle: Cantidad no supera el stock disponible; agregar respeta cantidades previas en carrito.
  - [ ] Carrito: `+` / `-` y eliminar recalculan subtotal y total; badge del navbar sincronizado; vaciar y finalizar compra piden confirmación.
  - [ ] Registro: Valida RUN (módulo 11), correo permitido, contraseña (4-10 car.), región → comuna dinámica, RUN duplicado rechazado.
  - [ ] Login: Error con credenciales incorrectas, bloqueo de cuentas inactivas, redirección adecuada según rol.
  - [ ] Navbar: Alternancia estado invitado / usuario conectado, menú Administración exclusivo roles 1 y 2.
  - [ ] Contacto: Valida campos, almacena en localStorage y limpia el formulario.
  - [ ] Admin Dashboard: Contadores correctos, lista de stock crítico filtrada, tarjeta usuarios oculta para vendedor.
  - [ ] Admin Productos: Tabla busca, ordena y pagina; vendedor en solo lectura; CRUD funcional.
  - [ ] Admin Usuarios: Solo accesible por Administrador; CRUD funcional.
  - [ ] Formularios Admin: Validación idéntica al registro; detección de código/RUN duplicado.
  - [ ] Rutas Protegidas: Intentar ingresar a `/admin` sin sesión dispara alerta y redirige a `/login`.
  - [ ] Persistencia: Recargar en cualquier página conserva sesión activa y carrito.
- **Commit esperado:** `test(qa): validar checklist funcional y resolver observaciones de integracion`

---

### Fase 9 — Build de Producción y Entrega
- **Responsable:** Trabajo en conjunto (3 integrantes)
- **Rama:** `fase-9-entrega-final`
- **Tareas:**
  1. Ejecutar `npm run build` y verificar que la compilación de TypeScript y el empaquetado de Vite terminen en 0 errores.
  2. Probar la aplicación en modo producción con `npm run preview`.
  3. Actualizar `README.md` con los comandos de instalación, ejecución y la arquitectura técnica implementada.
  4. Realizar el merge final hacia `migracion-react` y preparar la entrega.
- **Commit esperado:** `docs(release): preparar build de produccion y documentacion de entrega`
