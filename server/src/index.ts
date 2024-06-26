import express from 'express';
import * as dbConnect from './db/DatabaseConnect';
import {loginRoute} from './routers/LoginRoute';
import {registerRoute} from './routers/RegisterRoute';

import {timeslotRoute} from "./routers/TimeslotRoute";
import adviceRoute from "./routers/AdviceRoute";
import {userRoute} from "./routers/UserRoute";

import {washingScheduleRoute} from "./routers/ScheduledWashingRoute";
import { scheduleRoute } from './routers/ScheduleRoute';
import notificationRoute from './routers/NotificationRoute';
import { userProfileRoute } from './routers/UserProfileRoute';

import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const port = 1337;

dbConnect.handleConnection();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())

app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);
app.use('/api/schedule', scheduleRoute);
app.use('/api/timeslot', timeslotRoute);
app.use('/api/notification', notificationRoute);
app.use('/api/advice', adviceRoute);
app.use('/api/user', userRoute);
app.use('/api/user/profile', userProfileRoute);
app.use('/api/schedule/wash', washingScheduleRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
