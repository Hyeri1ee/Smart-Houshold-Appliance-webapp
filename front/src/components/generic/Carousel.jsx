import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CarouselItem from './CarouselItem';
import "../../styles/dashboard/dashboard.css";

const styles = {
  carouselContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    margin: '0',
    padding: '0px',
    height: '25vh',
    width: '200wv',
    overflowX: 'scroll',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none', // firefox
    '&::WebkitScrollbar': {
      display: 'none' //hide scrollbar for webKit browsers
    }
  },
  carousel: {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
  },
};

const Carousel = () => {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchHomeAppliances = async () => {
      const accessToken = window.sessionStorage.getItem('homeconnect_simulator_auth_token');
      if (!accessToken) {
        setMessage('Sign in to Home Connect in order to see your appliances');
        return;
      }

      try {
        const response = await fetch('https://simulator.home-connect.com/api/homeappliances', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/vnd.bsh.sdk.v1+json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appliances');
        }

        const data = await response.json();
        const appliancesData = data.data.homeappliances.map(appliance => ({
          text: appliance.name,
          isRunning: false,
          imageUrl: getApplianceImage(appliance.type)
        }));

        setItems(appliancesData);
      } catch (error) {
        console.log(error);
        setMessage('Sign in to Home Connect in order to see your appliances');
      }
    };

    fetchHomeAppliances();
  }, []);

  const getApplianceImage = (type) => {
    switch (type) {
      case 'Washer':
        return "https://media.croma.com/image/upload/v1655370905/Croma%20Assets/Large%20Appliances/Washers%20and%20Dryers/Images/253429_jx9ma4.png";
      case 'Dryer':
        return "https://www.electrolux.com.ph/globalassets/appliances/dryers/edv854j3wb/edv854j3wb-fr-cl-1500x1500.1.png";
      case 'Oven':
        return "https://sg.bertazzoni.com/media/immagini/15638_z_F6011PRO-TX.jpg";
      case 'Dishwasher':
        return "https://i.postimg.cc/R0gvPbcG/1862.jpg";
      case 'FridgeFreezer':
        return "https://i.postimg.cc/B61QXBKg/pngimg-com-refrigerator-PNG101545.png"
      case 'CoffeeMaker':
        return "https://i.postimg.cc/BbB3KYQx/Automatic-Coffee-Machine-Isolated-on-transparent-background-PNG-1.png"
    }
  };

  if (message) {
    return <div>{message}</div>;
  }

  return (
    <div style={styles.carouselContainer}>
      <div style={styles.carousel}>
        {items.map((item, index) => (
          <CarouselItem key={index} text={item.text} imageUrl={item.imageUrl} isRunning={item.isRunning} />
        ))}
      </div>
    </div>
  );
};

Carousel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      isRunning: PropTypes.bool,
    })
  )
};

export default Carousel;
