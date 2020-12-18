import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './Loader';
import Updater from './Updater';
import StationInfoBox from './StationInfoBox';
import { MapContainer, LayersControl, TileLayer, FeatureGroup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
//import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import passengerstation from '../images/passenger-railway-station.png'
import otherstation from '../images/other-railway-station.png';
import train from '../images/steam-engine.png';


const Map = ({ center, zoom }) => {
    const [stations, setStations] = useState([]);
    const [stationsLoaded, setStationsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isError, setIsError] = useState(false);
    const [stationInfo, setStationInfo] = useState(null);
    const [showInfoBox, setShowInfoBox] = useState(false);
    const [trains, setTrains] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            //console.log("This will be logged on component mount");

            setIsLoading(true);
            setIsError(false);

            try {
                const stationdata = await axios('https://rata.digitraffic.fi/api/v1/metadata/stations.geojson');
                setStations(stationdata.data);
                setIsLoading(false);
            } catch (error) {
                // Handle Error Here
                console.error(error);
                alert("Virhe datan noutamisessa :( \n \n" + error)
                setIsError(true);
            }

            setIsLoading(false);
            setStationsLoaded(true);
        };

        fetchData();

        return () => {
            //console.log("This will be logged on component unmount");
        }
    }, []);

    useEffect(() => {
        const updateTrainData = async () => {
            setIsUpdating(true);

            try {
                const traindata = await axios('https://rata.digitraffic.fi/api/v1/train-locations.geojson/latest');
                setTrains(traindata.data);
                setIsUpdating(false);
            } catch (error) {
                // Handle Error Here
                console.error(error);
                alert("Virhe datan noutamisessa :( \n \n" + error)
                setIsError(true);
            }

            setIsUpdating(false);
        }

        updateTrainData();

        const interval = setInterval(() => {            
            setRefreshTrigger(!refreshTrigger);
        }, 15000);

        return () => {
            //console.log("Behavior right before the component is removed from the DOM.");
            clearInterval(interval);
        }
    }, [refreshTrigger]);

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

    let TrainIcon = L.Icon.extend({
        options: {
            iconSize: [40, 40]
        }
    })

    let DefaultTrainIcon = new TrainIcon({
        iconUrl: train
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
                setStationInfo({
                    id: e.target.feature.properties.stationUICCode,
                    name: e.target.feature.properties.stationName,
                    ispassenger: e.target.feature.properties.passengerTraffic ? "Kyllä" : "Ei"
                });
                setShowInfoBox(true);
            }
        });
    };

    const handleTrainLayer = (feature, latlng) => {
        return L.marker(latlng, { icon: DefaultTrainIcon, });
    };

    const handleTrainFeatures = (feature, layer) => {
        //console.log(layer);
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
                        <FeatureGroup>
                            {isLoading
                                ? <Loader />
                                : <GeoJSON data={stations} pointToLayer={handleStationLayer} onEachFeature={handleStationFeatures} />}
                        </FeatureGroup>
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked name="Junat">
                        <FeatureGroup>
                            {stationsLoaded && isUpdating
                                ? <Updater />
                                : <GeoJSON data={trains} pointToLayer={handleTrainLayer} onEachFeature={handleTrainFeatures} />}
                        </FeatureGroup>
                    </LayersControl.Overlay>
                </LayersControl>
            </MapContainer>
            {showInfoBox && stationInfo && <StationInfoBox show={handleInfoBoxShow} info={stationInfo} />}
        </div>
    )
}

Map.defaultProps = {
    center: {
        lat: 61.5,
        lng: 23.8
    },
    zoom: 12
}

export default Map
