
import "../styles/global.css";
import "../styles/dashboard/dashboard.css"
import RecommendedTimeslot from "../components/dashboard/RecommendTimeslot";
import {getDecodedJwt} from "../helpers/DecodeJwt";
import Header from "../components/generic/Header";
import Carousel from "../components/generic/Carousel";

const items = [
  { text: "Washing machine",isRunning:true,  imageUrl: "https://media.croma.com/image/upload/v1655370905/Croma%20Assets/Large%20Appliances/Washers%20and%20Dryers/Images/253429_jx9ma4.png" },
  { text: "Dryer", imageUrl: "https://www.electrolux.com.ph/globalassets/appliances/dryers/edv854j3wb/edv854j3wb-fr-cl-1500x1500.1.png" },
  { text: "Oven", imageUrl: "https://sg.bertazzoni.com/media/immagini/15638_z_F6011PRO-TX.jpg" },
  { text: "Alarm", imageUrl: "https://instantalarm.com/wp-content/uploads/2017/01/6164CAN2-e1504284606174.png" }
];

const Dashboard = () => {
  const decoded = getDecodedJwt();
  if (!decoded) {
    window.location.href = "/login";
  }

  return (
    <div className="page-container">
    <div id="dashboard-wrapper">
      <Header/>
      <RecommendedTimeslot/>
      <p>Logged in user: {decoded.first_name}</p>
      <p>Your email: {decoded.email}</p>
      <a href="panels/info">Go to panel input!</a> <br/>
      <a href="user/schedule">Go to schedule!</a> <br/>
      <p>Logged in user: {decoded.first_name}</p>
      <p>Your email: {decoded.email}</p>
      <a href="panels/info">Go to panel input!</a> <br />
      <a href="user/schedule">Go to schedule!</a> <br />
      <h2 id='h2'>Devices</h2>
        <Carousel items={items} />
    </div>
    </div>
  )
}

export default Dashboard;