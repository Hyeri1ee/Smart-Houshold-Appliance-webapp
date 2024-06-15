import PropTypes from 'prop-types';

const commonPropTypes = {
    children: PropTypes.any.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    fontFamily: PropTypes.string,
    withStripes: PropTypes.bool.isRequired,
};

const commonDefaultProps = {
    fontFamily: "sans",
    backgroundColor: "#cc0000",
    color: "#ccffff",
    withStripes: true,
};

const Ribbon = ({ children, backgroundColor, color, fontFamily, withStripes }) => {
    return (
        <div className={styles.rightRibbon} style={withStripes ? { top: "-10px", right: "-10px" } : { top: "0", right: "0" }}>
            <svg height="70" width="70">
                {withStripes ? <polygon points="0 0, 0 10, 10 10" fill={`${backgroundColor}77`} strokeWidth="0" /> : <></>}
                <polygon points="0 0, 70 70, 70 40, 30 0" fill={backgroundColor} strokeWidth="0" />
                {withStripes ? <polygon points="60 60, 60 70, 70 70" fill={`${backgroundColor}77`} strokeWidth="0" /> : <></>}
            </svg>
            <span style={{ color, fontFamily }} className={styles.rightRibbonText}>{children}</span>
        </div>
    );
};

Ribbon.propTypes = commonPropTypes;
Ribbon.defaultProps = commonDefaultProps;

const styles = {
    rightRibbon: {
        position: 'absolute',
        pointerEvents: 'none'
    },
    rightRibbonText: {
        position: 'absolute',
        fontSize: '0.8em',
        top: '12px',
        right: '7px'
    }
};


export default Ribbon;