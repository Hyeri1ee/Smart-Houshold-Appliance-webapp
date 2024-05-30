import express, { Request, Response } from 'express';
import { Schedule } from '../db/entities/schedule';
import { Time } from '../db/entities/time';
import { getDataSource } from '../db/db-connect';
import { queryDatabase } from './schedule-helper';


export const checkSchedule = async (req: Request, res: Response): Promise<void> => {
    const currenttime = await queryDatabase('SELECT NOW()');
    const currentDate = new Date(currenttime.rows[0].now);
    const weekdayNow = currentDate.getDay();
    const timeNow = `${currentDate.getHours() % 24}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;
  
    try {
      const currentRunningQuery = `
        SELECT s.*, t.start_time, t.end_time
        FROM public.schedule s
        JOIN public.time t ON s.schedule_id = t.schedule_id
        WHERE s.weekday = ${weekdayNow}
          AND t.start_time <= '${timeNow}'
          AND t.end_time >= '${timeNow}';
      `;
      const currentRunningData = await queryDatabase(currentRunningQuery);
  
      const futureRunningQuery = `
        SELECT s.*, t.start_time, t.end_time
        FROM public.schedule s
        JOIN public.time t ON s.schedule_id = t.schedule_id
        WHERE s.weekday >= ${weekdayNow}
          AND (
            (t.start_time > '${timeNow}')
            OR (t.start_time <= '${timeNow}' AND t.end_time > '${timeNow}')
          );
      `;
      const futureRunningData = await queryDatabase(futureRunningQuery);
  
      res.status(200).json({
        currentRunning: currentRunningData.rows,
        futureRunning: futureRunningData.rows,
      });
  
  

  } catch (error) {
    console.error('Error fetching schedule data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};