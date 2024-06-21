import { Request, Response } from 'express';
import { Repository, DataSource } from 'typeorm';
import { Schedule } from '../db/entities/Schedule';
import { getDataSource } from '../db/DatabaseConnect';
import { User } from "../db/entities/User";
import { Time } from "../db/entities/Time";
import { handleJwt } from "./JWTHelper";

const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

interface TimeRange {
  start_time: string;
  end_time: string;
}

export const checkSchedule = async (req: Request, res: Response): Promise<void> => {
  let decoded;
  try {
    decoded = handleJwt(req);
  } catch (e) {
    res.status(400).json({ error: "authorization header missing!" });
    return;
  }

  try {
    const dataSource = await getDataSource();
    const scheduleRepository = dataSource.getRepository(Schedule);
    const timeRepository = dataSource.getRepository(Time);

    const schedules = await scheduleRepository.find({ where: { user_id: decoded.user_id } });

    if (!schedules.length) {
      res.status(404).json({ error: "No schedule found for user." });
      return;
    }

    for (const schedule of schedules) {
      schedule.times = await timeRepository.find({ where: { schedule_id: schedule.schedule_id } });
    }

    res.status(200).json({ schedules: schedules });

  } catch (error) {
    console.error('Error fetching schedule data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const handleTimes = async (times: TimeRange[], timeRepository: Repository<Time>, schedule: Schedule) => {
  const timeDatabaseEntries: Time[] = [];

  for (const timeEntry of times) {
    const time = new Time();
    time.schedule = schedule;
    time.schedule_id = schedule.schedule_id;
    time.start_time = timeEntry.start_time;
    time.end_time = timeEntry.end_time;
    timeDatabaseEntries.push(time);
    await timeRepository.save(time);
  }

  return timeDatabaseEntries;
}

export const putSchedule = async (req: Request, res: Response) => {
  let decoded;

  try {
    decoded = handleJwt(req);
  } catch (e) {
    return res.status(400).json({ error: "authorization header missing!" });
  }

  if (!Array.isArray(req.body) || req.body.length === 0) {
    return res.status(400).json({ error: "req body is not an array or is empty!" });
  }

  for (const entry of req.body) {
    if (typeof entry.weekday === 'undefined') {
      return res.status(400).json({ error: "weekday missing from request body" });
    }

    if (!entry.times || !Array.isArray(entry.times)) {
      return res.status(400).json({ error: "times are missing from request body, or not an array." });
    }

    const weekday = parseInt(entry.weekday, 10);
    const times = entry.times;

    if (isNaN(weekday) || weekday < 0 || weekday > 6) {
      return res.status(400).json({ error: "weekday is not a whole number, or not between 0 and 6." });
    }

    try {
      times.forEach((t: TimeRange) => {
        if (!t.start_time.match(timeRegex) || !t.end_time.match(timeRegex)) {
          throw new Error();
        }
      });
    } catch (e) {
      return res.status(400).json({ error: "Time is in wrong format. Make sure it's a string of HH:MM" });
    }

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);
    const scheduleRepository = dataSource.getRepository(Schedule);
    const timesRepository = dataSource.getRepository(Time);

    const user: User | null = await userRepository.findOne({ where: { user_id: decoded.user_id } });

    if (!user) {
      return res.status(400).json({ error: "user_id does not match any existing user." });
    }

    const existingScheduleForWeekday = await scheduleRepository.findOne({
      where: {
        user_id: decoded.user_id,
        weekday: weekday
      }
    });

    await dataSource.transaction(async transactionalEntityManager => {
      if (existingScheduleForWeekday !== null) {
        await transactionalEntityManager.delete(Time, { schedule_id: existingScheduleForWeekday.schedule_id });
        await transactionalEntityManager.delete(Schedule, { schedule_id: existingScheduleForWeekday.schedule_id });
      }

      const newSchedule = scheduleRepository.create({
        user_id: user.user_id,
        weekday: weekday,
        user: user
      });

      const savedSchedule = await transactionalEntityManager.save(newSchedule);
      await handleTimes(times, transactionalEntityManager.getRepository(Time), savedSchedule);
    });
  }

  return res.sendStatus(200);
};

export const deleteSchedule = async (req: Request, res: Response) => {
  let decoded;
  try {
    decoded = handleJwt(req);
  } catch (e) {
    res.status(400).json({ error: "authorization header missing!" });
    return;
  }

  try {
    const dataSource = await getDataSource();
    const scheduleRepository = dataSource.getRepository(Schedule);
    const timeRepository = dataSource.getRepository(Time);

    const schedules = await scheduleRepository.find({ where: { user_id: decoded.user_id } });

    if (schedules.length === 0) {
      res.status(404).json({ error: "No schedules found for user." });
      return;
    }

    for (const schedule of schedules) {
      await timeRepository.delete({ schedule_id: schedule.schedule_id });
      await scheduleRepository.delete({ schedule_id: schedule.schedule_id });
    }

    res.status(200).json({ message: "All schedules deleted successfully." });

  } catch (error) {
    console.error('Error deleting schedule data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteDaySchedule = async (req: Request, res: Response) => {
  let decoded;
  try {
    decoded = handleJwt(req);
  } catch (e) {
    res.status(400).json({ error: "authorization header missing!" });
    return;
  }

  const { dayId } = req.params;

  if (!dayId) {
    res.status(400).json({ error: "dayId is missing from request parameters" });
    return;
  }

  const weekday = parseInt(dayId, 10);

  if (isNaN(weekday) || weekday < 0 || weekday > 6) {
    res.status(400).json({ error: "dayId is not a whole number, or not between 0 and 6." });
    return;
  }

  try {
    const dataSource = await getDataSource();
    const scheduleRepository = dataSource.getRepository(Schedule);
    const timeRepository = dataSource.getRepository(Time);

    const schedule = await scheduleRepository.findOne({
      where: {
        user_id: decoded.user_id,
        weekday: weekday
      }
    });

    if (!schedule) {
      res.status(404).json({ error: "No schedule found for the specified day." });
      return;
    }

    await timeRepository.delete({ schedule_id: schedule.schedule_id });
    await scheduleRepository.delete({ schedule_id: schedule.schedule_id });

    res.status(200).json({ message: `Schedule for day ${weekday} deleted successfully.` });

  } catch (error) {
    console.error('Error deleting day schedule:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
