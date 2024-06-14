import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import AddButton from "../components/generic/AddButton";
import Checkbox from "../components/generic/Checkbox";
import "../styles/global.css";
import "../styles/schedule/schedule-page-style.css";
import Button from "../components/generic/Button";
import singleIcon from "../assets/userprofile/single.png";
import coupleIcon from "../assets/userprofile/couple.png";
import family from "../assets/userprofile/family.png";
import { getCookie } from "../helpers/cookies/GetCookie";

function UserprofilePage() {
    const [selectedLabel, setSelectedLabel] = useState(null);
    const [profileType, setProfileType] = useState(null);
    const navigate = useNavigate();

    const handleLabelClick = (labelId) => {
        setSelectedLabel(labelId);
        setProfileType(labelIdToProfileType(labelId));
    };
    const labelIdToProfileType = (labelId) => {
        switch (labelId) {
          case 'single':
            return 1;
          case 'couple':
            return 2;
          case 'family':
            return 3;
          default:
            return null;
        }
    };

    const handleNextButtonClick = async () => {
    if (profileType) {
        try {
        const accessToken = getCookie('authorization');
        console.log(accessToken);
        const response = await fetch('http://localhost:1337/api/user/profile', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ profile_type : profileType }),
        });

        if (response.ok) {
            const data = await response.json();
            document.cookie = `authorization=${data.accessToken}`;
            navigate('/dashboard');
        } else {
            console.error('Failed to update profile type');
            }
        } catch (error) {
            console.error('Error updating profile type:', error);
        }
        } else {
        alert('Please select a household type.');
        }
    };

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
      <label
  htmlFor="single"
  style={{
    ...styles.checkboxLabel,
    backgroundColor: selectedLabel === 'single' ? '#e0e0e0' : '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
  onClick={() => handleLabelClick('single')}
>
  <div style={styles.checkboxCustomWrapper}>
    <span style={styles.checkboxText}>I live by myself</span>
    <img src={singleIcon} alt="single" style={styles.checkboxImage} />
  </div>
</label>

<label
  htmlFor="couple"
  style={{
    ...styles.checkboxLabel,
    backgroundColor: selectedLabel === 'couple' ? '#e0e0e0' : '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
  onClick={() => handleLabelClick('couple')}
>
  <div style={styles.checkboxCustomWrapper}>
    <span style={styles.checkboxText}>I live with my partner or a housemate</span>
    <img src={coupleIcon} alt="couple" style={styles.checkboxImage} />
  </div>
</label>

<label
  htmlFor="family"
  style={{
    ...styles.checkboxLabel,
    backgroundColor: selectedLabel === 'family' ? '#e0e0e0' : '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
  onClick={() => handleLabelClick('family')}
>
  <div style={styles.checkboxCustomWrapper}>
    <span style={styles.checkboxText}>I live with my family</span>
    <img src={family} alt="family" style={styles.checkboxImage} />
  </div>
</label>
</div>

      <div className="button-container">
        <Button className="back-button"> Back </Button>
        <Button onClick={handleNextButtonClick}> Next </Button>
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
    marginTop: "80px",
    height: "450px",
    width: "380px",
  },
  checkboxLabel: {
    display: "block",
    position: "relative",
    paddingLeft: "10px",
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
  checkboxCustomWrapper: {
    top : "10px",
    height: "90px",
    width: "250px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #ddd",
    borderRadius: "4px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: "20px",
    paddingRight: "20px",
    color: "#000000",
    marginBottom: "20px", 
  },
  checkboxText: {
    flex: "2 1", 
    fontSize: "22px",
  },
  checkboxImage: {
    flex: "1 1",
    width: "40px",
    height:"auto",
    marginLeft: "auto",
  },
  backButton: {
    backgroundColor: "#FFF9C4", 
    border: "1px solid #ddd", 
  },
};

export default UserprofilePage;