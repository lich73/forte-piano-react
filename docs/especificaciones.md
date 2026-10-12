# Forte & Piano  

## 1. Descripción general

**Forte & Piano** será una tienda online de instrumentos (pianos y teclados) desarrollada como proyecto frontend.

El sistema tendrá dos grandes áreas:

1. **Tienda pública**, orientada a los clientes.
2. **Sistema administrativo**, orientado a la gestión de instrumentos musicales y usuarios.

La solución se desarrollará principalmente con:

- HTML.
- CSS.
- Bootstrap.
- JavaScript.
- localStorage.
- DataTables.
- SweetAlert2.
- Flask, únicamente como servidor mínimo para desplegar las páginas.

El objetivo es construir una aplicación web funcional, clara, moderna, atractiva y profesional, pero evitando complejidad innecesaria.

---

# 2. Principio de simplicidad

El proyecto debe desarrollarse con **poco código, solamente lo justo y necesario** para cumplir los requerimientos.

Se debe privilegiar:

- HTML simple y fácil de entender.
- CSS propio reducido, usado principalmente para personalizar Bootstrap.
- JavaScript sencillo y pedagógico.
- Funciones pequeñas y fáciles de leer.
- Evitar patrones, frameworks o arquitecturas complejas.
- Evitar programación innecesariamente avanzada.
- Evitar código duplicado cuando sea fácil reutilizar una función.
- Mantener nombres de variables y funciones claros.

El JavaScript debe ser especialmente simple, ya que el objetivo del proyecto es demostrar el uso de:

- Variables.
- Arreglos.
- Objetos.
- Funciones.
- Condiciones.
- Ciclos.
- Eventos.
- Manipulación básica del DOM.
- Validaciones.
- localStorage.

No se debe agregar complejidad técnica que no sea necesaria para el Control 1.

---

# 3. Interfaz gráfica

Toda la aplicación debe tener una interfaz:

- Moderna.
- Atractiva.
- Profesional.
- Consistente.
- Responsiva.
- Fácil de navegar.
- Adecuada para una tienda de instrumentos musicales.

La identidad visual debe representar a **Forte & Piano**.

Se recomienda un estilo elegante, clásico y profesional enfocado en músicos, pero sin sobrecargar la interfaz.

---

# 4. Uso obligatorio de Bootstrap

Se debe utilizar **Bootstrap en toda la aplicación** para construir los controles gráficos.

No se deben dejar botones, formularios, menús o tablas con apariencia HTML básica cuando exista un componente Bootstrap apropiado.

Se pueden utilizar, entre otros:

- `Navbar`.
- `Cards`.
- `Buttons`.
- `Forms`.
- `Form Controls`.
- `Input Groups`.
- `Select`.
- `Alerts`.
- `Badges`.
- `Modals`.
- `Toast`.
- `Carousel`.
- `Breadcrumb`.
- `Pagination`.
- `Accordion`.
- `Offcanvas`.
- `Nav`.
- `Container`.
- `Row`.
- `Col`.
- `Table`.
- Imágenes responsivas.

Bootstrap será la base visual del proyecto.

Además, se debe crear una hoja CSS propia para personalizar colores, tipografías, fondos, espacios y detalles visuales de Forte & Piano.

---

# 5. Uso obligatorio de CDN

Todas las librerías externas deben obtenerse mediante **CDN**.

No es necesario descargar Bootstrap, DataTables, SweetAlert2 ni otras librerías externas dentro del proyecto.

Se deben incluir mediante etiquetas como:

```html
<link rel="stylesheet" href="...">
<script src="..."></script>
```

Como mínimo se deben cargar por CDN:

- Bootstrap CSS.
- Bootstrap JavaScript.
- Bootstrap Icons, si se utilizan.
- DataTables CSS.
- DataTables JavaScript.
- SweetAlert2.

Los archivos locales del proyecto deben reservarse principalmente para:

- CSS propio.
- JavaScript propio.
- Imágenes.
- Logo.
- Fotografías de instrumentos musicales.
- Otros recursos creados específicamente para Forte & Piano.

---

# 6. SweetAlert2

Se debe utilizar **SweetAlert2** para los mensajes emergentes importantes.

Ejemplos de uso:

- Usuario registrado correctamente.
- Error de validación importante.
- Producto agregado al carrito.
- Producto eliminado.
- Usuario eliminado.
- Confirmación antes de borrar.
- Inicio de sesión correcto.
- Credenciales incorrectas.
- Producto guardado correctamente.
- Mensaje enviado desde Contacto.

