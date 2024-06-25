import {Request, Response} from 'express';
import {handleJwt} from "./JWTHelper";
import {getDataSource} from "../db/DatabaseConnect";
import {User} from "../db/entities/User";
import { Timeslot } from '../db/entities/Timeslot';

export const checkUserInfo = async (req: Request, res: Response) => {
  let decoded
  try {
    decoded = handleJwt(req);
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({
        message: 'User not signed in',
        redirect: '/login'
      });
  }

  const dataSource = await getDataSource(); // get data source
  const userRepository = dataSource.getRepository(User);
  const scheduleRepository = dataSource.getRepository(Timeslot);
  const user = await userRepository.findOne({ where: { user_id: decoded.user_id } });

  if (!user) {
    return res.sendStatus(400);
  }

  if (!user.profile_type) {
    return res
      .status(206)
      .json({
        message: 'No profile type',
        redirect: '/user/profile'
      });
  }

  const schedule = await scheduleRepository.findOne({where: {user: user}});

  if (!schedule) {
    return res
      .status(206)
      .json({
        message: 'No schedule',
        redirect: '/user/timeslots',
      })
  }
}