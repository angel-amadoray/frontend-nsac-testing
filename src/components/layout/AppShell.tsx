import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  BookOpen,
  Cloud,
  ExternalLink,
  Orbit,
  Telescope,
} from "lucide-react";
import logo from "../../assets/Logo.png";

import { useState } from "react";
import { GlossaryModal } from "@/components/glossary/GlossaryModal";

export function AppShell({ children }: { children: ReactNode }) {
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-white/15 bg-[#21212c] px-4 py-5 text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <Link
            to="/"
            aria-label="Ir a la página principal"
            className="flex w-fit items-center gap-3 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <img
              src={logo}
              alt="SPHEREx Explorer"
              className="h-12 w-12 object-contain"
            />
            <span
              className="text-lg font-extrabold leading-tight sm:text-xl"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800 }}
            >
              SPHEREx Explorer
            </span>
          </Link>

          <nav aria-label="Navegación principal" className="ml-auto hidden lg:block">
            <ul className="flex flex-wrap items-center justify-end gap-x-5 gap-y-3 text-sm text-white/80">
              <li>
                <NavLink
                  to="/sector/orion_nebula"
                  className={({ isActive }) =>
                    `transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                      isActive ? "font-semibold text-white underline decoration-2 underline-offset-4" : ""
                    }`
                  }
                >
                  <Telescope className="mr-2 inline-block h-4 w-4 align-[-0.15em]" />
                  Orion Nebula (M42)
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/sector/galactic_center"
                  className={({ isActive }) =>
                    `transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                      isActive ? "font-semibold text-white underline decoration-2 underline-offset-4" : ""
                    }`
                  }
                >
                  <Orbit className="mr-2 inline-block h-4 w-4 align-[-0.15em]" />
                  Galactic Center
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/sector/rho_ophiuchi"
                  className={({ isActive }) =>
                    `transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                      isActive ? "font-semibold text-white underline decoration-2 underline-offset-4" : ""
                    }`
                  }
                >
                  <Cloud className="mr-2 inline-block h-4 w-4 align-[-0.15em]" />
                  Rho Ophiuchi Complex
                </NavLink>
              </li>
            </ul>
          </nav>

          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            className="rounded border border-white/20 p-2 text-white transition-colors hover:border-white/60 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:hidden"
          >
            <span className="sr-only">
              {isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            </span>
            <span className="flex h-5 w-5 flex-col justify-center gap-1.5">
              <span
                className={`block h-px w-5 bg-current transition-transform ${
                  isMobileMenuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-current transition-opacity ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-current transition-transform ${
                  isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        <div
          className={`fixed inset-0 z-50 lg:hidden ${
            isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
          aria-hidden={!isMobileMenuOpen}
        >
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
              isMobileMenuOpen ? "opacity-100" : "opacity-0"
            }`}
          />

          <nav
            id="mobile-navigation"
            aria-label="Navegación principal móvil"
            className={`absolute right-0 top-0 flex h-full w-[min(84vw,22rem)] flex-col border-l border-white/15 bg-[#21212c] px-7 py-8 shadow-2xl transition-transform duration-300 ease-out ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="mb-10 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-white/50">
                Navigation
              </span>
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded p-2 text-2xl leading-none text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                ×
              </button>
            </div>

            <ul className="flex flex-col gap-6 text-base text-white/85">
              <li>
                <NavLink
                  to="/sector/orion_nebula"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                      isActive ? "font-semibold text-white underline decoration-2 underline-offset-4" : ""
                    }`
                  }
                >
                  <Telescope className="mr-2 inline-block h-4 w-4 align-[-0.15em]" />
                  Orion Nebula (M42)
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/sector/galactic_center"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                      isActive ? "font-semibold text-white underline decoration-2 underline-offset-4" : ""
                    }`
                  }
                >
                  <Orbit className="mr-2 inline-block h-4 w-4 align-[-0.15em]" />
                  Galactic Center
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/sector/rho_ophiuchi"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                      isActive ? "font-semibold text-white underline decoration-2 underline-offset-4" : ""
                    }`
                  }
                >
                  <Cloud className="mr-2 inline-block h-4 w-4 align-[-0.15em]" />
                  Rho Ophiuchi Complex
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>

      <footer className="border-t border-white/15 bg-[#21212c] px-4 py-10 text-white sm:px-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@800&display=swap');
        `}</style>

        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-10">
          <a
            href="/"
            aria-label="Ir a la página principal"
            className="flex w-fit items-center gap-4 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <img
              src={logo}
              alt="SPHEREx Explorer"
              className="h-20 w-20 object-contain"
            />
            <span
              className="text-xl font-extrabold leading-tight sm:text-2xl"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800 }}
            >
              SPHEREx Explorer
              <br />
            </span>
          </a>

          <nav aria-label="Enlaces del pie de página" className="w-full md:ml-auto md:w-auto">
            <ul className="flex flex-col gap-4 text-sm text-white/80 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-x-7">
              <li>
                <button
                  type="button"
                  onClick={() => setIsGlossaryOpen(true)}
                  className="text-white/80 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <BookOpen className="mr-2 inline-block h-4 w-4 align-[-0.15em]" />
                  Glossary of Terms
                </button>
              </li>

              <li>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.spaceappschallenge.org/2026/find-a-team/tlon-9/"
                  className="underline decoration-white/40 underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <ExternalLink className="mr-2 inline-block h-4 w-4 align-[-0.15em]" />
                  Team Challenge — Tlön 9
                </a>
              </li>

              <li>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.spaceappschallenge.org/2026/challenges/planet-x-and-spherex/"
                  className="underline decoration-white/40 underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <ExternalLink className="mr-2 inline-block h-4 w-4 align-[-0.15em]" />
                  Space Apps Challenge
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-center text-xs text-white/45">
          © {new Date().getFullYear()} SPHEREx Explorer. All rights reserved.
        </div>
      </footer>
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </div>
  );
}
