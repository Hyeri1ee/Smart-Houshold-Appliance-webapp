import PropTypes from "prop-types";

const AddButton = ({ onClick }) => {
    const handleClick = (e) => {
        e.preventDefault();
        onClick();
    };

    return (
        <button onClick={handleClick} style={styles.button}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="30"
                height="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
        </button>
    );
};

AddButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

const styles = {
    button: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: "#097969",
        color: "white",
        border: "none",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "6px 0",
        padding: '0'
    },
}

export default AddButton;