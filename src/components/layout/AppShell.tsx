import type { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { Header } from "./Header";
import logo from "../../assets/Logo.png";

import { useState } from "react";
import { GlossaryModal } from "@/components/glossary/GlossaryModal";

export function AppShell({ children }: { children: ReactNode }) {
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const isHome = useLocation().pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      {!isHome && <Header />}
      <main className="flex-1">{children}</main>

      <footer className="border-t border-white/15 bg-[#03021d] px-6 py-10 text-white sm:px-10">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@800&display=swap');
        `}</style>

        <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-center md:justify-between">
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

          <nav aria-label="Enlaces del pie de página">
            <ul className="flex flex-wrap gap-x-7 gap-y-4 text-sm text-white/80">
              <li>
                <button
                  type="button"
                  onClick={() => setIsGlossaryOpen(true)}
                  className="text-white/80 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Glossary of Terms
                </button>
              </li>

              <li>
                <Link
                  to="/sector/orion_nebula"
                  className="text-white/80 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Orion Nebula (M42)
                </Link>
              </li>

              <li>
                <Link
                  to="/sector/galactic_center"
                  className="text-white/80 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Galactic Center
                </Link>
              </li>

              <li>
                <Link
                  to="/sector/rho_ophiuchi"
                  className="text-white/80 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Rho Ophiuchi Complex
                </Link>
              </li>

              <li>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.spaceappschallenge.org/2026/challenges/planet-x-and-spherex/"
                  className="underline decoration-white/40 underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Space Apps Challenge
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </div>
  );
}
