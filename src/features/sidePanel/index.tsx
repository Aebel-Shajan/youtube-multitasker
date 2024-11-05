import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SidePanel from './SidePanel/SidePanel'
import './index.css'


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SidePanel />
  </StrictMode>,
)