Ejemplo conceptual:

```javascript
Swal.fire("Correcto", "Producto guardado correctamente", "success");
```

Para eliminar registros se recomienda pedir confirmación antes de borrar.

Ejemplo:

```javascript
Swal.fire({
    title: "¿Eliminar registro?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar"
});
```

SweetAlert2 debe complementar la interfaz de Bootstrap y reemplazar, cuando sea posible, el uso de `alert()` tradicional.

---

# 7. DataTables

Cuando sea necesario mostrar información tabular, se debe utilizar el plugin:

**DataTables**  
https://datatables.net/

Debe utilizarse especialmente en:

- Listado de usuarios.
- Listado de instrumentos musicales.
- Mensajes de contacto, si se crea su listado administrativo.
- Cualquier otro conjunto de datos que tenga sentido mostrar en formato tabla.

DataTables debe permitir, cuando corresponda:

- Buscar registros.
- Ordenar columnas.
- Paginar.
- Cambiar la cantidad de registros visibles.
- Mostrar información sobre la cantidad de registros.

Las acciones dentro de cada fila deben usar botones Bootstrap.

Por ejemplo:

- Ver.
- Editar.
- Eliminar.

---

# 8. localStorage como base de datos simulada

El proyecto no utilizará una base de datos real.

Se utilizará **localStorage como base de datos simulada en el navegador**.

Los datos deberán almacenarse como JSON.

Ejemplo:

```javascript
localStorage.setItem("fortepiano_productos", JSON.stringify(productos));
```

Para recuperar información:

```javascript
const productos =
    JSON.parse(localStorage.getItem("fortepiano_productos")) || [];
```

---

# 9. Colecciones principales en localStorage

Como mínimo se recomienda manejar las siguientes claves:

| Clave | Información |
|---|---|
| `fortepiano_usuarios` | Usuarios registrados |
| `fortepiano_productos` | Instrumentos y Accesorios |
| `fortepiano_categorias` | Categorías de instrumentos musicales |
| `fortepiano_regiones` | Regiones |
| `fortepiano_comunas` | Comunas |
| `fortepiano_roles` | Roles del sistema |
| `fortepiano_carrito` | Carrito de compras |
| `fortepiano_contactos` | Mensajes enviados |
| `fortepiano_blog` | Noticias o publicaciones |

---

# 10. Datos iniciales

La primera vez que se ejecute el sistema, JavaScript debe comprobar si las colecciones principales existen.

Si no existen, debe crear datos iniciales de prueba.

Por ejemplo:

- Un usuario administrador.
- Algunos usuarios de prueba.
- Categorías.
- Regiones.
- Comunas.
- Roles.
- Algunos instrumentos musicales.
- Noticias de ejemplo.

El objetivo es que el sistema pueda probarse inmediatamente sin tener que registrar manualmente todos los datos.

---

# 11. Operaciones CRUD

Los mantenedores deben implementar operaciones básicas:

- **Crear** registros.
- **Consultar** registros.
- **Modificar** registros.
- **Eliminar** registros.

Estas operaciones se realizarán completamente con JavaScript y localStorage.

No deben ser implementadas en Flask.

---

# 12. Servidor minimalista con Flask

Se debe utilizar un servidor web mínimo desarrollado con **Flask**.

Flask será utilizado únicamente para:

- Levantar el sitio.
- Mostrar las páginas HTML.
- Resolver las rutas.
- Permitir navegación entre páginas.
- Evitar trabajar directamente con rutas `file:///`.

Flask **no debe utilizarse como backend funcional**.

---

# 13. Lo que Flask NO debe hacer

Flask no debe utilizarse para:

- Guardar usuarios.
- Guardar productos.
- Procesar formularios.
- Implementar autenticación real.
- Implementar lógica de negocio.
- Administrar el carrito.
- Crear una API REST.
- Acceder a una base de datos.
- Ejecutar operaciones CRUD.
- Administrar sesiones complejas.

Toda la lógica funcional debe permanecer en el frontend mediante JavaScript y localStorage.

---

# 14. Estructura mínima del proyecto

Se debe utilizar la estructura típica de Flask:

