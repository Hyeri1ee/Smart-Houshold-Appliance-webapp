import express from 'express';
import { sendRecommendationNotification, saveSubscription, getVapidPublicKeyController } from '../controllers/NotificationController';

const notificationRoute = express.Router();

notificationRoute.post('/send-notification', sendRecommendationNotification);
notificationRoute.post('/save-subscription', saveSubscription);
notificationRoute.get('/vapid-public-key', getVapidPublicKeyController);

export default notificationRoute;
