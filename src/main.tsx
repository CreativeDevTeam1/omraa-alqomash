import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { startLiveRefresh } from './content/cms'
import './styles/reset.css'
import './styles/fonts.css'
import './styles/tokens.css'
import 'lenis/dist/lenis.css'
import './styles/globals.css'

startLiveRefresh()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
