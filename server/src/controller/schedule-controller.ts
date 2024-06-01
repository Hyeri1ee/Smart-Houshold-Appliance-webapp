import { Request, Response } from 'express';
import { Schedule } from '../db/entities/schedule';
import { getDataSource } from '../db/db-connect';
import { Brackets } from 'typeorm';

export const checkSchedule = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body; 
  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }
  
  try {
    const dataSource = await getDataSource();
    const scheduleRepository = dataSource.getRepository(Schedule);

    const currentDate = new Date();
    const weekdayNow = currentDate.getDay();
    const timeNow =
      `${currentDate.getHours()}
      :${String(currentDate.getMinutes()).padStart(2, '0')}
      :${String(currentDate.getSeconds()).padStart(2, '0')}`;

    const currentRunningData = await scheduleRepository.createQueryBuilder('s')
      .innerJoinAndSelect('s.times', 't')
      .innerJoin('s.user', 'u') 
      .where('u.user_id = :userId', { userId })
      .andWhere('s.weekday = :weekday', { weekday: weekdayNow })
      .andWhere('t.start_time <= :timeNow', { timeNow })
      .andWhere('t.end_time >= :timeNow', { timeNow })
      .getMany();

    const futureRunningData = await scheduleRepository.createQueryBuilder('s')
      .innerJoinAndSelect('s.times', 't')
      .innerJoin('s.user', 'u') 
      .where('u.user_id = :userId', { userId })
      .andWhere('s.weekday >= :weekday', { weekday: weekdayNow })
      .andWhere(new Brackets(qb => {
        qb.where('t.start_time > :timeNow', { timeNow })
          .orWhere('t.start_time <= :timeNow')
          .andWhere('t.end_time > :timeNow');
      }))
      .getMany();

   
    res.status(200).json({
      currentRunning: currentRunningData,
      futureRunning: futureRunningData,
    });

  } catch (error) {
    console.error('Error fetching schedule data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
