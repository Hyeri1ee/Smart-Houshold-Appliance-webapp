import "../../styles/components/dashboard/timeslot-recommendation.css"
import {getCookie} from "../../helpers/CookieHelper";

const resp = await fetch('http://localhost:1337/api/advice', {
  method: 'GET',
  authorization: getCookie("authorization")
});

if (!resp.ok) {
  console.error("Fetch failed!");
}

const data = await resp.json();

const householdItemToUse = "Washing machine"; // In the future, this can adapt to whatever the recommendation is for.
const timeToUse = data.time;
const dateToUse = data.date;

function RecommendedTimeslot() {
  return (
  <>
  <div id='element'>
    <div id='background'>
      <header className="image-background-text">Best time to use</header>
      <p className="image-background-text" id="item">{householdItemToUse}</p>
      <p className="image-background-text" id="time">{timeToUse}</p>
      <p className="image-background-text" id="time">{dateToUse}</p>
      <button className="image-background-text">Add to schedule</button>
    </div>
  </div>
  </>
  );
}

export default RecommendedTimeslot;