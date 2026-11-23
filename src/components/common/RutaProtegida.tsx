import { useEffect, useRef } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import Swal from '../../utils/alertas'

interface RutaProtegidaProps {
  rolesPermitidos: number[]
}

export function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const { sesion, cargando } = useAuth()
  const alertaMostrada = useRef(false)

  const autorizado = sesion !== null && rolesPermitidos.includes(sesion.rolId)

  useEffect(() => {
    if (cargando) return
    if (!autorizado && !alertaMostrada.current) {
      alertaMostrada.current = true
      Swal.fire({
        title: 'Acceso restringido',
        text: 'Debes iniciar sesion con una cuenta autorizada para ver esta pagina.',
        icon: 'warning',
        confirmButtonText: 'Ir a Iniciar sesion'
      })
    }
  }, [autorizado, cargando])

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <Spinner animation="border" variant="accent" role="status">
          <span className="visually-hidden">Validando sesión...</span>
        </Spinner>
      </div>
    )
  }

  if (!autorizado) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default RutaProtegida
