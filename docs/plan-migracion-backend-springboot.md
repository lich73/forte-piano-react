# Guía Paso a Paso y Plan de Migración a Backend Spring Boot — Forte & Piano (Evaluación 3 - DSY1104)

Este documento define el **plan de migración completo** desde el almacenamiento local (`localStorage` en `forte-piano-react`) hacia una arquitectura **API REST en Spring Boot + Base de Datos Relacional (MySQL / H2 / Oracle) + Spring Security con JWT + Swagger (OpenAPI 3)**, alineado con el **100% de la rúbrica de la Evaluación Parcial N° 3 (40%)** de **Desarrollo Fullstack II (`DSY1104`)**.

---

## 1. Mapa de Equivalencia: De `localStorage` (`forte-piano-react`) a Spring Boot

Actualmente el frontend persiste 11 claves en `localStorage` (definidas en `src/storage/claves.ts`). En el nuevo backend se transforman en **tablas relacionales JPA** y **estado de autenticación JWT**:

| Clave actual en `localStorage` | Entidad JPA en Spring Boot | Tabla en Base de Datos | Endpoint Base Versionado |
| :--- | :--- | :--- | :--- |
| `fortepiano_roles` | `Rol` | `rol` | `/api/v1/roles` |
| `fortepiano_regiones` | `Region` | `region` | `/api/v1/regiones` |
| `fortepiano_comunas` | `Comuna` | `comuna` | `/api/v1/comunas` |
| `fortepiano_categorias` | `Categoria` | `categoria` | `/api/v1/categorias` |
| `fortepiano_usuarios` | `Usuario` | `usuario` | `/api/v1/usuarios` |
| `fortepiano_productos` | `Producto` | `producto` | `/api/v1/productos` |
| `fortepiano_boletas` | `Boleta` + `DetalleBoleta` | `boleta`, `detalle_boleta` | `/api/v1/boletas` |
| `fortepiano_blog` | `Noticia` | `noticia` | `/api/v1/noticias` |
| `fortepiano_contactos` | `MensajeContacto` | `mensaje_contacto` | `/api/v1/contactos` |
| `fortepiano_sesion` | Token **JWT** + `/me` | *(Stateless JWT)* | `/api/v1/auth/login`, `/api/v1/auth/registro`, `/api/v1/auth/perfil` |
| `fortepiano_carrito` | Estado local en React enviado al hacer Checkout | Se transforma en `Boleta` + `DetalleBoleta` al pagar | `POST /api/v1/boletas/checkout` |

---

## 2. Organización del Equipo (3 Integrantes) y Flujo de Ramas Git

Para cumplir con el criterio de **Colaboración y uso de repositorios** de la rúbrica, cada integrante debe registrar commits claros en el repositorio backend y frontend:

| Integrante | Responsabilidad en Backend (Spring Boot) | Responsabilidad en Frontend (React) | Indicadores de Presentación Individual (60%) |
| :--- | :--- | :--- | :--- |
| **Integrante 1** | Configuración BD, Entidades `Usuario`, `Rol`, `Region`, `Comuna`, **Spring Security + JWT**, `AuthController`, `UsuarioController`. | Adaptar `AuthContext.tsx` para usar JWT (`Bearer token`), persistencia de sesión al recargar página y `RutaProtegida.tsx`. | Énfasis en **IE3.3.4**, **IE3.3.5**, **IE3.3.6** (Seguridad, JWT, Sesión y Roles). |
| **Integrante 2** | Entidades `Categoria`, `Producto`, `Boleta`, `DetalleBoleta`, lógica de ofertas, descuento de stock, pasarela de pago simulada (`BoletaService`). | Adaptar `useProductos.ts`, `CartContext.tsx` y `useBoletas.ts` para consumir `/api/v1/productos` y `/api/v1/boletas`. | Énfasis en **IE3.1.2**, **IE3.2.4** (Modelo relacional, lógica de negocio, checkout e integración). |
| **Integrante 3** | Entidades `Noticia`, `MensajeContacto`, `DashboardController` (métricas/gráficos), configuración **Swagger/OpenAPI**, `DataSeeder` y Pruebas Unitarias JUnit/Mockito. | Adaptar `AdminDashboard.tsx`, `AdminReportes.tsx`, `Contacto.tsx`, `useNoticias.ts` y pruebas unitarias. | Énfasis en **IE3.2.3**, **IE3.2.4** (Documentación Swagger, CRUDs, Dashboard y QA). |

