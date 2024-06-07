import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../db/entities/user';
import { Schedule } from '../db/entities/schedule';
import { Time } from '../db/entities/time';
import { getDataSource } from '../db/db-connect';
import { UserJwtPayload } from './jwt-helper';
import axios from 'axios';
import 'dotenv/config';
import { NextFunction } from 'express';

interface WeatherData {
    dt: number; 
    energy: number; 
}
interface UserWithSchedule {
    user: User;
    weekday: number;
    start_time: string;
    end_time: string;
}
interface ResponseFormat {
    user: User;
    adviceTime: string;
}
interface PeakTime {
    dt: number;  
    energy: number;
  }

const dummyWeatherData: WeatherData[] = [
{ dt: 20240607080000, energy: 5 }, // 2023-06-07 08:00:00 UTC
{ dt: 20240607090000, energy: 10 }, // 2023-06-07 09:00:00 UTC
{ dt: 20240607100000, energy: 20 }, // 2023-06-07 10:00:00 UTC
{ dt: 20240607110000, energy: 40 }, // 2023-06-07 11:00:00 UTC
{ dt: 20240607120000, energy: 80 }, // 2023-06-07 12:00:00 UTC
{ dt: 20240607130000, energy: 90 }, // 2023-06-07 13:00:00 UTC
{ dt: 20240607140000, energy: 95 }, // 2023-06-07 14:00:00 UTC
{ dt: 20240607150000, energy: 85 }, // 2023-06-07 15:00:00 UTC
{ dt: 20240607160000, energy: 75 }, // 2023-06-07 16:00:00 UTC
{ dt: 20240607170000, energy: 70 }, // 2023-06-07 17:00:00 UTC
{ dt: 20240607180000, energy: 65 }, // 2023-06-07 18:00:00 UTC
{ dt: 20240607190000, energy: 60 }, // 2023-06-07 19:00:00 UTC
{ dt: 20240607200000, energy: 55 }, // 2023-06-07 20:00:00 UTC
{ dt: 20240607210000, energy: 50 }, // 2023-06-07 21:00:00 UTC
{ dt: 20240607220000, energy: 45 }, // 2023-06-07 22:00:00 UTC
{ dt: 20240607230000, energy: 30 }, // 2023-06-07 23:00:00 UTC
];

const findPeakTimes = (weatherData: WeatherData[]): WeatherData[] => {
    const sortedData = [...weatherData].sort((a, b) => b.energy - a.energy);
    const top25Percent = sortedData.slice(0, Math.ceil(sortedData.length * 0.25));
    return top25Percent;
};
//1. know peak times
export const peakTimes = findPeakTimes(dummyWeatherData);
//2. get users with schedules in the specific weekday
const getWeekdayNumber = (): number => {
    const today = new Date();
    const dayIndex = today.getDay();
    return dayIndex;
  };

export const getUsersWithSchedules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);
    const scheduleRepository = dataSource.getRepository(Schedule);
    const timeRepository = dataSource.getRepository(Time);

    const usersWithSchedules: UserWithSchedule[] = [];

    const weekday = getWeekdayNumber();

    const schedules = await scheduleRepository
        .createQueryBuilder('schedule')
        .where('schedule.weekday = :weekday', { weekday })
        .getMany();

        const times: Time[] = [];
    for (const schedule of schedules) {
        const times = await timeRepository.find({ where: { schedule_id: schedule.schedule_id } });
        const user = await userRepository.findOne({ where: { user_id: schedule.user_id } });
    
        if (user) {
            for (const time of times) {
            usersWithSchedules.push({
                user,
                weekday,
                start_time: time.start_time,
                end_time: time.end_time,
            });
            }
        }
        }
    const uniqueUsersWithSchedules = usersWithSchedules.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.user.user_id === value.user.user_id && t.start_time === value.start_time && t.end_time === value.end_time
        ))
        );
    usersWithSchedules.sort((a, b) => a.start_time.localeCompare(b.start_time));
    res.locals.usersWithSchedules = uniqueUsersWithSchedules;
    next();
};
export const calculateEnergyUsage = (startTime: string, endTime: string, energyPerHour: number): number => {
    const [startHour, startMinute, startSecond] = startTime.split(':').map(Number);
    const [endHour, endMinute, endSecond] = endTime.split(':').map(Number);

    const startDate = new Date(0, 0, 0, startHour, startMinute, startSecond);
    const endDate = new Date(0, 0, 0, endHour, endMinute, endSecond);

    const timeDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60); // 시간 차이 계산 (시간 단위)
    return timeDiff * energyPerHour;
};
const getTimeIndex = (weatherData: WeatherData[], dt: number): number => {
    return weatherData.findIndex(data => data.dt === dt);
};
const isWithinPeakTime = (scheduleStartTime: number, scheduleEndTime: number, peakTime: WeatherData): boolean => {
    const peakStartTime = peakTime.dt;
    const peakEndTime = peakTime.dt + 10000; // 1시간 후

    return (scheduleStartTime < peakEndTime && scheduleEndTime > peakStartTime);
};
const parseTime = (timeStr: string): number => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
};

