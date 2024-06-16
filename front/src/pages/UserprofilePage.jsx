import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import "../styles/schedule/schedule-page-style.css";
import Button from "../components/generic/Button";
import singleIcon from "../assets/userprofile/single.png";
import coupleIcon from "../assets/userprofile/couple.png";
import familyIcon from "../assets/userprofile/family.png";
import { getCookie } from "../helpers/GetCookie";

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
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ profile_type: profileType }),
          credentials: "include",
        });

        if (response.ok) {
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
        <div
          style={{
            ...styles.checkboxDiv,
            backgroundColor: selectedLabel === 'single' ? '#e0e0e0' : '#ffffff',
          }}
          onClick={() => handleLabelClick('single')}
        >
          <p style={styles.checkboxText}>I live by myself</p>
          <img src={singleIcon} alt="single" style={styles.checkboxImage} />
        </div>

        <div
          style={{
            ...styles.checkboxDiv,
            backgroundColor: selectedLabel === 'couple' ? '#e0e0e0' : '#ffffff',
          }}
          onClick={() => handleLabelClick('couple')}
        >
          <p style={styles.checkboxText}>I live with my partner or a housemate</p>
          <img src={coupleIcon} alt="couple" style={{ ...styles.checkboxImage, paddingRight: selectedLabel === 'couple' ? '10px' : '0px' }} />
        </div>

        <div
          style={{
            ...styles.checkboxDiv,
            backgroundColor: selectedLabel === 'family' ? '#e0e0e0' : '#ffffff',
          }}
          onClick={() => handleLabelClick('family')}
        >
          <p style={styles.checkboxText}>I live with my family</p>
          <img src={familyIcon} alt="family" style={{ ...styles.checkboxImage, paddingRight: selectedLabel === 'family' ? '15px' : '0px' }} />
        </div>
      </div>

      <div className="button-container">
        <Button className="back-button" style={styles.backButton}> Back </Button>
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
    color: '#404040'
  },
  checkboxDiv: {
    height: '90px',
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: "0px",
    marginBottom: "20px",
    cursor: "pointer",
    border: "1px solid #ddd",
    borderRadius: "4px",
    width: "260px",
    backgroundColor: "#ffffff",
  },
  checkboxText: {
    flex: 2,
    fontSize: "22px",
    margin: 0,
  },
  checkboxImage: {
    flex: 1,
    width: "40px",
    height: "auto",
    marginLeft: "auto",
  },
  backButton: {
    backgroundColor: "#FFF9C4",
    border: "1px solid #ddd",
  },
};

export default UserprofilePage;