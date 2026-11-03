import { ArrowLeft, Telescope } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  return (
    <header className="top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {!isHome && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2.5">
            <Telescope className="h-6 w-6 text-accent-cyan" />
            <span className="font-display text-lg font-semibold tracking-tight">
              SPHEREx <span className="text-text-secondary font-normal">Explorer</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden font-mono text-xs text-text-secondary md:inline">
            NASA · SPHEREx · 102 bandas
          </span>
        </div>
      </div>
    </header>
  )
}