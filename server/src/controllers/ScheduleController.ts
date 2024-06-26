import { Request, Response } from 'express';
import schedule from "node-schedule";
import dotenv from 'dotenv';
import {Schedule} from '../db/entities/Schedule';
import {getDataSource} from '../db/DatabaseConnect';
import {User} from "../db/entities/User";
import {Time} from "../db/entities/Time";
import {handleJwt} from "./JWTHelper";
dotenv.config();
const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
interface timeRange {
  start_time: string;
  end_time: string;
}



// https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
const createUUID = () => {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

/**
 * For the brave souls who dare enter this file: You are the chosen ones,
 * the valiant knights of programming who toil away, without rest,
 * fixing our most awful code. To you, true saviors, kings of men,
 * I say this: never gonna give you up, never gonna let you down,
 * never gonna run around and desert you. Never gonna make you cry,
 * never gonna say goodbye. Never gonna tell a lie and hurt you.
 */

interface JobData {
  isAdvice: boolean,
  program: string,
}

const jobs: { [id: string]: JobData } = {};

const checkValidInfo = async (req: Request, res: Response) => {
  if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
    console.error('PLEASE (RE-)RUN \'./make-key.sh\'! You are missing the client_id and client_secret!\nif you ask about this on discord, you owe Nick a box of chocolates.')
    return res
      .sendStatus(500);
  }

  const requestData = {
    'grant_type': 'refresh_token',
    'refresh_token': req.body.homeconnectrefresh,
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET,
  }

  const resp = await fetch(`${'https://simulator.home-connect.com' +
    '/security/oauth/token'
    }`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    // In the new block because it needs to be x-www-form-urlencoded iirc, code from the prototype
    body: new URLSearchParams(requestData).toString()
  }
  );

  if (!resp.ok) {
    return res
      .status(400)
      .json({
        error: 'Something went wrong when refreshing homeconnect auth token. Your refresh token most likely expired.',
      });
  }

  let accessToken: string;

  try {
    accessToken = (await resp.json()).access_token;
  } catch (e) {
    res
      .status(400)
      .json({
        error: "Something went wrong when getting access token. Please check your homeconnect refresh token!",
      });
    return false;
  }

  const response = await fetch(`https://simulator.home-connect.com/api/homeappliances/${req.body.washer_id}/programs/available`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.bsh.sdk.v1+json',
    },
  });

  if (!response.ok) {
    res
      .status(400)
      .json({
        error: 'Failed to fetch appliance available programs'
      });

    return false;
  }

  const data = await response.json();
  let valid: boolean = false;

  for (const program of data.data.programs) {
    if (program.key === req.body.settings.data.key) {
      valid = true
    }
  }

  if (!valid) {
    res
      .status(400)
      .json({
        error: 'Invalid program key',
      })
    return false;
  }

  valid = false;
  const availableOptionsResp =
    await fetch(`https://simulator.home-connect.com/api/homeappliances/${req.body.washer_id}/programs/available/${req.body.settings.data.key}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.bsh.sdk.v1+json',
      },
    });
  

  const availableOptions = await availableOptionsResp.json();
  for (const optionIn of req.body.settings.data.options) {
    for (const option of availableOptions.data.options) {
      for (const value of option.constraints.allowedvalues) {
        if (value === optionIn.value) {
          valid = true;
        }
      }
    }

    if (!valid) {
      res
        .status(400)
        .json({
          error: 'Invalid options',
        })
      return false;
    }
  }

  return true;
}

export const addScheduledWash = async (req: Request, res: Response) => {
  let decoded;
  try {
    decoded = handleJwt(req);
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({
        message: 'User not signed in',
      });
  }

  if (!req.body || !req.body.homeconnectrefresh || !req.body.date || !req.body.washer_id || !req.body.settings || !req.body.settings.data) {
    return res
      .status(400)
      .json({
        message: "Request does not have all required properties, or not in correct format.",
        body: req.body,
        homeconnectrefresh: req.body.homeconnectrefresh,
        date: req.body.date,
        washer_id: req.body.washer_id,
        settings: req.body.settings,
      });
  }

  if (!(await checkValidInfo(req, res))) {
    return; // means info is invalid and a response has already been sent
  }

  let schedule_id = createUUID();

  try {
    schedule.scheduleJob(`user_id:${decoded.user_id}, washer_id:${req.body.washer_id} UUID:${schedule_id}`, req.body.date, async () => {
      if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
        console.error('PLEASE (RE-)RUN \'./make-key.sh\'! You are missing the client_id and client_secret!\nif you ask about this on discord, you owe Nick a box of chocolates.')
        return;
      }

      const requestData = {
        'grant_type': 'refresh_token',
        'refresh_token': req.body.homeconnectrefresh,
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
      }

      const resp = await fetch(`${'https://simulator.home-connect.com' +
        '/security/oauth/token'
        }`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        // In the new block because it needs to be x-www-form-urlencoded iirc, code from the prototype
        body: new URLSearchParams(requestData).toString()
      }
      );

      if (!resp.ok) {
        console.error("Something went wrong when getting auth token");
        return;
      }

      let homeconnectAccessToken;
      try {
        homeconnectAccessToken = (await resp.json()).access_token;
      } catch (e) {
        console.error("Access token was not returned with request, which is weird, since the status is ok.");
        return;
      }

      // Make request
      const response = await fetch(`https://simulator.home-connect.com/api/homeappliances/${req.body.washer_id}/programs/active`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${homeconnectAccessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.bsh.sdk.v1+json',
        },
        body: JSON.stringify({
          "data": req.body.settings.data,
        }),
      });

      if (!response.ok) {
        console.error(`Something went wrong when starting washer with id ${req.body.washer_id}`);
      }

      delete jobs[`user_id:${decoded.user_id}, washer_id:${req.body.washer_id} UUID:${schedule_id}`];
    });
  } catch (error) {
    console.error("Maybe the date wasn't wrong, but something went wrong with the name assignment.\n" +
      "If you're sure the date is correct, please message Nick on discord. If you want to check, look at " +
      "https://www.npmjs.com/package/node-schedule section cron-style scheduling");
    return res
      .status(400)
      .json({
        error: "Invalid date."
      });
  }

  console.log(JSON.stringify(jobs));
  console.log(`Looking for job: user_id:${decoded.user_id}, washer_id:${req.body.washer_id} UUID:${schedule_id}`)

  jobs[`user_id:${decoded.user_id}, washer_id:${req.body.washer_id} UUID:${schedule_id}`] = {
    isAdvice: req.body.isAdvice,
    program: req.body.settings.key
  }

  console.log(JSON.stringify(jobs));

  return res
    .status(200)
    .json({
      message: "Schedule successfully added.",
      schedule_id: schedule_id,
    });
};

