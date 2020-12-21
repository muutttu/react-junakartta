import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import train from '../images/steam-engine.png';

const TrainLayer = ({ layerdata }) => {

    let TrainIcon = L.Icon.extend({
        options: {
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        }
    })

    let DefaultTrainIcon = new TrainIcon({
        iconUrl: train
    });

    const handlePointToLayer = (feature, latlng) => {
        return L.marker(latlng, { icon: DefaultTrainIcon, });
    };

    const handleOnEachFeature = (feature, layer) => {
        layer.on({
            'click': function (e) {
                console.log(e.target.feature.properties.trainNumber);
                //setTrainInfo(e.target.feature.properties.trainNumber);
                //setShowTrainInfoBox(true);
            }
        });
    };

    const handleTrainInfoBoxShow = () => {
        //setShowTrainInfoBox(false);
    };

    return (
        <>
            <GeoJSON data={layerdata} pointToLayer={handlePointToLayer} onEachFeature={handleOnEachFeature} />}
        </>
    )
}

export default TrainLayer