### Estrategia de Ramas sugerida en el repositorio Backend
- `main`: Rama estable de entrega.
- `develop`: Rama de integración grupal.
- Ramas por funcionalidad:
  - `feat/config-db-entidades`
  - `feat/security-jwt-auth`
  - `feat/crud-productos-ofertas`
  - `feat/checkout-boletas-pasarela`
  - `feat/dashboard-swagger-seed`

---

## 3. Estructura de Paquetes del Proyecto Spring Boot

Organicen el proyecto backend bajo una arquitectura en capas limpia:

```text
src/main/java/cl/duoc/fortepiano/
├── FortePianoBackendApplication.java
├── config/
│   ├── CorsConfig.java                 # Permite peticiones desde http://localhost:5173
│   ├── OpenApiConfig.java              # Configuración de Swagger UI con soporte Bearer JWT
│   └── DataSeeder.java                 # Carga inicial de datos idéntica a seed.ts
├── security/
│   ├── SecurityConfig.java             # Reglas de acceso por rol (ADMIN, VENDEDOR, CLIENTE)
│   ├── JwtService.java                 # Generación, firma y validación del token JWT
│   ├── JwtAuthenticationFilter.java    # Filtro que lee el header Authorization: Bearer <token>
│   └── CustomUserDetailsService.java   # Carga usuario por correo desde MySQL
├── entity/
│   ├── Rol.java
│   ├── Region.java
│   ├── Comuna.java
│   ├── Usuario.java                    # Tabla USUARIO (Figura 1)
│   ├── Categoria.java                  # Tabla CATEGORIA (Figura 1)
│   ├── Producto.java                   # Tabla PRODUCTO (Figura 1)
│   ├── Boleta.java                     # Tabla BOLETA (Figura 1)
│   ├── DetalleBoleta.java              # Tabla DETALLE_BOLETA (Figura 1)
│   ├── Noticia.java
│   └── MensajeContacto.java
├── dto/
│   ├── LoginRequest.java
│   ├── AuthResponse.java
│   ├── RegistroRequest.java
│   ├── ActualizarPerfilRequest.java
│   ├── CheckoutRequest.java
│   ├── ReintentoPagoRequest.java
│   └── DashboardResumenDto.java
├── repository/
│   ├── RolRepository.java
│   ├── RegionRepository.java
│   ├── ComunaRepository.java
│   ├── UsuarioRepository.java
│   ├── CategoriaRepository.java
│   ├── ProductoRepository.java
│   ├── BoletaRepository.java
│   ├── DetalleBoletaRepository.java
│   ├── NoticiaRepository.java
│   └── MensajeContactoRepository.java
├── service/
│   ├── RutValidatorService.java        # Algoritmo Módulo 11 en backend
│   ├── AuthService.java
│   ├── UsuarioService.java
│   ├── ProductoService.java
│   ├── BoletaService.java              # Checkout, Pasarela Simulada y Control de Stock
│   └── DashboardService.java
├── controller/
│   ├── AuthController.java             # /api/v1/auth/**
│   ├── UsuarioController.java          # /api/v1/usuarios/**
│   ├── ProductoController.java         # /api/v1/productos/**
│   ├── CategoriaController.java        # /api/v1/categorias/**
│   ├── BoletaController.java           # /api/v1/boletas/**
│   ├── CatalogoMaestroController.java  # /api/v1/regiones, /api/v1/comunas, /api/v1/roles
│   ├── NoticiaController.java          # /api/v1/noticias/**
│   ├── ContactoController.java         # /api/v1/contactos/**
│   └── DashboardController.java        # /api/v1/dashboard/**
└── exception/
    └── GlobalExceptionHandler.java     # Respuestas JSON uniformes ante errores 400/401/403/404
```

