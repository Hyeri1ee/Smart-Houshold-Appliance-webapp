const captureCode = (searchParams) => {
  if (!searchParams.has('code')) {
    console.error('The authorization code is missing!');
    // window.location.href = '/login/failed';
  }

  return searchParams.get('code');
};

const getToken = async (authorizationCode) => {
  const requestData = {
    'grant_type': import.meta.env.VITE_REACT_APP_GRANT_TYPE,
    'code': authorizationCode,
    'client_id': import.meta.env.VITE_REACT_APP_CLIENT_ID,
    'client_secret': import.meta.env.VITE_REACT_APP_CLIENT_SECRET,
    'redirect_uri': import.meta.env.VITE_REACT_APP_REDIRECT_URI
  };

  const resp = await fetch(`${
      import.meta.env.VITE_REACT_APP_SIMULATOR_HOMECONNECT_URL +
      import.meta.env.VITE_REACT_APP_ACCESS_AND_REFRESH_TOKEN_ENDPOINT
    }`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    body: new URLSearchParams(requestData).toString(),
  }
);

  if (!resp.ok) {
    console.error('Something went wrong when getting auth and refresh token.');
    // window.location.href = '/login/failed';
    return null;
  }

  return await resp.json();
};

function HomeConnectSimulatorLogin() {
  const searchParams = new URLSearchParams(window.location.search);
  console.log(searchParams);

  if (!searchParams || searchParams.size === 0) {
    window.location.href = `${
      import.meta.env.VITE_REACT_APP_SIMULATOR_HOMECONNECT_URL +
      import.meta.env.VITE_REACT_APP_AUTHORIZATION_CODE_ENDPOINT +
      '?response_type=' + import.meta.env.VITE_REACT_APP_RESPONSE_TYPE +
      '&client_id=' + import.meta.env.VITE_REACT_APP_CLIENT_ID
      // '&scope=IdentifyAppliance%20Monitor%20Control%20Settings%20Washer'
      // '&redirect_uri=' + encodeURIComponent(import.meta.env.VITE_REACT_APP_REDIRECT_URI)
    }`;
    return;
  }

  (async () => {
    const authorizationCode = captureCode(searchParams);

    const tokenRequestResponse = await getToken(authorizationCode);

    if (tokenRequestResponse === undefined) {
      return;
    }

    try {
      console.log('tokenRequestResponse:', tokenRequestResponse);
      window.sessionStorage.setItem('homeconnect_simulator_auth_token', tokenRequestResponse.access_token);
      window.localStorage.setItem('refresh_simulator_token', tokenRequestResponse.refresh_token);
      window.location.href = '/dashboard';
    } catch (e) {
      console.error('' +
        'Some information was missing from home-connect\'s API response. This is most likely not our fault.' +
        '\n Error:' + e.message
      );
      window.location.href='/login/failed'
    }
  })();
}

export default HomeConnectSimulatorLogin;
