import { useState, useEffect } from 'react';
import axios from 'axios';

const TrainInfoBox = ({ show, info }) => {

    const [trainDetails, setTrainDetails] = useState(null);

    //console.log(info);

    useEffect(() => {
        const getTrainData = async () => {
            try {
                const traindetails = await axios('https://rata.digitraffic.fi/api/v1/trains/latest/'+info);
                setTrainDetails(traindetails.data);
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
    }, [info]);

    console.log(trainDetails);

    return (
        <div className="train-info">
            <button onClick={show}><i class="las la-times"></i></button>
            <h2>Junatiedot:</h2>
            <ul>
                <li>Junanumero: <strong></strong></li>
            </ul>
        </div>
    )
}

export default TrainInfoBox
