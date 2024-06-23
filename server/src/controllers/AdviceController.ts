import { NextFunction, Request, Response } from 'express';
import { handleJwt } from './JWTHelper';
import 'dotenv/config';
import { getDataSource } from '../db/DatabaseConnect';
import { Schedule } from '../db/entities/Schedule';
import { Time } from '../db/entities/Time';
import { User } from '../db/entities/User';
import { sendPushNotification } from '../webPushService';

interface WeatherData {
  epoch: number;
  energy: number;
}

const peakPercentage = 0.25;

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function calculateBellCurveEnergy(hour: number, peakHour: number, peakEnergy: number, spread: number): number {
  const exponent = -Math.pow(hour - peakHour, 2) / (2 * Math.pow(spread, 2));
  const energy = peakEnergy * Math.exp(exponent);
  return Math.round(energy);
}

function generateWeatherData(): WeatherData[] {
  const weatherData: WeatherData[] = [];
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

const washerRunTime = 5400000;

const findPeakTimes = (weatherData: WeatherData[]): WeatherData[] => {
  const sortedData = [...weatherData].sort((a, b) => b.energy - a.energy);
  return sortedData.slice(0, Math.ceil(sortedData.length * peakPercentage));
};

const getTimeIndex = (weatherData: WeatherData[], epoch: number): number => {
  return weatherData.findIndex(data => data.epoch === epoch);
};

const parseTime = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 3600 + minutes * 60;
};

const formatTime = (epoch: number): string => {
  const date = new Date(epoch);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const formatDate = (): string => {
  const date = new Date();
  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];

  const formattedDate = `${day}${findSuffix(day)} ${month}`;

  return `${formattedDate}`;
};

const findSuffix = (day: number): string => {
  if (day > 11 && day < 13) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

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
};

export const assignSchedulesToPeakTimes = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  let decoded;
  try {
    decoded = handleJwt(req);
    console.log('JWT decoded:', decoded);
  } catch (e) {
    console.log('JWT decoding failed:', e);
    return res.status(400).json({ message: 'Authentication failed' });
  }

  const peakTimes = findPeakTimes(dummyWeatherData).sort((a, b) => a.epoch - b.epoch);
  const weatherDataCopy: WeatherData[] = dummyWeatherData.map(data => ({ ...data }));

  const dataSource = await getDataSource();

  const schedule = await dataSource.getRepository(Schedule).findOne({ where: { user_id: decoded.user_id } });
  const user = await dataSource.getRepository(User).findOne({ where: { user_id: decoded.user_id } });

  if (!schedule) {
    return res.status(400).json({ error: 'Schedule not found' });
  }

  const times = await dataSource.getRepository(Time).find({ where: { schedule_id: schedule.schedule_id } });

  let maxOverlapSeconds = -1;
  let recommendation = { start: '', end: '' };

  const date = formatDate();

  for (const time of times) {
    const scheduleStartSeconds = parseTime(time.start_time);
    const scheduleEndSeconds = parseTime(time.end_time);

    for (const peak of peakTimes) {
      const peakStartIndex = getTimeIndex(weatherDataCopy, peak.epoch);
      if (peakStartIndex === -1) {
        break;
      }

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

  let time;
  if (maxOverlapSeconds !== -1) {
    time = `${recommendation.start} - ${recommendation.end}`;
  } else {
    const peak = findOptimal(dummyWeatherData);
    if (!peak) {
      return res.sendStatus(500);
    }
    const secondsEpoch = peak.epoch;
    const start = formatTime(secondsEpoch);
    const end = formatTime(secondsEpoch + washerRunTime);
    time = `${start} - ${end}`;
  }

  const message = `The best time to use your washing machine is ${time} on ${date}`;

  return res.status(200).json({ time, date });
};

export const sendRecommendationNotification = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  let decoded;
  try {
    decoded = handleJwt(req);
    console.log('JWT decoded:', decoded);
  } catch (e) {
    console.log('JWT decoding failed:', e);
    return res.status(400).json({ message: 'Authentication failed' });
  }

  const { notificationToken } = req.body;
  console.log('Received notification token:', notificationToken);

  if (!notificationToken) {
    return res.status(400).json({ error: 'No notification token provided' });
  }

  const dataSource = await getDataSource();
  const user = await dataSource.getRepository(User).findOne({ where: { user_id: decoded.user_id } });

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const peakTimes = findPeakTimes(dummyWeatherData).sort((a, b) => a.epoch - b.epoch);
  const weatherDataCopy: WeatherData[] = dummyWeatherData.map(data => ({ ...data }));

  const schedule = await dataSource.getRepository(Schedule).findOne({ where: { user_id: decoded.user_id } });

  if (!schedule) {
    return res.status(400).json({ error: 'Schedule not found' });
  }

  const times = await dataSource.getRepository(Time).find({ where: { schedule_id: schedule.schedule_id } });

  let maxOverlapSeconds = -1;
  let recommendation = { start: '', end: '' };

  const date = formatDate();

  for (const time of times) {
    const scheduleStartSeconds = parseTime(time.start_time);
    const scheduleEndSeconds = parseTime(time.end_time);

    for (const peak of peakTimes) {
      const peakStartIndex = getTimeIndex(weatherDataCopy, peak.epoch);
      if (peakStartIndex === -1) {
        break;
      }

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

  let time;
  if (maxOverlapSeconds !== -1) {
    time = `${recommendation.start} - ${recommendation.end}`;
  } else {
    const peak = findOptimal(dummyWeatherData);
    if (!peak) {
      return res.sendStatus(500);
    }
    const secondsEpoch = peak.epoch;
    const start = formatTime(secondsEpoch);
    const end = formatTime(secondsEpoch + washerRunTime);
    time = `${start} - ${end}`;
  }

  const message = `The best time to use your washing machine is ${time} on ${date}`;
  console.log('Final message:', message);

  await sendPushNotification(notificationToken, message);

  return res.status(200).json({ message: 'Notification sent' });
};

export const saveSubscription = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  let decoded;
  try {
    decoded = handleJwt(req);
    console.log('JWT decoded:', decoded);
  } catch (e) {
    console.log('JWT decoding failed:', e);
    return res.status(400).json({ message: 'Authentication failed' });
  }

  const { subscription } = req.body;
  console.log('Received subscription:', subscription);

  if (!subscription) {
    return res.status(400).json({ error: 'No subscription provided' });
  }

  const dataSource = await getDataSource();
  const user = await dataSource.getRepository(User).findOne({ where: { user_id: decoded.user_id } });

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  user.subscription = subscription;
  await dataSource.getRepository(User).save(user);

  return res.status(200).json({ message: 'Subscription saved' });
};
