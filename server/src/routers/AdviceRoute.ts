import express from 'express';
import { assignSchedulesToPeakTimes, sendRecommendationNotification, saveSubscription } from '../controllers/AdviceController';

const adviceRoute = express.Router();

adviceRoute.get('/', assignSchedulesToPeakTimes);
adviceRoute.post('/send-notification', sendRecommendationNotification);
adviceRoute.post('/save-subscription', saveSubscription);

export default adviceRoute;