---

## 4. Paso 1: Configuración del Proyecto (`pom.xml` y `application.properties`)

### 4.1. Dependencias clave en `pom.xml`
Asegúrate de tener estas dependencias en tu `pom.xml` (Spring Boot 3.x + Java 17/21):

```xml
<dependencies>
    <!-- 1. API REST y Validaciones -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- 2. Persistencia JPA y Base de Datos (MySQL + H2 opcional para tests) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- 3. Spring Security + JWT (jjwt 0.12.6) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.6</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.6</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.6</version>
        <scope>runtime</scope>
    </dependency>

    <!-- 4. Documentación Swagger / OpenAPI 3 -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.6.0</version>
    </dependency>

    <!-- 5. Lombok y Testing -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### 4.2. Archivo `src/main/resources/application.properties`

```properties
spring.application.name=forte-piano-backend
server.port=8080

# Conexión MySQL (crea la BD automáticamente si no existe)
spring.datasource.url=jdbc:mysql://localhost:3306/fortepiano_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=America/Santiago&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Configuración JWT (Clave secreta de al menos 256 bits / 32+ caracteres)
jwt.secret=FortePianoClaveSecretaSuperSeguraEvaluacion3DuocUC2026!
jwt.expiration-ms=86400000

# Configuración Swagger UI
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operationsSorter=method
```

---

## 5. Paso 2: Modelamiento de Datos Relacional (Figura 1 de la Pauta)

La **Figura 1** de las instrucciones exige explícitamente el modelo relacional central:

```text
[ROL] 1 ─── * [USUARIO] 1 ─── * [BOLETA] 1 ─── * [DETALLE_BOLETA] * ─── 1 [PRODUCTO] * ─── 1 [CATEGORIA]
```

### 5.1. Entidades Principales (`entity/`)

#### `Categoria.java` (Tabla `CATEGORIA`)
```java
package cl.duoc.fortepiano.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "categoria")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank
    @Column(nullable = false, unique = true, length = 80)
    private String nombre;
}
```

#### `Producto.java` (Tabla `PRODUCTO` con soporte de Ofertas y Stock Crítico)
```java
package cl.duoc.fortepiano.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "producto")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Producto {

    @Id
    @Column(length = 20)
    private String codigo; // Ej: "PD-001", "PA-001"

    @NotBlank
    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer precio;

    @NotNull
    @Min(0)
    @Column(nullable = false)
    private Integer stock;

    @Column(name = "stock_critico")
    private Integer stockCritico;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Column(length = 255)
    private String imagen;

    @Column(nullable = false, length = 20)
    private String estado; // "Activo" | "Inactivo"

    @Column(name = "en_oferta", nullable = false)
    private Boolean enOferta = false;

    @Column(name = "porcentaje_descuento")
    private Integer porcentajeDescuento = 0;

    @Column(name = "precio_oferta")
    private Integer precioOferta;

    // Método auxiliar de negocio para obtener el precio vigente
    public int obtenerPrecioEfectivo() {
        if (Boolean.TRUE.equals(enOferta) && precioOferta != null && precioOferta > 0 && precioOferta < precio) {
            return precioOferta;
        }
        return precio;
    }
}
```

#### `Rol.java`, `Region.java`, `Comuna.java` y `Usuario.java` (Tabla `USUARIO`)
```java
package cl.duoc.fortepiano.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "usuario")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Usuario {

    @Id
    @Column(length = 12)
    private String run; // Normalizado sin puntos ni guión, ej: "123456785"

    @NotBlank
    @Column(nullable = false, length = 50)
    private String nombre;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String apellidos;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true, length = 100)
    private String correo;

    @JsonIgnore
    @Column(nullable = false)
    private String password; // Encriptada con BCryptPasswordEncoder

    @Column(name = "fecha_nacimiento", length = 20)
    private String fechaNacimiento;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol; // 1=Administrador, 2=Vendedor, 3=Cliente

    @Column(name = "region_id", nullable = false)
    private Integer regionId;

    @Column(name = "comuna_id", nullable = false)
    private Integer comunaId;

    @NotBlank
    @Column(nullable = false, length = 300)
    private String direccion;

    @Column(nullable = false, length = 20)
    private String estado; // "Activo" | "Inactivo"
}
```

#### `Boleta.java` (Tabla `BOLETA`) y `DetalleBoleta.java` (Tabla `DETALLE_BOLETA`)
Separamos los datos del comprador (`Usuario`) de los datos específicos de despacho (`modalidadEntrega`, `destinatario`, `direccionEnvio`, `comunaEnvio`, `regionEnvio`) y guardamos el estado de la pasarela (`Emitida`, `Pendiente`, `Rechazada`, `Anulada`):

```java
package cl.duoc.fortepiano.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "boleta")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Boleta {

    @Id
    @Column(length = 40)
    private String id; // Ej: "BOL-1001"

    @Column(nullable = false, unique = true)
    private Integer folio;

    @Column(nullable = false, length = 40)
    private String fecha;

    // Relación con USUARIO (Figura 1)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_run")
    private Usuario usuario;

    @Column(name = "cliente_run", length = 15)
    private String clienteRun;

    @Column(name = "cliente_nombre", nullable = false, length = 160)
    private String clienteNombre;

    @Column(name = "cliente_correo", nullable = false, length = 100)
    private String clienteCorreo;

    @Column(name = "subtotal_neto", nullable = false)
    private Integer subtotalNeto;

    @Column(nullable = false)
    private Integer iva;

    @Column(nullable = false)
    private Integer total;

    @Column(name = "metodo_pago", nullable = false, length = 80)
    private String metodoPago;

    @Column(nullable = false, length = 20)
    private String estado; // "Emitida" | "Pendiente" | "Rechazada" | "Anulada"

    @Column(name = "mensaje_transaccion", length = 255)
    private String mensajeTransaccion;

    // Datos específicos de despacho (diferenciados de los datos del perfil del cliente)
    @Column(name = "modalidad_entrega", length = 30)
    private String modalidadEntrega; // "perfil" | "otra_direccion" | "retiro_tienda"

    @Column(name = "envio_destinatario", length = 150)
    private String envioDestinatario;

    @Column(name = "envio_telefono", length = 30)
    private String envioTelefono;

    @Column(name = "envio_region_id")
    private Integer envioRegionId;

    @Column(name = "envio_region_nombre", length = 100)
    private String envioRegionNombre;

    @Column(name = "envio_comuna_id")
    private Integer envioComunaId;

    @Column(name = "envio_comuna_nombre", length = 100)
    private String envioComunaNombre;

    @Column(name = "envio_direccion", length = 300)
    private String envioDireccion;

    @Column(name = "envio_referencia", length = 300)
    private String envioReferencia;

    // Relación 1 a N con DETALLE_BOLETA (Figura 1)
    @OneToMany(mappedBy = "boleta", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<DetalleBoleta> items = new ArrayList<>();
}
```

```java
package cl.duoc.fortepiano.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "detalle_boleta")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DetalleBoleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "boleta_id", nullable = false)
    private Boleta boleta;

    // Relación con PRODUCTO (Figura 1)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "producto_codigo", nullable = false)
    private Producto producto;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(name = "precio_unitario", nullable = false)
    private Integer precioUnitario;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private Integer subtotal;
}
```

---

## 6. Paso 3: Lógica de Negocio en Servicios (`service/`)

Para obtener el **100% en IE3.1.1 e IE3.1.2**, el backend no debe ser solo un pasamanos de base de datos, sino encapsular las reglas de negocio de Forte & Piano:

1. **Validación de RUN Chileno (Módulo 11) y Dominio de Correo en `RutValidatorService.java`**:
   - Validar en el backend que todo RUN registrado o actualizado incluya su dígito verificador y cumpla el algoritmo Módulo 11.
   - Validar que el correo pertenezca a `@duoc.cl`, `@profesor.duoc.cl` o `@gmail.com`.
2. **Cálculo Automático de Precios de Oferta en `ProductoService.java`**:
   - Si `enOferta == true` y se envía `porcentajeDescuento` (entre `1` y `90`), calcular `precioOferta = Math.round(precio * (1 - porcentajeDescuento / 100.0))`.
   - Si `enOferta == false`, forzar `porcentajeDescuento = 0` y `precioOferta = null`.
3. **Simulación de Pasarela de Pago y Control Transaccional de Stock (`@Transactional`) en `BoletaService.java`**:
   - El endpoint `POST /api/v1/boletas/checkout` recibe los ítems, los datos de envío y el `resultadoTransaccion` seleccionado en la pasarela simulada (`exitoso`, `rechazado`, `intentar_mas_tarde`):
     - **`exitoso`**: Verifica que `producto.getStock() >= item.getCantidad()`, **descuenta el stock en la tabla `producto`**, calcula `subtotalNeto = Math.round(total / 1.19)` e `iva = total - subtotalNeto`, y guarda la boleta con estado **`Emitida`**.
     - **`rechazado`**: No descuenta stock y registra la boleta con estado **`Rechazada`**.
     - **`intentar_mas_tarde`**: No descuenta stock y registra la boleta con estado **`Pendiente`**.
   - El endpoint `PUT /api/v1/boletas/{id}/reintentar-pago` permite cambiar una boleta `Pendiente` o `Rechazada` a `Emitida` (descontando el stock en ese instante si el resultado es `exitoso`).
   - El endpoint `PUT /api/v1/boletas/{id}/anular` cambia una boleta `Emitida` a `Anulada` y **repone automáticamente el stock** de cada producto en la base de datos.

---

## 7. Paso 4: Diseño de Endpoints API REST Versionados (`/api/v1/...`) y Matriz de Roles

La pauta exige versionado en la ruta (`/api/v1/...`) y restricción estricta según los 3 roles definidos en la página 2 del documento:
- **Administrador (`ROLE_ADMIN`)**: Acceso total al sistema.
- **Vendedor (`ROLE_VENDEDOR`)**: Puede visualizar la lista y detalle de productos, y la lista y detalle de órdenes (`Boleta`). No puede gestionar usuarios.
- **Cliente (`ROLE_CLIENTE`)**: Puede navegar la tienda, comprar en el checkout, editar su propio perfil y consultar/reintentar sus propias boletas.

| Método | Endpoint Versionado | Descripción | Permiso / Rol Requerido |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Autentica correo/password y devuelve JWT + datos de sesión | Público (`permitAll`) |
| `POST` | `/api/v1/auth/registro` | Registra un nuevo usuario `Cliente` validando RUN Módulo 11 | Público (`permitAll`) |
| `GET` | `/api/v1/auth/me` | Obtiene la sesión actual a partir del token JWT (persistencia al recargar) | Autenticado (`ADMIN`, `VENDEDOR`, `CLIENTE`) |
| `PUT` | `/api/v1/auth/perfil` | Permite al cliente editar sus datos personales desde Checkout | Autenticado (`ADMIN`, `VENDEDOR`, `CLIENTE`) |
| `GET` | `/api/v1/productos` | Lista todo el catálogo (con filtros opcionales `?ofertas=true&categoriaId=`) | Público (`permitAll`) |
| `GET` | `/api/v1/productos/{codigo}` | Obtiene el detalle de un instrumento por código | Público (`permitAll`) |
| `POST` | `/api/v1/productos` | Crea un nuevo producto (con configuración de oferta) | Solo `ROLE_ADMIN` |
| `PUT` | `/api/v1/productos/{codigo}` | Actualiza producto, stock u oferta | Solo `ROLE_ADMIN` |
| `DELETE` | `/api/v1/productos/{codigo}` | Elimina o desactiva un producto | Solo `ROLE_ADMIN` |
| `GET` | `/api/v1/categorias` | Lista todas las categorías de instrumentos | Público (`permitAll`) |
| `POST` | `/api/v1/categorias` | Crea una nueva categoría | Solo `ROLE_ADMIN` |
| `DELETE` | `/api/v1/categorias/{id}` | Elimina una categoría sin productos asociados | Solo `ROLE_ADMIN` |
| `POST` | `/api/v1/boletas/checkout` | Procesa el pago simulado (`exitoso`, `rechazado`, `intentar_mas_tarde`) | Público o Autenticado (`CLIENTE`, `ADMIN`) |
| `GET` | `/api/v1/boletas` | Lista todas las órdenes/boletas del sistema | `ROLE_ADMIN` y `ROLE_VENDEDOR` |
| `GET` | `/api/v1/boletas/{id}` | Obtiene el detalle de una orden/boleta | `ROLE_ADMIN`, `ROLE_VENDEDOR` o Dueño |
| `GET` | `/api/v1/boletas/mis-boletas` | Lista las boletas del cliente autenticado | Autenticado (`CLIENTE`, `ADMIN`, `VENDEDOR`) |
| `PUT` | `/api/v1/boletas/{id}/reintentar-pago` | Reintenta el pago de una orden `Pendiente` o `Rechazada` | Autenticado (`CLIENTE`, `ADMIN`) |
| `PUT` | `/api/v1/boletas/{id}/anular` | Anula una boleta y repone el stock de los instrumentos | Solo `ROLE_ADMIN` |
| `GET` | `/api/v1/usuarios` | Lista todos los usuarios registrados | Solo `ROLE_ADMIN` |
| `GET` | `/api/v1/usuarios/{run}` | Obtiene detalle de un usuario por RUN | Solo `ROLE_ADMIN` |
| `POST` | `/api/v1/usuarios` | Crea un usuario (Administrador, Vendedor o Cliente) | Solo `ROLE_ADMIN` |
| `PUT` | `/api/v1/usuarios/{run}` | Edita un usuario existente | Solo `ROLE_ADMIN` |
| `DELETE` | `/api/v1/usuarios/{run}` | Elimina un usuario | Solo `ROLE_ADMIN` |
| `GET` | `/api/v1/dashboard/resumen` | Devuelve KPIs y series para los gráficos del Dashboard | `ROLE_ADMIN` y `ROLE_VENDEDOR` |
| `GET` | `/api/v1/noticias` | Lista artículos del blog musical | Público (`permitAll`) |
| `POST` | `/api/v1/contactos` | Registra un mensaje en el formulario de contacto | Público (`permitAll`) |
| `GET` | `/api/v1/contactos` | Lista mensajes de contacto recibidos | `ROLE_ADMIN` |
| `GET` | `/api/v1/regiones` y `/api/v1/comunas` | Catálogos geográficos para formularios y despacho | Público (`permitAll`) |

---

## 8. Paso 5: Implementación de Seguridad con Spring Security y JWT (`security/`)

### 8.1. Configuración de `SecurityConfig.java`
```java
package cl.duoc.fortepiano.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // 1. Swagger UI y OpenAPI públicos
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                // 2. Autenticación, catálogo público, blog, contacto y tablas maestras
                .requestMatchers("/api/v1/auth/login", "/api/v1/auth/registro").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/productos/**", "/api/v1/categorias/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/noticias/**", "/api/v1/regiones/**", "/api/v1/comunas/**", "/api/v1/roles/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/contactos").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/boletas/checkout").permitAll()

                // 3. Permisos compartidos entre ADMINISTRADOR y VENDEDOR
                .requestMatchers(HttpMethod.GET, "/api/v1/boletas").hasAnyRole("ADMIN", "VENDEDOR")
                .requestMatchers(HttpMethod.GET, "/api/v1/dashboard/**").hasAnyRole("ADMIN", "VENDEDOR")

                // 4. Permisos exclusivos del ADMINISTRADOR
                .requestMatchers("/api/v1/usuarios/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/v1/productos/**", "/api/v1/categorias/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/productos/**", "/api/v1/categorias/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/productos/**", "/api/v1/categorias/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/boletas/*/anular").hasRole("ADMIN")

                // 5. Cualquier otra ruta (ej. /api/v1/auth/me, /api/v1/boletas/mis-boletas) requiere token válido
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

