import webPush, { SendResult } from 'web-push';

interface VapidKeys {
  publicKey: string;
  privateKey: string;
}

const vapidKeys: VapidKeys = {
  publicKey: 'BJ8UyQy743ovPUSrBBUZEuMigZ0ihYD7_7JKmGAhM2vpKRvSILSPB5GhxJu4cbUsCm50hBIdVXRgnt7vp3nuNJw',
  privateKey: 'a461MRxH9Ouavx0Ukbe1f-Vu2Zaz2S_HiLCkjXPkUZ8',
};

webPush.setVapidDetails(
  'mailto:projectdoomtoaster@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const sendPushNotification = async (subscription: PushSubscription, message: string): Promise<void> => {
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
