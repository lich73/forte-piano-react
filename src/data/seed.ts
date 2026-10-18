import { FORTEPIANO_KEYS } from '../storage/claves'
import { Rol, Categoria, Region, Comuna, Usuario, Producto, Noticia } from '../types'

export const ROLES_INICIALES: Rol[] = [
  { id: 1, nombre: 'Administrador' },
  { id: 2, nombre: 'Vendedor' },
  { id: 3, nombre: 'Cliente' }
]

export const CATEGORIAS_INICIALES: Categoria[] = [
  { id: 1, nombre: 'Pianos Acusticos' },
  { id: 2, nombre: 'Pianos Digitales' },
  { id: 3, nombre: 'Sintetizadores' },
  { id: 4, nombre: 'Accesorios' },
  { id: 5, nombre: 'Amplificadores' },
  { id: 6, nombre: 'Partituras' }
]

export const REGIONES_INICIALES: Region[] = [
  { id: 1, nombre: 'Region Metropolitana' },
  { id: 2, nombre: 'Valparaiso' },
  { id: 3, nombre: 'Biobio' }
]

export const COMUNAS_INICIALES: Comuna[] = [
  { id: 1, regionId: 1, nombre: 'Santiago' },
  { id: 2, regionId: 1, nombre: 'Providencia' },
  { id: 3, regionId: 1, nombre: 'Maipu' },
  { id: 4, regionId: 2, nombre: 'Valparaiso' },
  { id: 5, regionId: 2, nombre: 'Vina del Mar' },
  { id: 6, regionId: 3, nombre: 'Concepcion' },
  { id: 7, regionId: 3, nombre: 'Talcahuano' }
]

export const USUARIOS_INICIALES: Usuario[] = [
  {
    run: '123456785',
    nombre: 'Admin',
    apellidos: 'Forte',
    correo: 'admin@gmail.com',
    password: 'admin123',
    fechaNacimiento: '1990-01-01',
    rolId: 1,
    regionId: 1,
    comunaId: 1,
    direccion: 'Av. Principal 123',
    estado: 'Activo'
  },
  {
    run: '987654325',
    nombre: 'Vendedor',
    apellidos: 'Forte',
    correo: 'vendedor@gmail.com',
    password: 'vend1234',
    fechaNacimiento: '1992-05-14',
    rolId: 2,
    regionId: 1,
    comunaId: 2,
    direccion: 'Calle Venta 456',
    estado: 'Activo'
  },
  {
    run: '112223339',
    nombre: 'Camila',
    apellidos: 'Soto Perez',
    correo: 'camila@gmail.com',
    password: 'cliente1',
    fechaNacimiento: '1998-03-22',
    rolId: 3,
    regionId: 2,
    comunaId: 4,
    direccion: 'Los Aromos 789',
    estado: 'Activo'
  },
  {
    run: '201113334',
    nombre: 'Diego',
    apellidos: 'Fernandez Rojas',
    correo: 'diego@duoc.cl',
    password: 'diego123',
    fechaNacimiento: '2001-11-09',
    rolId: 3,
    regionId: 3,
    comunaId: 6,
    direccion: 'Las Rosas 321',
    estado: 'Activo'
  }
]

