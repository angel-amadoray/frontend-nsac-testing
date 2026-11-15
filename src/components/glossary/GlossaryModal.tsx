
import { useEffect, useMemo, useState } from 'react'
import { Search, X, BookOpen } from 'lucide-react'
import {
  GLOSSARY_PRIORITIES,
  GLOSSARY_TERMS,
  type GlossaryPriority,
} from '@/data/glossary'

interface GlossaryModalProps {
  isOpen: boolean
  onClose: () => void
}

type PriorityFilter = 'all' | GlossaryPriority

export function GlossaryModal({
  isOpen,
  onClose,
}: GlossaryModalProps) {
  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState<PriorityFilter>('all')

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const filteredTerms = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return GLOSSARY_TERMS.filter((item) => {
      const matchesPriority =
        priority === 'all' || item.priority === priority

      const matchesSearch =
        !normalizedSearch ||
        item.term.toLowerCase().includes(normalizedSearch) ||
        item.definition.toLowerCase().includes(normalizedSearch)

      return matchesPriority && matchesSearch
    })
  }, [search, priority])

  const selectedCategory =
    priority === 'all'
      ? 'All categories'
      : GLOSSARY_PRIORITIES.find((item) => item.id === priority)?.label

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="glossary-title"
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden border border-white/15 bg-[#0b0b0b] text-[#f2f0eb] shadow-2xl"
      >
        {/* HEADER */}

        <header className="flex items-start justify-between gap-5 border-b border-white/10 px-5 py-6 sm:px-8 sm:py-7">
          <div className="flex items-start gap-4">
            <BookOpen
              size={22}
              strokeWidth={1.3}
              className="mt-1 shrink-0 text-[#d8c7a1]"
            />

            <div>
              <span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.22em] text-white/40">
                SPHEREx Explorer / Reference 01
              </span>

              <h2
                id="glossary-title"
                className="text-2xl font-medium tracking-tight sm:text-3xl"
              >
                Glossary of Terms
              </h2>

              <p className="mt-2 max-w-lg text-xs leading-relaxed text-white/45">
                A reference to astronomical concepts, scientific
                terminology and infrared observation.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close glossary"
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/15 text-white/50 transition-colors hover:border-[#d8c7a1] hover:text-[#d8c7a1]"
          >
            <X size={17} strokeWidth={1.5} />
          </button>
        </header>

        {/* SEARCH */}

        <div className="border-b border-white/10 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3 border border-white/15 bg-white/[0.025] px-4 py-3 transition-colors focus-within:border-[#d8c7a1]/70">
            <Search
              size={16}
              strokeWidth={1.5}
              className="shrink-0 text-white/35"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search astronomical terms or definitions..."
              aria-label="Search glossary terms"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="text-white/40 transition-colors hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* CONTENT */}

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden sm:flex-row">

          {/* CATEGORY NAVIGATION */}

          <nav
            aria-label="Glossary categories"
            className="shrink-0 border-b border-white/10 bg-white/[0.015] sm:w-56 sm:border-b-0 sm:border-r sm:border-white/10"
          >
            <div className="flex items-center gap-2 overflow-x-auto px-4 py-3 sm:block sm:space-y-1 sm:px-5 sm:py-6">
              <span className="hidden pb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/35 sm:block">
                Categories
              </span>

              <button
                type="button"
                onClick={() => setPriority('all')}
                aria-pressed={priority === 'all'}
                className={`shrink-0 border px-3 py-2.5 text-left text-[10px] transition-colors sm:block sm:w-full ${
                  priority === 'all'
                    ? 'border-[#d8c7a1]/50 bg-[#d8c7a1]/10 text-[#d8c7a1]'
                    : 'border-transparent text-white/45 hover:text-white/80'
                }`}
              >
                All categories
              </button>

              {GLOSSARY_PRIORITIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPriority(item.id)}
                  aria-pressed={priority === item.id}
                  className={`shrink-0 border px-3 py-2.5 text-left text-[10px] transition-colors sm:block sm:w-full ${
                    priority === item.id
                      ? 'border-[#d8c7a1]/50 bg-[#d8c7a1]/10 text-[#d8c7a1]'
                      : 'border-transparent text-white/45 hover:text-white/80'
                  }`}
                >
                  <span className="mr-2 font-mono text-[9px] opacity-50">
                    0{item.id}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden border-t border-white/10 px-5 py-5 sm:block">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-white/30">
                Documented concepts
              </span>

              <span className="mt-2 block text-2xl font-light tabular-nums text-white/75">
                {GLOSSARY_TERMS.length.toString().padStart(2, '0')}
              </span>
            </div>
          </nav>

          {/* TERM LIST */}

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-7">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-[#d8c7a1]">
                  Knowledge reference / 0{priority === 'all' ? 0 : priority}
                </span>

                <h3 className="text-lg font-medium tracking-tight text-white">
                  {search ? 'Search results' : selectedCategory}
                </h3>
              </div>

              <span className="font-mono text-[10px] tabular-nums text-white/40">
                {filteredTerms.length.toString().padStart(2, '0')} TERMS
              </span>
            </div>

            {filteredTerms.length > 0 ? (
              <div className="divide-y divide-white/[0.09]">
                {filteredTerms.map((item, index) => {
                  const category = GLOSSARY_PRIORITIES.find(
                    (entry) => entry.id === item.priority,
                  )

                  return (
                    <article
                      key={item.id}
                      className="group grid gap-3 py-5 first:pt-0 sm:grid-cols-[36px_1fr] sm:gap-4"
                    >
                      <span className="hidden pt-1 font-mono text-[10px] tabular-nums text-white/25 sm:block">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#d8c7a1]">
                            {category?.label}
                          </span>
                        </div>

                        <h4 className="mb-2 text-base font-medium tracking-tight text-white transition-colors group-hover:text-[#e4d7bb]">
                          {item.term}
                        </h4>

                        <p className="max-w-2xl text-xs leading-6 text-white/55">
                          {item.definition}
                        </p>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="flex min-h-56 flex-col items-center justify-center text-center">
                <Search
                  size={23}
                  strokeWidth={1.3}
                  className="mb-4 text-white/25"
                />

                <h4 className="text-sm font-medium text-white/75">
                  No terms found
                </h4>

                <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/40">
                  No concepts match your search. Try another term or
                  select a different category.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setPriority('all')
                  }}
                  className="mt-5 border border-white/15 px-4 py-2.5 font-mono text-[9px] uppercase tracking-wider text-white/55 transition-colors hover:border-[#d8c7a1] hover:text-[#d8c7a1]"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-5 py-4 sm:px-8">
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">
            SPHEREx Explorer / Knowledge Reference
          </span>

          <span className="font-mono text-[9px] tabular-nums text-white/40">
            {filteredTerms.length} OF {GLOSSARY_TERMS.length} CONCEPTS
          </span>
        </footer>
      </section>
    </div>
  )
}
