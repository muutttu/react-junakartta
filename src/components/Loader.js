import LoadingOverlay from 'react-loading-overlay';

const Loader = () => {
    return (
        <LoadingOverlay
            active
            spinner
            text='Ladataan tietoja...'
        >
        </LoadingOverlay>
    )
}

export default Loader
