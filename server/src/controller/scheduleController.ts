import express, { Request, Response } from 'express';
import { Schedule } from '../db/entities/schedule';
import { Time } from '../db/entities/time';
import { getDataSource } from '../db/db-connect';
import { Brackets } from 'typeorm';

export const checkSchedule = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body; // 요청 본문에서 userId를 받아옴

  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }
  
  try {
    const dataSource = await getDataSource();
    const scheduleRepository = dataSource.getRepository(Schedule);

    // 현재 시간과 요일을 가져옴
    const currentDate = new Date();
    const weekdayNow = currentDate.getDay();
    const timeNow = `${currentDate.getHours()}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;

    // 현재 실행 중인 스케줄 쿼리
    const currentRunningData = await scheduleRepository.createQueryBuilder('s')
      .innerJoinAndSelect('s.times', 't')
      .innerJoin('s.user', 'u') // 사용자 테이블을 명시적으로 조인
      .where('u.user_id = :userId', { userId })
      .andWhere('s.weekday = :weekday', { weekday: weekdayNow })
      .andWhere('t.start_time <= :timeNow', { timeNow })
      .andWhere('t.end_time >= :timeNow', { timeNow })
      .getMany();

    // 미래 실행 예정인 스케줄 쿼리
    const futureRunningData = await scheduleRepository.createQueryBuilder('s')
      .innerJoinAndSelect('s.times', 't')
      .innerJoin('s.user', 'u') // 사용자 테이블을 명시적으로 조인
      .where('u.user_id = :userId', { userId })
      .andWhere('s.weekday >= :weekday', { weekday: weekdayNow })
      .andWhere(new Brackets(qb => {
        qb.where('t.start_time > :timeNow', { timeNow })
          .orWhere('t.start_time <= :timeNow')
          .andWhere('t.end_time > :timeNow');
      }))
      .getMany();

    // 결과를 클라이언트에게 반환
    res.status(200).json({
      currentRunning: currentRunningData,
      futureRunning: futureRunningData,
    });

  } catch (error) {
    console.error('Error fetching schedule data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
