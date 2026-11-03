import { Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { HomePage } from '@/pages/HomePage'
import { SectorPage } from '@/pages/SectorPage'

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sector/:id" element={<SectorPage />} />
        <Route
          path="*"
          element={
            <div className="mx-auto max-w-7xl px-6 py-24 text-center">
              <h1 className="font-display text-6xl font-bold text-accent-cyan">404</h1>
              <p className="mt-4 text-text-secondary">Página no encontrada</p>
            </div>
          }
        />
      </Routes>
    </AppShell>
  )
}