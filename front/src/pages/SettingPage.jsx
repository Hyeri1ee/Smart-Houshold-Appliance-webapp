import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import Button from "../components/generic/Button";
import { getCookie } from "../helpers/CookieHelper";

function SettingPage() {
  const [profileType, setProfileType] = useState('');
  const [storedProfileType, setStoredProfileType] = useState('');
  const [showSaveButton, setShowSaveButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = getCookie('authorization');
        console.log(accessToken);
        const response = await fetch('http://localhost:1337/api/setting', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileType(data.profileType);
          setStoredProfileType(data.profileType);
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    setShowSaveButton(parseInt(profileType) !== parseInt(storedProfileType));
  }, [profileType, storedProfileType]);

  const handleProfileTypeChange = (event) => {
    const newProfileType = event.target.value;
    setProfileType(newProfileType);
  };

  const handleSaveButtonClick = async () => {
    if (profileType) {
      try {
        const accessToken = getCookie('authorization');
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
          setStoredProfileType(profileType);
          setShowSaveButton(false);
        } else {
          console.error('Failed to update profile type');
        }
      } catch (error) {
        console.error('Error updating profile type:', error);
      }
    }
  };

  return (
    <div style={styles.appContainer}>
      <h2 style={styles.title}>
        Settings
      </h2>
      <div style={styles.settingBox}>
        <div style={styles.labelContainer}>
          <p style={styles.settingLabel}>
            User profile:
          </p>
        </div>
        <div style={styles.secondBox}>
          <select
            value={profileType}
            onChange={handleProfileTypeChange}
            style={styles.dropdown}
          >
            <option value="1">I live by myself</option>
            <option value="2">I live with partner/housemate</option>
            <option value="3">I live with family</option>
            <option value="4">Prefer not to say</option>
          </select>
        </div>
      </div>
      <div style={styles.buttonContainer}>
        <div style={styles.button}>
          {showSaveButton && (
            <Button onClick={handleSaveButtonClick} style={{ ...styles.button, ...styles.fadeIn }}>
              Save User Profile
            </Button>
          )}
        </div>
      </div>
      <div style={styles.settingBox}>
        <div style={styles.labelContainer}>
          <p style={styles.settingLabel}>
            Timeslots:
          </p>
        </div>
        <div style={styles.secondBox}>
          <Button onClick={() => navigate('/user/timeslots')} style={styles.button}>
            View Timeslots
          </Button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 10px'
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: 'center'
  },
  settingBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: '90%',
    // outline: '1px solid pink'
  },
  settingLabel: {
    textAlign: 'center',
    fontSize: 20
  },
  labelContainer: {
    height: '100%',
    width: '36%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  secondBox: {
    width: '60%',
    // border: '1px solid blue'
  },
  dropdown: {
    padding: "3px 5px",
    fontSize: 16,
    width: '100%'
  },
  buttonContainer: {
    width: '90%',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '20px',
    margin: '20px 0',
    // border: '1px solid orange'
  }, 
  button: {
    width: '60%'
  }
};

export default SettingPage;