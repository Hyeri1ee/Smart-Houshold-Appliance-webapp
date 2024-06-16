import PropTypes from 'prop-types';

const CarouselItem = ({ text, imageUrl, isRunning }) => {
    const backgroundStyle = isRunning ? { backgroundColor: 'var(--primary)' } : { backgroundColor: 'var(--whitesmoke)' };
    const textStyle = isRunning ? { color: 'var(--whitesmoke)' } : { color: 'var(--gray)' };
    const imageWidth = isRunning ? '68%' : '88%';

    return (
        <div style={{ ...styles.carouselItem, ...backgroundStyle }}>
            <p style={{ ...styles.carouselText, ...textStyle }}>{text}</p>
            <img src={imageUrl} alt="carousel item" style={{ ...styles.carouselImage, width: imageWidth }} />
            {isRunning && <p style={styles.p}>ON</p>}
        </div>
    );
};

CarouselItem.propTypes = {
    text: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    isRunning: PropTypes.bool,
};

const styles = {
    carouselItem: {
        width: '140px',
        height: '140px',
        margin: '0 auto',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    carouselImage: {
        height: 'auto',
        borderRadius: '10px',
        marginBottom: '4px',
    },
    carouselText: {
        fontSize: '14px',
        textAlign: 'center',
        margin: 0,
    },
    p: {
        color: 'var(--primary)',
        margin: 0,
        backgroundColor: 'var(--whitesmoke)',
        borderRadius: '5px',
        padding: '3px',
    }
};

export default CarouselItem;