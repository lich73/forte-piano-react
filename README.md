# Forte & Piano (React + TypeScript)

Aplicación web Single Page Application (SPA) para la tienda de instrumentos musicales **Forte & Piano**, especializada en pianos acústicos, pianos digitales, sintetizadores y accesorios musicales.

El proyecto ha sido completamente migrado desde su versión original (Flask + Jinja + JavaScript Vanilla) hacia una arquitectura moderna con **React 18 + TypeScript + Vite**, manteniendo paridad funcional al 100% y almacenamiento simulado reactivo en `localStorage`.

---

## 🚀 Tecnologías y Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (modo estricto)
- **Empaquetador y Dev Server**: [Vite](https://vitejs.dev/)
- **Enrutamiento**: [React Router DOM v6](https://reactrouter.com/) (BrowserRouter, Routes, Route, Outlet, NavLink, Navigate)
- **Componentes UI y Estilos**:
  - [React-Bootstrap](https://react-bootstrap.github.io/) (componentes controlados: Navbar, Carousel, Offcanvas, Modal, Accordion, Form, Table)
  - [Bootstrap 5](https://getbootstrap.com/) + [Bootstrap Icons](https://icons.getbootstrap.com/)
  - CSS Vanilla personalizado (`src/estilos.css`) con paleta dorada y tema oscuro
- **Mensajería y Modales**: [SweetAlert2](https://sweetalert2.github.io/) con wrappers tipados en `src/utils/alertas.ts`
- **Persistencia**: `localStorage` mediante hook genérico reactivo `useColeccion<T>`

---

## 👥 Organización del Equipo de Migración

| Integrante | Rol Principal | Fases Asignadas | Enfoque |
|---|---|---|---|
| **Integrante 1** | Arquitectura & Seguridad | **Fase 0, Fase 1, Fase 5** | Configuración base, shell/layout público y privado, routing inicial, autenticación y rutas protegidas. |
| **Integrante 2** | Estado Global & E-Commerce | **Fase 2, Fase 4, Fase 7** | Modelos tipados, contextos (Auth/Cart), hooks de datos, catálogo, detalle de producto, carrito y pulido con React-Bootstrap. |
| **Integrante 3** | Contenidos, Backoffice & QA | **Fase 3, Fase 6, Fase 8, Fase 9** | Páginas informativas (Nosotros, Servicios, Blog, Contacto), panel administrativo completo (Dashboard, CRUDs, DataTable genérico) y verificación final. |

---

## 📁 Estructura del Proyecto

```text
src/
├── main.tsx                         # Punto de entrada, estilos globales e inicialización del seed
├── App.tsx                          # Router principal, Providers (Auth, Cart) y jerarquía de rutas
├── estilos.css                      # Estilos personalizados y tokens de diseño
├── types/
│   └── index.ts                     # Interfaces TypeScript (Producto, Usuario, Sesion, etc.)
├── data/
│   └── seed.ts                      # Datos semilla iniciales tipados para localStorage
├── storage/
│   ├── claves.ts                    # Constantes de claves de almacenamiento FORTEPIANO_KEYS
│   └── useColeccion.ts              # Hook genérico reactivo sobre localStorage
├── context/
│   ├── AuthContext.tsx              # Contexto global de sesión, login y logout
│   └── CartContext.tsx              # Contexto global del carrito de compras y stock
├── hooks/
│   ├── useProductos.ts              # Lógica de catálogo, filtros y operaciones CRUD
│   ├── useUsuarios.ts               # Lógica de usuarios y operaciones CRUD
│   ├── useNoticias.ts               # Consulta y filtrado de noticias del blog
│   └── useTablasMaestras.ts         # Acceso a categorías, regiones, comunas y roles
├── utils/
│   ├── validaciones.ts              # Módulo 11 (RUN), dominios de correo, contraseñas, etc.
│   ├── formato.ts                   # Formato de moneda chilena (CLP)
│   └── alertas.ts                   # Helpers estándar para SweetAlert2
├── components/
│   ├── layout/
│   │   ├── Layout.tsx               # Shell público (Navbar + Outlet + Footer)
│   │   ├── Navbar.tsx               # Barra de navegación reactiva con badge y dropdown
│   │   ├── Footer.tsx               # Pie de página institucional
│   │   ├── AdminLayout.tsx          # Shell administrativo con Sidebar y Offcanvas
│   │   ├── AdminSidebar.tsx         # Menú lateral del panel administrativo
│   │   └── AdminOffcanvas.tsx       # Menú lateral responsive móvil
│   └── common/
│       ├── ProductCard.tsx          # Tarjeta interactiva de producto
│       ├── NewsCard.tsx             # Tarjeta de artículo del blog
│       ├── DataTable.tsx            # Tabla administrativa propia (búsqueda, orden y paginación)
│       └── RutaProtegida.tsx        # Control de acceso declarativo por rol
└── pages/
    ├── Home.tsx                     # Portada con Hero Carousel, destacados y novedades
    ├── Productos.tsx                # Catálogo reactivo con buscador y filtro por categoría
    ├── ProductoDetalle.tsx          # Detalle por ?codigo=, control de stock y compra
    ├── Carrito.tsx                  # Detalle del carrito, sumatorias, edición de cantidades
    ├── Login.tsx                    # Inicio de sesión con redirección según rol
    ├── Registro.tsx                 # Formulario con validación de RUN y cascada región-comuna
    ├── Nosotros.tsx                 # Quiénes somos y FAQ con Accordion
    ├── Servicios.tsx                # Servicios musicales de la tienda
    ├── Blog.tsx                     # Listado de noticias
    ├── BlogDetalle.tsx              # Detalle dinámico en /blog/:slug
    ├── Contacto.tsx                 # Formulario de contacto con guardado en localStorage
    └── admin/
        ├── AdminDashboard.tsx       # Panel de control con contadores y stock crítico
        ├── AdminProductos.tsx       # Mantenedor CRUD de catálogo con DataTable
        ├── AdminProductoForm.tsx    # Formulario creación/edición de instrumento
        ├── AdminUsuarios.tsx        # Mantenedor CRUD de usuarios con DataTable (solo Admin)
        └── AdminUsuarioForm.tsx     # Formulario creación/edición de usuario
```

---

## 🛠️ Instalación y Ejecución

### 1. Requisitos Previos
- [Node.js](https://nodejs.org/) v18 o superior.
- [npm](https://www.npmjs.com/) v9 o superior.

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Ejecutar en Modo Desarrollo
```bash
npm run dev
```
La aplicación se levantará normalmente en `http://localhost:5173/`.

### 4. Compilar para Producción
```bash
npm run build
```

### 5. Previsualizar el Build de Producción
```bash
npm run preview
```

---

## 🔐 Cuentas de Prueba Preconfiguradas

| Rol | Correo | Contraseña | Permisos |
|---|---|---|---|
| **Administrador** (Rol 1) | `admin@gmail.com` | `admin123` | Acceso completo a `/admin` (Dashboard, Productos y Usuarios con CRUD total). |
| **Vendedor** (Rol 2) | `vendedor@gmail.com` | `vend1234` | Acceso a `/admin` (Dashboard y consulta de Catálogo en solo lectura). |
| **Cliente** (Rol 3) | `camila@gmail.com` | `cliente1` | Navegación en tienda pública, carrito de compras y catálogo. |
| **Cliente** (Rol 3) | `diego@duoc.cl` | `diego123` | Navegación en tienda pública, carrito de compras y catálogo. |

---

## ✅ Cumplimiento del Checklist de Verificación (Anexo C)

- [x] **Home**: Carrusel avanza y botones llevan a las rutas correctas; se muestran 4 destacados y 3 noticias.
- [x] **Catálogo**: Buscador en vivo por texto y selector de categoría en tiempo real; botón deshabilitado si está sin stock.
- [x] **Detalle**: Cantidad no supera el stock disponible; agregar respeta cantidades previas en carrito.
- [x] **Carrito**: Botones `+` / `-` y eliminar recalculan subtotal y total; badge del navbar sincronizado; vaciar y finalizar compra piden confirmación.
- [x] **Registro**: Valida RUN con algoritmo módulo 11, correo institucional/gmail permitido, contraseña (4-10 caracteres), región → comuna dependiente, rechaza RUN duplicado.
- [x] **Login**: Credenciales inválidas muestran error; cuenta inactiva se bloquea; redirige a `/admin` si el rol es Administrador/Vendedor y a `/` si es Cliente.
- [x] **Navbar**: Alterna entre "Iniciar sesión/Registrarse" y el menú de usuario según sesión; "Administración" exclusivo para Administrador y Vendedor.
- [x] **Contacto**: Valida campos, almacena mensaje en `localStorage` y limpia el formulario.
- [x] **Admin Dashboard**: Contadores correctos, lista de stock crítico filtrada, tarjeta usuarios oculta para vendedor.
- [x] **Admin Productos**: Tabla busca, ordena y pagina mediante componente React `<DataTable>`; vendedor en solo lectura; CRUD funcional.
- [x] **Admin Usuarios**: Solo accesible por Administrador; CRUD funcional.
- [x] **Formularios Admin**: Validaciones idénticas al registro; detección de código/RUN duplicado y aviso de stock crítico.
- [x] **Rutas Protegidas**: Intentar ingresar a `/admin/*` sin sesión o sin permiso dispara alerta y redirige a `/login`.
- [x] **Persistencia**: Recargar en cualquier página conserva sesión activa y carrito en `localStorage`.
