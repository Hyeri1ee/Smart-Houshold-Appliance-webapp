import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../db/entities/user';
import { getDataSource } from '../db/db-connect';
import { UserJwtPayload } from './jwt-helper';
import 'dotenv/config';
interface DecodedToken {
    user_id: number;
    first_name: string;
    email: string;
    iat: number;
  }
export const setProfiletype = async (req: Request, res: Response): Promise<void> => {
    let { profile_type: profileType } = req.body;

    if (typeof profileType === 'string') {
        profileType = parseInt(profileType, 10);
    }
    console.log(profileType);
  try {
    // 1. find user by token
    const accessToken = req.cookies.authorization;

    if (!accessToken) {
        res.status(401).json({ message: 'Access token is missing' });
    }

    let decodedToken: DecodedToken = {} as DecodedToken;
    const jwtKey: string | undefined = process.env.JWT_KEY;
    try {
        decodedToken = jwt.verify(accessToken,jwtKey || '') as DecodedToken;
    } catch (err) {
        res.status(403).json({ message: 'Invalid access token' });
    }

    const userId = decodedToken.user_id;

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOneBy({ user_id: userId });

    if (!user) {
      res.status(401).json({ error: 'Invalid token' });
      console.log("user not exist");
      return;
    }

    // 2. Update user profile type
    user.profile_type = profileType;
    await userRepository.save(user);

    res.status(200).json({ message: 'User profile type updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};