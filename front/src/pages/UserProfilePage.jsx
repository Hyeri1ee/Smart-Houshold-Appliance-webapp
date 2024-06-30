import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import Button from "../components/generic/Button";
import singleIcon from "../assets/user/profile/single.png";
import coupleIcon from "../assets/user/profile/couple.png";
import familyIcon from "../assets/user/profile/family.png";
import { getCookie } from "../helpers/CookieHelper";

function UserProfilePage() {
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
        return 4;
    }
  };

  const handleBackButtonClick = () => {
    navigate('/login');
  };

  const handleOptionOut = async (e) => {
    e.preventDefault();

    setProfileType(4);
    try {
      const accessToken = getCookie('authorization');
      //console.log(accessToken);
      const response = await fetch('http://localhost:1337/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ profile_type: 4 }),
        credentials: "include",
      });

      if (response.ok) {
        navigate('/user/timeslots');
      } else {
        console.error('Failed to update profile type');
      }
    } catch (error) {
      console.error('Error updating profile type:', error);
    }
  };

  const handleNextButtonClick = async (e) => {
    e.preventDefault();

    if (profileType >= 0) {
      try {
        const accessToken = getCookie('authorization');
        //console.log(accessToken);
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
          document.cookie = `authorization=${accessToken}`;
          navigate('/user/timeslots');
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
            outline: selectedLabel === 'single' ? '4px solid var(--primary)' : '1px solid #ddd',
            backgroundColor: 'var(--whitesmoke)',
          }}
          onClick={() => handleLabelClick('single')}
        >
          <p style={styles.checkboxText}>I live by myself</p>
          <img src={singleIcon} alt="single" style={styles.checkboxImage} />
        </div>

        <div
          style={{
            ...styles.checkboxDiv,
            outline: selectedLabel === 'couple' ? '4px solid var(--primary)' : '1px solid #ddd',
            backgroundColor: 'var(--whitesmoke)',
          }}
          onClick={() => handleLabelClick('couple')}
        >
          <p style={styles.checkboxText}>I live with my partner or a housemate</p>
          <img src={coupleIcon} alt="couple" style={styles.checkboxImage} />
        </div>

        <div
          style={{
            ...styles.checkboxDiv,
            outline: selectedLabel === 'family' ? '4px solid var(--primary)' : '1px solid #ddd',
            backgroundColor: 'var(--whitesmoke)',
          }}
          onClick={() => handleLabelClick('family')}
        >
          <p style={styles.checkboxText}>I live with my family</p>
          <img src={familyIcon} alt="family" style={styles.checkboxImage} />
        </div>

        <p style={styles.skip} onClick={handleOptionOut}>Skip</p>
      </div>

      <div className="button-container">
        <Button className="back-button" onClick={handleBackButtonClick} style={styles.backButton}> Back </Button>
        <Button onClick={handleNextButtonClick}> Next </Button>
      </div>
    </div>
  );
}

const styles = {
  fixedHeader: {
    position: "relative",
    top: "10px",
    textAlign: "center",
    color: 'var(--text)',
  },
  header1: {
    fontSize: 18,
    fontWeight: "bold",
    color: 'var(--text)',
  },
  header2: {
    fontSize: 26,
    fontWeight: "bold",
    color: 'var(--text)',
  },
  checkboxContainer: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "30px",
    height: "450px",
    width: "100vw",
    color: '#404040'
  },
  checkboxDiv: {
    height: '18%',
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: "0px",
    marginBottom: "20px",
    cursor: "pointer",
    borderRadius: "4px",
    width: "80%",
    boxSizing: "border-box",
    transition: "border 0.3s ease",
    backgroundColor: 'var(--whitesmoke)',
  },
  checkboxText: {
    flex: 2,
    fontSize: "22px",
    margin: 0,
  },
  checkboxImage: {
    flex: 1,
    width: "40px",
    height: "60px",
    marginLeft: "auto",
  },
  backButton: {
    backgroundColor: "#FFF9C4",
    border: "1px solid var(--text)",
  },
  skip: {
    marginTop: '10px',
    fontSize: '20px',
    cursor: 'pointer',
    color: 'white',
    textDecoration: 'underline'
  }
};

export default UserProfilePage;
