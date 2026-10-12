# Forte & Piano

Forte & Piano es una aplicación web (frontend) para una tienda de instrumentos musicales, especializada en pianos, teclados y accesorios. El proyecto cuenta con un catálogo de productos, carrito de compras, panel administrativo y gestión de usuarios (funcionalidad simulada).

## Tecnologías Utilizadas

- **Backend / Servidor**: Python con [Flask](https://flask.palletsprojects.com/) (utilizado para el enrutamiento y servir las plantillas).
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla).
- **Base de Datos**: Simulada en el cliente utilizando `localStorage` (gestionado a través de `storage.js`).
- **Librerías Adicionales**: 
  - [Bootstrap](https://getbootstrap.com/) para el diseño responsivo y sistema de grillas.
  - [SweetAlert2](https://sweetalert2.github.io/) para las alertas y cuadros de diálogo.
  - [DataTables](https://datatables.net/) para la interacción con las tablas administrativas.

## Cómo levantar el proyecto

Para ejecutar este proyecto en tu entorno local, sigue estos sencillos pasos:

### 1. Requisitos previos
- Debes tener [Python](https://www.python.org/downloads/) instalado en tu computadora.

### 2. Instalación de dependencias
Abre tu terminal, navega hasta la carpeta raíz del proyecto (`forte-piano-frontend`) y asegúrate de tener Flask instalado. Puedes instalarlo ejecutando:

```bash
pip install flaskpip install flask
```

### 3. Ejecutar el servidor
Una vez instalado Flask, simplemente ejecuta el archivo principal de la aplicación:

```bash
python app.py
```

### 4. Ver la aplicación
Abre tu navegador web favorito y visita la siguiente dirección:

```text
http://127.0.0.1:5000/
```

## Estructura del Proyecto

- `app.py`: Archivo principal del servidor Flask que maneja las rutas y navegación.
- `/templates`: Archivos HTML para cada una de las vistas de la tienda.
- `/static/css`: Hojas de estilo personalizadas.
- `/static/js`: Lógica del frontend (carrito, productos, validaciones, etc).
- `/static/img`: Imágenes y banners utilizados en el sitio (optimizados en WebP).
