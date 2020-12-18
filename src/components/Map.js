import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './Loader';
import StationInfoBox from './StationInfoBox';
import { MapContainer, LayersControl, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import passengerstation from '../images/passenger-railway-station.png'
import otherstation from '../images/other-railway-station.png'


const Map = ({ center, zoom }) => {
    const [stations, setStations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [stationInfo, setStationInfo] = useState(null);
    const [showInfoBox, setShowInfoBox] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            //console.log("This will be logged on component mount");

            setIsLoading(true);
            setIsError(false);

            try {
                const result = await axios('https://rata.digitraffic.fi/api/v1/metadata/stations.geojson');
                setStations(result.data);
                setIsLoading(false);
            } catch (error) {
                // Handle Error Here
                console.error(error);
                alert("Virhe datan noutamisessa :( \n \n" + error)
                setIsError(true);
            }

            setIsLoading(false);
        };

        fetchData();

        return () => {
            //console.log("This will be logged on component unmount");
        }
    }, []);

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

    const handlePointToLayer = (feature, latlng) => {
        if(feature.properties.passengerTraffic) {
            return L.marker(latlng, {icon: PassengerStationIcon,});
        }
        return L.marker(latlng, {icon: OtherStationIcon,});
    };

    const handleOnEachFeature = (feature, layer) => {
        layer.on({
            'click': function (e) {
                setStationInfo({
                    id: e.target.feature.properties.stationUICCode,
                    name: e.target.feature.properties.stationName,
                    ispassenger: e.target.feature.properties.passengerTraffic ? "Kyllä" : "Ei"
                });
                setShowInfoBox(true);
            }
        });
    };

    const handleInfoBoxShow = () => {
        setShowInfoBox(false);
    };

    return (
        <div className="map">
            <h2>Karttanäkymä</h2>
            {isError && <div>Jotain meni pieleen...</div>}
            <MapContainer center={center} zoom={zoom}>
                <LayersControl>
                    <LayersControl.BaseLayer checked name="OpenStreetMap.Mapnik">
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="OpenStreetMap.BlackAndWhite">
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.Overlay checked name="Asemat">
                        {isLoading ? <Loader /> : <GeoJSON data={stations} pointToLayer={handlePointToLayer} onEachFeature={handleOnEachFeature} />}
                    </LayersControl.Overlay>
                </LayersControl>
            </MapContainer>
            {showInfoBox && stationInfo && <StationInfoBox show={handleInfoBoxShow} info={stationInfo} />}
        </div>
    )
}

Map.defaultProps = {
    center: {
        lat: 64.5,
        lng: 24
    },
    zoom: 6
}

export default Map
