import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {User} from '../db/entities/User';
import {getDataSource} from '../db/DatabaseConnect';
import 'dotenv/config';
import { handleJwt } from './JWTHelper';

interface DecodedToken {
  user_id: number;
  first_name: string;
  email: string;
  iat: number;
}

export const getProfiletype = async (req: Request, res: Response): Promise<void> => {
  
  try {
    const accessToken = req.headers.authorization

    if (!accessToken) {
      console.log('no access token')
      res.status(401).json({message: 'Access token is missing'});
      return;
    }

    const jwtKey: string | undefined = process.env.JWT_KEY;
    let decodedToken: DecodedToken = {user_id: 0, first_name: '', email: '', iat: 0};

    try {
      decodedToken = jwt.verify(accessToken, jwtKey || '') as DecodedToken;
    } catch (err) {
      console.log('invalid access token')
      res.status(403).json({message: 'Invalid access token'});
      return;
    }

    const userId = decodedToken.user_id;

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOneBy({user_id: userId});

    if (!user) {
      console.log('user not found')
      res.status(401).json({error: 'user not found'});
      return;
    }


    const userObj = user as User;

    res.status(200).json({profileType : userObj.profile_type});
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Internal server error'});
    return;
  }
};