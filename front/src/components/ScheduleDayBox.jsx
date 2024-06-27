import PropTypes from 'prop-types';
import { format } from 'date-fns';

const truncateAfterLastDot = (str) => {
  return str.split('.').pop();
};

const ScheduleDayBox = ({ day, schedules }) => {
  if (schedules.length === 0) {
    return null;
  }

  return (
    <div style={styles.dayBox}>
      <div style={styles.dayHeader}>
        <div style={styles.dayOfWeek}>{format(day, 'EEEE')}</div>
        <div style={styles.date}>{format(day, 'dd MMM')}</div>
      </div>
      {schedules.map((schedule, index) => {
        const backgroundColor = schedule.isAdvice ? { backgroundColor: 'var(--primary)' } : { backgroundColor: 'var(--whitesmoke)' };
        const dayTextColor = schedule.isAdvice ? { color: 'var(--whitesmoke)' } : { color: 'var(--primary)' };
        const whiteText = schedule.isAdvice ? { color: 'var(--whitesmoke)' } : { color: 'var(--gray)' };
        const dirtyWhiteText = schedule.isAdvice ? { color: 'var(--whitesmoke)' } : { color: 'var(--gray)' };

        return (
          <div key={index} style={{ ...styles.box, ...backgroundColor }}>
            {schedule.isAdvice && <div style={styles.ribbonRed}>Advice</div>}
            <div style={styles.boxDetails}>
              <div style={styles.timeBox}>
                <p style={{ ...styles.time, ...dirtyWhiteText }}>{format(new Date(schedule.datetime), 'HH:mm')}</p>
              </div>
              <div style={styles.deviceBox}>
                <p style={{ ...styles.appliance, ...whiteText }}>Washing Machine</p>
                <p style={{ ...styles.program, ...dirtyWhiteText }}>{truncateAfterLastDot(schedule.program)}</p>
                <div>
                  {schedule.options.map((option, idx) => (
                    <p key={idx} style={styles.optionText}>{truncateAfterLastDot(option.key)}: {truncateAfterLastDot(option.value)}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

ScheduleDayBox.propTypes = {
  day: PropTypes.instanceOf(Date).isRequired,
  schedules: PropTypes.arrayOf(PropTypes.shape({
    datetime: PropTypes.string.isRequired,
    program: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })).isRequired,
    isAdvice: PropTypes.bool
  })).isRequired
};

const styles = {
  dayBox: {
    border: '1px solid #ccc',
    padding: '10px',
    margin: '10px',
    width: '230px'
  },
  dayHeader: {
    marginBottom: '10px',
    textAlign: 'center'
  },
  dayOfWeek: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--primary)',
  },
  date: {
    fontSize: '0.7rem',
    marginTop: '5px',
  },
  box: {
    width: '100%',
    margin: '6px 0',
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
    fontSize: '0.6rem'
  },
  deviceBox: {
    height: '100%',
    flex: 3,
    textAlign: 'left',
    padding: '4px 10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  appliance: {
    fontSize: '0.8rem',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  program: {
    fontSize: '0.7rem',
    fontWeight: '400',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  optionText: {
    fontSize: '0.7rem',
    fontWeight: '400',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
};

export default ScheduleDayBox;
