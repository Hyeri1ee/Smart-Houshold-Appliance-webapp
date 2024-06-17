import { useState } from 'react';
import { startOfWeek, addWeeks, subWeeks, eachDayOfInterval, addDays } from 'date-fns';
import ScheduleDayBox from '../components/ScheduleDayBox';
import ScheduleHeader from '../components/ScheduleHeader';

const SchedulePage = () => {
    const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

    const nextWeek = () => {
        setCurrentWeek(addWeeks(currentWeek, 1));
    };

    const previousWeek = () => {
        setCurrentWeek(subWeeks(currentWeek, 1));
    };

    const daysOfWeek = eachDayOfInterval({
        start: currentWeek,
        end: addDays(currentWeek, 3),
    });

    const times = [
        {
            startTime: '10:30',
            endTime: '11:45',
        },
        {
            startTime: '12:45',
            endTime: '13:15',
        },
        {
            startTime: '15:35',
            endTime: '16:15',
        },
        {
            startTime: '12:30',
            endTime: '14:05',
        },
    ];

    const appliances = ['Washing machine', 'Dryer', 'Oven', 'Washing machine'];
    const programs = ['Cotton Eco', 'Drying', 'Cooking', 'Delicates'];
    const isAdvice = [false, true, false, false];

    return (
        <div style={styles.pageContainer}>
            <h1>Schedule</h1>
            <ScheduleHeader
                currentWeek={currentWeek}
                previousWeek={previousWeek}
                nextWeek={nextWeek}
            />
            {daysOfWeek.map((day, index) => (
                <ScheduleDayBox
                    key={day}
                    day={day}
                    startTime={times[index % times.length].startTime}
                    endTime={times[index % times.length].endTime}
                    appliance={appliances[index % appliances.length]}
                    program={programs[index % programs.length]}
                    isAdvice={isAdvice[index % isAdvice.length]}
                />
            ))}
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
    }
};

export default SchedulePage;
