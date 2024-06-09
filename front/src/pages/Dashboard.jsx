
import "../styles/global.css";
import "../styles/dashboard/dashboard.css";
import Carousel from "../components/generic/Carousel";

const items = [
  { text: "Washing machine",isRunning:true,  imageUrl: "https://media.croma.com/image/upload/v1655370905/Croma%20Assets/Large%20Appliances/Washers%20and%20Dryers/Images/253429_jx9ma4.png" },
  { text: "Dryer", imageUrl: "https://www.electrolux.com.ph/globalassets/appliances/dryers/edv854j3wb/edv854j3wb-fr-cl-1500x1500.1.png" },
  { text: "Oven", imageUrl: "https://sg.bertazzoni.com/media/immagini/15638_z_F6011PRO-TX.jpg" },
  { text: "Alarm", imageUrl: "https://instantalarm.com/wp-content/uploads/2017/01/6164CAN2-e1504284606174.png" }
];


// https://www.w3schools.com/js/js_cookies.asp
const getCookie = (cookie, cookieName) => {
  const name = cookieName + "=";
  const splitCookie = cookie.split(';');
  for (let i = 0; i < splitCookie.length; i++) {
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
  } catch (error) {
    console.error(error);
  }

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
    <div className="page-container">
      <h1>Dashboard</h1>
      <p>Logged in user: {decoded.first_name}</p>
      <p>Your email: {decoded.email}</p>
      <a href="panels/info">Go to panel input!</a> <br />
      <a href="user/schedule">Go to schedule!</a> <br />
      <h2 id='h2'>Devices</h2>
        <Carousel items={items} />
    </div>
  )
}

export default Dashboard;