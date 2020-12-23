const StationInfoBox = ({ closeInfoBoxTrigger, station }) => {

    return (
        <div className="station-info">
            <button onClick={closeInfoBoxTrigger}><i class="las la-times"></i></button>
            <h2>Asematiedot:</h2>
            <ul>
                <li>Asematunnus: <strong>{station.id}</strong></li>
                <li>Paikkakunta: <strong>{station.name}</strong></li>
                <li>Matkustaja-asema: <strong>{station.ispassenger}</strong></li>
            </ul>
        </div>
    )
}

export default StationInfoBox