import "../styles/global.css";
import "../styles/pages/Dashboard.css"
import Header from "../components/generic/Header";
import RecommendedTimeslot from "../components/dashboard/RecommendTimeslot";
import Carousel from "../components/generic/Carousel";
import {checkUserInfo} from "../helpers/CheckUserInfo";

function HtmlCode () {
  return (
    <div className="page-container">
      <div id="dashboard-wrapper">
        <Header/>
        <RecommendedTimeslot/>

        <h2>Devices</h2>
        <Carousel/>
      </div>
    </div>
  )
}

function Dashboard () {
  checkUserInfo().then(
    () => {
      return HtmlCode
    }
  )
}

export default Dashboard;