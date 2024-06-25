import express from 'express';
import { sendRecommendationNotification, saveSubscription } from '../controllers/NotificationController';

const notificationRoute = express.Router();

notificationRoute.post('/send-notification', sendRecommendationNotification);
notificationRoute.post('/save-subscription', saveSubscription);

export default notificationRoute;
