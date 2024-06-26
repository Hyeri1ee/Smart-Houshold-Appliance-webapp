import express from 'express';
import * as dbConnect from './db/DatabaseConnect';
import {loginRoute} from './routers/LoginRoute';
import {registerRoute} from './routers/RegisterRoute';
import {adviceRoute} from "./routers/AdviceRoute";
import {userRoute} from "./routers/UserRoute";
import {washingScheduleRoute} from "./routers/ScheduledWashingRoute";

import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const port = 1337;

dbConnect.handleConnection();

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())

app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);
app.use('/api/user', userRoute);
app.use('/api/advice', adviceRoute);
app.use('/api/schedule', washingScheduleRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});