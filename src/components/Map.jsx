import React, {useEffect, useState} from 'react'
import styles from './Map.module.css'
import {useNavigate, useSearchParams} from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useCities } from '../contexts/CitiesContext';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';
import { useUrlPosition } from '../hooks/useUrlPosition';

const Map = () => {
  const [mapPositon , setMapPostion] = useState([40,0])

  const [mapLat, mapLng] = useUrlPosition();
  const {isLoading: isLoadingPosition, position: geoLocationPosition, getPosition} = useGeolocation();

  const {cities} = useCities()
  const navigate = useNavigate();


  

  useEffect(() => {
    if (mapLat && mapLng) {
      setMapPostion([mapLat, mapLng])
    }}, [mapLat, mapLng])

  useEffect(() => {
    if (geoLocationPosition) {
      setMapPostion([geoLocationPosition.lat, geoLocationPosition.lng])
    }
  }, [geoLocationPosition])

  return (
    <div className={styles.mapContainer}>
     {!geoLocationPosition && <Button type="position" onClick={getPosition}>
        {isLoadingPosition ? "Loading..." : "Get position"}
      </Button>}
      {/* <MapContainer center={[mapLat, mapLng]} zoom={6} scrollWheelZoom={true} className={styles.map}> */}
      <MapContainer center={mapPositon} zoom={6} scrollWheelZoom={true} className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {
          cities.map((city) => {
            const{id, position, emoji, cityName} = city

            return (
              <Marker position={[position.lat, position.lng]} key={id} >
                <Popup>
                 <span>{emoji} {cityName}</span>
                </Popup>
              </Marker>
            )
          })
        }
        <ChangeCenter position={mapPositon} />
        <DetectClick />
        {/* <Marker position={mapPositon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */}
      </MapContainer>
    </div>
  )
}

function ChangeCenter ({position}){
  const map = useMap()
  map.setView(position)
  return null
}

function DetectClick () {
  const navigate = useNavigate()
  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    }
  })

}

export default Map