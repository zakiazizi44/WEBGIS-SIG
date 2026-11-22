import { interpolateColor } from '../utils/colorScale'

export default function Legend({ indicator, breaks, format }) {
  return (
    <div className="legend">
      <div className="legend-title">{indicator.label}</div>
      <div className="legend-items">
        {breaks.map((b, i) => {
          const t = breaks.length > 1 ? i / (breaks.length - 1) : 0
          const range =
            i === 0
              ? `≤ ${format(b)}`
              : i === breaks.length - 1
                ? `> ${format(breaks[i - 1])}`
                : `${format(breaks[i - 1])} – ${format(b)}`
          return (
            <div className="legend-item" key={i}>
              <span className="legend-swatch" style={{ background: interpolateColor(t) }} />
              <span className="legend-range">{range}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
