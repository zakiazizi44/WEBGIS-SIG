import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { ROWS, TOTALS, formatNumber, COLOR_SDN, COLOR_SDS } from '../utils/data'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip)

function palette() {
  return {
    text: '#1d1d1f',
    grid: 'rgba(0,0,0,0.06)',
  }
}

function stackedOptions(valueSuffix = '') {
  const p = palette()
  return {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: p.text,
        bodyColor: p.text,
        borderColor: 'rgba(0,0,0,0.08)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${formatNumber(ctx.raw)} ${valueSuffix}`.trim(),
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { color: p.grid },
        ticks: { color: p.text, precision: 0 },
        border: { display: false },
      },
      y: {
        stacked: true,
        grid: { display: false },
        ticks: { color: p.text },
        border: { display: false },
      },
    },
  }
}

function ChartCard({ title, sub, children }) {
  return (
    <div className="bento-card chart-card">
      <div className="card-head">
        <h3>{title}</h3>
        {sub && <p>{sub}</p>}
      </div>
      <div className="chart-body">{children}</div>
    </div>
  )
}

const sortedRows = [...ROWS]

export function SDChart() {
  const data = useMemo(
    () => ({
      labels: sortedRows.map((r) => r.name),
      datasets: [
        { label: 'SD Negeri', data: sortedRows.map((r) => r.sdn), backgroundColor: COLOR_SDN, borderRadius: 3, barPercentage: 0.8 },
        { label: 'SD Swasta', data: sortedRows.map((r) => r.sds), backgroundColor: COLOR_SDS, borderRadius: 3, barPercentage: 0.8 },
      ],
    }),
    [],
  )
  return (
    <ChartCard title="Jumlah SD per Kecamatan" sub="Perbandingan SD Negeri dan SD Swasta">
      <Bar data={data} options={stackedOptions('SD')} />
    </ChartCard>
  )
}

export function SiswaChart() {
  const data = useMemo(
    () => ({
      labels: sortedRows.map((r) => r.name),
      datasets: [
        { label: 'Siswa Negeri', data: sortedRows.map((r) => r.siswan), backgroundColor: COLOR_SDN, borderRadius: 3, barPercentage: 0.8 },
        { label: 'Siswa Swasta', data: sortedRows.map((r) => r.siswas), backgroundColor: COLOR_SDS, borderRadius: 3, barPercentage: 0.8 },
      ],
    }),
    [],
  )
  return (
    <ChartCard title="Jumlah Siswa per Kecamatan" sub="Peserta didik SD Negeri dan Swasta">
      <Bar data={data} options={stackedOptions('siswa')} />
    </ChartCard>
  )
}

export function GuruChart() {
  const data = useMemo(
    () => ({
      labels: sortedRows.map((r) => r.name),
      datasets: [
        { label: 'Guru Negeri', data: sortedRows.map((r) => r.gurun), backgroundColor: COLOR_SDN, borderRadius: 3, barPercentage: 0.8 },
        { label: 'Guru Swasta', data: sortedRows.map((r) => r.gurus), backgroundColor: COLOR_SDS, borderRadius: 3, barPercentage: 0.8 },
      ],
    }),
    [],
  )
  return (
    <ChartCard title="Jumlah Guru per Kecamatan" sub="Pendidik SD Negeri dan Swasta">
      <Bar data={data} options={stackedOptions('guru')} />
    </ChartCard>
  )
}

export function DoughnutChart() {
  const p = palette()
  const data = useMemo(
    () => ({
      labels: ['SD Negeri', 'SD Swasta'],
      datasets: [
        {
          data: [TOTALS.sdn, TOTALS.sds],
          backgroundColor: [COLOR_SDN, COLOR_SDS],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    }),
    [],
  )
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: p.text,
          bodyColor: p.text,
          borderColor: 'rgba(0,0,0,0.08)',
          borderWidth: 1,
          cornerRadius: 12,
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${formatNumber(ctx.raw)} (${Math.round((ctx.raw / TOTALS.sdns) * 100)}%)`,
          },
        },
      },
    }),
    [p.text],
  )
  const sdnPct = Math.round((TOTALS.sdn / TOTALS.sdns) * 100)
  const sdsPct = Math.round((TOTALS.sds / TOTALS.sdns) * 100)
  return (
    <ChartCard title="Komposisi SD Negeri & Swasta" sub={`Dari total ${formatNumber(TOTALS.sdns)} sekolah dasar`}>
      <div className="doughnut-box">
        <Doughnut data={data} options={options} />
        <div className="doughnut-center">
          <strong>{formatNumber(TOTALS.sdns)}</strong>
          <span>Total SD</span>
        </div>
      </div>
      <div className="doughnut-legend">
        <div className="dl-item">
          <span className="dl-swatch" style={{ background: COLOR_SDN }} />
          <span className="dl-name">SD Negeri</span>
          <span className="dl-meta">{formatNumber(TOTALS.sdn)} · {sdnPct}%</span>
        </div>
        <div className="dl-item">
          <span className="dl-swatch" style={{ background: COLOR_SDS }} />
          <span className="dl-name">SD Swasta</span>
          <span className="dl-meta">{formatNumber(TOTALS.sds)} · {sdsPct}%</span>
        </div>
      </div>
    </ChartCard>
  )
}
