export interface Producto {
  codigo: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
  stockCritico: number | null
  categoriaId: number
  imagen: string
  estado: 'Activo' | 'Inactivo'
}

export interface Usuario {
  run: string
  nombre: string
  apellidos: string
  correo: string
  password: string
  fechaNacimiento: string
  rolId: number
  regionId: number
  comunaId: number
  direccion: string
  estado: 'Activo' | 'Inactivo'
}

export interface Sesion {
  run: string
  nombre: string
  apellidos: string
  correo: string
  rolId: number
}

export interface ItemCarrito {
  codigo: string
  cantidad: number
}

export interface Categoria {
  id: number
  nombre: string
}

export interface Region {
  id: number
  nombre: string
}

export interface Comuna {
  id: number
  regionId: number
  nombre: string
}

export interface Rol {
  id: number
  nombre: string
}

export interface Noticia {
  id: number
  titulo: string
  resumen: string
  imagen: string
  fecha: string
  slug: string
  contenido?: string[]
}

export interface Mensaje {
  nombre: string
  correo: string
  comentario: string
  fecha: string
}
