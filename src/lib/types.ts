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