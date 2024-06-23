import express from 'express';
import * as dbConnect from './db/DatabaseConnect';
import { loginRoute } from './routers/LoginRoute';
import { registerRoute } from './routers/RegisterRoute';
import { scheduleRoute } from './routers/ScheduleRoute';
import adviceRoute from './routers/AdviceRoute'; // Default import
import { userRoute } from './routers/UserRoute';
import { userProfileRoute } from './routers/UserProfileRoute';
import { solarRoute } from './routers/SolarRoute';
import { washingScheduleRoute } from './routers/ScheduledWashingController';

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
app.use(cookieParser());

app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);
app.use('/api/solar', solarRoute);
app.use('/api/schedule', scheduleRoute);
app.use('/api/advice', adviceRoute); // Correct import usage
app.use('/api/user', userRoute);
app.use('/api/user/profile', userProfileRoute);
app.use('/api/schedule/wash', washingScheduleRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
