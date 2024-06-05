import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {UserJwtPayload} from './jwt-helper';
import { getDataSource } from '../db/db-connect';
import { User } from '../db/entities/user';
import dotenv from 'dotenv';
dotenv.config();

export const handleRegister = async (req: Request, res: Response): Promise<void> => {

  const user = req.body;

  const { first_name, email, password, password_confirmation,profile_type } = user;

  const dataSource = await getDataSource();
  const userRepository = dataSource.getRepository(User);
  const existingUser = await userRepository.findOne({ where: { email } });

  if (existingUser) {
    res
      .status(400)
      .json({
        message: 'User already exists'
      });
    return;
  }

  if (password !== password_confirmation) {
    res
      .status(422)
      .json({
        message: 'Passwords do not match'
      });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      first_name,
      email,
      password: hashedPassword,
      profile_type
    });

    await userRepository.save(newUser);

    const payload: UserJwtPayload = {
      user_id: newUser.user_id,
      first_name: newUser.first_name,
      email: newUser.email
    };
    const secretKey = process.env.JWT_KEY;
    if (secretKey === undefined) {
      console.error("JWT KEY NOT FOUND, PLEASE RUN MAKE-KEY.SH");
      throw new Error("No JWT key.");
    }
    const token = jwt.sign(payload, secretKey, { expiresIn: '30m' }); //access token

    res
      .status(200)
      .json({
        message: 'User registered successfully', token
      });
      res.header("Authorization", `Bearer ${token}`);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
      res
        .status(500)
        .json({
          message: 'Internal server error', error: e.message
        });
    }
  }
};
