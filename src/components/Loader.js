import LoadingOverlay from 'react-loading-overlay';

const Loader = () => {
    return (
        <LoadingOverlay
            active
            spinner
            text='Ladataan asematietoja...'
        >
        </LoadingOverlay>
    )
}

export default Loader
