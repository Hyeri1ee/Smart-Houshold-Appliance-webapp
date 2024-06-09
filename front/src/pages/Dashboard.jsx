import "../styles/global.css";
import "../styles/dashboard/dashboard.css"
import RecommendedTimeslot from "../components/dashboard/RecommendTimeslot";
import Header from "../components/generic/Header";
import {checkUserInfo} from "../helpers/CheckUserInfo";

const Dashboard = () => {
  checkUserInfo();

  return (
    <div id="dashboard-wrapper">
      <Header/>
      <RecommendedTimeslot/>
      <p>Logged in user: {decoded.first_name}</p>
      <p>Your email: {decoded.email}</p>
      <a href="panels/info">Go to panel input!</a> <br/>
      <a href="user/schedule">Go to schedule!</a> <br/>
    </div>
  )
}

export default Dashboard;