import type { ReactNode } from 'react'
import { Header } from './Header'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/60 py-4 text-center font-mono text-xs text-text-secondary">
        Datos: NASA / IRSA SPHEREx · JPL SBDB · Procesado por SPHEREx Explorer
      </footer>
    </div>
  )
}