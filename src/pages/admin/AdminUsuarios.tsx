import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Button } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useUsuarios } from '../../hooks/useUsuarios'
import { useTablasMaestras } from '../../hooks/useTablasMaestras'
import { DataTable, Columna } from '../../components/common/DataTable'
import { Usuario } from '../../types'
import { confirmarAccion, alertaExito } from '../../utils/alertas'

export default function AdminUsuarios() {
  const { usuarios, eliminarUsuario } = useUsuarios()
  const { obtenerNombreRol, obtenerNombreRegion, obtenerNombreComuna } = useTablasMaestras()

  const verUsuarioAdmin = (usuario: Usuario) => {
    Swal.fire({
      title: `${usuario.nombre} ${usuario.apellidos}`,
      html: `
        <div class="text-start text-light">
          <p class="mb-1"><strong>RUN:</strong> ${usuario.run}</p>
          <p class="mb-1"><strong>Correo:</strong> ${usuario.correo}</p>
          <p class="mb-1"><strong>Rol:</strong> ${obtenerNombreRol(usuario.rolId)}</p>
          <p class="mb-1"><strong>Región:</strong> ${obtenerNombreRegion(usuario.regionId)}</p>
          <p class="mb-1"><strong>Comuna:</strong> ${obtenerNombreComuna(usuario.comunaId)}</p>
          <p class="mb-1"><strong>Dirección:</strong> ${usuario.direccion}</p>
          <p class="mb-0"><strong>Estado:</strong> ${usuario.estado}</p>
        </div>
      `,
      confirmButtonText: 'Cerrar'
    })
  }

  const handleEliminar = async (run: string) => {
    const confirmacion = await confirmarAccion(
      '¿Eliminar usuario?',
      'Esta acción no se puede deshacer.',
      'Eliminar',
      'Cancelar'
    )

    if (confirmacion.isConfirmed) {
      eliminarUsuario(run)
      alertaExito('Eliminado', 'El usuario fue eliminado correctamente.')
    }
  }

  const columnas: Columna<Usuario>[] = useMemo(
    () => [
      {
        encabezado: 'RUN',
        render: (u) => u.run,
        ordenarPor: (u) => u.run
      },
      {
        encabezado: 'Nombre',
        render: (u) => u.nombre,
        ordenarPor: (u) => u.nombre
      },
      {
        encabezado: 'Apellidos',
        render: (u) => u.apellidos,
        ordenarPor: (u) => u.apellidos
      },
      {
        encabezado: 'Correo',
        render: (u) => u.correo,
        ordenarPor: (u) => u.correo
      },
      {
        encabezado: 'Rol',
        render: (u) => obtenerNombreRol(u.rolId),
        ordenarPor: (u) => obtenerNombreRol(u.rolId)
      },
      {
        encabezado: 'Región',
        render: (u) => obtenerNombreRegion(u.regionId),
        ordenarPor: (u) => obtenerNombreRegion(u.regionId)
      },
      {
        encabezado: 'Estado',
        render: (u) => (
          <Badge bg={u.estado === 'Activo' ? 'success' : 'secondary'}>
            {u.estado}
          </Badge>
        ),
        ordenarPor: (u) => u.estado
      },
      {
        encabezado: 'Acciones',
        className: 'text-nowrap',
        render: (u) => (
          <div className="d-flex gap-1">
            <Button
              size="sm"
              variant="outline-accent"
              onClick={() => verUsuarioAdmin(u)}
              title="Ver detalle"
              aria-label={`Ver usuario ${u.nombre}`}
            >
              <i className="bi bi-eye" />
            </Button>
            <Link
              to={`/admin/usuarios/form?run=${encodeURIComponent(u.run)}`}
              className="btn btn-sm btn-outline-light"
              title="Editar usuario"
              aria-label={`Editar usuario ${u.nombre}`}
            >
              <i className="bi bi-pencil" />
            </Link>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={() => handleEliminar(u.run)}
              title="Eliminar usuario"
              aria-label={`Eliminar usuario ${u.nombre}`}
            >
              <i className="bi bi-trash" />
            </Button>
          </div>
        )
      }
    ],
    [obtenerNombreRol, obtenerNombreRegion, obtenerNombreComuna]
  )

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h1 className="section-title mb-0">Usuarios</h1>
        <Link to="/admin/usuarios/form" className="btn btn-accent">
          <i className="bi bi-plus-lg me-1" />
          Nuevo usuario
        </Link>
      </div>

      <div className="bg-forte-panel rounded p-3 shadow-sm">
        <DataTable<Usuario>
          filas={usuarios}
          columnas={columnas}
          filaKey={(u) => u.run}
          itemsPorPaginaInicial={5}
          criterioBusqueda={(u, termino) => {
            const rol = obtenerNombreRol(u.rolId).toLowerCase()
            const reg = obtenerNombreRegion(u.regionId).toLowerCase()
            return (
              u.run.toLowerCase().includes(termino) ||
              u.nombre.toLowerCase().includes(termino) ||
              u.apellidos.toLowerCase().includes(termino) ||
              u.correo.toLowerCase().includes(termino) ||
              rol.includes(termino) ||
              reg.includes(termino) ||
              u.estado.toLowerCase().includes(termino)
            )
          }}
        />
      </div>
    </div>
  )
}
