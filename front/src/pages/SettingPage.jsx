import { useState,useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

import Button from "../components/generic/Button";
import { getCookie } from "../helpers/CookieHelper";

function SettingPage() {
    const [profileType, setProfileType] = useState('');
    const [profileLabel, setProfileLabel] = useState('');
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [initialProfileType, setInitialProfileType] = useState('');
    const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log('fetching user profile')
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
          setInitialProfileType(data.profileType);
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
    setShowSaveButton(profileType !== initialProfileType);
  }, [profileType, initialProfileType]);

  const getProfileLabel = (type) => {
    switch (type) {
      case 1:
        return 'I live by myself';
      case 2:
        return 'I live with partner/housemate';
      case 3:
        return 'I live with family';
      case 4:
        return 'not choose';
      default:
        return 'Select profile type';
    }
  };

  const handleProfileTypeChange = async (event) => {
    const newProfileType = event.target.value;
    setProfileType(newProfileType);
    setProfileLabel(getProfileLabel(parseInt(newProfileType)));
    if (newProfileType) {
        try {
          const accessToken = getCookie('authorization');
          console.log(accessToken);
          const response = await fetch('http://localhost:1337/api/user/profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ profile_type: newProfileType }),
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
      }
  };

  const handleSaveButtonClick = async () => {
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
          setInitialProfileType(profileType);
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
    <div className="app-container">
      <div className="fixed-header" style={styles.fixedHeader}>
        <h3 className="header2" style={styles.header2}>
          settings
        </h3>
        <div style={styles.profileSelection}>
          <h2 className="header1" style={styles.header1}>
            user profile:
          </h2>
          <select 
            value={profileType} 
            onChange={handleProfileTypeChange}
            style={styles.dropdown}
          >
            <option value="">Select profile type</option>
            <option value="1">I live by myself</option>
            <option value="2">I live with partner/housemate</option>
            <option value="3">I live with family</option>
            <option value="4">not choose</option>
          </select>
        </div>
        <div style={styles.buttonContainer}>
          {showSaveButton && (
            <Button onClick={handleSaveButtonClick} style={{...styles.button, ...styles.fadeIn}}>
              save userProfile
            </Button>
          )}
        </div>
        <div style={styles.timeslotsContainer}>
        <h3 className="header3" style={styles.header3}>
          timeslots:
        </h3>
        <Button onClick={() => navigate('/user/timeslots')} style={styles.button}>
          addTimeslots
        </Button>
      </div>
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
    marginRight: 10,
    display: "inline-block",
  },
  header2: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  timeslotsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    marginTop: 20,
  },
  header3: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 30,
  },
  profileSelection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  dropdown: {
    padding: "3px 5px",
    fontSize: 16,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px', 
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    width: '150px', 
    fontSize: '14px',
    padding: '5px 10px',
    marginRight : '30px',
  },
};

export default SettingPage;