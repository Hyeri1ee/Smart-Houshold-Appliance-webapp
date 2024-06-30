import {getCookie} from "./CookieHelper";

const urlPattern = /https?:\/\/[^\/]+(\/.*)/;

const redirect = (url) => {
  const match = window.location.toString().match(urlPattern);
  const windowLocation = match ? match[1] : '/';

  if (windowLocation !== url) {
    window.location.href = url;
  }
}

export const checkUserInfo = async () => {
  let auth;
  try {
    auth = getCookie("authorization");
  } catch (e) {
    console.log("user not signed in");
    redirect("/login")
  }

  // if (!localStorage.getItem('refresh_token') && !localStorage.getItem('refresh_simulator_token')) {
  //   redirect("/login/homeconnect");
  // }

  const resp = await fetch('http://localhost:1337/api/user/info', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'authorization': auth,
    },
  });

  const data = await resp.json();
  try {
    redirect(data.redirect);
  } catch (ignored) {}
}