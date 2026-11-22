import { useState } from 'react'
import SegmentedControl from './components/SegmentedControl'
import MapView from './components/MapView'
import StatCards from './components/StatCards'
import {
  SDChart,
  SiswaChart,
  GuruChart,
  DoughnutChart,
} from './components/Charts'
import TableView from './components/TableView'
import { INDICATORS, TOTALS, formatNumber } from './utils/data'

export default function App() {
  const [indicatorId, setIndicatorId] = useState('sdns')
  const indicator = INDICATORS.find((i) => i.id === indicatorId)

  return (
    <div className="app" id="top">
      <main className="container">
        <section className="hero">
          <p className="hero-eyebrow">WebGIS · Tahun Ajaran 2025/2026</p>
          <h1>
            Persebaran Sekolah Dasar
            <span>di Kota Semarang</span>
          </h1>
          <div className="hero-chips">
            <span className="chip">
              <b>{formatNumber(TOTALS.sdns)}</b> Sekolah
            </span>
            <span className="chip">
              <b>{formatNumber(TOTALS.siswans)}</b> Siswa
            </span>
            <span className="chip">
              <b>{formatNumber(TOTALS.guruns)}</b> Guru
            </span>
            <span className="chip">
              <b>16</b> Kecamatan
            </span>
          </div>
        </section>

        <StatCards indicator={indicator} />

        <section className="bento">
          <div className="bento-item map-slot">
            <div className="bento-card map-card">
              <div className="card-head map-head">
                <div>
                  <h3>Peta Persebaran</h3>
                  <p>Klik kecamatan pada peta untuk melihat detail data</p>
                </div>
              </div>
              <div className="map-controls">
                <SegmentedControl
                  options={INDICATORS}
                  value={indicatorId}
                  onChange={setIndicatorId}
                />
              </div>
              <MapView indicatorId={indicatorId} />
            </div>
          </div>

          <div className="bento-item">
            <DoughnutChart />
          </div>

          <div className="bento-item">
            <SDChart />
          </div>

          <div className="bento-item">
            <SiswaChart />
          </div>

          <div className="bento-item">
            <GuruChart />
          </div>

          <div className="bento-item table-slot">
            <TableView />
          </div>
        </section>

        <footer className="footer">
          <p>
            Sumber data: BPS Kota Semarang, 2025 · Batas administrasi: OpenStreetMap contributors
          </p>
          <p>Sistem Informasi Geografis Persebaran Sekolah Dasar Kota Semarang</p>
        </footer>
      </main>
    </div>
  )
}
