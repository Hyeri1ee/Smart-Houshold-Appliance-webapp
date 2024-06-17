import {Request, Response} from 'express';
import {handleJwt} from "./JWTHelper";
import {getDataSource} from "../db/DatabaseConnect";
import {User} from "../db/entities/User";

export const checkUserInfo = async (req: Request, res: Response) => {
  let decoded
  try {
    decoded = handleJwt(req);
  } catch (e) {
    console.log(e);
    return res
      .status(404)
      .json({
        message: 'User not signed in',
        redirect: '/login'
      });
  }

  const dataSource = await getDataSource(); // get data source
  const userRepository = dataSource.getRepository(User);
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

  if (!user.schedule || user.schedule.length === 0) {
    return res
      .status(206)
      .json({
        message: 'No schedule',
        redirect: '/user/timeslots',
      })
  }
}