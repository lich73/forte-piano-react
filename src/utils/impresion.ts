/**
 * Utilidad para imprimir la Boleta Electrónica de forma limpia mediante un iframe oculto.
 * Evita bloqueos de pestañas emergentes, ventanas en blanco y previene que el modal
 * de SweetAlert2 congele los eventos de clic en la página principal.
 */
export function imprimirBoletaHtml(boletaHtml: string, folio: number | string) {
  // 1. Limpiar cualquier overlay residual de SweetAlert
  document.body.classList.remove('swal2-shown', 'swal2-height-auto')
  document.body.style.overflow = ''
  const residualSwal = document.querySelector('.swal2-container')
  if (residualSwal) {
    residualSwal.remove()
  }

  // 2. Reutilizar o crear un iframe oculto
  const iframeId = 'forte-print-frame'
  const existente = document.getElementById(iframeId)
  if (existente) {
    existente.remove()
  }

  const iframe = document.createElement('iframe')
  iframe.id = iframeId
  iframe.setAttribute('style', 'position: fixed; top: -9999px; left: -9999px; width: 0; height: 0; border: none;')
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow?.document
  if (!doc) return

  doc.open()
  doc.write(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Boleta Electrónica N° ${folio} - Forte & Piano</title>
        <style>
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #ffffff;
            color: #1e293b;
          }
          @page {
            size: auto;
            margin: 8mm 12mm;
          }
          #boletaImprimible, #boletaImprimible * {
            color: #1e293b !important;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border-bottom: 1px solid #cbd5e1;
            padding: 6px 4px;
          }
        </style>
      </head>
      <body>
        ${boletaHtml}
      </body>
    </html>
  `)
  doc.close()

  // 3. Ejecutar print tras renderizado
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    } catch (err) {
      console.warn('Error al invocar impresión en iframe:', err)
    } finally {
      // 4. Limpieza total y reactivación de clicks
      setTimeout(() => {
        iframe.remove()
        document.body.classList.remove('swal2-shown', 'swal2-height-auto')
        document.body.style.overflow = ''
      }, 500)
    }
  }, 200)
}
