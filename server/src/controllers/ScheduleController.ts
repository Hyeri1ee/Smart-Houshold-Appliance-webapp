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
export const checkprofileTypeandDefaultSchedule = async (req: Request, res: Response): Promise<void> => {
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
  
  try{
    const dataSource = await getDataSource();
    const timeRepository = dataSource.getRepository(Time);
    const users = dataSource.getRepository(User);
    const user = await users.findOne({where: {user_id: decoded.user_id}});
    const profileType = (user?.profile_type);

    res.status(200).json({profileType: profileType});
  }
  catch (error) {
    console.error('Error fetching profileType data:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }

};
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

  try {
    const dataSource = await getDataSource();
    const scheduleRepository = dataSource.getRepository(Schedule);
    const timeRepository = dataSource.getRepository(Time);
    const users = dataSource.getRepository(User);
    const user = await users.findOne({where: {user_id: decoded.user_id}});
    const profileType = (user?.profile_type);

    //set default schedule basedon profile type
    switch (profileType) {
      case 1:
        //mon 0 - sun 6 까지 all day 를 schedule에 넣어서 보내줘야함
        for (let i = 0; i < 7; i++) {
          const schedule = await scheduleRepository.findOne({where: {user_id: decoded.user_id, weekday: i}});
          if (!schedule) {
            //save schedule
            const newSchedule = new Schedule();
            newSchedule.user_id = decoded.user_id;
            newSchedule.weekday = i;
            await scheduleRepository.save(newSchedule);

            //save time
            const newTime = new Time();
            newTime.schedule_id = newSchedule.schedule_id;
            newTime.start_time = '00:00';
            newTime.end_time = '23:59';
            newTime.schedule = newSchedule;
            await timeRepository.save(newTime);
          }
        }
        break;
      case 2:
        //mon 0 - fri 4 까지 오후 6시부터 10시까지 schedule에 넣어서 보내줘야함
        for (let i = 0; i < 5; i++) {
          const schedule = await scheduleRepository.findOne({where: {user_id: decoded.user_id, weekday: i}});
          if (!schedule) {
            //save schedule
            const newSchedule = new Schedule();
            newSchedule.user_id = decoded.user_id;
            newSchedule.weekday = i;
            await scheduleRepository.save(newSchedule);

            //save time
            const newTime = new Time();
            newTime.schedule_id = newSchedule.schedule_id;
            newTime.start_time = '18:00';
            newTime.end_time = '23:59';
            newTime.schedule = newSchedule;
            await timeRepository.save(newTime);
          }
        }
        break;
      case 3:
        //mon 0 - fri 4 까지 오후 1시부터 5시까지 schedule에 넣어서 보내줘야함
        for (let i = 0; i < 5; i++) {
          const schedule = await scheduleRepository.findOne({where: {user_id: decoded.user_id, weekday: i}});
          if (!schedule) {
            //save schedule
            const newSchedule = new Schedule();
            newSchedule.user_id = decoded.user_id;
            newSchedule.weekday = i;
            await scheduleRepository.save(newSchedule);

            //save time
            const newTime = new Time();
            newTime.schedule_id = newSchedule.schedule_id;
            newTime.start_time = '13:00';
            newTime.end_time = '17:00';
            newTime.schedule = newSchedule;
            await timeRepository.save(newTime);
          }
        }
        break;
    }
    const schedule = await scheduleRepository.find({where: {user_id: decoded.user_id}});

    if (!schedule) {
      res.sendStatus(400);
      return;
    }
    //shcedule의 weekday 별로 time을 가져와서 json으로 만들어서 보내줘야함
    const result = [];

  for (const s of schedule) {
    const times = await timeRepository.find({ where: { schedule_id: s.schedule_id } });
    const timesArray = times.map(t => ({
      start_time: t.start_time,
      end_time: t.end_time
    }));

    result.push({
      weekday: s.weekday,
      times: timesArray
    });
  }

  res.status(200).json(result);

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

    if (existingScheduleForWeekday === null) {
      const newSchedule = scheduleRepository.create({
        user_id: user.user_id,
        weekday: weekday,
        times: times,
        user: user
      })

      scheduleRepository.save(newSchedule);
      
      // const newSchedule: Schedule = new Schedule();
      // newSchedule.user_id = user.user_id;
      // newSchedule.weekday = weekday;

      // newSchedule.times = await handleTimes(newTimes, timesRepository, newSchedule);
      // newSchedule.user = user;

      // await scheduleRepository.save(newSchedule);
      
      // console.log('schedule id: %d', newSchedule.schedule_id);
      console.log(await scheduleRepository.findOne({where: {user: user}}));
    } else {
      existingScheduleForWeekday.times = await handleTimes(times, timesRepository, existingScheduleForWeekday);
      await scheduleRepository.save(existingScheduleForWeekday);
    }
  }
  return res.sendStatus(200);
}
