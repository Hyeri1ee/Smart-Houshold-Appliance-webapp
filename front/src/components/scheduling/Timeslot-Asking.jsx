import {useNavigate} from "react-router-dom";
import Timeslot from "./Timeslot";

import "../../styles/userinfo/timeslotAsking-page-style.css";

function AskTimeslotPage() {
    const navigate = useNavigate();
    const gotoAdd = () => {
        
        navigate("/userinfo/addTimeslot");
    };
  
    return (
      <div className="background">
        <h2 id="command">
          What time do you want
          <br /> your washing machine
          <br /> to run?
        </h2>
        <Timeslot class ="timeslotitem"/>
        <button id="add" onClick={gotoAdd}>Add timeslot</button>
        <button id="edit">Confirm</button>
      </div>
    );
  }
  

export default AskTimeslotPage;