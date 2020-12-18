import LoadingOverlay from 'react-loading-overlay';

const Updater = () => {
    return (
        <LoadingOverlay
            active
            spinner
            text='Päivitetään junatietoja...'
        >
        </LoadingOverlay>
    )
}

export default Updater