export const PRODUCTOS_INICIALES: Producto[] = [
  {
    codigo: 'AC-005',
    nombre: 'Soporte de Teclado Doble',
    descripcion: 'Soporte de teclado tipo tijera de metal resistente con altura ajustable, compatible con la mayoria de pianos digitales y teclados.',
    precio: 17990,
    stock: 10,
    stockCritico: 3,
    categoriaId: 4,
    imagen: 'productos/prod-soporte-teclado-doble.webp',
    estado: 'Activo'
  },
  {
    codigo: 'PD-006',
    nombre: 'Yamaha Arius YDP-146 Rosewood',
    descripcion: 'Piano digital de mueble con teclas contrapesadas GH3, sonido Pure CF Sampling y acabado elegante en palisandro.',
    precio: 699990,
    stock: 25,
    stockCritico: 5,
    categoriaId: 2,
    imagen: 'productos/prod-piano-yamaha-arius-ydp-146-rosewood.webp',
    estado: 'Activo'
  },
  {
    codigo: 'AD-001',
    nombre: 'Funda GTSA Key 61 con Ruedas',
    descripcion: 'Funda acolchada con ruedas para teclados de 61 teclas, protege tu instrumento del polvo y la humedad durante el transporte.',
    precio: 25000,
    stock: 15,
    stockCritico: 4,
    categoriaId: 4,
    imagen: 'productos/prod-funda-gtsa-key-61-ruedas.webp',
    estado: 'Activo'
  },
  {
    codigo: 'PA-001',
    nombre: 'Piano Yamaha B1',
    descripcion: 'Piano acustico vertical de la serie B, ideal para estudiantes y espacios reducidos. Sonido brillante y mecanismo fiable.',
    precio: 3299000,
    stock: 5,
    stockCritico: 2,
    categoriaId: 1,
    imagen: 'productos/prod-piano-yamaha-b10.webp',
    estado: 'Activo'
  },
  {
    codigo: 'PD-001',
    nombre: 'Yamaha P-45 Negro',
    descripcion: 'Piano digital de entrada con 88 teclas contrapesadas GHS y tecnologia Pure CF Sampling. Compacto y portatil.',
    precio: 459990,
    stock: 30,
    stockCritico: 5,
    categoriaId: 2,
    imagen: 'productos/prod-piano-yamaha-p45-negro.webp',
    estado: 'Activo'
  },
  {
    codigo: 'SY-001',
    nombre: 'Nord Electro 6D 61',
    descripcion: 'Teclado de escenario premium con 61 teclas, motores de piano, organo y sintetizador. Sonido profesional de referencia.',
    precio: 1899990,
    stock: 12,
    stockCritico: 3,
    categoriaId: 3,
    imagen: 'productos/prod-teclado-nord-electro-6d-61.jpg',
    estado: 'Activo'
  },
  {
    codigo: 'AD-003',
    nombre: 'Pedal de Sustain SP-34',
    descripcion: 'Pedal de sustain estilo piano con accion progresiva, compatible con la mayoria de pianos y teclados digitales.',
    precio: 15000,
    stock: 25,
    stockCritico: 5,
    categoriaId: 4,
    imagen: 'productos/prod-pedal-sp-34.webp',
    estado: 'Activo'
  },
  {
    codigo: 'PD-002',
    nombre: 'Donner DDP-80 Digital Piano',
    descripcion: 'Piano digital compacto de 88 teclas contrapesadas con 128 voces de polifonia y diseno moderno en madera.',
    precio: 659990,
    stock: 18,
    stockCritico: 4,
    categoriaId: 2,
    imagen: 'productos/prod-piano-donner-ddp-80.webp',
    estado: 'Activo'
  }
]

