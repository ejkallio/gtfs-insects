import 'leaflet/dist/leaflet.css'
import { useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from 'react-leaflet'
import { AntGif } from './AntGif'

type GtfsStop = {
  id: string
  code: string
  name: string
  lat: number
  lon: number
}

type VehiclePosition = {
  id: string
  vehicleId: string
  label: string
  licensePlate: string
  latitude: number
  longitude: number
  bearing?: number
  speed?: number
  tripId: string
  routeId: string
  currentStatus: string
}

export function GtfsLeafletMap({ vehicles, sampleStops, centerLat, centerLon }: {
    vehicles: VehiclePosition[]
    sampleStops: GtfsStop[]
    centerLat: number
    centerLon: number
}) {

    const stops = useMemo(() => sampleStops, [])

    return (
        <section style={{ padding: 16 }}>
                <h2>GTFS Leaflet Map with Vehicle Positions</h2>
                <p>Stops: {stops.length} | Vehicles: {vehicles.length}</p>
                <MapContainer center={[centerLat, centerLon]} zoom={8} style={{ width: '100%', height: '500px', border: '1px solid #666' }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg?api_key=a836fc0f-0498-4be5-9561-a17ea895b984'
                  />
                  {stops.map((stop) => (
                    <CircleMarker
                      key={stop.id}
                      center={[stop.lat, stop.lon]}
                      radius={8}
                      pathOptions={{ color: '#c0392b', fillColor: '#e74c3c', fillOpacity: 0.9 }}
                    >
                      <Popup>
                        <strong>{stop.name}</strong><br />{stop.lat.toFixed(6)}, {stop.lon.toFixed(6)}
                      </Popup>
                    </CircleMarker>
                  ))}
                  {vehicles.map((vehicle) => (
                    <Marker
                      key={vehicle.id}
                      position={[vehicle.latitude, vehicle.longitude]}
                      icon={AntGif}
                      //radius={6}
                      //pathOptions={{ color: '#2ecc71', fillColor: '#27ae60', fillOpacity: 0.8 }}
                    >
                      <Popup>
                        <strong>{vehicle.label}</strong> (Route {vehicle.routeId})<br />
                        Vehicle ID: {vehicle.vehicleId}<br />
                        License Plate: {vehicle.licensePlate}<br />
                        Speed: {vehicle.speed?.toFixed(1) || 'N/A'} m/s<br />
                        Bearing: {vehicle.bearing || 'N/A'}°<br />
                        Status: {vehicle.currentStatus}<br />
                        {vehicle.latitude.toFixed(6)}, {vehicle.longitude.toFixed(6)}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
                <p>Red dots: GTFS stops | Green dots: Live vehicle positions</p>
        </section>
    )
}
