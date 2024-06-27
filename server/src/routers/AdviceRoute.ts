import express from 'express';
import { assignSchedulesToPeakTimes } from '../controllers/auth/AdviceController';

const adviceRoute = express.Router();

adviceRoute.get('/', assignSchedulesToPeakTimes);

export default adviceRoute;
