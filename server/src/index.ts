import express from 'express';
import * as dbConnect from './db/db-connect';
import { solarRoute } from './routers/solar-route';
import { loginRoute } from './routers/login-route';
import { registerRoute } from './routers/register-route';
import { scheduleRoute } from "./routers/schedule-route"

import cors from 'cors';

const app = express();
const port = 1337;

dbConnect.handleConnection();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
  credentials: true
}));

app.use(cors());
app.use(express.json());

app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);
app.use('/api/solar', solarRoute);
app.use('/api/schedule', scheduleRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
