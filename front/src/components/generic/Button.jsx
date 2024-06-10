import PropTypes from "prop-types";

const Button = ({ type, onClick, children }) => {
  return (
    <button style={styles.button} type={type} onClick={onClick} className="custom-button">
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  type: "button",
  onClick: () => { },
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

export default Button;