import { useState, useEffect } from 'react';
import axios from 'axios';
import StationLayer from './StationLayer';
import TrainLayer from './TrainLayer';
import Loader from './Loader';
import Updater from './Updater';
import StationInfoBox from './StationInfoBox';
import TrainInfoBox from './TrainInfoBox';
import { MapContainer, LayersControl, TileLayer, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ center, zoom }) => {
    const [stations, setStations] = useState([]);
    const [stationInfo, setStationInfo] = useState(null);
    const [showStationInfoBox, setShowStationInfoBox] = useState(false);
    const [trains, setTrains] = useState([]);
    const [trainInfo, setTrainInfo] = useState(null);
    const [showTrainInfoBox, setShowTrainInfoBox] = useState(false);
    const [stationsLoaded, setStationsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isError, setIsError] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    // Asemien tilan asettaminen sivun lataamisen yhteydessä:
    useEffect(() => {
        const fetchData = async () => {
            //console.log("This will be logged on component mount");

            setIsLoading(true);
            setIsError(false);

            try {
                const stationdata = await axios("https://rata.digitraffic.fi/api/v1/metadata/stations.geojson");
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

    // Junien tilan asettaminen intervallilla:
    useEffect(() => {
        const updateTrainData = async () => {
            setIsUpdating(true);

            try {
                const traindata = await axios("https://rata.digitraffic.fi/api/v1/train-locations.geojson/latest");
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

    // Asemakerroksen funktiot:
    // Avataan aseman infolaatikko, asetetaan StationInfoBox-komponentissa
    const triggerOpenStationInfoBox = () => {
        setShowStationInfoBox(true);
    };

    // Suljetaan aseman infolaatikko, asetetaan StationInfoBox-komponentissa
    const triggerCloseStationInfoBox = () => {
        setShowStationInfoBox(false);
    };

    // StationInfoBox-komponentin asemadata
    const handleSelectedStation = (station) => {
        setStationInfo(station);
    };

    // Junakerroksen funktiot:
    // Avataan junan infolaatikko, asetetaan TrainInfoBox-komponentissa
    const triggerCloseTrainInfoBox = () => {
        setShowTrainInfoBox(false);
    };

    // Suljetaan juna infolaatikko, asetetaan TrainInfoBox-komponentissa
    const triggerOpenTrainInfoBox = () => {
        setShowTrainInfoBox(true);
    };

    // TrainInfoBox-komponentin junadata
    const handleSelectedTrain = (train) => {
        setTrainInfo(train);
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
                                : <StationLayer layerData={stations} selectedObject={handleSelectedStation} openInfoBoxTrigger={triggerOpenStationInfoBox} />}
                        </FeatureGroup>
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked name="Junat">
                        <FeatureGroup>
                            {stationsLoaded && isUpdating
                                ? <Updater />
                                : <TrainLayer layerdata={trains} selectedObject={handleSelectedTrain} openInfoBoxTrigger={triggerOpenTrainInfoBox} />}
                        </FeatureGroup>
                    </LayersControl.Overlay>
                </LayersControl>
            </MapContainer>
            {showStationInfoBox && stationInfo && <StationInfoBox closeInfoBoxTrigger={triggerCloseStationInfoBox} station={stationInfo} />}
            {showTrainInfoBox && trainInfo && <TrainInfoBox closeInfoBoxTrigger={triggerCloseTrainInfoBox} train={trainInfo} />}
        </div>
    )
}

Map.defaultProps = {
    center: {
        lat: 61.5,
        lng: 23.8
    },
    zoom: 10
}

export default Map
