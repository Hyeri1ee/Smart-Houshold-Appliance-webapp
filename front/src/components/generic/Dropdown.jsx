import React from "react";
import PropTypes from "prop-types";

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: ""
    };
    this.renderOptions = this.renderOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      selectedOption: e.target.value
    });
  }

  renderOptions() {
    const { options } = this.props; // Destructure options from props
    return options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.title}
      </option>
    ));
  }

  render() {
    return (
      <div className="dropdown" style={styles.dropdown}>
        <select
          value={this.state.selectedOption}
          onChange={this.handleChange}
          className="options-list"
          style={styles.select}
        >
          {this.renderOptions()}
        </select>
      </div>
    );
  }
}

Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired
};

const styles = {
  dropdown: {
    flex: "2"
  },
  select: {
    width: "100%",
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px"
  }
};

export default Dropdown;