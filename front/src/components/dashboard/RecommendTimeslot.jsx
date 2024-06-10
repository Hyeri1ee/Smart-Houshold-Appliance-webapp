import "../../styles/components/dashboard/timeslot-recommendation.css"
import {getCookie} from "../../helpers/CookieHelper";

const resp = await fetch('http://localhost:1337/api/advice', {
  method: 'GET',
  headers: {
    authorization: getCookie("authorization"),
  },
});

const data = await resp.json();

const householdItemToUse = "Washing machine"; // In the future, this can adapt to whatever the recommendation is for.
const timeToUse = data.time;
const dateToUse = data.date;

function RecommendedTimeslot() {
  if (!resp.ok) {
    console.error("Fetch failed!");
    return (
      <>
        <div id='element'>
          <div id='background'>
            <p className="image-background-text" id="error">No advice at the moment</p>
          </div>
        </div>
      </>
    );
  }

  return (
  <>
  <div id='element'>
    <div id='background'>
      <header className="image-background-text">Best time to use</header>
      <p className="image-background-text" id="item">{householdItemToUse}</p>
      <p className="image-background-text" id="time">{timeToUse}</p>
      <p className="image-background-text" id="day">{dateToUse}</p>
      <button className="image-background-text">Add to schedule</button>
    </div>
  </div>
  </>
  );
}

export default RecommendedTimeslot;