```text
forte-piano/
│
├── app.py
│
├── templates/
│   ├── index.html
│   ├── registro.html
│   ├── login.html
│   ├── nosotros.html
│   ├── blog.html
│   ├── blog-detalle-1.html
│   ├── blog-detalle-2.html
│   ├── contacto.html
│   ├── productos.html
│   ├── producto-detalle.html
│   ├── carrito.html
│   ├── admin.html
│   ├── admin-productos.html
│   ├── admin-producto-form.html
│   ├── admin-usuarios.html
│   └── admin-usuario-form.html
│
└── static/
    ├── css/
    │   └── estilos.css
    │
    ├── js/
    │   ├── storage.js
    │   ├── usuarios.js
    │   ├── productos.js
    │   ├── carrito.js
    │   └── validaciones.js
    │
    └── img/
        ├── logo.png
        ├── productos/
        └── blog/
```

La estructura puede simplificarse si el equipo lo necesita, pero se deben mantener las carpetas:

- `templates`
- `static`

---

# 15. Flask mínimo esperado

El archivo `app.py` debe ser sencillo.

Ejemplo:

```python
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/productos")
def productos():
    return render_template("productos.html")

@app.route("/carrito")
def carrito():
    return render_template("carrito.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/registro")
def registro():
    return render_template("registro.html")

@app.route("/admin")
def admin():
    return render_template("admin.html")

if __name__ == "__main__":
    app.run(debug=True)
```

Se deben agregar las demás rutas necesarias siguiendo el mismo estilo.

---

# 16. Navegación entre páginas

Los enlaces deben utilizar las rutas Flask.

Ejemplo:

```html
<a href="{{ url_for('home') }}">Inicio</a>
<a href="{{ url_for('productos') }}">Instrumentos y Accesorios</a>
<a href="{{ url_for('carrito') }}">Carrito</a>
```

El sistema debe poder navegar mediante direcciones similares a:

```text
http://127.0.0.1:5000/
http://127.0.0.1:5000/productos
http://127.0.0.1:5000/carrito
http://127.0.0.1:5000/admin
```

---

# 17. Páginas de la tienda

## 17.1 Home de Forte & Piano

Página principal de la tienda.

Debe servir para:

- Presentar la marca.
- Mostrar promociones.
- Mostrar novedades.
- Mostrar instrumentos musicales destacados.
- Navegar hacia las demás páginas.

Controles recomendados:

- Bootstrap `Navbar`.
- Logo.
- `Carousel`.
- `Cards`.
- `Badges`.
- Botones.
- Carrito.
- Footer.

Los productos destacados deben obtenerse desde localStorage.

---

## 17.2 Registro de usuario

Permite que un cliente cree una cuenta.

Debe incluir al menos:

- RUN.
- Nombre.
- Apellidos.
- Correo.
- Contraseña.
- Fecha de nacimiento.
- Región.
- Comuna.
- Dirección.

Controles recomendados:

- Bootstrap `Form`.
- `Form Control`.
- `Select`.
- Botón Registrar.
- Mensajes de validación.
- SweetAlert2.

Los datos deben validarse con JavaScript y guardarse en `fortepiano_usuarios`.

---

## 17.3 Inicio de sesión

Permite ingresar al sistema.

Debe incluir:

- Logo de Forte & Piano.
- Correo.
- Contraseña.
- Botón Iniciar sesión.

JavaScript debe:

- Buscar al usuario en localStorage.
- Comparar las credenciales.
- Identificar su rol.
- Mostrar las opciones que correspondan.

Los errores o mensajes de éxito deben mostrarse con SweetAlert2.

---

## 17.4 Nosotros

Página informativa sobre Forte & Piano.

Debe explicar brevemente:

- Qué es Forte & Piano.
- Qué vende.
- Su propósito.
- Quiénes desarrollaron el sitio.

Controles recomendados:

- Bootstrap `Container`.
- `Row`.
- `Col`.
- Cards.
- Imágenes responsivas.
- Títulos y párrafos.

---

## 17.5 Blog Musical

Muestra noticias y contenidos relacionados con instrumentos musicales.

Ejemplos:

- Nuevos modelos de pianos.
- Novedades musicales.
- Curiosidades.
- Recomendaciones.
- Novedades de Forte & Piano.

Cada noticia debe mostrar:

- Imagen.
- Título.
- Descripción breve.
- Botón Ver noticia.

Se recomienda utilizar Bootstrap Cards.

---

## 17.6 Detalle Blog 1

Muestra completa una de las noticias.

Puede incluir:

