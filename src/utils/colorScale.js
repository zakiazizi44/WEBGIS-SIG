const STOPS = [
  [0.0, '#eaf2ff'],
  [0.25, '#c3d9ff'],
  [0.5, '#8ab8ff'],
  [0.75, '#4b8ff5'],
  [1.0, '#0a56d0'],
]

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}

function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map((c) => Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, '0'))
      .join('')
  )
}

export function interpolateColor(t) {
  const clamped = Math.max(0, Math.min(1, t))
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [t0, c0] = STOPS[i]
    const [t1, c1] = STOPS[i + 1]
    if (clamped >= t0 && clamped <= t1) {
      const local = (clamped - t0) / (t1 - t0 || 1)
      const [r0, g0, b0] = hexToRgb(c0)
      const [r1, g1, b1] = hexToRgb(c1)
      return rgbToHex(r0 + (r1 - r0) * local, g0 + (g1 - g0) * local, b0 + (b1 - b0) * local)
    }
  }
  return STOPS[STOPS.length - 1][1]
}

export function quantileBreaks(values, k = 5) {
  const sorted = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b)
  const breaks = []
  for (let i = 1; i <= k; i++) {
    const idx = Math.floor((sorted.length - 1) * (i / k))
    breaks.push(sorted[idx])
  }
  return breaks
}

export function colorForValue(breaks, value) {
  let idx = breaks.findIndex((b) => value <= b)
  if (idx === -1) idx = breaks.length - 1
  const t = breaks.length > 1 ? idx / (breaks.length - 1) : 0
  return interpolateColor(t)
}
