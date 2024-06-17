import {NextFunction, Request, Response} from 'express';
import {handleJwt} from "./JWTHelper";
import 'dotenv/config';
import {getDataSource} from "../db/DatabaseConnect";
import {Schedule} from "../db/entities/Schedule";
import {Time} from "../db/entities/Time";
import * as string_decoder from "node:string_decoder";

interface WeatherData {
  epoch: number;
  energy: number;
}

const peakPercentage = 0.25;

const months = [
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

function calculateBellCurveEnergy(hour: number, peakHour: number, peakEnergy: number, spread: number) {
  const exponent = -Math.pow(hour - peakHour, 2) / (2 * Math.pow(spread, 2));
  const energy = peakEnergy * Math.exp(exponent);
  return Math.round(energy);
}

function generateWeatherData() {
  const weatherData = [];
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);

  const peakHour = 12;
  const peakEnergy = 100;
  const spread = 6;

  for (let i = 0; i < 24; i++) {
    const currentEpoch = baseDate.getTime() + (i * 3600000);
    const energy = calculateBellCurveEnergy(i, peakHour, peakEnergy, spread);
    weatherData.push({ epoch: currentEpoch, energy: energy });
  }

  return weatherData;
}

const dummyWeatherData = generateWeatherData();
console.log(dummyWeatherData);


const washerRunTime = 5400000;

const findPeakTimes = (weatherData: WeatherData[]): WeatherData[] => {
  const sortedData = [...weatherData].sort((a, b) => b.energy - a.energy);
  return sortedData.slice(0, Math.ceil(sortedData.length * peakPercentage));
};

const getTimeIndex = (weatherData: WeatherData[], epoch: number): number => {
  return weatherData.findIndex(data => data.epoch === epoch);
};

const parseTime = (timeStr: string): number => {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

const formatTime = (epoch: number): string => {
  const date = new Date(epoch);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const formatDate = () => {
  const date = new Date();
  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];

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

const findOptimal = (data: WeatherData[]): WeatherData | null => {
  if (data.length === 0) {
    return null;
  }

  let highestEnergyData = data[0];

  for (const entry of data) {
    if (entry.energy > highestEnergyData.energy) {
      highestEnergyData = entry;
    }
  }

  return highestEnergyData;
}

export const assignSchedulesToPeakTimes = async (req: Request, res: Response, next: NextFunction) => {
  let decoded;
  try {
    decoded = handleJwt(req);
  } catch (e) {
    return res
      .status(400)
      .json({
        message: 'Authentication failed',
      });
  }

  const peakTimes =
    findPeakTimes(dummyWeatherData).sort((a, b) => a.epoch - b.epoch);

  const weatherDataCopy: WeatherData[] = dummyWeatherData.map(data => ({...data}));

  const dataSource = await getDataSource();

  const schedule=
    await dataSource.getRepository(Schedule).findOne({where: {user_id: decoded.user_id}});

  console.log(schedule);

  if (!schedule) {
    return res
      .status(400)
      .json({
        error: 'Schedule not found',
      });
  }

  const times =
  await dataSource.getRepository(Time).find({where: {schedule_id: schedule.schedule_id}})

  let maxOverlapSeconds = -1;
  let recommendation = {
    start: '' as string,
    end: '' as string,
  };

  const date = formatDate();

  for (const time of times) {
    const scheduleStartSeconds = parseTime(time.start_time);
    const scheduleEndSeconds = parseTime(time.end_time);

    for (const peak of peakTimes) {
      const peakStartIndex = getTimeIndex(weatherDataCopy, peak.epoch);
      if (peakStartIndex === -1) { break; }

      let remainingScheduleSeconds = scheduleEndSeconds - scheduleStartSeconds;

      for (let i = peakStartIndex; i < weatherDataCopy.length && remainingScheduleSeconds > 0; i++) {
        const data = weatherDataCopy[i];
        const peakStartSeconds = parseTime(formatTime(data.epoch % 1000000));
        const peakEndSeconds = peakStartSeconds + 3600;

        const overlapStartSeconds = Math.max(scheduleStartSeconds, peakStartSeconds);
        const overlapEndSeconds = Math.min(scheduleEndSeconds, peakEndSeconds);
        const overlapSeconds = Math.max(0, overlapEndSeconds - overlapStartSeconds);
        if (overlapSeconds > maxOverlapSeconds) {
          maxOverlapSeconds = overlapSeconds;
          recommendation.start = formatTime(overlapSeconds);
          recommendation.end = formatTime(overlapSeconds + washerRunTime);
        }
      }
    }
  }

  if (maxOverlapSeconds !== -1) {
    // Overlap between peaks and schedule found!
    const time = `${recommendation.start} - ${recommendation.end}`

    return res
      .status(200)
      .json({
        time,
        date
      });
  }

  const peak = findOptimal(dummyWeatherData);
  if (!peak) {
    return res.sendStatus(500);
  }

  const secondsEpoch = peak.epoch;

  const start = formatTime(secondsEpoch);
  const end = formatTime(secondsEpoch + washerRunTime);

  const time = `${start} - ${end}`

  console.log("recommending absolute best")

  return res
    .status(200)
    .json({
      time,
      date
    });
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

