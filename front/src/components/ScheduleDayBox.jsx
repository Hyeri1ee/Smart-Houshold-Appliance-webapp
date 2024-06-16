import PropTypes from 'prop-types';
import { format } from 'date-fns';

const ScheduleDayBox = ({ day, startTime, endTime, appliance, program, isAdvice }) => {
    const backgroundColor = isAdvice ? { backgroundColor: 'var(--primary)' } : { backgroundColor: 'var(--whitesmoke)' };
    const dayTextColor = isAdvice ? { color: 'var(--whitesmoke)' } : { color: 'var(--primary)' };
    const whiteText = isAdvice ? { color: 'var(--whitesmoke)' } : { color: 'var(--gray)' };
    const dirtyWhiteText = isAdvice ? { color: 'var(--whitesmoke)' } : { color: 'var(--gray)' };

    return (
        <div style={{ ...styles.box, ...backgroundColor }}>
            {isAdvice && <div style={styles.ribbonRed}>Advice</div>}
            <div style={{ ...styles.dayOfWeek, ...dayTextColor }}>{format(day, 'EEEE')}</div>
            <div style={{ ...styles.date, ...whiteText }}>{format(day, 'dd MMM')}</div>
            <div style={styles.boxDetails}>
                <div style={styles.timeBox}>
                    <p style={{ ...styles.time, ...dirtyWhiteText }}>{startTime}</p>
                    <p style={{ ...styles.time, ...dirtyWhiteText }}>{endTime}</p>
                </div>
                <div style={styles.deviceBox}>
                    <p style={{ ...styles.appliance, ...whiteText }}>{appliance}</p>
                    <p style={{ ...styles.program, ...dirtyWhiteText }}>{program}</p>
                </div>
            </div>
        </div>
    );
};

ScheduleDayBox.propTypes = {
    day: PropTypes.instanceOf(Date).isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    appliance: PropTypes.string.isRequired,
    program: PropTypes.string.isRequired,
    isAdvice: PropTypes.bool
};

const styles = {
    box: {
        width: '230px',
        height: '90px',
        margin: '6px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        backgroundColor: 'var(--whitesmoke)',
        color: 'var(--gray)',
    },
    ribbonRed: {
        position: 'absolute',
        top: '10px',
        right: '-10px',
        width: '60px',
        backgroundColor: 'var(--red)',
        color: 'white',
        textAlign: 'center',
        transform: 'rotate(45deg)',
        fontSize: '0.7rem',
        fontWeight: '600',
        padding: '5px 0',
        zIndex: '1'
    },
    dayOfWeek: {
        fontSize: '.8rem',
        fontWeight: '600',
        color: 'var(--primary)',
    },
    date: {
        fontSize: '.7em',
        marginTop: '5px',
    },
    boxDetails: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        marginTop: '4px',
    },
    timeBox: {
        flex: 1,
        textAlign: 'right',
        paddingRight: '10px',
        borderRight: '1px solid #ccc',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        color: 'gray',
        fontWeight: '500',
    },
    time: {
        fontSize: '.6em'
    },
    deviceBox: {
        height: '90%',
        flex: 3,
        textAlign: 'left',
        padding: '4px 10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    appliance: {
        fontSize: '.8rem',
        fontWeight: '600'
    },
    program: {
        fontSize: '.7rem',
        fontWeight: '400'
    }
};

export default ScheduleDayBox;