
const TrainInfoBox = ({ show, info }) => {
    return (
        <div className="train-info">
            <button onClick={show}><i class="las la-times"></i></button>
            <h2>Junatiedot:</h2>
            <ul>
                <li>Junanumero: <strong>{info.number}</strong></li>
            </ul>
        </div>
    )
}

export default TrainInfoBox
