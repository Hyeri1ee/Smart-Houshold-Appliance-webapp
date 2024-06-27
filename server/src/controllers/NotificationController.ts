import { NextFunction, Request, Response } from 'express';
import { handleJwt } from './auth/JWTHelper';
import { getDataSource } from '../db/DatabaseConnect';
import { User } from '../db/entities/User';
import { sendPushNotification, getVapidPublicKey } from '../WebPushService';

export const sendRecommendationNotification = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  let decoded;
  try {
    decoded = handleJwt(req);
    console.log('JWT decoded:', decoded);
  } catch (e) {
    console.log('JWT decoding failed:', e);
    return res.status(400).json({ message: 'Authentication failed' });
  }

  console.log('Request body:', req.body);

  const { notificationToken, time, date } = req.body;
  console.log('Received notification token:', notificationToken);

  if (!notificationToken) {
    return res.status(400).json({ error: 'No notification token provided' });
  }

  const dataSource = await getDataSource();
  const user = await dataSource.getRepository(User).findOne({ where: { user_id: decoded.user_id } });

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const message = `The best time to use your washing machine is ${time} on ${date}`;
  console.log('Final message:', message);

  await sendPushNotification(notificationToken, message);

  return res.status(200).json({ message: 'Notification sent' });
};

export const saveSubscription = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  let decoded;
  try {
    decoded = handleJwt(req);
    console.log('JWT decoded:', decoded);
  } catch (e) {
    console.log('JWT decoding failed:', e);
    return res.status(400).json({ message: 'Authentication failed' });
  }

  const { subscription } = req.body;
  console.log('Received subscription:', subscription);

  if (!subscription) {
    return res.status(400).json({ error: 'No subscription provided' });
  }

  const dataSource = await getDataSource();
  const user = await dataSource.getRepository(User).findOne({ where: { user_id: decoded.user_id } });

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  user.subscription = JSON.stringify(subscription);
  await dataSource.getRepository(User).save(user);

  return res.status(200).json({ message: 'Subscription saved' });
};

export const getVapidPublicKeyController = (req: Request, res: Response): Response => {
  const publicKey = getVapidPublicKey();
  return res.json({ publicKey });
};
