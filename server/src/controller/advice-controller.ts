import {Request, Response} from 'express';
import {User} from '../db/entities/user';
import {Schedule} from '../db/entities/schedule';
import {Time} from '../db/entities/time';
import {getDataSource} from '../db/db-connect';
import 'dotenv/config';

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

const dummyWeatherData: WeatherData[] = [
    { dt: 20240606120000, energy: 80 }, // 2023-06-06 12:00:00 UTC
    { dt: 20240606130000, energy: 90 }, // 2023-06-06 13:00:00 UTC
    { dt: 20240606140000, energy: 95 }, // 2023-06-06 14:00:00 UTC
    { dt: 20240606150000, energy: 85 }, // 2023-06-06 15:00:00 UTC
    { dt: 20240606160000, energy: 75 }, // 2023-06-06 16:00:00 UTC
    { dt: 20240606170000, energy: 70 }, // 2023-06-06 17:00:00 UTC
    { dt: 20240606180000, energy: 65 }, // 2023-06-06 18:00:00 UTC
    { dt: 20240606190000, energy: 60 }, // 2023-06-06 19:00:00 UTC
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
    const top25Percent = sortedData.slice(0, Math.ceil(sortedData.length * 0.25));
    return top25Percent;
};

const peakTimes = findPeakTimes(dummyWeatherData);

const getUsersWithSchedules = async (date: string): Promise<UserWithSchedule[]> => {
    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);
    const scheduleRepository = dataSource.getRepository(Schedule);
    const timeRepository = dataSource.getRepository(Time);

    const usersWithSchedules: UserWithSchedule[] = [];

    //오늘 요일에 해당하는 schedule을 가진 user들을 찾는다.
    const weekday = new Date(date).getDay();
    //해당 user들의 schedule을 가져온다.
    const users = await userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.schedules', 'schedule')
      .where('schedule.weekday = :weekday', { weekday })
      .getMany();
    //해당 schedule의 time을 가져온다.
    //가져온 값들을 usersWithSchedules에 저장한다.

    return usersWithSchedules;
};

const findSuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

const formatDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = monthNames[date.getMonth()];

  const formattedDate = `${day}${findSuffix(day)} ${month}`;

  const targetDate = new Date(date.getFullYear(), 5, 7); // 7th June
  const timeDiff = targetDate.getTime() - date.getTime();
  const daysUntilTarget = Math.ceil(timeDiff / (1000 * 3600 * 24));

  let daysUntilText = '';
  if (daysUntilTarget === 0) {
      daysUntilText = "today";
  } else if (daysUntilTarget === 1) {
      daysUntilText = `in ${daysUntilTarget} day`;
  } else {
      daysUntilText = `in ${daysUntilTarget} days`;
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