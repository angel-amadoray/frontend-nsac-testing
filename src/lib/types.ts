export interface Hotspot {
  id: string
  name: string
  description: string
  ra: number
  dec: number
  size_deg: number
  epochs: string[]
  thumbnail_url: string | null
}

export interface CompositeResponse {
  url: string
  cached: boolean
  parameters: Record<string, unknown>
}

export interface DifferenceResponse {
  url: string
  cached: boolean
  parameters: Record<string, unknown>
  threshold: number
  n_pixels_above: number
  n_pixels_total: number
  metadata: Record<string, unknown>
}

export interface KnownObject {
  name: string
  ra: string | null
  dec: string | null
  vmag: string | null
  ra_offset_arcsec: string | null
  dec_offset_arcsec: string | null
  total_offset_arcsec: string | null
  rate_arcsec_min: string | null
  ra_deg: number | null
  dec_deg: number | null
  pixel_x: number | null
  pixel_y: number | null
  in_frame: boolean | null
}

export interface KnownObjectsResponse {
  sector_id: string
  epoch: string
  ra_center_deg: number
  dec_center_deg: number
  obs_time_iso: string
  two_pass: boolean
  mag_required: boolean
  mode: string
  n_objects_raw: number
  n_objects_after_offset: number
  n_objects_after_vmag: number
  n_objects: number
  filtered_out_offset: number
  filtered_out_vmag: number
  truncated: number
  max_offset_arcsec_allowed: number | null
  max_vmag: number | null
  max_objects: number | null
  n_first_pass: number
  n_second_pass: number | null
  objects: KnownObject[]
  cached: boolean
}

export interface IdentifyResponse {
  sector_id: string
  epoch: string
  detector: number
  pixel_x: number
  pixel_y: number
  ra_deg: number
  dec_deg: number
  tolerance_arcsec: number
  n_known: number
  known_objects: KnownObject[]
  is_known: boolean
  is_candidate: boolean
  spherex_profile: SpherexProfile | null
  cached: boolean
}

// Params para endpoints (se usan en bloques 2-4)
export interface CompositeParams {
  sector_id: string
  epoch: string
  detector?: number
  stretch_scale?: number
  p_low?: number
  p_high?: number
  quality?: number
  downsample?: number
  mode?: 'per_row' | 'global'
  fill_masked?: boolean
}

export interface DifferenceParams {
  sector_id: string
  epoch_from: string
  epoch_to: string
  detector?: number
  background_mode?: 'row' | '2d' | 'none'
  threshold_method?: 'percentile' | 'sigma' | 'absolute'
  threshold_percentile?: number
  style?: 'signed' | 'absolute'
  quality?: number
}

export interface KnownObjectsParams {
  sector_id: string
  epoch: string
  detector?: number
  radius_deg?: number
  max_vmag?: number
  max_objects?: number
  include_pixels?: boolean
}

// ---------- Análisis espectral ----------
export type Classification = 'STAR' | 'ASTEROID' | 'UNKNOWN'
export type Model3D = 'rocky' | 'star' | 'unknown'

export interface VisualHints {
  base_color_hex: string
  roughness: number
  metalness: number
  emissive_intensity: number
  scale_hint: 'small' | 'medium' | 'large'
  suggested_3d_model: Model3D
}

export type CandidateClass = 'STAR_LIKE' | 'ROCKY_LIKE' | 'UNKNOWN'

export interface SpherexProfile {
  candidate_class: 'STAR_LIKE' | 'ROCKY_LIKE' | 'UNKNOWN'
  confidence: number
  reasons: string[]
  color_ratio: number | null
  color_ratio_error: number | null
  color_index: number | null
  f_short: number | null
  f_long: number | null
  wavelength_range_um: number[]
  wavelength_range_nm: number
  n_spectral_points: number
  reliable: boolean
  total_flux: number | null
  flux_error: number | null
  snr: number | null
  valid_fraction_aperture: number
  valid_fraction_annulus: number
  cutout_edge: boolean
  visual_hints: VisualHints
}

export interface SpectrumResponse {
  sector_id: string
  epoch: string
  detector: number
  pixel_x: number
  pixel_y: number
  wavelengths_um: number[]
  flux_per_row: number[]
  profile: SpherexProfile
}

export interface AvailableDetectorsResponse {
  sector_id: string
  epoch: string
  detectors: number[]
}

export interface DetectorSample {
  detector: number
  available: boolean
  pixel_x: number | null
  pixel_y: number | null
  flux: number | null
  flux_err: number | null
  snr: number | null
  valid_fraction_aperture: number
  wavelength_center_um: number
  wavelength_range_um: number[]
}

export type PairClassType =
  | 'ABSORPTION'
  | 'EMISSION'
  | 'CONTINUUM'
  | 'NO_SOURCE'
  | 'MASKED'
  | 'UNDETERMINED'

export interface PairClassification {
  classification: PairClassType
  confidence: number
  diagnostic_band: string | null
  reason: string
}

export interface PairSpectrumResponse {
  sector_id: string
  epoch: string
  ra_deg: number
  dec_deg: number
  pair: string | null
  short: DetectorSample | null
  long: DetectorSample | null
  ratio: number | null
  ratio_error: number | null
  classification: PairClassification
  cached: boolean
}

export interface SuggestedTarget {
  ra_deg: number
  dec_deg: number
  flux_short: number
  flux_long: number
  snr_short: number
  snr_long: number
  pixel_short: [number, number]
  pixel_long: [number, number]
}

export interface SuggestTargetResponse {
  sector_id: string
  epoch: string
  pair: string
  target: SuggestedTarget | null
  candidates_examined: number
  reason: string
}

export interface BrightPixelItem {
  rank: number
  ra_deg: number
  dec_deg: number
  flux_short: number
  flux_long: number
  snr_short: number
  snr_long: number
  ratio: number
  pixel_short_x: number
  pixel_short_y: number
  pixel_long_x: number
  pixel_long_y: number
}

export interface BrightestValidResponse {
  sector_id: string
  epoch: string
  pair: string
  n_candidates_scanned: number
  n_valid: number
  pixels: BrightPixelItem[]
}