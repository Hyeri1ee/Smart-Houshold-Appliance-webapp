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

  const resp = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER}/api/user/info`, {
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