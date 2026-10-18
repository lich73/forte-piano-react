import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './estilos.css'
import App from './App'
import { inicializarDatos } from './data/seed'

// Inicializar base de datos simulada en localStorage antes del primer render
inicializarDatos()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

