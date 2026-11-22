import { useMemo, useCallback, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import { FEATURES, getValue, BOUNDS, INDICATORS, formatNumber } from '../utils/data'
import { quantileBreaks, colorForValue } from '../utils/colorScale'
import Legend from './Legend'

function MapHooks({ mapRef, onEmptyClick }) {
  const map = useMap()
  useEffect(() => {
    mapRef.current = map
    map.invalidateSize()
    const ro = new ResizeObserver(() => map.invalidateSize())
    ro.observe(map.getContainer())
    const onMapClick = (e) => {
      if (e.target === map) onEmptyClick()
    }
    map.on('click', onMapClick)
    return () => {
      ro.disconnect()
      map.off('click', onMapClick)
    }
  }, [map, mapRef, onEmptyClick])
  return null
}

function buildTooltip(p, indicator) {
  const value = getValue({ properties: p }, indicator.id)
  return `<div class="tt"><strong>${p.kecamatan}</strong><br/><span>${indicator.label}: ${formatNumber(value)}</span></div>`
}

function buildPopup(p, indicator) {
  return `
    <div class="pop">
      <div class="pop-name">${p.kecamatan}</div>
      <div class="pop-grid">
        <div><span>SD Negeri</span><b>${formatNumber(p.sdn)}</b></div>
        <div><span>SD Swasta</span><b>${formatNumber(p.sds)}</b></div>
        <div class="full"><span>Total SD</span><b>${formatNumber(p.sdns)}</b></div>
        <div><span>Siswa</span><b>${formatNumber(p.siswans)}</b></div>
        <div><span>Guru</span><b>${formatNumber(p.guruns)}</b></div>
      </div>
      <div class="pop-note">${indicator.label}: ${formatNumber(getValue({ properties: p }, indicator.id))}</div>
    </div>`
}

export default function MapView({ indicatorId }) {
  const indicator = INDICATORS.find((i) => i.id === indicatorId)
  const layerRef = useRef(null)
  const mapRef = useRef(null)

  const values = useMemo(
    () => FEATURES.map((f) => getValue(f, indicatorId)),
    [indicatorId],
  )
  const breaks = useMemo(() => quantileBreaks(values, 5), [values])

  const style = useCallback(
    (feature) => ({
      fillColor: colorForValue(breaks, getValue(feature, indicatorId)),
      weight: 1,
      color: 'rgba(255,255,255,0.9)',
      opacity: 1,
      fillOpacity: 0.88,
    }),
    [breaks, indicatorId],
  )

  const handleEmptyClick = useCallback(() => {
    if (layerRef.current) layerRef.current.resetStyle()
    if (mapRef.current) {
      mapRef.current.flyToBounds(BOUNDS, { padding: [24, 24], maxZoom: 12, duration: 0.6 })
    }
  }, [])

  const onEachFeature = useCallback(
    (feature, layer) => {
      const p = feature.properties
      layer.bindTooltip(buildTooltip(p, indicator), { sticky: true, className: 'apple-tooltip' })
      layer.bindPopup(buildPopup(p, indicator), { maxWidth: 300, className: 'apple-popup' })
      layer.on('click', () => {
        if (layerRef.current) layerRef.current.resetStyle()
        layer.setStyle({
          weight: 3,
          color: '#1d1d1f',
          fillOpacity: 1,
        })
        if (mapRef.current) {
          mapRef.current.flyToBounds(layer.getBounds(), {
            padding: [60, 60],
            maxZoom: 13,
            duration: 0.8,
          })
        }
      })
    },
    [indicator],
  )

  return (
    <div className="map-wrap">
      <MapContainer bounds={BOUNDS} boundsOptions={{ padding: [24, 24] }} scrollWheelZoom className="map">
        <MapHooks mapRef={mapRef} onEmptyClick={handleEmptyClick} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <GeoJSON
          key={indicatorId}
          ref={layerRef}
          data={FEATURES}
          style={style}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
      <Legend indicator={indicator} breaks={breaks} format={(v) => formatNumber(v)} />
    </div>
  )
}
