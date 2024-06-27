import React, { useState, useEffect } from 'react';
import { startOfWeek, addWeeks, subWeeks, eachDayOfInterval, addDays } from 'date-fns';
import ScheduleDayBox from '../components/ScheduleDayBox';
import ScheduleHeader from '../components/ScheduleHeader';
import { getCookie } from '../helpers/CookieHelper';

const SchedulePage = () => {
    const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [schedules, setSchedules] = useState([]);

    const fetchSchedules = async () => {
        let auth = getCookie("authorization");
        try {
            const response = await fetch('http://localhost:1337/api/schedule', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth
                }
            });

            const data = await response.json();
            setSchedules(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const nextWeek = () => {
        setCurrentWeek(addWeeks(currentWeek, 1));
    };

    const previousWeek = () => {
        setCurrentWeek(subWeeks(currentWeek, 1));
    };

    const daysOfWeek = eachDayOfInterval({
        start: currentWeek,
        end: addDays(currentWeek, 6),
    });

    return (
        <div style={styles.pageContainer}>
            <h1>Schedule</h1>
            <ScheduleHeader
                currentWeek={currentWeek}
                previousWeek={previousWeek}
                nextWeek={nextWeek}
            />
            <div style={styles.scheduleContainer}>
                {daysOfWeek.map((day, index) => {
                    const daySchedules = schedules.filter(schedule =>
                        new Date(schedule.datetime).toDateString() === day.toDateString()
                    );
                    return (
                        <ScheduleDayBox
                            key={index}
                            day={day}
                            schedules={daySchedules}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        height: '100vh',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center'
    },
    scheduleContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
    }
};

export default SchedulePage;