### 8.2. Configuración de Swagger con Botón `Authorize (Bearer JWT)` (`OpenApiConfig.java`)
Para que el profesor pueda probar los endpoints protegidos directamente desde Swagger (`http://localhost:8080/swagger-ui.html`):

```java
package cl.duoc.fortepiano.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        return new OpenAPI()
            .info(new Info()
                .title("Forte & Piano - API REST E-Commerce Musical")
                .version("v1.0.0")
                .description("Documentación oficial de endpoints CRUD, Checkout, Pasarela de Pago Simulada y Seguridad JWT para Evaluación 3 (DSY1104).")
                .contact(new Contact().name("Equipo Forte & Piano - Duoc UC")))
            .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
            .components(new Components()
                .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                    .name(securitySchemeName)
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")));
    }
}
```

---

## 9. Paso 6: Semilla Inicial de Datos (`DataSeeder.java`)

Implementa un `CommandLineRunner` en `config/DataSeeder.java` que se ejecute al arrancar Spring Boot si la base de datos está vacía, insertando exactamente los mismos datos de `src/data/seed.ts`:
1. **Roles**: `1 = Administrador`, `2 = Vendedor`, `3 = Cliente`.
2. **Regiones y Comunas**: Región Metropolitana, Valparaíso y Biobío con sus 7 comunas.
3. **Categorías**: Pianos Acústicos, Pianos Digitales, Sintetizadores, Accesorios, Amplificadores, Partituras.
4. **Usuarios Iniciales** (con sus contraseñas encriptadas mediante `passwordEncoder.encode(...)`):
   - `admin@gmail.com` / `admin123` (RUN `123456785`, Rol `1 - Administrador`)
   - `vendedor@gmail.com` / `vend1234` (RUN `987654325`, Rol `2 - Vendedor`)
   - `camila@gmail.com` / `cliente1` (RUN `112223339`, Rol `3 - Cliente`)
   - `diego@duoc.cl` / `diego123` (RUN `201113334`, Rol `3 - Cliente`)
