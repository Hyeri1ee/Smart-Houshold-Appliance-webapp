import {useNavigate} from "react-router-dom";

import "../../styles/userinfo/addtimeslot.css";

function AddTimeslot() {
    //should change later
    const navigate = useNavigate();
    const gotoAdd = () => {
        
        navigate("/login");
    };
  
    return (
      <div className="background">
        <h2 id="command">
          What time do you want
          <br /> your washing machine
          <br /> to run?
        </h2>
       
        <button id="add" onClick={gotoAdd}>Add timeslot</button>
        <button id="edit">Confirm</button>
      </div>
    );
  }
  

export default AddTimeslot;