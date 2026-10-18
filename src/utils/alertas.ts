import Swal, { SweetAlertResult } from 'sweetalert2'

export function alertaExito(titulo: string, texto?: string): Promise<SweetAlertResult> {
  return Swal.fire({
    title: titulo,
    text: texto,
    icon: 'success',
    confirmButtonText: 'Aceptar'
  })
}

export function alertaError(titulo: string, texto?: string): Promise<SweetAlertResult> {
  return Swal.fire({
    title: titulo,
    text: texto,
    icon: 'error',
    confirmButtonText: 'Entendido'
  })
}

export function alertaAdvertencia(titulo: string, texto?: string, confirmText = 'Aceptar'): Promise<SweetAlertResult> {
  return Swal.fire({
    title: titulo,
    text: texto,
    icon: 'warning',
    confirmButtonText: confirmText
  })
}

export function confirmarAccion(
  titulo: string,
  texto: string,
  confirmButtonText = 'Confirmar',
  cancelButtonText = 'Cancelar'
): Promise<SweetAlertResult> {
  return Swal.fire({
    title: titulo,
    text: texto,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText
  })
}

export function confirmarEliminar(
  titulo = '¿Eliminar producto?',
  texto = 'Se quitará del carrito de compras.'
): Promise<SweetAlertResult> {
  return confirmarAccion(titulo, texto, 'Eliminar', 'Cancelar')
}

export default Swal

