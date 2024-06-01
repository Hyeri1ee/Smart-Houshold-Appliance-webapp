import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User} from '../db/entities/user';
import {getDataSource} from '../db/db-connect';
import {UserJwtPayload} from './jwt-helper';
import 'dotenv/config'

export const checkUserExist = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  let { password } = req.body;

  password = password.toString();
  console.log(req.body);
  try {
    // 1. find user by email
    const dataSource = await getDataSource(); // get data source
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    //2-1. if user does not exist
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // 2-2. compare with hashed password
    console.log("password: %s\nuser.password: %s\ncum: %s", password, user.password, await bcrypt.hash(password, 10));
    if (!(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid email or password' });
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