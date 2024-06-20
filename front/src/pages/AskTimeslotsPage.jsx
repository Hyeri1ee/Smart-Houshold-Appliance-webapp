import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddButton from "../components/generic/AddButton";
import RemoveButton from "../components/generic/RemoveButton";
import Checkbox from "../components/generic/Checkbox";
import { getCookie } from "../helpers/CookieHelper";
import "../styles/global.css";
import "../styles/pages/AskTimeslotsPage.css";

const daysOfWeek = [
  { short: "Mo", full: "Monday", id: 0 },
  { short: "Tu", full: "Tuesday", id: 1 },
  { short: "We", full: "Wednesday", id: 2 },
  { short: "Th", full: "Thursday", id: 3 },
  { short: "Fr", full: "Friday", id: 4 },
  { short: "Sa", full: "Saturday", id: 5 },
  { short: "Su", full: "Sunday", id: 6 }
];

function AskTimeslotsPage() {
  const [showDaysModal, setShowDaysModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [tempSelectedDays, setTempSelectedDays] = useState([]);
  const [dayTimeSlots, setDayTimeSlots] = useState({});
  const [currentDay, setCurrentDay] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [allDay, setAllDay] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedule = async () => {
      const auth = getCookie('authorization');
      const response = await fetch('http://localhost:1337/api/schedule/getSchedule', {
        method: 'GET',
        headers: {
          'Authorization': auth,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const schedules = data.schedules;

        if (schedules.length > 0) {
          const scheduleMap = {};
          const selectedDays = [];

          schedules.forEach(s => {
            const day = daysOfWeek.find(d => d.id === s.weekday).short;
            selectedDays.push(day);
            scheduleMap[day] = s.times.map(time => ({
              startTime: time.start_time.slice(0, 5),
              endTime: time.end_time.slice(0, 5)
            }));
          });

          setSelectedDays(selectedDays);
          setDayTimeSlots(scheduleMap);
        } else {
          setSelectedDays([]);
          setDayTimeSlots({});
        }
      } else {
        console.error("Failed to fetch existing schedule.");
      }
    };

    fetchSchedule();
  }, []);

  const handleAddTimeslot = () => {
    setTempSelectedDays(selectedDays);
    setShowDaysModal(true);
  };

  const handleCloseDaysModal = () => {
    setTempSelectedDays([]);
    setShowDaysModal(false);
  };

  const handleSaveDays = () => {
    setSelectedDays(tempSelectedDays);
    setShowDaysModal(false);
  };

  const handleCloseTimeModal = () => {
    setShowTimeModal(false);
  };

  const handleConfirm = async () => {
    for (const day of selectedDays) {
      if (!dayTimeSlots[day] || dayTimeSlots[day].length === 0) {
        alert(`Please select a time for ${daysOfWeek.find(d => d.short === day).full}`);
        return;
      }
    }

    const auth = getCookie('authorization');

    const timeslotData = selectedDays.map(day => ({
      weekday: daysOfWeek.find(d => d.short === day).id,
      times: dayTimeSlots[day] === "All Day" ? [{ start_time: "00:00", end_time: "23:59" }] : dayTimeSlots[day].map(slot => ({
        start_time: slot.startTime,
        end_time: slot.endTime
      }))
    }));

    const putResp = await fetch('http://localhost:1337/api/schedule/putSchedule', {
      method: 'PUT',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(timeslotData)
    });

    if (!putResp.ok) {
      console.error("Fetch failed!");
      return;
    }

    navigate("/dashboard");
  };

  const handleSaveTimeslot = () => {
    if (allDay) {
      setDayTimeSlots(prevDayTimeSlots => ({
        ...prevDayTimeSlots,
        [currentDay]: "All Day"
      }));
    } else {
      setDayTimeSlots(prevDayTimeSlots => ({
        ...prevDayTimeSlots,
        [currentDay]: timeSlots
      }));
    }
    setShowTimeModal(false);
  };

  const toggleDay = (day) => {
    setTempSelectedDays(prevSelectedDays =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter(d => d !== day)
        : [...prevSelectedDays, day]
    );
  };

  const handleTimeChange = (index, field, value) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index][field] = value;
    setTimeSlots(newTimeSlots);
  };

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { startTime: "", endTime: "" }]);
  };

  const handleRemoveTimeSlot = (index) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots.splice(index, 1);
    setTimeSlots(newTimeSlots);
  };

  const handleDayModal = (day) => {
    setCurrentDay(day);
    setTimeSlots(dayTimeSlots[day] || [{ startTime: "", endTime: "" }]);
    setShowTimeModal(true);
  };

  const handleAllDay = () => {
    setAllDay(prevAllDay => !prevAllDay);
    if (!allDay) {
      setTimeSlots([]);
    } else {
      setTimeSlots(dayTimeSlots[currentDay] || []);
    }
  };

  return (
    <div className="app-container">
      <h2 className="fixed-header">When would you like to run your washing machine?</h2>
      <div className="selected-days-container">
        {selectedDays.map(day => (
          <div key={day} className="day-box" onClick={() => handleDayModal(day)}>
            <div className="primary-color">{daysOfWeek.find(d => d.short === day).full}</div>
            <div className="separator"></div>
            {dayTimeSlots[day] && typeof dayTimeSlots[day] === 'string' ? (
              <div className="time-slot-display secondary-color">
                {dayTimeSlots[day]}
              </div>
            ) : (
              dayTimeSlots[day] && dayTimeSlots[day].map((slot, index) => (
                <div key={index} className="time-slot-display secondary-color">
                  {`${slot.startTime} - ${slot.endTime}`}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
      <div className={`schedule-container ${showDaysModal || showTimeModal ? 'blurred' : ''}`}>
        {/* Content that can be blurred */}
      </div>
      <div className="button-container">
        <button type="button" onClick={handleAddTimeslot}>Add Timeslot</button>
        <button type="button" onClick={handleConfirm}>Confirm</button>
      </div>
      {showDaysModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Choose Days</h3>
            <form>
              <div className="day-selector">
                {daysOfWeek.map(day => (
                  <div
                    key={day.short}
                    className={`day-circle ${tempSelectedDays.includes(day.short) ? 'selected' : ''}`}
                    onClick={() => toggleDay(day.short)}
                  >
                    {day.short}
                  </div>
                ))}
              </div>
              <div className="modal-submit-buttons">
                <button type="button" onClick={handleSaveDays}>Save</button>
                <button type="button" onClick={handleCloseDaysModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showTimeModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Timeslot for {daysOfWeek.find(d => d.short === currentDay)?.full}</h3>
            <form>
              <div className="time-slots">
                {!allDay && timeSlots.map((slot, index) => (
                  <div key={index} className="time-slot">
                    <div className="inputs">
                      <div className="input-group">
                        <label>Start Time:</label>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => handleTimeChange(index, "startTime", e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label>End Time:</label>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => handleTimeChange(index, "endTime", e.target.value)}
                        />
                      </div>
                    </div>
                    <RemoveButton onRemove={() => handleRemoveTimeSlot(index)} />
                  </div>
                ))}
              </div>

              <div id="add-btn">
                <AddButton onClick={handleAddTimeSlot} />
              </div>
              <div id="checkbox-box">
                <Checkbox onClick={handleAllDay}>Mark all day</Checkbox>
              </div>
              <div className="modal-submit-buttons">
                <button type="button" onClick={handleSaveTimeslot}>Save</button>
                <button type="button" onClick={handleCloseTimeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AskTimeslotsPage;
