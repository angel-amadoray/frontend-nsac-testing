
import { useState } from 'react'
import { ArrowUpRight, CalendarDays, Crosshair } from 'lucide-react'
import { Link } from 'react-router-dom'

const sectors = [
  {
    id: 'orion_nebula',
    name: 'Nebulosa de Orión (M42)',
    description: 'Región de formación estelar masiva.',
    ra: '05:37:43.2',
    dec: '−06° 54′ 36″',
    epochs: ['2025-09', '2025-09b'],
    image: '/images/orion.jpg',
  },
  {
    id: 'galactic_center',
    name: 'Centro Galáctico',
    description: 'Región más densa de la Vía Láctea en Sagitario.',
    ra: '17:42:28.2',
    dec: '−29° 09′ 04″',
    epochs: ['2025-09', '2026-03'],
    image: '/images/galactic-center.png',
  },
  {
    id: 'rho_ophiuchi',
    name: 'Complejo Rho Ophiuchi',
    description:
      'Región de formación estelar cercana (140 pc) con nubes moleculares y abundantes fuentes infrarrojas.',
    ra: '16:28:04.8',
    dec: '−24° 32′ 24″',
    epochs: [],
    image: '/images/rho-ophiuchi.png',
  },
] as const

export function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="home-landing home-landing--stacked">
      <main className="home-layout home-layout--stacked">

        <section className="home-copy" aria-labelledby="home-title">
          <span className="home-eyebrow">
            NASA SPHEREx · Misión en órbita
          </span>

          <h1 id="home-title">
            EXPLORA EL CIELO A TRAVÉS DE SPHEREx
          </h1>

          <div className="home-description">
            <p>
              Navega por las imágenes tomadas por medio del satélite de la
              misión de NASA Spherex. La misión SPHEREx de la NASA ha estado
              cartografiando todo el cielo cada seis meses en 102 bandas de
              luz infrarroja cercana, obteniendo imágenes de más de mil
              millones de objetos.
            </p>

            <p>
              Cometas, asteroides, estrellas, enanas marrones e incluso
              nuevos planetas se revelan al cambiar de posición entre
              imágenes. El satélite responsable de obtener estas imágenes
              pasa por un mismo sitio cada seis meses, donde puedes medir y
              comparar el cambio de todos los astros capturados en dichas
              imágenes. ¡Diviértete explorando!
            </p>
          </div>
        </section>

        <section
          id="sectores"
          className="stack-carousel"
          aria-label="Sectores astronómicos"
        >
          <div className="stack-carousel__heading">
            <span />
            ELIGE UN SECTOR
            <span />
          </div>

          <div className="stack-carousel__list">
            {sectors.map((sector, index) => {
              const relativePosition =
                (index - activeIndex + sectors.length) % sectors.length

              const position =
                relativePosition === 0
                  ? 'middle'
                  : relativePosition === 1
                    ? 'top'
                    : 'bottom'

              const cardContent = (
                <>
                  <div className="stack-card__image" aria-hidden="true">
                    <img
                      src={sector.image}
                      alt=""
                      draggable={false}
                    />
                  </div>

                  {position === 'middle' && (
                    <div className="stack-card__content">
                      <div className="stack-card__eyebrow">
                        SECTOR 0{index + 1}
                      </div>

                      <h2>{sector.name}</h2>

                      <p>{sector.description}</p>

                      <div className="stack-card__coordinates">
                        <span>
                          <Crosshair />
                          RA {sector.ra}
                        </span>

                        <span>
                          <Crosshair />
                          Dec {sector.dec}
                        </span>
                      </div>

                      <div className="stack-card__footer">
                        <span>
                          <CalendarDays />
                          {sector.epochs.length} épocas
                          {sector.epochs.length > 0
                            ? ` · ${sector.epochs.join(' · ')}`
                            : ''}
                        </span>

                        <span className="stack-card__open">
                          <ArrowUpRight />
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )

              const className = `stack-card stack-card--${position}`

              return position === 'middle' ? (
                <Link
                  key={sector.id}
                  to={`/sector/${sector.id}`}
                  className={className}
                  aria-label={`Explorar ${sector.name}`}
                >
                  {cardContent}
                </Link>
              ) : (
                <button
                  key={sector.id}
                  type="button"
                  className={className}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Seleccionar ${sector.name}`}
                  title={`Mostrar ${sector.name}`}
                >
                  {cardContent}
                </button>
              )
            })}
          </div>
        </section>

      </main>
    </div>
  )
}
