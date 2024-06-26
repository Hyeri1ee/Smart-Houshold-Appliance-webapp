import webPush from 'web-push';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface VapidKeys {
  publicKey: string;
  privateKey: string;
}

function generateAndStoreVapidKeys(): VapidKeys {
  const vapidKeys = webPush.generateVAPIDKeys();
  const envPath = path.resolve(__dirname, '../.env');
  fs.appendFileSync(envPath, `VAPID_PUBLIC_KEY=${vapidKeys.publicKey}\n`);
  fs.appendFileSync(envPath, `VAPID_PRIVATE_KEY=${vapidKeys.privateKey}\n`);
  console.log('.env file updated with new VAPID keys.');
  return vapidKeys;
}

let vapidKeys: VapidKeys;
if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  vapidKeys = generateAndStoreVapidKeys();
} else {
  vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY!,
    privateKey: process.env.VAPID_PRIVATE_KEY!,
  };
}

webPush.setVapidDetails(
  'mailto:projectdoomtoaster@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export const sendPushNotification = async (subscription: any, message: string): Promise<void> => {
  const payload = JSON.stringify({
    title: 'Peak Time Advice',
    body: message,
  });

  try {
    const result = await webPush.sendNotification(subscription, payload);
    console.log('Push Notification Sent:', result);
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
};

export const getVapidPublicKey = (): string => {
  return vapidKeys.publicKey;
};
