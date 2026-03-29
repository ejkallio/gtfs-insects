import { useEffect, useMemo, useState } from 'react'
import './App.css'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'


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

function App() {
  const [vehicles, setVehicles] = useState<VehiclePosition[]>([]);

  useEffect(() => {
    fetchVehiclePositions();
    const interval = setInterval(fetchVehiclePositions, 5000);

    return () => clearInterval(interval)
  }, []);


  const sampleStops: GtfsStop[] = [
    { id: '24254', code: '4800', name: 'Kaavi MH', lat: 62.9756, lon: 28.4804 },
    { id: '24508', code: '2300', name: 'Siilinjärvi', lat: 63.075297156962, lon: 27.658543203704937 },
  ]

  const centerLat = sampleStops.reduce((acc, stop) => acc + stop.lat, 0) / sampleStops.length
  const centerLon = sampleStops.reduce((acc, stop) => acc + stop.lon, 0) / sampleStops.length


  const fetchVehiclePositions = async () => {
    try {
      console.log("Getting vehicle positions...")
      // Call backend proxy which returns decoded JSON
      const response = await fetch('http://localhost:8080/api/vehicles/positions')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    
      const data = await response.json()
    
    // Backend returns array of vehicle objects
      if (Array.isArray(data)) {
        const mapped: VehiclePosition[] = data.map(v => ({
          id: v.id || 'unknown',
          vehicleId: v.vehicleId || 'unknown',
          label: v.label || 'Bus',
          licensePlate: v.licensePlate || '',
          latitude: v.latitude,
          longitude: v.longitude,
          bearing: v.bearing,
          speed: v.speed,
          tripId: v.tripId || 'unknown',
          routeId: v.routeId || 'unknown',
          currentStatus: v.currentStatus || 'UNKNOWN',
        }))
        setVehicles(mapped)
      }
    } catch (error) {
      console.error('Error fetching vehicle positions:', error)
    }
  }

  function GtfsLeafletMap() {
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
            <CircleMarker
              key={vehicle.id}
              center={[vehicle.latitude, vehicle.longitude]}
              radius={6}
              pathOptions={{ color: '#2ecc71', fillColor: '#27ae60', fillOpacity: 0.8 }}
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
            </CircleMarker>
          ))}
        </MapContainer>
        <p>Red dots: GTFS stops | Green dots: Live vehicle positions</p>
      </section>
    )
  }


  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <GtfsLeafletMap />
    </div>
  )
}

export default App
