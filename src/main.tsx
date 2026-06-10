import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppBootstrap } from '@/components/AppBootstrap'
import { ThemeAwareToaster } from '@/components/ThemeAwareToaster'
import '@/utils/i18n'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppBootstrap />
    <ThemeAwareToaster position="top-center" richColors />
  </StrictMode>,
)
