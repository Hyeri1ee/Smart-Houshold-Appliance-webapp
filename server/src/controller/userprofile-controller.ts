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

    try {
        const accessToken = req.cookies.authorization;

        if (!accessToken) {
            res.status(401).json({ message: 'Access token is missing' });
            return;
        }

        const jwtKey: string | undefined = process.env.JWT_KEY;
        let decodedToken: DecodedToken = { user_id: 0, first_name: '', email: '', iat: 0 };

        try {
            decodedToken = jwt.verify(accessToken, jwtKey || '') as DecodedToken;
        } catch (err) {
            res.status(403).json({ message: 'Invalid access token' });
            return;
        }

        const userId = decodedToken.user_id;

        const dataSource = await getDataSource();
        const userRepository = dataSource.getRepository(User);
        const user = await userRepository.findOneBy({ user_id: userId });

        if (!user) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }

        const userObj = user as User;
        userObj.profile_type = profileType;
        await userRepository.save(userObj);

        res.status(200).json({ message: 'User profile type updated successfully' });
        return;
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};