import React, { useState } from 'react';

const HomeAppliancesSimulator = () => {
  const [appliances, setAppliances] = useState([]);
  const [initialized, setInitialized] = useState(false);

  const fetchHomeAppliances = async () => {
    const accessToken = window.sessionStorage.getItem('homeconnect_simulator_auth_token');

    console.log('Access Token:', accessToken);
    if (!accessToken) {
      console.error('No access token found.');
      window.location.href = '/login';
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

      const data = await response.json();
      setAppliances(data.data.homeappliances);

    } catch (error) {
      console.log(error);
    }
  };

  if (!initialized) {
    fetchHomeAppliances();
    setInitialized(true);
  }

  return (
    <div>
      <h1>Home Appliances</h1>
      <ul>
        {appliances.map((appliance) => (
          <li key={appliance.haId}>
            <h2>Name: {appliance.name}</h2>
            <p>Brand: {appliance.brand}</p>
            <p>Type: {appliance.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomeAppliancesSimulator;
