import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AdminProducts from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminProducts />
  </StrictMode>,
)
