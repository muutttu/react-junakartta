import L from 'leaflet';
import { Marker, Tooltip } from 'react-leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import passengerstation from '../images/passenger-railway-station-24.png'
import otherstation from '../images/other-railway-station-24.png'

let DefaultIcon = L.icon({
    iconUrl: icon,
    iconSize: [24, 40],
    iconAnchor: [12, 40],
    popupAnchor: [12, 4],
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

let PassengerStationIcon = L.icon({
    iconUrl: passengerstation,
    iconAnchor: [12, 12],
})

let OtherStationIcon = L.icon({
    iconUrl: otherstation,
    iconAnchor: [12, 12],
})

const StationMarker = ({ position, name, code, id, ispassenger }) => {

    return (
        <>
            <Marker position={position} icon={ispassenger ? PassengerStationIcon : OtherStationIcon}>

                <Tooltip sticky>{code} - {id}</Tooltip>
            </Marker>
        </>
    )
}

export default StationMarker
