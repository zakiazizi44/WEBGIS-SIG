import { useMemo, useState } from 'react'
import { ROWS, formatNumber } from '../utils/data'

const COLUMNS = [
  { key: 'name', label: 'Kecamatan', align: 'left' },
  { key: 'sdn', label: 'SD Negeri' },
  { key: 'sds', label: 'SD Swasta' },
  { key: 'sdns', label: 'Total SD' },
  { key: 'siswans', label: 'Siswa' },
  { key: 'guruns', label: 'Guru' },
]

export default function TableView() {
  const [sortKey, setSortKey] = useState('sdns')
  const [sortDir, setSortDir] = useState('desc')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = q ? ROWS.filter((r) => r.name.toLowerCase().includes(q)) : ROWS
    return [...rows].sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      if (typeof va === 'string') return va.localeCompare(vb) * (sortDir === 'asc' ? 1 : -1)
      return (va - vb) * (sortDir === 'asc' ? 1 : -1)
    })
  }, [query, sortKey, sortDir])

  const maxOf = useMemo(() => {
    const map = {}
    for (const c of COLUMNS) {
      if (c.key === 'name') continue
      map[c.key] = Math.max(...ROWS.map((r) => r[c.key]))
    }
    return map
  }, [])

  function toggleSort(key) {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir(key === 'name' ? 'asc' : 'desc')
    }
  }

  return (
    <div className="bento-card table-card">
      <div className="card-head table-head">
        <div>
          <h3>Peringkat Kecamatan</h3>
          <p>Analisis perbandingan data pendidikan antar kecamatan</p>
        </div>
        <input
          type="search"
          className="table-search"
          placeholder="Cari kecamatan…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th className="num">No</th>
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  className={c.align === 'left' ? 'left' : 'num'}
                  onClick={() => toggleSort(c.key)}
                >
                  <span className={`th-sort${sortKey === c.key ? ` ${sortDir}` : ''}`}>
                    {c.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id}>
                <td className="num dim">{i + 1}</td>
                <td className="left strong">{r.name}</td>
                {COLUMNS.slice(1).map((c) => {
                  const isMax = c.key !== 'name' && r[c.key] === maxOf[c.key]
                  return (
                    <td key={c.key} className={`num${isMax ? ' max' : ''}`}>
                      {formatNumber(r[c.key], c.float ? 1 : 0)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
