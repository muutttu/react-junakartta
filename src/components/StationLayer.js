import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';
//import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import passengerstation from '../images/passenger-railway-station.png'
import otherstation from '../images/other-railway-station.png';

const StationLayer = ({ layerData, selectedObject, openInfoBoxTrigger }) => {

    let StationIcon = L.Icon.extend({
        options: {
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            shadowUrl: iconShadow,
            shadowSize: [40, 40],
            shadowAnchor: [10, 40]
        }
    });

    let PassengerStationIcon = new StationIcon({
        iconUrl: passengerstation
    });

    let OtherStationIcon = new StationIcon({
        iconUrl: otherstation
    });



    const handleStationLayer = (feature, latlng) => {
        if (feature.properties.passengerTraffic) {
            return L.marker(latlng, { icon: PassengerStationIcon, });
        }
        return L.marker(latlng, { icon: OtherStationIcon, });
    };

    const handleStationFeatures = (feature, layer) => {
        layer.on({
            'click': function (e) {
                openInfoBoxTrigger();
                selectedObject({
                    id: e.target.feature.properties.stationUICCode,
                    name: e.target.feature.properties.stationName,
                    ispassenger: e.target.feature.properties.passengerTraffic ? "Kyllä" : "Ei"
                });
            }
        });
    };

    return (
        <>
            <GeoJSON data={layerData} pointToLayer={handleStationLayer} onEachFeature={handleStationFeatures} />
        </>
    )
}

export default StationLayer