- Imagen.
- Título.
- Fecha.
- Texto largo.
- Botón Volver al Blog.

---

## 17.7 Detalle Blog 2

Muestra una segunda noticia completa.

Debe mantener el mismo estilo de la página anterior, pero con contenido diferente.

---

## 17.8 Contacto

Permite que un cliente envíe una consulta a Forte & Piano.

Debe incluir:

- Nombre.
- Correo.
- Comentario.
- Botón Enviar.

Se debe usar:

- Bootstrap Forms.
- Textarea.
- Buttons.
- SweetAlert2.

JavaScript debe validar los datos y guardar el mensaje en `fortepiano_contactos`.

---

## 17.9 Catálogo de instrumentos musicales

Muestra todos los instrumentos musicales disponibles.

Los productos deben obtenerse desde `fortepiano_productos`.

Cada instrumento debe mostrar como mínimo:

- Fotografía.
- Nombre.
- Categoría.
- Precio.
- Stock.
- Botón Ver detalle.
- Botón Añadir al carrito.

Se recomienda utilizar Bootstrap Cards.

---

## 17.10 Detalle del instrumento

Muestra información completa de un instrumento seleccionado.

Debe incluir:

- Fotografía.
- Imágenes adicionales, si se desea.
- Nombre.
- Descripción.
- Categoría.
- Precio.
- Stock.
- Cantidad.
- Botón Añadir al carrito.

La información debe obtenerse desde localStorage.

---

## 17.11 Carrito de compras

Muestra los instrumentos musicales seleccionados por el cliente.

Debe permitir:

- Agregar productos.
- Aumentar cantidad.
- Disminuir cantidad.
- Eliminar productos.
- Mostrar subtotal.
- Mostrar total.

El carrito debe guardarse en:

```text
fortepiano_carrito
```

Se pueden utilizar:

- Cards.
- Tabla Bootstrap.
- Botones `+` y `-`.
- Botón Eliminar.
- Badges.
- SweetAlert2.

---

# 18. Páginas administrativas

## 18.1 Panel principal de administración

Es la página inicial del sistema administrativo.

Debe mostrar un menú lateral visible.

Puede incluir accesos a:

- Usuarios.
- Instrumentos y Accesorios.
- Categorías.
- Mensajes.

Controles recomendados:

- Bootstrap `Nav`.
- `Offcanvas`.
- Cards de resumen.
- Badges.
- Iconos.

---

## 18.2 Administración de instrumentos musicales

Muestra todos los instrumentos musicales registrados.

Debe utilizar obligatoriamente **DataTables**.

Columnas sugeridas:

- Código.
- Imagen.
- Nombre.
- Categoría.
- Precio.
- Stock.
- Estado.
- Acciones.

Debe existir un botón:

**Nuevo instrumento**

Las acciones pueden ser:

- Ver.
- Editar.
- Eliminar.

Todos los botones deben utilizar Bootstrap.

La eliminación debe solicitar confirmación mediante SweetAlert2.

---

## 18.3 Nuevo / Editar instrumento

Permite registrar o modificar un instrumento.

Debe incluir:

- Código.
- Nombre.
- Descripción.
- Precio.
- Stock.
- Stock crítico.
- Categoría.
- Imagen.

Reglas mínimas:

### Código

- Requerido.
- Texto.
- Mínimo 3 caracteres.

### Nombre

- Requerido.
- Máximo 100 caracteres.

### Descripción

- Opcional.
- Máximo 500 caracteres.

### Precio

- Requerido.
- Mínimo 0.
- Puede contener decimales.

Un precio igual a cero puede representar un producto gratuito.

### Stock

- Requerido.
- Mínimo 0.
- Solo números enteros.

### Stock crítico

- Opcional.
- Mínimo 0.
- Solo números enteros.

Debe mostrarse una alerta cuando el stock sea igual o inferior al stock crítico.

### Categoría

- Requerida.
- Debe utilizar un `select`.

### Imagen

- Opcional.

Los datos se deben guardar o actualizar en `fortepiano_productos`.

---

## 18.4 Administración de usuarios

Muestra todos los usuarios registrados.

Debe utilizar obligatoriamente **DataTables**.

Columnas sugeridas:

- RUN.
- Nombre.
- Apellidos.
- Correo.
- Rol.
- Región.
- Estado.
- Acciones.

Debe incluir:

**Nuevo usuario**

Acciones recomendadas:

