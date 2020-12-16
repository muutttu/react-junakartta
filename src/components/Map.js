import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, LayersControl, TileLayer, FeatureGroup } from 'react-leaflet';
import StationMarker from './StationMarker'
//import StationInfoBox from './StationInfoBox'
import Loader from './Loader'
import 'leaflet/dist/leaflet.css';


const Map = ({ center, zoom }) => {
    const [stations, setStations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            //console.log("This will be logged on component mount");

            setIsLoading(true);
            setIsError(false);

            try {
                const result = await axios('https://rata.digitraffic.fi/api/v1/metadata/stations.geojson');
                setStations(result.data.features);
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

    const stationMarkers = stations.map((station, index) => {
        return <StationMarker
            key={index}
            position={[station.geometry.coordinates[1], station.geometry.coordinates[0]]}
            name={station.properties.stationName}
            code={station.properties.stationShortCode}
            id={station.properties.stationUICCode}
            ispassenger={station.properties.passengerTraffic}
        />
    })

    const handleOnEachFeature = (feature, layer) => {
        console.log('feature: ', feature);
        console.log('layer: ', layer);
        layer.on({
            'click': function (e) {
                console.log('e: ', e);
                console.log('click');
            }
        })
    }

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
                        <FeatureGroup onEachFeature={handleOnEachFeature}>
                            {isLoading ? <Loader /> : stationMarkers}
                        </FeatureGroup>
                    </LayersControl.Overlay>
                </LayersControl>
            </MapContainer>
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
