const captureCode = (searchParams) => {
  // grant_type and code are mandatory in the response from home-connect. If these aren't present, something went wrong.
  if (!searchParams.has('grant_type') || !searchParams.has('code')) {
    console.error('One of grant_type or code is missing!');
    window.location.href='/login/failed';
  }

  return searchParams.get('code');
}

const getToken = async (authorizationCode) => {
  const requestData = {
    'grant_type': import.meta.env.VITE_REACT_APP_GRANT_TYPE,
    'code': authorizationCode,
    'client_id': import.meta.env.VITE_REACT_APP_CLIENT_ID,
    'client_secret': import.meta.env.VITE_REACT_APP_CLIENT_SECRET,
  }

  const resp = await fetch(`${
      import.meta.env.VITE_REACT_APP_BASE_HOMECONNECT_URL +
      import.meta.env.VITE_REACT_APP_ACCESS_AND_REFRESH_TOKEN_ENDPOINT
    }`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // In the new block because it needs to be x-www-form-urlencoded iirc, code from the prototype
      body: new URLSearchParams(requestData).toString()
    }
  );

  if (!resp.ok) {
    console.error('Something went wrong when getting auth and refresh token.');
    window.location.href='/login/failed'
    return;
  }

  return await resp.json();
};

function HomeConnectLogin() {
  const searchParams = new URLSearchParams(window.location.search);
  console.log(searchParams);
  // Checks if the user has already logged in. If not, then the client is asked to log in.
  if (!searchParams || searchParams.size === 0) {
    // Redirect to login page.
    window.location.href = `${
      import.meta.env.VITE_REACT_APP_BASE_HOMECONNECT_URL +
      import.meta.env.VITE_REACT_APP_AUTHORIZATION_CODE_ENDPOINT +
      '?response_type=' + import.meta.env.VITE_REACT_APP_RESPONSE_TYPE +
      '&client_id=' + import.meta.env.VITE_REACT_APP_CLIENT_ID
    }`
    return;
  }

  // Run async code in the main function without making a whole separate function
  (async () => {
    // If the user already logged in, the code is captured.
    // This code is used to make an access token request within 10 minutes.
    const authorizationCode = captureCode(searchParams);

    const tokenRequestResponse = await getToken(authorizationCode);

    if (tokenRequestResponse === undefined) {
      return;
    }

    // Set refresh and auth token
    // In a try block in case some info is missing. If any is, then the catch block is used.
    try {
      console.log("tokenRequestResponse: " + tokenRequestResponse);
      window.sessionStorage.homeconnect_auth_token = tokenRequestResponse.access_token;
      window.localStorage.refresh_token = tokenRequestResponse.refresh_token;
      window.location.href="/pages"; // Sign in successful.
    } catch (e) {
      console.error('' +
        'Some information was missing from home-connect\'s API response. This is most likely not our fault.' +
        '\n Error:' + e.message
      );
      window.location.href='/login/failed'
    }
  })();
}

export default HomeConnectLogin