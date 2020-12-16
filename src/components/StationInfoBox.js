const StationInfoBox = ({ info }) => {
    return (
        <div className="station-info">
            <h2>Asematiedot:</h2>
            <ul>
                <li>ID: <strong>{info.id}</strong></li>
                <li>Paikkakunta: <strong>{info.name}</strong></li>
            </ul>
        </div>
    )
}

export default StationInfoBox