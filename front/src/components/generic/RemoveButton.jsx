import PropTypes from "prop-types";

const RemoveButton = ({ onRemove, index }) => {
    const handleClick = () => {
        onRemove(index);
    };

    return (
        <button type="button" style={styles.button} onClick={handleClick}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        </button>
    );
};

const styles = {
    button: {
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        backgroundColor: "transparent",
        color: "white",
        border: "1px solid var(--primary)",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0",
    },
}

RemoveButton.propTypes = {
    onRemove: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
};

export default RemoveButton;