import express from 'express';
import { assignSchedulesToPeakTimes } from '../controllers/AdviceController';

const adviceRoute = express.Router();

adviceRoute.get('/', assignSchedulesToPeakTimes);

export default adviceRoute;
