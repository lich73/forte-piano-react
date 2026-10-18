import React, { act } from 'react'
import { createRoot, Root } from 'react-dom/client'
import Contacto from '../../pages/Contacto'
import { FORTEPIANO_KEYS } from '../../storage/claves'
import { textoRequerido } from '../../utils/validaciones'
import Swal from 'sweetalert2'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('Integrante 3 - Test 6: Validación de Formulario de Contacto', () => {
  let container: HTMLDivElement
  let root: Root

  const cambiarValorInput = (elemento: HTMLInputElement | HTMLTextAreaElement, valor: string) => {
    const proto =
      elemento instanceof HTMLTextAreaElement
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype
    const descriptor = Object.getOwnPropertyDescriptor(proto, 'value')
    if (descriptor && descriptor.set) {
      descriptor.set.call(elemento, valor)
    } else {
      elemento.value = valor
    }
    elemento.dispatchEvent(new Event('input', { bubbles: true }))
    elemento.dispatchEvent(new Event('change', { bubbles: true }))
  }

  beforeEach(() => {
    localStorage.clear()
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any))

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => {
      root.unmount()
    })
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
    localStorage.clear()
  })

  it('1. El formulario debe rechazar el envío si el comentario está vacío o supera los 500 caracteres permitidos', async () => {
    // Verificación unitaria directa de la regla de comentario
    expect(textoRequerido('', 500)).toBeFalse()
    expect(textoRequerido('   ', 500)).toBeFalse()
    expect(textoRequerido('Comentario válido dentro del límite', 500)).toBeTrue()
    expect(textoRequerido('a'.repeat(501), 500)).toBeFalse()

    // Renderizado del componente Contacto
    await act(async () => {
      root.render(React.createElement(Contacto))
    })

    const inputNombre = container.querySelector('#nombreContacto') as HTMLInputElement
    const inputCorreo = container.querySelector('#correoContacto') as HTMLInputElement
    const textareaComentario = container.querySelector('#comentarioContacto') as HTMLTextAreaElement
    const form = container.querySelector('form') as HTMLFormElement

    expect(inputNombre).not.toBeNull()
    expect(inputCorreo).not.toBeNull()
    expect(textareaComentario).not.toBeNull()

    // Caso A: Comentario vacío
    await act(async () => {
      cambiarValorInput(inputNombre, 'Juan Pérez')
      cambiarValorInput(inputCorreo, 'juan.perez@duoc.cl')
      cambiarValorInput(textareaComentario, '')
    })

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    // Debe mostrar error y NO guardar en localStorage
    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'error',
        title: 'Revisa el formulario'
      })
    )
    expect(localStorage.getItem(FORTEPIANO_KEYS.contactos)).toBeNull()
    expect(textareaComentario.classList.contains('is-invalid')).toBeTrue()

    // Caso B: Comentario supera los 500 caracteres
    const comentarioLargo = 'Este es un comentario demasiado largo para la prueba. '.repeat(15) // > 500 chars
    expect(comentarioLargo.length).toBeGreaterThan(500)

    ;(Swal.fire as jasmine.Spy).calls.reset()

    await act(async () => {
      cambiarValorInput(textareaComentario, comentarioLargo)
    })

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'error',
        title: 'Revisa el formulario'
      })
    )
    expect(localStorage.getItem(FORTEPIANO_KEYS.contactos)).toBeNull()
    expect(textareaComentario.classList.contains('is-invalid')).toBeTrue()
  })

  it('2. Un envío válido debe registrar el mensaje en la colección fortepiano_contactos de localStorage con la fecha actual', async () => {
    await act(async () => {
      root.render(React.createElement(Contacto))
    })

    const inputNombre = container.querySelector('#nombreContacto') as HTMLInputElement
    const inputCorreo = container.querySelector('#correoContacto') as HTMLInputElement
    const textareaComentario = container.querySelector('#comentarioContacto') as HTMLTextAreaElement
    const form = container.querySelector('form') as HTMLFormElement

    const mensajeEsperado = {
      nombre: 'María Valenzuela',
      correo: 'm.valenzuela@profesor.duoc.cl',
      comentario: 'Hola, quisiera cotizar la afinación y traslado de un piano vertical.'
    }

    await act(async () => {
      cambiarValorInput(inputNombre, mensajeEsperado.nombre)
      cambiarValorInput(inputCorreo, mensajeEsperado.correo)
      cambiarValorInput(textareaComentario, mensajeEsperado.comentario)
    })

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    // Debe lanzar alerta de éxito
    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'success',
        title: 'Mensaje enviado'
      })
    )

    // Debe registrar el mensaje en la colección de contactos de localStorage
    const datosGuardados = localStorage.getItem(FORTEPIANO_KEYS.contactos)
    expect(datosGuardados).not.toBeNull()

    const listaContactos = JSON.parse(datosGuardados || '[]')
    expect(listaContactos.length).toBe(1)

    const fechaHoy = new Date().toISOString().slice(0, 10)
    expect(listaContactos[0].nombre).toBe(mensajeEsperado.nombre)
    expect(listaContactos[0].correo).toBe(mensajeEsperado.correo)
    expect(listaContactos[0].comentario).toBe(mensajeEsperado.comentario)
    expect(listaContactos[0].fecha).toBe(fechaHoy)

    // El formulario debe haberse limpiado
    expect(inputNombre.value).toBe('')
    expect(inputCorreo.value).toBe('')
    expect(textareaComentario.value).toBe('')
  })
})
