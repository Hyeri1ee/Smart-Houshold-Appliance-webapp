import PropTypes from "prop-types";

const LargeButton = ({ onClick, children }) => {
  const handleClick = (e) => {
    e.preventDefault();
    onClick();
  };

  return (
    <button style={styles.button} onClick={handleClick}>
      {children}
    </button>
  );
};

LargeButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const styles = {
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#097969",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    textAlign: "center",
    display: "block",
  },
};

export default LargeButton;