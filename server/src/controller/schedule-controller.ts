import {Request, Response} from 'express';
import {Repository} from 'typeorm'
import {Schedule} from '../db/entities/schedule';
import {getDataSource} from '../db/db-connect';
import {Brackets} from 'typeorm';
import {User} from "../db/entities/user";
import {Time} from "../db/entities/time";
import {handleJwt} from "./jwt-helper";

const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

interface timeRange {
  start_time: string;
  end_time: string;
}

export const checkSchedule = async (req: Request, res: Response): Promise<void> => {
  let decoded;
  try {
    decoded = handleJwt(req);
  } catch (e) {
    res
      .status(400)
      .json({
        error: "authorization header missing!"
      });
    return;
  }

  const userId = decoded.user_id;

  try {
    const dataSource = await getDataSource();
    const scheduleRepository = dataSource.getRepository(Schedule);
    const timeRepository = dataSource.getRepository(Time);

    const schedule = await scheduleRepository.findOne({where: {user_id: decoded.user_id}});

    if (!schedule) {
      res.sendStatus(400);
      return;
    }

    schedule.times = await timeRepository.find({where: {schedule_id: schedule.schedule_id}});

    res.status(200).json({
      schedule: schedule
    });

  } catch (error) {
    console.error('Error fetching schedule data:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

const handleTimes = async (times: Time[], timeRepository: Repository<Time>, schedule: Schedule) => {
  const timeDatabaseEntries: Time[] = [];

  for (let i = 0; i < times.length; i++) {
    const time: Time = new Time();
    time.schedule = schedule;
    time.schedule_id = schedule.schedule_id;
    time.start_time = times[i].start_time;
    time.end_time = times[i].end_time;
    timeDatabaseEntries.push(time);
    console.log(time);
    await timeRepository.save(time);
  }

  return timeDatabaseEntries;
}

export const putSchedule = async (req: Request, res: Response) => {
  let decoded;

  try {
    decoded = handleJwt(req);
  } catch (e) {
    return res
      .status(400)
      .json({
        error: "authorization header missing!"
      });
  }

  if (req.body.weekday === undefined || req.body.weekday === null) {
    return res
      .status(400)
      .json({
        error: "weekday missing from request body"
      });
  }

  if (!req.body.times) {
    return res
      .status(400)
      .json({
        error: "times are missing from request body"
      });
  }

  const weekday = parseInt(req.body.weekday);

  if (isNaN(weekday) || !isFinite(Number(weekday)) || weekday < 0 || weekday > 6) {
    return res
      .status(400)
      .json({
        error: "weekday is not a whole number, or not between 0 and 6."
      });
  }

  if (!Array.isArray(req.body.times)) {
    return res
      .status(400)
      .json({
        error: "times is not an array!"
      });
  }

  try {
    req.body.times.forEach((t: timeRange) => {
      if (!t.start_time.match(timeRegex) || !t.end_time.match(timeRegex)) {
        throw new Error();
      }
    })
  } catch (e) {
    return res
      .status(400)
      .json({
        error: "Time is in wrong format. Make sure it's a string of HH:MM:SS"
      })
  }

  const dateSource = await getDataSource();
  const userRepository = dateSource.getRepository(User);
  const scheduleRepository = dateSource.getRepository(Schedule);
  const timesRepository = dateSource.getRepository(Time);

  const user: User | null = await userRepository.findOne({where: {user_id: decoded.user_id}});

  if (!user) {
    return res
      .status(400)
      .json({
        error: "user_id does not match any existing user."
      })
  }

  const existingScheduleForWeekday: Schedule | null = await scheduleRepository.findOne({
    where: {
      user_id: decoded.user_id,
      weekday: weekday
    }
  });

  if (existingScheduleForWeekday === null) {
    const newTimes = req.body.times;
    const newSchedule: Schedule = new Schedule();
    newSchedule.user_id = user.user_id;
    newSchedule.weekday = weekday;

    const times = await handleTimes(newTimes, timesRepository, newSchedule);

    console.log(times);

    newSchedule.times = times;
    newSchedule.user = user;

    await scheduleRepository.save(newSchedule);
    return res.sendStatus(201);
  } else {
    const times = await handleTimes(req.body.times, timesRepository, existingScheduleForWeekday);
    existingScheduleForWeekday.times = times;
    return res.sendStatus(200);
  }

}