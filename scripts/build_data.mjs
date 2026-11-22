import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const RAW_DIR = resolve(root, 'data', 'raw')
const OUT_DIR = resolve(root, 'src', 'data')
const GEOJSON_SRC = resolve(RAW_DIR, 'sdn_kota_semarang.geojson')
const CSV_SRC = resolve(RAW_DIR, 'bps_kota_semarang_2025.csv')
const GEOJSON_OUT = resolve(OUT_DIR, 'kecamatan.json')

function normalize(name) {
  return String(name).replace(/\s+/g, '').toLowerCase()
}

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').trim().split(/\r?\n/)
  const headers = lines[0].split(',').map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const cells = line.split(',').map((c) => c.trim())
    const row = {}
    headers.forEach((h, i) => {
      row[h] = cells[i]
    })
    return row
  })
}

const geojson = JSON.parse(readFileSync(GEOJSON_SRC, 'utf8'))
const csvRows = parseCsv(readFileSync(CSV_SRC, 'utf8'))

const csvByKey = new Map()
for (const row of csvRows) {
  const key = normalize(row.Kecamatan)
  if (!csvByKey.has(key)) csvByKey.set(key, row)
}

const FIELDS = [
  ['sdn', 'jml_sdn'],
  ['sds', 'jml_sds'],
  ['sdns', 'jml_sdns'],
  ['gurun', 'jml_gurun'],
  ['gurus', 'jml_gurus'],
  ['guruns', 'jml_guruns'],
  ['siswan', 'jml_siswan'],
  ['siswas', 'jml_siswas'],
  ['siswans', 'jml_siswans'],
]

let matched = 0
let missing = []

for (const feature of geojson.features) {
  const key = normalize(feature.properties.name)
  const row = csvByKey.get(key)
  if (!row) {
    missing.push(feature.properties.name)
    continue
  }
  matched++
  for (const [out, src] of FIELDS) {
    feature.properties[out] = Number(row[src])
  }
  feature.properties.kecamatan = row.Kecamatan
}

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(GEOJSON_OUT, JSON.stringify(geojson))

console.log(`OK: ${matched}/${geojson.features.length} kecamatan joined`)
if (missing.length) console.log('MISSING:', missing.join(', '))
console.log(`Output: ${GEOJSON_OUT}`)
