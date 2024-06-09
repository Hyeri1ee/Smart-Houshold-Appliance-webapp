import PropTypes from 'prop-types';

const CarouselItem = ({ text, imageUrl, isRunning }) => {
    const backgroundStyle = isRunning ? { backgroundColor: 'var(--primary)' } : { backgroundColor: 'white' };

    return (
        <div style={{ ...styles.carouselItem, ...backgroundStyle }}>
            <p style={styles.carouselText}>{text}</p>
            <img src={imageUrl} alt="carousel item" style={styles.carouselImage} />
        </div>
    );
};

CarouselItem.propTypes = {
    text: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    isRunning: PropTypes.bool.isRequired,
};

const styles = {
    carouselItem: {
        width: '130px',
        height: '130px',
        margin: '0 auto',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    carouselImage: {
        width: '86%',
        height: 'auto',
        borderRadius: '10px',
        marginBottom: '10px',
    },
    carouselText: {
        fontSize: '14px',
        textAlign: 'center',
        color: '#333',
        margin: 0
    },
};

export default CarouselItem;