5. **Productos Iniciales**: Los 8 instrumentos (`AC-005`, `PD-006`, `AD-001`, `PA-001`, `PD-001`, `SY-001`, `AD-003`, `PD-002`) con sus campos `enOferta`, `porcentajeDescuento` y `precioOferta`.
6. **Boletas Iniciales**: Las 5 órdenes semilla (`BOL-SEED-1001` a `BOL-SEED-1005`) en estados `Emitida`, `Pendiente` y `Rechazada` para que los gráficos del Dashboard tengan datos desde el primer arranque.

---

## 10. Paso 7: Plan de Integración en el Frontend (`forte-piano-react`)

Para conectar este repositorio React con el nuevo backend en Spring Boot manteniendo toda la interfaz actual:

### 10.1. Crear cliente HTTP centralizado (`src/services/api.ts`)
Crear un archivo `src/services/api.ts` (con `fetch` o `axios`) que lea la URL base desde `.env` (`VITE_API_URL=http://localhost:8080/api/v1`) e inyecte automáticamente el token JWT en la cabecera `Authorization`:

```ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'
const TOKEN_KEY = 'fortepiano_jwt_token'

export function obtenerToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function guardarToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function eliminarToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = obtenerToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {})
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.mensaje || `Error HTTP ${response.status}`)
  }

  return response.json() as Promise<T>
}
```

