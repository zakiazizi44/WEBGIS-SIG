import geojson from '../data/kecamatan.json'

export const FEATURES = geojson.features

export const INDICATORS = [
  { id: 'sdns', label: 'Jumlah SD' },
  { id: 'siswans', label: 'Jumlah Siswa' },
  { id: 'guruns', label: 'Jumlah Guru' },
]

export function getValue(feature, indicatorId) {
  return Number(feature.properties[indicatorId]) || 0
}

export function computeBounds() {
  let minLon = Infinity
  let minLat = Infinity
  let maxLon = -Infinity
  let maxLat = -Infinity
  for (const f of FEATURES) {
    for (const polygon of f.geometry.coordinates) {
      for (const ring of polygon) {
        for (const [lon, lat] of ring) {
          if (lon < minLon) minLon = lon
          if (lon > maxLon) maxLon = lon
          if (lat < minLat) minLat = lat
          if (lat > maxLat) maxLat = lat
        }
      }
    }
  }
  return [
    [minLat, minLon],
    [maxLat, maxLon],
  ]
}

export const BOUNDS = computeBounds()
export const CENTER = [
  (BOUNDS[0][0] + BOUNDS[1][0]) / 2,
  (BOUNDS[0][1] + BOUNDS[1][1]) / 2,
]

export const TOTALS = FEATURES.reduce(
  (acc, f) => {
    const p = f.properties
    acc.sdn += p.sdn
    acc.sds += p.sds
    acc.sdns += p.sdns
    acc.gurun += p.gurun
    acc.gurus += p.gurus
    acc.guruns += p.guruns
    acc.siswan += p.siswan
    acc.siswas += p.siswas
    acc.siswans += p.siswans
    return acc
  },
  {
    sdn: 0, sds: 0, sdns: 0,
    gurun: 0, gurus: 0, guruns: 0,
    siswan: 0, siswas: 0, siswans: 0,
  },
)

export const ROWS = FEATURES.map((f) => {
  const p = f.properties
  return {
    id: p.kecamatan,
    name: p.kecamatan,
    sdn: p.sdn,
    sds: p.sds,
    sdns: p.sdns,
    gurun: p.gurun,
    gurus: p.gurus,
    guruns: p.guruns,
    siswan: p.siswan,
    siswas: p.siswas,
    siswans: p.siswans,
  }
}).sort((a, b) => b.sdns - a.sdns)

export function topBy(key) {
  const sorted = [...ROWS].sort((a, b) => b[key] - a[key])
  return sorted[0]
}

export function formatNumber(n, digits = 0) {
  return Number(n).toLocaleString('id-ID', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  })
}

export const COLOR_SDN = '#0071e3'
export const COLOR_SDS = '#ff9f0a'
