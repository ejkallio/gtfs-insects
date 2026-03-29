import { useEffect, useMemo, useState } from 'react'
import './App.css'
import 'leaflet/dist/leaflet.css'
import { GtfsLeafletMap } from './components/GtfsLeafletMap'

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
    const interval = setInterval(fetchVehiclePositions, 2000);

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


  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <GtfsLeafletMap
        vehicles={vehicles}
        sampleStops={sampleStops}
        centerLat={centerLat}
        centerLon={centerLon} />
    </div>
  )
}

export default App
