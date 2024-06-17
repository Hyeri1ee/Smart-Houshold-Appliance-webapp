import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User} from '../db/entities/User';
import {getDataSource} from '../db/DatabaseConnect';
import {UserJwtPayload} from './JWTHelper';
import 'dotenv/config'

export const checkUserExist = async (req: Request, res: Response): Promise<void> => {
  let { password } = req.body;

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

    const token = jwt.sign(payload, jwtKey);

    // 5. success response
    res.status(200).json({ "token": token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};