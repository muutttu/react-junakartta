import { useState, useEffect } from 'react';
import axios from 'axios';

const TrainInfoBox = ({ show, train }) => {

    const [selectedTrain, setSelectedTrain] = useState([{
        trainNumber: train
    }]);

    useEffect(() => {
        const getTrainData = async () => {
            try {
                const traindetails = await axios('https://rata.digitraffic.fi/api/v1/trains/latest/'+train);
                setSelectedTrain(traindetails.data);
                //setIsUpdating(false);
                //console.log(traindetails.data[0].trainNumber);
            } catch (error) {
                // Handle Error Here
                console.error(error);
                alert("Virhe datan noutamisessa :( \n \n" + error)
            }
        }
        getTrainData();
        return () => {
            //console.log("This will be logged on component unmount");
        }
    }, [train]);

    console.log(selectedTrain[0]);

    return (
        <div className="train-info">
            <button onClick={show}><i class="las la-times"></i></button>
            <h2>Junatiedot:</h2>
            <ul>
                <li>Junanumero: <strong>{selectedTrain[0].trainNumber}</strong></li>
            </ul>
        </div>
    )
}

export default TrainInfoBox
