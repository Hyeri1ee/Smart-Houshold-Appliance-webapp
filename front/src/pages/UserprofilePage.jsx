import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddButton from "../components/generic/AddButton";
import Checkbox from "../components/generic/Checkbox";
import "../styles/global.css";
import "../styles/schedule/schedule-page-style.css";
import Button from "../components/generic/Button";
import singleIcon from "../assets/userprofile/single.png";
import coupleIcon from "../assets/userprofile/couple.png";
import family from "../assets/userprofile/family.png";

function UserprofilePage() {
  return (
    <div className="app-container">
      <div className="fixed-header" style={styles.fixedHeader}>
        <h2 className="header1" style={styles.header1}>
          Tell us a bit about yourself.
        </h2>
        <h3 className="header2" style={styles.header2}>
          What is your type of household?
        </h3>
      </div>

      <div className="checkbox-container" style={styles.checkboxContainer}>
      <label style={styles.checkboxLabel}>
        <input type="checkbox" id="single" style={styles.checkboxInput} />
        <span style={{ ...styles.checkboxCustom, top: "50px", display: "flex", alignItems: "center" }}>
            I live by myself
            <img src={singleIcon} alt="single" style={{ width: "40px", height: "40px", marginLeft: "10px" }} />
        </span>
     </label>

        <label style={styles.checkboxLabel}>
          <input type="checkbox" id="couple" style={styles.checkboxInput} />
          <span style={{ ...styles.checkboxCustom, top: "150px" }}>I live with my partner or a housemate
          <img src={coupleIcon} alt="couple" style={{ width: "40px", height: "40px", marginLeft: "10px" }} />
          </span>
        </label>

        <label style={styles.checkboxLabel}>
          <input type="checkbox" id="family" style={styles.checkboxInput} />
          <span style={{ ...styles.checkboxCustom, top: "250px" }}>I live with my family
          <img src={family} alt="family" style={{ width: "40px", height: "40px", marginLeft: "10px" }} />

          </span>
        </label>
      </div>

      <div className="button-container">
        <Button className="back-button"> Back </Button>
        <Button > Next </Button>
      </div>
    </div>
  );
}

const styles = {
  fixedHeader: {
    position: "relative",
    top: "50px",
    textAlign: "center",
  },
  header1: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  header2: {
    fontSize: 26,
    fontWeight: "bold",
  },
  checkboxContainer: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "50px",
    height: "450px",
    width: "380px",
  },
  checkboxLabel: {
    display: "block",
    position: "relative",
    paddingLeft: "35px",
    marginBottom: "12px",
    cursor: "pointer",
    fontSize: "22px",
    userSelect: "none",
  },
  checkboxInput: {
    position: "absolute",
    opacity: 0,
    cursor: "pointer",
    height: 0,
    width: 0,
  },
  checkboxCustom: {
    position: "absolute",
    left: "-110px",
    height: "90px",
    width: "250px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #ddd",
    borderRadius: "4px",
    paddingLeft: "20px",
    color: "#000000",
  },
  backButton: {
    backgroundColor: "#FFF9C4", 
    border: "1px solid #ddd", 
  },
};

export default UserprofilePage;