import PropTypes from "prop-types";

const Checkbox = ({ onClick, children }) => {
    return (
        <label style={styles.container}>
            <input
                type="checkbox"
                onChange={onClick}
                style={styles.checkbox}
            />
            <span style={styles.text}>{children}</span>
        </label>
    );
};

Checkbox.propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
    },
    checkbox: {
        marginRight: "8px",
    },
    text: {
        fontSize: "16px",
    },
};

export default Checkbox;
