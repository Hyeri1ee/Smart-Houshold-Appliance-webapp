import {getCookie} from "./CookieHelper";

export const checkUserInfo = async () => {
  const resp = await fetch('http://localhost:1337/api/user/info', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'authorization': getCookie('authorization'),
    },
  });

  if (!resp.ok) {
    const data = await resp.json();
    location.href=data.redirect;
  }
}