const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
//3. peak times scheduling
export const assignSchedulesToPeakTimes = (req: Request, res: Response): void => {
    const usersWithSchedules: UserWithSchedule[] = res.locals.usersWithSchedules || [];
    const peakTimes = findPeakTimes(dummyWeatherData).sort((a, b) => a.dt - b.dt);
    const ENERGY_USAGE_PER_HOUR = 30;
    const responseResult: ResponseFormat[] = [];
    const assignedUsers: Set<number> = new Set(); // To track users with assigned advice times

    const weatherDataCopy: WeatherData[] = dummyWeatherData.map(data => ({ ...data }));

    for (const schedule of usersWithSchedules) {
        if (assignedUsers.has(schedule.user.user_id)) continue; // Skip if user already has an assigned advice time

        let assigned = false;

        const scheduleStartSeconds = parseTime(schedule.start_time);
        const scheduleEndSeconds = parseTime(schedule.end_time);

        for (const peak of peakTimes) {
            const peakStartIndex = getTimeIndex(weatherDataCopy, peak.dt);
            if (peakStartIndex === -1) continue;

            let canAssign = true;
            let remainingScheduleSeconds = scheduleEndSeconds - scheduleStartSeconds;

            for (let i = peakStartIndex; i < weatherDataCopy.length && remainingScheduleSeconds > 0; i++) {
                const data = weatherDataCopy[i];
                const peakStartSeconds = parseTime(formatTime(data.dt % 1000000));
                const peakEndSeconds = peakStartSeconds + 3600;

                const overlapStartSeconds = Math.max(scheduleStartSeconds, peakStartSeconds);
                const overlapEndSeconds = Math.min(scheduleEndSeconds, peakEndSeconds);
                const overlapSeconds = Math.max(0, overlapEndSeconds - overlapStartSeconds);

                const energyUsage = (overlapSeconds / 3600) * ENERGY_USAGE_PER_HOUR;

                if (data.energy < energyUsage) {
                    canAssign = false;
                    break;
                }
                data.energy -= energyUsage;
                remainingScheduleSeconds -= overlapSeconds;
            }

            if (canAssign) {
                responseResult.push({ user: schedule.user, adviceTime: schedule.start_time });
                assigned = true;
                assignedUsers.add(schedule.user.user_id); // Mark user as assigned
                break;
            }
        }

        if (!assigned) {
            for (const nonPeak of dummyWeatherData) {
                const nonPeakStartIndex = getTimeIndex(weatherDataCopy, nonPeak.dt);
                if (nonPeakStartIndex === -1) continue;

                let canAssign = true;
                let remainingScheduleSeconds = scheduleEndSeconds - scheduleStartSeconds;

                for (let i = nonPeakStartIndex; i < weatherDataCopy.length && remainingScheduleSeconds > 0; i++) {
                    const data = weatherDataCopy[i];
                    const nonPeakStartSeconds = parseTime(formatTime(data.dt % 1000000));
                    const nonPeakEndSeconds = nonPeakStartSeconds + 3600;

                    const overlapStartSeconds = Math.max(scheduleStartSeconds, nonPeakStartSeconds);
                    const overlapEndSeconds = Math.min(scheduleEndSeconds, nonPeakEndSeconds);
                    const overlapSeconds = Math.max(0, overlapEndSeconds - overlapStartSeconds);

                    const energyUsage = (overlapSeconds / 3600) * ENERGY_USAGE_PER_HOUR;

                    if (data.energy < energyUsage) {
                        canAssign = false;
                        break;
                    }
                    data.energy -= energyUsage;
                    remainingScheduleSeconds -= overlapSeconds;
                }

                if (canAssign) {
                    responseResult.push({ user: schedule.user, adviceTime: schedule.start_time });
                    assignedUsers.add(schedule.user.user_id); // Mark user as assigned
                    break;
                }
            }
        }
    }

    res.status(200).json(responseResult);
};
