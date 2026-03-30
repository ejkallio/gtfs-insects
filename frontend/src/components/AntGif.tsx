import L from 'leaflet'
import antGif from '../assets/Sprite-0001.gif'

export const AntGif = L.icon({
    iconUrl: antGif,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
})