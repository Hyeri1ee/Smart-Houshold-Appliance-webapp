import {format, addDays} from 'date-fns';
import PropTypes from 'prop-types';

const ScheduleHeader = ({currentWeek, previousWeek, nextWeek}) => {
  return (<div style={styles.header}>
      <button style={styles.button} onClick={previousWeek}>◀</button>
      <p style={styles.p}>{format(currentWeek, 'dd MMM')} - {format(addDays(currentWeek, 6), 'dd MMM yyyy')}</p>
      <button style={styles.button} onClick={nextWeek}>▶</button>
    </div>);
};

ScheduleHeader.propTypes = {
  currentWeek: PropTypes.instanceOf(Date).isRequired,
  previousWeek: PropTypes.func.isRequired,
  nextWeek: PropTypes.func.isRequired,
};

const styles = {
  header: {
    backgroundColor: 'whitesmoke',
    width: '260px',
    height: '50px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: '10px',
    borderRadius: '10px',
  }, button: {
    backgroundColor: 'transparent', color: '#404040',
  }, p: {
    color: '#404040', fontSize: '1rem'
  }
};

export default ScheduleHeader;
