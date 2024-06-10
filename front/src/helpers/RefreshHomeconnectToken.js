const requestAuthTokenFromRefreshToken = async (refreshToken) => {
  const requestData = {
    'grant_type': import.meta.env.VITE_REACT_APP_GRANT_TYPE_REFRESH,
    'refresh_token': refreshToken,
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
    console.error('Something went wrong when refreshing homeconnect auth token. Your refresh token most likely expired.');
    window.location.href='/login/homeconnect'
    return;
  }

  return await resp.json().access_token;
}

export const refreshAuthToken = async () => {
  const refreshToken = window.location.getItem("refresh_token");
  if (!refreshToken || refreshToken.length === 0) {
    // User not logged in, send them to homeconnect login page.
    window.location.href="/login/homeconnect";
  }

  try {
    window.sessionStorage.homeconnect_auth_token = await requestAuthTokenFromRefreshToken(refreshToken);
  } catch (e) {
    console.error("Something went wrong when refreshing your homeconnect token.");
    window.location.href="/login/homeconnect";
  }
}