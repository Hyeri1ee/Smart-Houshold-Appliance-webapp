import { useState } from 'react';
import { startOfWeek, addWeeks, subWeeks, eachDayOfInterval, addDays } from 'date-fns';
import ScheduleDayBox from '../components/ScheduleDayBox';
import ScheduleHeader from '../components/ScheduleHeader';

const SettingsPage = () => {
    return (
        <div style={styles.pageContainer}>
            <h1>Settings</h1>
            <div style={styles.settingsBox}>
                <p>Profile type:</p>
                <select>
                    <option>I live by myself</option>
                    <option>I live with my a partner/housemate</option>
                    <option>I live with my family</option>
                </select>
            </div>
            <div style={styles.cell}>
                <div style={styles.cellContent}>
                    <div style={styles.cellTitle}>
                        <p>Edit timeslots</p>
                    </div>
                </div>
                <div style={styles.cellAccessory}>
                    <span style={styles.chevron}>&gt;</span>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
        width: '100vw'
    },
    settingsBox: {
        width: '80%',
        display: 'flex',
        // border: '1px solid pink',
        padding: '10px 0',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cell: {
        width: '80%',
        display: 'flex',
        alignItems: 'center',
        padding: '10px 16px',
        borderBottom: '1px solid var(--whitesmoke)',
        backgroundColor: 'transparent',
        borderRadius: '10px',
        border: '1px solid var(--whitesmoke)',   
    },
    cellContent: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    cellTitle: {
        fontSize: '16px',
        color: '#000',
    },
    cellSubtitle: {
        fontSize: '14px',
        color: '#666',
    },
    cellAccessory: {
        flexShrink: 0,
        marginLeft: '12px',
    },
    chevron: {
        fontSize: '20px',
        color: '#ccc',
    },
};

export default SettingsPage;