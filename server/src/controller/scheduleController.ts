import express, { Request, Response } from 'express';
import { Router } from 'express';
import { queryDatabase } from './db-query';

const router: Router = express.Router();

router.get('/', async (req:Request, res: Response) => {
    const currenttime =  await queryDatabase('SELECT NOW()');   
    //console.log(currenttime.rows[0].now);
    const currentDate = new Date(currenttime.rows[0].now);
    const weekdayNow = currentDate.getDay();
    const timeNow = `${currentDate.getHours() % 24}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;    
    // console.log(currentDate);
    // console.log(weekdayNow);
    // console.log(timeNow);
    try {
        const scheduleData = await queryDatabase(`
        SELECT s.*, t.start_time, t.end_time
        FROM public.schedule s
        JOIN public.time t ON s.schedule_id = t.schedule_id
        WHERE s.weekday >= ${weekdayNow} AND (
          (t.start_time <= '${timeNow}' AND t.end_time >= '${timeNow}')
          OR
          (t.start_time >= '${timeNow}')
        );
      `);
          
        res.status(200).json(scheduleData.rows);
      } catch (error) {
        console.error('Error fetching schedule data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});
module.exports = router;