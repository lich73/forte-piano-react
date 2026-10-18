import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { AdminOffcanvas } from './AdminOffcanvas'
import { useAuth } from '../../context/AuthContext'

export function AdminLayout() {
  const [showOffcanvas, setShowOffcanvas] = useState(false)
  const { sesion } = useAuth()
  const rolId = sesion?.rolId ?? 1

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-3 col-xl-2 d-none d-lg-block px-0">
          <AdminSidebar rolId={rolId} />
        </div>
        <div className="col-12 d-lg-none px-3 pt-3">
          <button
            className="btn btn-outline-light"
            type="button"
            onClick={() => setShowOffcanvas(true)}
          >
            <i className="bi bi-list me-1"></i> Menú administrativo
          </button>
        </div>
        <div className="col-lg-9 col-xl-10 p-4">
          <Outlet />
        </div>
      </div>
      <AdminOffcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        rolId={rolId}
      />
    </div>
  )
}

export default AdminLayout
