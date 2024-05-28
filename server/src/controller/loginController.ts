import express, { Request, Response } from 'express';
import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { handleJwt } from './jwt-helper';
import { User } from '../db/entities/user';
import { getDataSource } from '../db/db-connect';
import { UserJwtPayload } from './jwt-helper';
import dotenv from 'dotenv';
import { Revoked_token } from '../db/entities/revoked_token';

dotenv.config();

const hashing = async (password: string) => {
  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}


export const checkUserExist = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // 1. find user by email
    const dataSource = await getDataSource(); // get data source
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    //2-1. if user does not exist
    if (!user)
    {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    const hashedPassword = await hashing(password);
    const hashedUserPassword = await hashing(user.password);
    // 2-2. compare with hashed password
    if (!(await bcrypt.compare(password,hashedUserPassword))) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    // 3. JWT token generation
    const payload: UserJwtPayload = {
      user_id: user.user_id,
      first_name: user.first_name,
      email: user.email


    };
    const secretKey:string = process.env.JWT_SECRET_KEY ||"jwt-secret-key";
    const token = jwt.sign(payload, secretKey);
    const generatedTime = new Date();
    //4. put in the revoked token table
    const revokedTokenRepository = dataSource.getRepository(Revoked_token);
    const revokedToken = new Revoked_token();
    revokedToken.token = token;
    await revokedTokenRepository.save(revokedToken);
    // 5. success response
    res.status(200).json({ "token": token, "generatedTime": generatedTime});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};