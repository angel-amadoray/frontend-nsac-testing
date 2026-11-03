import type {
  Hotspot,
  CompositeResponse,
  DifferenceResponse,
  KnownObjectsResponse,
  IdentifyResponse,
  CompositeParams,
  DifferenceParams,
  KnownObjectsParams,
} from './types'

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`
  const res = await fetch(url, {
    headers: { Accept: 'application/json', ...init?.headers },
    ...init,
  })

  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    try {
      const body = await res.json()
      detail = body.detail ?? body.message ?? detail
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, detail)
  }
  return res.json() as Promise<T>
}

function toQuery(params: object): string {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) search.set(k, String(v))
  })
  return search.toString()
}

/** Convierte `/static/cache/...` en una URL absoluta para <img src>. */
export function resolveApiUrl(path: string | null | undefined): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${API_URL}${path}`
}

// ------------- Endpoints -------------

export const getHotspots = () => request<Hotspot[]>('/api/hotspots')

export const getHotspot = (id: string) =>
  request<Hotspot>(`/api/hotspots/${encodeURIComponent(id)}`)

export const getComposite = (p: CompositeParams) =>
  request<CompositeResponse>(`/api/images/composite?${toQuery(p)}`)

export const getDifference = (p: DifferenceParams) =>
  request<DifferenceResponse>(`/api/analytics/difference?${toQuery(p)}`)

export const getKnownObjects = (p: KnownObjectsParams) =>
  request<KnownObjectsResponse>(`/api/analytics/known-objects?${toQuery(p)}`)

export const identify = (
  sectorId: string,
  epoch: string,
  detector: number,
  pixelX: number,
  pixelY: number,
  toleranceArcsec = 15,
) =>
  request<IdentifyResponse>(
    `/api/analytics/identify?${toQuery({
      sector_id: sectorId,
      epoch,
      detector,
      pixel_x: pixelX,
      pixel_y: pixelY,
      tolerance_arcsec: toleranceArcsec,
    })}`,
  )