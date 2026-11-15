import { useState } from "react";
import { ArrowUpRight, CalendarDays, Crosshair } from "lucide-react";
import { Link } from "react-router-dom";
import { GlossaryText } from "@/components/glossary/GlossaryText";

const sectors = [
  {
    id: "orion_nebula",
    name: "Orion Nebula (M42)",
    description: "Massive star-forming region.",
    ra: "05:37:43.2",
    dec: "−06° 54′ 36″",
    epochs: ["2025-09", "2025-09b", "2026-06", "2026-06b", "2026-06c"],
    image: "/images/orion.jpg",
  },
  {
    id: "galactic_center",
    name: "Galactic Center",
    description: "The densest region of the Milky Way, located in Sagittarius.",
    ra: "17:42:28.2",
    dec: "−29° 09′ 04″",
    epochs: ["2025-09", "2026-03"],
    image: "/images/galactic-center.png",
  },
  {
    id: "rho_ophiuchi",
    name: "Rho Ophiuchi Cloud Complex",
    description:
      "A nearby star-forming region (140 pc) containing molecular clouds and abundant infrared sources.",
    ra: "16:28:04.8",
    dec: "−24° 32′ 24″",
    epochs: [],
    image: "/images/rho-ophiuchi.png",
  },
] as const;

export function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="home-landing home-landing--stacked">
      <main className="home-layout home-layout--stacked">
        <section className="home-copy" aria-labelledby="home-title">
          <span className="home-eyebrow">NASA SPHEREx · ORBITAL MISSION</span>

          <h1 id="home-title">EXPLORE THE UNIVERSE WITH SPHEREx</h1>

          <div className="home-description">
            <p>
              <GlossaryText>
                Explore images captured by NASA's SPHEREx space telescope. The
                SPHEREx mission has been mapping the entire sky every six months
                across 102 near-infrared wavelength bands, collecting images of
                more than one billion objects.
              </GlossaryText>
            </p>

            <p>
              <GlossaryText>
                Comets, asteroids, stars, brown dwarfs, and even new planets can
                be revealed by comparing their positions across different
                images. The satellite revisits the same region of the sky every
                six months, allowing you to measure and compare changes in the
                celestial objects captured in these images. Enjoy exploring!
              </GlossaryText>
            </p>
          </div>
        </section>

        <section
          id="sectors"
          className="stack-carousel"
          aria-label="Astronomical sectors"
        >
          <div className="stack-carousel__heading">
            <span />
            SELECT A SECTOR
            <span />
          </div>

          <div className="stack-carousel__list">
            {sectors.map((sector, index) => {
              const relativePosition =
                (index - activeIndex + sectors.length) % sectors.length;

              const position =
                relativePosition === 0
                  ? "middle"
                  : relativePosition === 1
                    ? "top"
                    : "bottom";

              const cardContent = (
                <>
                  <div className="stack-card__image" aria-hidden="true">
                    <img src={sector.image} alt="" draggable={false} />
                  </div>

                  {position === "middle" && (
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
                          {sector.epochs.length} observation epochs
                          {sector.epochs.length > 0
                            ? ` · ${sector.epochs.join(" · ")}`
                            : ""}
                        </span>

                        <span className="stack-card__open">
                          <ArrowUpRight />
                        </span>
                      </div>
                    </div>
                  )}
                </>
              );

              const className = `stack-card stack-card--${position}`;

              return position === "middle" ? (
                <Link
                  key={sector.id}
                  to={`/sector/${sector.id}`}
                  className={className}
                  aria-label={`Explore ${sector.name}`}
                >
                  {cardContent}
                </Link>
              ) : (
                <button
                  key={sector.id}
                  type="button"
                  className={className}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Select ${sector.name}`}
                  title={`Show ${sector.name}`}
                >
                  {cardContent}
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
