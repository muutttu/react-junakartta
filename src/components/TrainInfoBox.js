import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './Loader';

const TrainInfoBox = ({ closeInfoBoxTrigger, train }) => {

    const [selectedTrain, setSelectedTrain] = useState([{
        trainNumber: train
    }]);
    const [isLoadingTrain, setIsLoadingTrain] = useState(false);

    useEffect(() => {
        const getTrainData = async () => {
            setIsLoadingTrain(true);

            try {
                const traindetails = await axios('https://rata.digitraffic.fi/api/v1/trains/latest/' + train);
                setSelectedTrain(traindetails.data);
                setIsLoadingTrain(false);
                //console.log(traindetails.data[0].trainNumber);
            } catch (error) {
                // Handle Error Here
                console.error(error);
                alert("Virhe datan noutamisessa :( \n \n" + error)
            }
            setIsLoadingTrain(false);
        }

        getTrainData();
        return () => {
            //console.log("This will be logged on component unmount");
        }
    }, [train]);

    const element = <div className="train-info">
        <button onClick={closeInfoBoxTrigger}><i class="las la-times"></i></button>
        <h2>Junatiedot:</h2>
        <ul>
            <li>Junanumero: <strong>{selectedTrain[0].trainNumber}</strong></li>
            <li>Lähtöpäivä: <strong>{selectedTrain[0].departureDate}</strong></li>
            <li>Tyyppi: <strong>{selectedTrain[0].trainCategory}</strong></li>
        </ul>
    </div>;

    return (
        <>
            {isLoadingTrain
                ? <Loader />
                : element
            }
        </>
    )
}

export default TrainInfoBox