export const deleteScheduledWash = (req: Request, res: Response) => {
  let decoded;
  try {
    decoded = handleJwt(req);
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({
        message: 'User not signed in',
      });
  }

  let job;

  try {
    job = schedule.scheduledJobs[`user_id:${decoded.user_id}, washer_id:${req.body.washer_id} UUID:${req.body.schedule_id}`];
    delete jobs[`user_id:${decoded.user_id}, washer_id:${req.body.washer_id} UUID:${req.body.schedule_id}`];
  } catch (e) {
    if (e instanceof Error) {
      return res
        .status(400)
        .json({
          message: 'something went wrong when getting job',
          error: e.message
        });
    }

    return res
      .status(400)
      .json({
        message: 'something went wrong when getting job',
      });
  }

  if (job.cancel()) {
    return res
      .send(200)
      .json({
        message: 'Job cancelled successfully.',
      });
  } else {
    return res
      .status(500)
      .json({
        message: 'Something went wrong when canceling job',
      });
  }

}

export const getScheduledWash = (req: Request, res: Response) => {
  let decoded;
  try {
    decoded = handleJwt(req);
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({
        message: 'User not signed in',
      });
  }

  let job;

  try {
    job = schedule.scheduledJobs[`user_id:${decoded.user_id}, washer_id:${req.body.washer_id} UUID:${req.body.schedule_id}`];
  } catch (e) {
    if (e instanceof Error) {
      return res
        .status(400)
        .json({
          message: 'something went wrong when getting job',
          error: e.message
        });
    }

    return res
      .status(400)
      .json({
        message: 'something went wrong when getting job',
      });
  }
  console.log(JSON.stringify(jobs));
  console.log(`Looking for job: user_id:${decoded.user_id}, washer_id:${req.body.washer_id} UUID:${req.body.schedule_id}`)
  const date = job.nextInvocation()

  const otherData = jobs[`user_id:${decoded.user_id}, washer_id:${req.body.washer_id} UUID:${req.body.schedule_id}`];

  return res
    .status(200)
    .json({
      weekday: date.getDay(),
      month: date.getMonth(),
      day: date.getDate(),
      startTime: date.getTime(),
      isAdvice: otherData.isAdvice,
      program: otherData.program,
    });
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
