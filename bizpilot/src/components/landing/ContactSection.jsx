import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Workaround to set Leaflet's default icon properly when using bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href
})

export default function ContactSection(){
  const lat = 23.7266944444
  const lon = 90.3885
  const [mapStatus, setMapStatus] = useState('initializing')

  return (
    <div className="contact-grid">
      <div className="contact-form">
        <h3>Get in touch</h3>
        <p className="page-sub">Questions about teams, pricing, or integrations?</p>
        <form onSubmit={(e)=> e.preventDefault()}>
          <input className="input" placeholder="Your name" />
          <input className="input" placeholder="Email" />
          <textarea className="input" placeholder="Message" rows={4} />
          <button className="btn btn-primary" style={{marginTop:12}}>Send</button>
        </form>
      </div>
      <div className="contact-map">
        <div className="map-frame">
          <MapContainer center={[lat, lon]} zoom={13} style={{height:'100%', width:'100%'}} whenCreated={()=> setMapStatus('initialized')}>
            <TileLayer
              // use a reliable basemap (Carto Voyager) and provide fallback tile
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              errorTileUrl={'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}
              eventHandlers={{
                tileload: () => setMapStatus('tiles-loaded'),
                tileerror: (e) => { console.error('Tile error', e); setMapStatus('tile-error') }
              }}
            />
            <Marker position={[lat, lon]}>
              <Popup>
                We're here — reach out!
              </Popup>
            </Marker>
          </MapContainer>
          <div className="map-debug">Status: {mapStatus}</div>
        </div>
      </div>
    </div>
  )
}
