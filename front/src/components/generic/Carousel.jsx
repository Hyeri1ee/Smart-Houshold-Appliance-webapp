import PropTypes from 'prop-types';
import CarouselItem from './CarouselItem';
import "../../styles/dashboard/dashboard.css"

const styles = {
    carouselContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        margin: '0',
        padding: '0px',
        height: '20vh',
        width: '200wv',
        // border: '2px solid pink',
        overflowX: 'scroll',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none', // firefox
        '&::-webkit-scrollbar': {
            display: 'none' //hide scrollbar for webKit browsers
        }
    },
    carousel: {
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
    },
};

const Carousel = ({ items }) => {
    return (
        <div style={styles.carouselContainer}>
            <div style={styles.carousel}>
                {items.map((item, index) => (
                    <CarouselItem key={index} text={item.text} imageUrl={item.imageUrl} isRunning={item.isRunning} />
                ))}
            </div>
        </div>
    );
};

Carousel.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string.isRequired,
            imageUrl: PropTypes.string.isRequired,
            isRunning: PropTypes.bool.isRequired,
        })
    ).isRequired
};

export default Carousel;