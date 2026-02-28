import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { CustomProvider } from 'rsuite'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomProvider theme="dark">
      <App />
    </CustomProvider>
  </StrictMode>
)
