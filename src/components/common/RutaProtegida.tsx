import { useEffect, useRef } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Swal from '../../utils/alertas'

interface RutaProtegidaProps {
  rolesPermitidos: number[]
}

export function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const { sesion } = useAuth()
  const alertaMostrada = useRef(false)

  const autorizado = sesion !== null && rolesPermitidos.includes(sesion.rolId)

  useEffect(() => {
    if (!autorizado && !alertaMostrada.current) {
      alertaMostrada.current = true
      Swal.fire({
        title: 'Acceso restringido',
        text: 'Debes iniciar sesion con una cuenta autorizada para ver esta pagina.',
        icon: 'warning',
        confirmButtonText: 'Ir a Iniciar sesion'
      })
    }
  }, [autorizado])

  if (!autorizado) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default RutaProtegida
