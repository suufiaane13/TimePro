import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LogoSpinner } from '@/components/LogoSpinner'
import { AppShell } from '@/components/layout/AppShell'

const SaisiePage = lazy(() => import('@/pages/Saisie'))
const CalendrierPage = lazy(() => import('@/pages/Calendrier'))
const DashboardPage = lazy(() => import('@/pages/Dashboard'))
const ExportPage = lazy(() => import('@/pages/Export'))
const ParametresPage = lazy(() => import('@/pages/Parametres'))

function PageFallback() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-[50svh] items-center justify-center">
      <LogoSpinner size="md" ariaLabel={t('common.loading')} />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route
            index
            element={
              <Suspense fallback={<PageFallback />}>
                <SaisiePage />
              </Suspense>
            }
          />
          <Route
            path="calendrier"
            element={
              <Suspense fallback={<PageFallback />}>
                <CalendrierPage />
              </Suspense>
            }
          />
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<PageFallback />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="export"
            element={
              <Suspense fallback={<PageFallback />}>
                <ExportPage />
              </Suspense>
            }
          />
          <Route
            path="parametres"
            element={
              <Suspense fallback={<PageFallback />}>
                <ParametresPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
