import {Request, Response} from 'express';
import {Repository} from 'typeorm'
import {Schedule} from '../db/entities/Schedule';
import {getDataSource} from '../db/DatabaseConnect';
import {User} from "../db/entities/User";
import {Time} from "../db/entities/Time";
import {handleJwt} from "./JWTHelper";

const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

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

  const dataSource = await getDataSource();
  const users = dataSource.getRepository(User);
  const user = await users.findOne({where: {user_id: decoded.user_id}});
  const profileType = (user?.profile_type);

  res.status(200).json({profileType : profileType});

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

  if (!Array.isArray(req.body)) {
    return res
      .status(400)
      .json({
        error: "req body is not an array!"
      });
  }

  for (let i = 0; i < req.body.length; i++) {
    if (!req.body[i].weekday) {
      return res
        .status(400)
        .json({
          error: "weekday missing from request body"
        });
    }

    if (!req.body[i].times || !Array.isArray(req.body[i].times)) {
      return res
        .status(400)
        .json({
          error: "times are missing from request body, or not an array."
        });
    }

    const weekday = parseInt(req.body[i].weekday);
    const times = req.body[i].times;

    if (isNaN(weekday) || !isFinite(Number(weekday)) || weekday < 0 || weekday > 6) {
      return res
        .status(400)
        .json({
          error: "weekday is not a whole number, or not between 0 and 6."
        });
    }

    try {
      times.forEach((t: timeRange) => {
        if (!t.start_time.match(timeRegex) || !t.end_time.match(timeRegex)) {
          throw new Error();
        }
      })
    } catch (e) {
      return res
        .status(400)
        .json({
          error: "Time is in wrong format. Make sure it's a string of HH:MM"
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

    
  return res.sendStatus(200);
}}

export const saveSchedule = async (req: Request, res: Response) => { 
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

  if (!Array.isArray(req.body)) {
    return res
      .status(400)
      .json({
        error: "req body is not an array!"
      });
  }

  for (let i = 0; i < req.body.length; i++) {
    if (!req.body[i].weekday) {
      return res
        .status(400)
        .json({
          error: "weekday missing from request body"
        });
    }

    if (!req.body[i].times || !Array.isArray(req.body[i].times)) {
      return res
        .status(400)
        .json({
          error: "times are missing from request body, or not an array."
        });
    }

    const weekday = parseInt(req.body[i].weekday);
    const times = req.body[i].times;

    if (isNaN(weekday) || !isFinite(Number(weekday)) || weekday < 0 || weekday > 6) {
      return res
        .status(400)
        .json({
          error: "weekday is not a whole number, or not between 0 and 6."
        });
    }

    try {
      times.forEach((t: timeRange) => {
        if (!t.start_time.match(timeRegex) || !t.end_time.match(timeRegex)) {
          throw new Error();
        }
      })
    } catch (e) {
      return res
        .status(400)
        .json({
          error: "Time is in wrong format. Make sure it's a string of HH:MM"
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

    let schedule: Schedule;

    if (existingScheduleForWeekday === null) {
      const newSchedule = scheduleRepository.create({
        user_id: user.user_id,
        weekday: weekday,
        user: user
      })

      schedule = await scheduleRepository.save(newSchedule);
      
    } else {
      schedule = existingScheduleForWeekday;
      await timesRepository.delete({ schedule_id: schedule.schedule_id });
    }
    for (const time of times) {
      const newTime = timesRepository.create({
        schedule_id: schedule.schedule_id,
        start_time: time.start_time,
        end_time: time.end_time,
        schedule: schedule
      });
    
      await timesRepository.save(newTime);
  }
   
}
return res.sendStatus(200);
}