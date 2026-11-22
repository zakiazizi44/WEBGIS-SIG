import { TOTALS, ROWS, getValue, formatNumber } from '../utils/data'

function Icon({ children }) {
  return <span className="stat-icon">{children}</span>
}

const icons = {
  school: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5 12 5l9 5.5v7.5a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-7.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  students: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 3 2 8l10 5 10-5-10-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6 10.5V15c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5M22 8v5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  teacher: (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M8 4h8v6a4 4 0 0 1-8 0V4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 6H5a2 2 0 0 0 2 4h1M16 6h3a2 2 0 0 1-2 4h-1M12 14v4M9 21h6M10 18h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

function StatCard({ icon, label, value, sub, accent = false }) {
  return (
    <div className={`stat-card bento-card${accent ? ' accent' : ''}`}>
      <Icon>{icons[icon]}</Icon>
      <div className="stat-body">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        <span className="stat-sub">{sub}</span>
      </div>
    </div>
  )
}

export default function StatCards({ indicator }) {
  const { sdn, sds, sdns, gurun, gurus, guruns, siswan, siswas, siswans } = TOTALS

  const sorted = [...ROWS].sort(
    (a, b) => getValue({ properties: b }, indicator.id) - getValue({ properties: a }, indicator.id),
  )
  const top = sorted[0]
  const topValue = getValue({ properties: top }, indicator.id)

  return (
    <div className="stat-grid">
      <StatCard
        icon="school"
        label="Total Sekolah Dasar"
        value={formatNumber(sdns)}
        sub={`${formatNumber(sdn)} Negeri · ${formatNumber(sds)} Swasta`}
      />
      <StatCard
        icon="students"
        label="Total Peserta Didik"
        value={formatNumber(siswans)}
        sub={`${formatNumber(siswan)} Negeri · ${formatNumber(siswas)} Swasta`}
      />
      <StatCard
        icon="teacher"
        label="Total Pendidik"
        value={formatNumber(guruns)}
        sub={`${formatNumber(gurun)} Negeri · ${formatNumber(gurus)} Swasta`}
      />
      <StatCard
        icon="trophy"
        label={`Terbanyak · ${indicator.label}`}
        value={top.name}
        sub={`${formatNumber(topValue)} ${indicator.label.toLowerCase()}`}
        accent
      />
    </div>
  )
}
