import {NextFunction, Request, Response} from 'express';
import {User} from '../db/entities/User';
import {Schedule} from '../db/entities/Schedule';
import {Time} from '../db/entities/Time';
import {getDataSource} from '../db/DatabaseConnect';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  user_id: number;
  first_name: string;
  email: string;
  iat: number;
}

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
  adviceEndTime: string;
}

const dummyWeatherData: WeatherData[] = [
  {dt: 20240610080000, energy: 5},
  {dt: 20240610090000, energy: 10},
  {dt: 20240610100000, energy: 20}, // 2024-06-10 10:00:00 UTC
  {dt: 20240610110000, energy: 40},
  {dt: 20240610120000, energy: 80},
  {dt: 20240610130000, energy: 90},
  {dt: 20240610140000, energy: 95},
  {dt: 20240610150000, energy: 85},
  {dt: 20240610160000, energy: 75},
  {dt: 20240610170000, energy: 70},
  {dt: 20240610180000, energy: 65},
  {dt: 20240610190000, energy: 60},
  {dt: 20240610200000, energy: 55},
  {dt: 20240610210000, energy: 50},
  {dt: 20240610220000, energy: 45},
  {dt: 20240610230000, energy: 30},
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const findPeakTimes = (weatherData: WeatherData[]): WeatherData[] => {
  const sortedData = [...weatherData].sort((a, b) => b.energy - a.energy);
  return sortedData.slice(0, Math.ceil(sortedData.length * 0.25));
};
//1. know peak times
export const peakTimes = findPeakTimes(dummyWeatherData);
//2. get users with schedules in the specific weekday
const getWeekdayNumber = (): number => {
  const today = new Date();
  return today.getDay();
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
    .where('schedule.weekday = :weekday', {weekday})
    .getMany();
  for (const schedule of schedules) {
    const times = await timeRepository.find({where: {schedule_id: schedule.schedule_id}});
    const user = await userRepository.findOne({where: {user_id: schedule.user_id}});

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

  const timeDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  return timeDiff * energyPerHour;
};
const getTimeIndex = (weatherData: WeatherData[], dt: number): number => {
  return weatherData.findIndex(data => data.dt === dt);
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
export const assignSchedulesToPeakTimes = (req: Request, res: Response, next: NextFunction): void => {
  const usersWithSchedules: UserWithSchedule[] = res.locals.usersWithSchedules || [];
  const peakTimes = findPeakTimes(dummyWeatherData).sort((a, b) => a.dt - b.dt);
  const ENERGY_USAGE_PER_HOUR = 30;
  const responseResult: ResponseFormat[] = [];
  const assignedUsers: Set<number> = new Set();

  const weatherDataCopy: WeatherData[] = dummyWeatherData.map(data => ({...data}));

  for (const schedule of usersWithSchedules) {
    if (assignedUsers.has(schedule.user.user_id)) continue;

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
        responseResult.push({user: schedule.user, adviceTime: schedule.start_time, adviceEndTime: schedule.end_time});
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
          responseResult.push({user: schedule.user, adviceTime: schedule.start_time, adviceEndTime: schedule.end_time});
          assignedUsers.add(schedule.user.user_id); // Mark user as assigned
          break;
        }
      }
    }
  }
  res.locals.responseResult = responseResult;

  next();
};
//4. give information to authosized user
export const forAuthorizedUserSchedule = (req: Request, res: Response) => {
  const accessToken = req.cookies.authorization;

  if (!accessToken) {
    return res.status(401).json({message: 'Access token is missing'});
  }

  let decodedToken: DecodedToken;
  const jwtKey: string | undefined = process.env.JWT_KEY;
  try {
    decodedToken = jwt.verify(accessToken, jwtKey || '') as DecodedToken;
  } catch (err) {
    return res.status(403).json({message: 'Invalid access token'});
  }

  const authorizedUserId = decodedToken.user_id;
  const responseResult: ResponseFormat[] = res.locals.responseResult || [];

  const authorizedUserSchedule = responseResult.find(
    (schedule) => schedule.user.user_id === authorizedUserId
  );

  if (authorizedUserSchedule) {
    res.status(200).json({
      time: `${authorizedUserSchedule.adviceTime} - ${authorizedUserSchedule.adviceEndTime}`,
      date: formatDate(),
    });
  } else {
    res.status(404).json({message: 'Schedule not found for the authorized user'});
  }
};

const findSuffix = (day: number) => {
  if (day > 11 && day < 13) return 'th';
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

const formatDate = () => {
  const date = new Date();
  const day = date.getUTCDate();
  const month = monthNames[date.getUTCMonth()];

  const formattedDate = `${day}${findSuffix(day)} ${month}`;


  const currentDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const timeDiff = currentDate.getTime() - currentDate.getTime();
  const daysUntilTarget = Math.ceil(timeDiff / (1000 * 3600 * 24));


  let daysUntilText: string;
  if (daysUntilTarget === 0) {
    daysUntilText = "today";
  } else if (daysUntilTarget === 1) {
    daysUntilText = "tomorrow";
  } else if (daysUntilTarget > 1) {
    daysUntilText = `in ${daysUntilTarget} days`;
  } else {
    daysUntilText = `${Math.abs(daysUntilTarget)} day(s) ago`;
  }

  return `${formattedDate} (${daysUntilText})`;
}

export const adviceBestTime = (req: Request, res: Response) => {
  console.log(req.headers);
  res
    .status(200)
    .json({
      time: "12:30 - 15:00",
      date: formatDate(),
    });
  return;
}