- Ver.
- Editar.
- Eliminar.

Todos los botones deben utilizar Bootstrap.

La eliminación debe confirmarse con SweetAlert2.

---

## 18.5 Nuevo / Editar usuario

Permite crear o modificar usuarios.

Debe incluir:

- RUN.
- Nombre.
- Apellidos.
- Correo.
- Contraseña.
- Fecha de nacimiento.
- Tipo de usuario.
- Región.
- Comuna.
- Dirección.

### RUN

- Requerido.
- Debe validarse.
- Sin puntos ni guion.
- Ejemplo: `19011022K`.
- Mínimo 7 caracteres.
- Máximo 9 caracteres.

### Nombre

- Requerido.
- Máximo 50 caracteres.

### Apellidos

- Requerido.
- Máximo 100 caracteres.

### Correo

- Requerido.
- Máximo 100 caracteres.

Se aceptan solamente correos pertenecientes a:

- `@duoc.cl`
- `@profesor.duoc.cl`
- `@gmail.com`

### Fecha de nacimiento

- Opcional.

### Tipo de usuario

Debe utilizar un `select`.

Roles:

- Administrador.
- Vendedor.
- Cliente.

### Región y comuna

Las regiones deben cargarse desde un arreglo o desde localStorage.

Al cambiar la región, se deben mostrar solamente las comunas correspondientes.

### Dirección

- Requerida.
- Máximo 300 caracteres.

Los usuarios se deben almacenar en `fortepiano_usuarios`.

---

# 19. Roles del sistema

## Administrador

Tiene acceso total al sistema.

Puede gestionar:

- Usuarios.
- Instrumentos y Accesorios.
- Datos administrativos.

## Vendedor

Puede visualizar:

- Lista de productos.
- Detalle de productos.
- Lista de órdenes y detalle, si dicha funcionalidad se incorpora.

Los demás accesos administrativos no deben mostrarse al vendedor.

## Cliente

Solo debe acceder a la tienda pública.

---

# 20. Validaciones de inicio de sesión

## Correo

- Requerido.
- Máximo 100 caracteres.
- Solo se permiten:
  - `@duoc.cl`
  - `@profesor.duoc.cl`
  - `@gmail.com`

## Contraseña

- Requerida.
- Entre 4 y 10 caracteres.

Los mensajes importantes deben mostrarse con SweetAlert2.

---

# 21. Validaciones de Contacto

## Nombre

- Requerido.
- Máximo 100 caracteres.

## Correo

- Máximo 100 caracteres.
- Solo se permiten:
  - `@duoc.cl`
  - `@profesor.duoc.cl`
  - `@gmail.com`

## Comentario

- Requerido.
- Máximo 500 caracteres.

El mensaje debe guardarse en `fortepiano_contactos`.

---

# 22. Productos cargados mediante JavaScript

Los instrumentos musicales deben manejarse inicialmente mediante JavaScript.

Se debe:

1. Crear o recuperar un arreglo de productos.
2. Guardarlo en localStorage.
3. Leerlo desde localStorage.
4. Recorrerlo con JavaScript.
5. Generar las tarjetas de productos dinámicamente.

No es necesario escribir manualmente una tarjeta HTML diferente para cada instrumento.

---

# 23. Tablas maestras

Se deben manejar mediante localStorage las tablas maestras necesarias.

Como mínimo:

- Roles.
- Categorías.
- Regiones.
- Comunas.

Estas tablas deben utilizarse para alimentar los controles `select`.

Ejemplo:

```text
Región seleccionada
        ↓
Filtrar comunas
        ↓
Mostrar comunas correspondientes
```

---

# 24. Manejo del carrito

El carrito debe funcionar mediante JavaScript.

Como mínimo debe permitir:

- Añadir un instrumento.
- Evitar errores al agregar productos.
- Modificar cantidades.
- Eliminar productos.
- Calcular subtotales.
- Calcular total.
- Guardar el carrito en localStorage.

La información debe mantenerse aunque el usuario cambie de página o recargue el navegador.

---

# 25. CSS externo

Todas las páginas deben utilizar una hoja CSS externa propia.

Ejemplo:

```html
<link rel="stylesheet"
      href="{{ url_for('static', filename='css/estilos.css') }}">
```

El CSS personalizado debe utilizarse para complementar Bootstrap y mantener una identidad gráfica propia para Forte & Piano.

No se recomienda colocar grandes bloques de CSS dentro de cada página HTML.