### 10.2. Archivos del Frontend a Actualizar
1. **`src/context/AuthContext.tsx` (Indicadores IE3.3.2 e IE3.3.5)**:
   - `login(correo, password)` llama a `POST /api/v1/auth/login`, recibe `{ token, sesion }`, guarda el JWT con `guardarToken(token)` y actualiza el estado `sesion`.
   - En un `useEffect` al montar `AuthProvider`, si existe un token en `localStorage`, llama a `GET /api/v1/auth/me` para **rehidratar y validar la sesión de forma segura ante recargas de página (`F5`)**. Si el token expiró (`401`), limpia la sesión automáticamente.
   - `actualizarPerfil(datos)` llama a `PUT /api/v1/auth/perfil`.
2. **`src/hooks/useProductos.ts`**:
   - Reemplazar `useColeccion(FORTEPIANO_KEYS.productos)` por llamadas a `GET /api/v1/productos`, `POST /api/v1/productos`, `PUT /api/v1/productos/{codigo}` y `DELETE /api/v1/productos/{codigo}`.
3. **`src/context/CartContext.tsx` y `src/hooks/useBoletas.ts`**:
   - El carrito (`items`) sigue siendo reactivo en el cliente durante la navegación, pero `procesarPagoPasarela(datosCheckout)` envía `POST /api/v1/boletas/checkout` al backend.
   - El backend valida el stock, aplica el escenario de la pasarela (`exitoso`, `rechazado`, `intentar_mas_tarde`) y devuelve la `Boleta` persistida en MySQL.
   - `reintentarPagoBoleta` llama a `PUT /api/v1/boletas/{id}/reintentar-pago` y `anularBoleta` llama a `PUT /api/v1/boletas/{id}/anular`.
