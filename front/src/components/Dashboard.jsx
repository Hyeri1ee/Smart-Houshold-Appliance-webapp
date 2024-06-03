import "./styles/global.css";
import "./styles/dashboard/dashboard.css"

// https://www.w3schools.com/js/js_cookies.asp
const getCookie = (cookie, cookieName) => {
  const name = cookieName + "=";
  const splitCookie = cookie.split(';');
  for(let i = 0; i <splitCookie.length; i++) {
    let c = splitCookie[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return undefined;
}

const parseJwt = (token) => {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}

const Dashboard = () => {
  let token;
  try {
    token = getCookie(document.cookie, "authorization");
  } catch (ignored) {}

  if (!token) {
    window.location.href = "/login";
  }

  let decoded;
  try {
    decoded = parseJwt(token);
  } catch (e) {
    window.location.href = "/login";
  }

  return (
    <>
      <h1>Dashboard for demo</h1>
      <p>Logged in user: {decoded.first_name}</p>
      <p>Your email: {decoded.email}</p>
      <a href="panels/info">Go to panel input!</a> <br/>
      <a href="user/schedule">Go to schedule!</a> <br/>
    </>
  )
}

export default Dashboard;