---

# 26. JavaScript externo

En lo posible, el JavaScript debe mantenerse en archivos externos dentro de `static/js`.

Ejemplo:

```html
<script src="{{ url_for('static', filename='js/productos.js') }}"></script>
```

Se recomienda separar solamente cuando ayude a entender el proyecto.

No es necesario crear demasiados archivos.

El criterio principal debe ser:

**simple, claro y fácil de mantener**.

---

# 27. Mensajes y experiencia de usuario

La aplicación debe entregar retroalimentación clara al usuario.

Se debe utilizar principalmente:

- SweetAlert2 para mensajes emergentes.
- Bootstrap para mensajes visuales dentro de formularios.
- Clases de validación como:
  - `is-valid`
  - `is-invalid`

Los errores deben explicar brevemente qué debe corregir el usuario.

---

# 28. Navegación

Todas las páginas de la tienda deben estar correctamente conectadas.

El usuario debe poder navegar de manera clara entre:

- Inicio.
- Productos.
- Blog.
- Nosotros.
- Contacto.
- Registro.
- Login.
- Carrito.

El administrador debe disponer de su propio menú.

---

# 29. HTML semántico

Las páginas deben utilizar etiquetas HTML actuales y semánticas.

Cuando corresponda, utilizar:

```html
<header>
<nav>
<main>
<section>
<article>
<footer>
```

No se debe construir toda la página utilizando solamente `<div>` cuando exista una etiqueta semántica apropiada.

---

# 30. GitHub

El proyecto debe utilizar un repositorio remoto en GitHub.

Los commits deben tener mensajes claros y descriptivos.

Ejemplos:

```text
Agrega pagina de productos
Implementa validacion de registro
Agrega carrito con localStorage
Implementa DataTable de usuarios
Corrige estilos del administrador
```

El trabajo debe distribuirse entre los integrantes del equipo.

---

# 31. Entregables

El proyecto debe contemplar:

- Enlace público del repositorio GitHub.
- Proyecto frontend comprimido.
- Documento ERS, versión inicial.
- Presentación funcional del sistema.

---

# 32. Presentación

Cada integrante debe ser capaz de explicar brevemente:

- Cómo se construyeron las páginas HTML.
- Por qué se utilizó HTML semántico.
- Cómo se utilizó Bootstrap.
- Cómo se personalizó la interfaz con CSS.
- Cómo funcionan las validaciones JavaScript.
- Cómo funciona localStorage.
- Cómo se manejan productos y usuarios.
- Cómo funciona el carrito.
- Cómo se utilizó GitHub.
- Qué trabajo realizó personalmente.

---

# 33. Resumen tecnológico obligatorio

La solución debe quedar formada por:

```text
HTML
    ↓
Bootstrap + CSS propio
    ↓
JavaScript simple
    ↓
localStorage
```

Complementado con:

```text
Bootstrap     → interfaz gráfica
DataTables    → tablas de datos
SweetAlert2   → mensajes emergentes
CDN           → carga de librerías externas
Flask         → servir páginas y navegación
localStorage  → persistencia local
```

---

# 34. Arquitectura final

```text
                         Forte & Piano

                            Flask
                 Servidor web minimalista
                             │
                             ▼
                      templates/*.html
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
      Bootstrap          DataTables         SweetAlert2
       por CDN              por CDN            por CDN
          │                  │                  │
          └──────────────────┼──────────────────┘
                             ▼
                      Interfaz moderna
                             │
                             ▼
                       JavaScript simple
                             │
                             ▼
                        localStorage
                             │
          ┌──────────────────┼───────────────────┐
          ▼                  ▼                   ▼
       Usuarios          Instrumentos y Accesorios          Carrito
       Roles             Categorías           Contactos
       Regiones          Comunas              Blog
```

---

# 35. Restricción principal del proyecto

Aunque se utiliza Flask, **Forte & Piano sigue siendo un proyecto frontend**.

Toda la lógica funcional debe realizarse con JavaScript.

Flask existe únicamente para:

- Servir los archivos HTML.
- Resolver rutas.
- Permitir navegabilidad.
- Ejecutar el proyecto desde un servidor web local.

No se debe transformar este Control 1 en un proyecto backend.

La prioridad es construir una aplicación sencilla, funcional, visualmente profesional y fácil de comprender, usando **el menor código razonable posible** para cumplir correctamente todos los requerimientos.