4. **`src/hooks/useUsuarios.ts` y `src/pages/Registro.tsx`**:
   - `Registro.tsx` envía `POST /api/v1/auth/registro`.
   - `useUsuarios.ts` consume `GET/POST/PUT/DELETE /api/v1/usuarios` (protegido con `ROLE_ADMIN`).
5. **Restricciones de Rol para el Vendedor (`src/components/layout/AdminSidebar.tsx`, `src/App.tsx`) (Indicadores IE3.3.3 e IE3.3.6)**:
   - Verificar que el rol `Vendedor` (`rolId === 2`) solo tenga acceso a la vista de Productos y Órdenes/Boletas, ocultando en el menú lateral y bloqueando en `RutaProtegida` el acceso a Usuarios y demás mantenedores exclusivos del Administrador.

---

## 11. Checklist de Entregables Oficiales (Evaluación Parcial N° 3)

De acuerdo con la página 4 de la pauta oficial, asegúrense de preparar y comprimir los siguientes **9 archivos** en un único `.zip` (`Control3-FullStack2-nombre1.apellido1-nombre2.apellido2-nombre3.apellido3.zip`):

- [ ] **`01-README.txt`**: Sigla (`DSY1104 - Desarrollo Fullstack II`), nombres completos con RUT de los 3 integrantes, enlace GitHub público del proyecto Frontend y enlace GitHub público del proyecto Backend.
- [ ] **`02-Documento-ERS.docx`**: Requerimientos funcionales/no funcionales actualizados con arquitectura Cliente-Servidor REST, modelo relacional (Figura 1) y seguridad JWT.
- [ ] **`03-Documento-de-Cobertura-de-Testing.docx`**: Evidencia y capturas de los tests unitarios del frontend (Karma + Jasmine en `tests_varios`) y tests unitarios del backend (JUnit 5 + Mockito).
- [ ] **`04-Documentación-de-APIs.xlsx`**: Planilla Excel listando cada endpoint (`/api/v1/...`), método HTTP, rol requerido, JSON de entrada (Request Body), JSON de salida (Response) y códigos de estado (`200`, `201`, `400`, `401`, `403`, `404`).
- [ ] **`05-Documentación-de-APIs-e-Integración.docx`**: Explicación del modelo de base de datos relacional (`USUARIO`, `BOLETA`, `DETALLE_BOLETA`, `PRODUCTO`, `CATEGORIA`), capturas de Swagger UI, flujo de autenticación JWT y pruebas de comunicación Frontend ↔ Backend.
- [ ] **`06-Manual-de-Usuario.docx`**: Guía paso a paso con pantallazos detallados del flujo de Cliente (Catálogo con ofertas, Checkout con despacho, Pasarela de Pago Simulada, Mis Compras), Vendedor y Administrador (Dashboard con gráficos, CRUDs).
- [ ] **`07-Proyecto-frontend-comprimido.zip`**: Código fuente de `forte-piano-react` (sin `node_modules`).
- [ ] **`08-Proyecto-backend-comprimido.zip`**: Código fuente del proyecto Spring Boot (sin carpeta `target`).
- [ ] **`09-Video-de-presentación-del-proyecto.mp4`**: Video donde participan los 3 integrantes mostrando cada pantalla funcionando integrada con Spring Boot y explicando su relación con el código fuente.