export const NOTICIAS_INICIALES: Noticia[] = [
  {
    id: 1,
    titulo: 'Forte & Piano abre sus puertas',
    resumen: 'Nace una nueva tienda online pensada por y para los pianistas y músicos de Chile.',
    imagen: 'blog/apertura.jpg',
    fecha: '2026-08-01',
    slug: 'detalle-1',
    contenido: [
      'Después de meses de trabajo, hoy nace Forte & Piano, una nueva tienda online pensada por y para la comunidad musical. Nuestro objetivo es simple: ofrecer un catálogo variado de instrumentos musicales, con una experiencia de compra rápida, clara y sin complicaciones.',
      'Desde el primer día contarás con un catálogo organizado por categorías, fichas de producto con toda la información que necesitas, y un carrito de compras que recuerda tus productos aunque cierres el navegador.',
      'Este es solo el comienzo. En las próximas semanas seguiremos sumando títulos, promociones y contenido para toda la comunidad. Gracias por ser parte de este lanzamiento.'
    ]
  },
  {
    id: 2,
    titulo: 'Cuidando tu piano acústico',
    resumen: 'Consejos clave sobre humedad, temperatura y afinación para mantener tu piano en perfecto estado.',
    imagen: 'blog/banner.jpg',
    fecha: '2026-08-10',
    slug: 'detalle-2',
    contenido: [
      'Un piano acústico no es solo un instrumento musical; es una obra de arte y una máquina compleja compuesta por miles de piezas de madera, metal y fieltro. Para que mantenga su sonido y funcionamiento impecable durante generaciones, requiere de un cuidado continuo y consciente.',
      '1. Control de Humedad: La madera de tu piano está viva. Los cambios bruscos de humedad son su peor enemigo, ya que pueden hacer que las piezas se expandan o se contraigan, lo que afecta directamente a la afinación, a la mecánica e incluso puede generar grietas en la tabla armónica. Lo ideal es mantener una humedad relativa constante de entre un 40% y un 50% en la habitación.',
      '2. Temperatura Constante: Al igual que con la humedad, la estabilidad térmica es clave. Evita colocar tu piano cerca de ventanas por donde entre la luz solar directa, calefactores, estufas o corrientes de aire acondicionado. Una temperatura ambiente estable alrededor de los 20°C a 22°C es perfecta para preservar la integridad de los materiales y del clavijero.',
      '3. Afinación y Mantenimiento Regular: Incluso si el piano no se toca con frecuencia, la tensión extrema a la que están sometidas las cuerdas (que suma varias toneladas) hará que se desafine de forma natural por el paso del tiempo y los cambios estacionales. Recomendamos llamar a un técnico afinador profesional al menos dos veces al año para asegurar que siempre suene en su máximo esplendor.',
      'Con estos consejos fundamentales, podrás garantizar que tu piano se mantenga en perfectas condiciones y siga ofreciendo su mejor sonido por muchos años más.'
    ]
  },
  {
    id: 3,
    titulo: '5 curiosidades sobre los pianos',
    resumen: 'Datos interesantes que quizás no conocías sobre el rey de los instrumentos musicales.',
    imagen: 'blog/piano.webp',
    fecha: '2026-08-20',
    slug: 'detalle-3',
    contenido: [
      'El piano es conocido como el rey de los instrumentos musicales, y no es para menos. Su amplio registro y su capacidad para tocar melodía y acompañamiento al mismo tiempo lo hacen único. Pero, ¿conoces todos sus secretos?',
      'Miles de piezas: Un piano acústico promedio tiene más de 12.000 piezas individuales, de las cuales 10.000 son móviles. ¡Una verdadera obra de ingeniería!',
      'Tensión extrema: Las cuerdas de un piano de cola están sometidas a una tensión combinada de unas 30 toneladas.',
      'El piano más grande: El piano más grande del mundo fue construido por un joven de 15 años en Nueva Zelanda. Mide más de 5,7 metros de largo.',
      'Su verdadero nombre: Originalmente, Bartolomeo Cristofori lo llamó "gravicembalo col piano e forte", que significa clavecín con (sonido) suave y fuerte.',
      'Material de las teclas: Aunque solían hacerse de marfil, hoy en día las teclas blancas se fabrican con plásticos especiales para proteger a los elefantes.',
      'Esperamos que estas curiosidades te hayan resultado interesantes. ¡Sigue explorando nuestra tienda para encontrar el piano perfecto para ti!'
    ]
  }
]

export function inicializarDatos(): void {
  if (!localStorage.getItem(FORTEPIANO_KEYS.roles)) {
    localStorage.setItem(FORTEPIANO_KEYS.roles, JSON.stringify(ROLES_INICIALES))
  }
  if (!localStorage.getItem(FORTEPIANO_KEYS.categorias)) {
    localStorage.setItem(FORTEPIANO_KEYS.categorias, JSON.stringify(CATEGORIAS_INICIALES))
  }
  if (!localStorage.getItem(FORTEPIANO_KEYS.regiones)) {
    localStorage.setItem(FORTEPIANO_KEYS.regiones, JSON.stringify(REGIONES_INICIALES))
  }
  if (!localStorage.getItem(FORTEPIANO_KEYS.comunas)) {
    localStorage.setItem(FORTEPIANO_KEYS.comunas, JSON.stringify(COMUNAS_INICIALES))
  }
  if (!localStorage.getItem(FORTEPIANO_KEYS.usuarios)) {
    localStorage.setItem(FORTEPIANO_KEYS.usuarios, JSON.stringify(USUARIOS_INICIALES))
  }
  if (!localStorage.getItem(FORTEPIANO_KEYS.productos)) {
    localStorage.setItem(FORTEPIANO_KEYS.productos, JSON.stringify(PRODUCTOS_INICIALES))
  }
  if (!localStorage.getItem(FORTEPIANO_KEYS.blog)) {
    localStorage.setItem(FORTEPIANO_KEYS.blog, JSON.stringify(NOTICIAS_INICIALES))
  }
  if (!localStorage.getItem(FORTEPIANO_KEYS.carrito)) {
    localStorage.setItem(FORTEPIANO_KEYS.carrito, JSON.stringify([]))
  }
  if (!localStorage.getItem(FORTEPIANO_KEYS.contactos)) {
    localStorage.setItem(FORTEPIANO_KEYS.contactos, JSON.stringify([]))
  }
}
