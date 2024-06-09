import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User} from '../db/entities/user';
import {getDataSource} from '../db/db-connect';
import {UserJwtPayload} from './jwt-helper';
import 'dotenv/config'
import { Revoked_token } from '../db/entities/revoked_token';

export const checkUserExist = async (req: Request, res: Response): Promise<void> => {
  let { password } = req.body;

  password = password.toString();
  //console.log("email: %s\npw: %s", req.body.email, req.body.password);
  try {
    // 1. find user by email
    const dataSource = await getDataSource(); // get data source
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email: req.body.email } });

    //2-1. if user does not exist
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      console.log("user not exist");
      return;
    }

    // 2-2. compare with hashed password
    if (!(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid email or password' });
      console.log("password wrong");
      return;
    }

    // 3. JWT token generation
    const payload: UserJwtPayload = {
      user_id: user.user_id,
      first_name: user.first_name,
      email: user.email,
      iat: new Date().getTime(),
    };

    const jwtKey: string | undefined = process.env.JWT_KEY;
    if (jwtKey === undefined) {
      console.error("Server is missing JWT key! Please run make-key.sh.");
      res
        .sendStatus(500);
      return;
    }

    const accessToken = jwt.sign(payload, jwtKey, { expiresIn: '5h' }); // Access Token (expire duratioin can be changed)
    const refreshToken = jwt.sign(payload, jwtKey, { expiresIn: '7d' }); // Refresh Token (expire duratioin can be changed)

    // 4. save refresh token to revokedToken table
    const revokedToken = dataSource.getRepository(Revoked_token);
    revokedToken.save({ token: refreshToken });

    // 5. success response
    res.header("Authorization", `Bearer ${accessToken}`);
    res.header("Refresh-Token", `${refreshToken}`);
    res.status(200).json({ accessToken, refreshToken });
   
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};