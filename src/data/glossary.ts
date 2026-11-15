
export type GlossaryPriority = 1 | 2 | 3

export interface GlossaryTerm {
  id: string
  term: string
  definition: string
  priority: GlossaryPriority
}

export const GLOSSARY_PRIORITIES = [
  {
    id: 1,
    label: 'Essential Concepts',
    description: 'Fundamental concepts for understanding SPHEREx.',
  },
  {
    id: 2,
    label: 'Data Analysis',
    description: 'Concepts related to astronomical data processing and analysis.',
  },
  {
    id: 3,
    label: 'Astronomical Objects',
    description: 'Types of celestial objects found in the universe.',
  },
] as const

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // PRIORITY 1 — ESSENTIAL CONCEPTS

  {
    id: 'spherex',
    term: 'SPHEREx',
    definition: 'A NASA satellite that observes the sky in many wavelengths to learn what is in the universe.',
    priority: 1,
  },
  {
    id: 'infrared',
    term: 'Infrared',
    definition: 'Light invisible to the human eye that shows cold or dusty things in space.',
    priority: 1,
  },
  {
    id: 'spectral-band',
    term: 'Spectral band',
    definition: 'A specific part of the light spectrum, like a particular color that can be analyzed separately.',
    priority: 1,
  },
  {
    id: 'wavelength',
    term: 'Wavelength',
    definition: 'The distance between two peaks of a light wave; it determines the light’s color or type.',
    priority: 1,
  },
  {
    id: 'spectrum',
    term: 'Spectrum',
    definition: 'An ordered set of colors or wavelengths that shows information about the light.',
    priority: 1,
  },
  {
    id: 'right-ascension',
    term: 'Right ascension (RA)',
    definition: 'A coordinate that indicates “longitude” in the sky, helping to locate stars or objects.',
    priority: 1,
  },
  {
    id: 'declination',
    term: 'Declination (Dec)',
    definition: 'A coordinate that indicates “latitude” in the sky, helping to locate celestial objects.',
    priority: 1,
  },
  {
    id: 'celestial-coordinates',
    term: 'Celestial coordinates',
    definition: 'A reference system used to pinpoint exact positions of objects in the sky.',
    priority: 1,
  },
  {
    id: 'field-of-view',
    term: 'Field of view (FOV)',
    definition: 'The area of the sky visible in a single image or through an instrument.',
    priority: 1,
  },
  {
    id: 'epoch',
    term: 'Epoch / observation date',
    definition: 'The moment when a picture or measurement of the sky is taken.',
    priority: 1,
  },
  {
    id: 'astronomical-image',
    term: 'Astronomical image',
    definition: 'A photo or visualization created to study space objects.',
    priority: 1,
  },
  {
    id: 'pixel',
    term: 'Pixel',
    definition: 'A tiny part or dot of an image containing light information.',
    priority: 1,
  },
  {
    id: 'apparent-motion',
    term: 'Apparent motion',
    definition: 'The visible movement of an object in the sky due to its movement or ours.',
    priority: 1,
  },
  {
    id: 'motion-detection',
    term: 'Motion detection',
    definition: 'The process of noticing that an object moved between images.',
    priority: 1,
  },
  {
    id: 'astronomical-object',
    term: 'Astronomical object',
    definition: 'Anything in space, like stars, planets, or galaxies.',
    priority: 1,
  },

  // PRIORITY 2 — DATA ANALYSIS

  {
    id: 'exposure',
    term: 'Exposure',
    definition: 'The time a telescope gathers light to make an image.',
    priority: 2,
  },
  {
    id: 'signal',
    term: 'Signal',
    definition: 'Useful information received from an object in the sky.',
    priority: 2,
  },
  {
    id: 'noise',
    term: 'Noise',
    definition: 'Unwanted information or interference that makes seeing the signal harder.',
    priority: 2,
  },
  {
    id: 'signal-to-noise-ratio',
    term: 'Signal-to-noise ratio (SNR)',
    definition: 'Comparison between useful information and noise; the higher, the clearer the object.',
    priority: 2,
  },
  {
    id: 'contamination',
    term: 'Contamination',
    definition: 'Interference in images from unwanted light or effects.',
    priority: 2,
  },
  {
    id: 'image-difference',
    term: 'Image difference',
    definition: 'Comparing two images to see what changed.',
    priority: 2,
  },
  {
    id: 'image-subtraction',
    term: 'Image subtraction',
    definition: 'Removing one image from another to highlight differences.',
    priority: 2,
  },
  {
    id: 'image-combination',
    term: 'Image combination',
    definition: 'Merging multiple images to improve quality or show more detail.',
    priority: 2,
  },
  {
    id: 'angular-displacement',
    term: 'Angular displacement',
    definition: 'Change in an object’s position measured in degrees or arcminutes.',
    priority: 2,
  },
  {
    id: 'proper-motion',
    term: 'Proper motion',
    definition: 'The real movement of an object in space as seen from Earth.',
    priority: 2,
  },
  {
    id: 'parallax',
    term: 'Parallax',
    definition: 'Apparent shift in an object’s position when viewed from different angles, used to measure distance.',
    priority: 2,
  },
  {
    id: 'apparent-magnitude',
    term: 'Brightness / apparent magnitude',
    definition: 'How bright an object appears from Earth.',
    priority: 2,
  },
  {
    id: 'variability',
    term: 'Variability',
    definition: 'Changes in an object’s brightness or position over time.',
    priority: 2,
  },
  {
    id: 'light-curve',
    term: 'Light curve',
    definition: 'A graph showing how an object’s light changes over time.',
    priority: 2,
  },
  {
    id: 'photometry',
    term: 'Photometry',
    definition: 'Measuring how much light an object emits or reflects.',
    priority: 2,
  },

  // PRIORITY 3 — ASTRONOMICAL OBJECTS

  {
    id: 'star',
    term: 'Star',
    definition: 'A huge ball of hot gas that shines by itself.',
    priority: 3,
  },
  {
    id: 'variable-star',
    term: 'Variable star',
    definition: 'A star whose brightness changes over time.',
    priority: 3,
  },
  {
    id: 'brown-dwarf',
    term: 'Brown dwarf',
    definition: 'An object smaller than a star that doesn’t have enough energy to shine like one.',
    priority: 3,
  },
  {
    id: 'asteroid',
    term: 'Asteroid',
    definition: 'A large rock orbiting the Sun, usually in the asteroid belt.',
    priority: 3,
  },
  {
    id: 'comet',
    term: 'Comet',
    definition: 'A body made of ice and dust that develops a bright tail when near the Sun.',
    priority: 3,
  },
  {
    id: 'planet',
    term: 'Planet',
    definition: 'A large body orbiting a star that doesn’t make its own light.',
    priority: 3,
  },
  {
    id: 'binary-system',
    term: 'Binary system',
    definition: 'Two stars orbiting around a common center.',
    priority: 3,
  },
  {
    id: 'galaxy',
    term: 'Galaxy',
    definition: 'A giant collection of stars, gas, and dust held together by gravity.',
    priority: 3,
  },
  {
    id: 'quasar',
    term: 'Quasar',
    definition: 'A very bright distant object powered by a supermassive black hole.',
    priority: 3,
  },
  {
    id: 'supernova',
    term: 'Supernova',
    definition: 'A powerful explosion marking the death of a big star.',
    priority: 3,
  },
]
