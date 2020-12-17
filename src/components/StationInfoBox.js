const StationInfoBox = ({ show, info }) => {

    return (
        <div className="station-info">
            <button onClick={show}><strong>X</strong></button>
            <h2>Asematiedot:</h2>
            <ul>
                <li>Asematunnus: <strong>{info.id}</strong></li>
                <li>Paikkakunta: <strong>{info.name}</strong></li>
                <li>Matkustaja-asema: <strong>{info.ispassenger}</strong></li>
            </ul>
        </div>
    )
}

export default StationInfoBox