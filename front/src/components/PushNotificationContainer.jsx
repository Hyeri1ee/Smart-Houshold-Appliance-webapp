import React, { useEffect } from 'react';
import { getCookie } from "../helpers/CookieHelper";

const VAPID_PUBLIC_KEY = 'BJ8UyQy743ovPUSrBBUZEuMigZ0ihYD7_7JKmGAhM2vpKRvSILSPB5GhxJu4cbUsCm50hBIdVXRgnt7vp3nuNJw';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array(rawData.length).map((_, i) => rawData.charCodeAt(i));
}

const PushNotificationComponent = () => {
  useEffect(() => {
    async function requestNotificationPermission() {
      if (!('Notification' in window)) {
        return;
      }

      let permission = Notification.permission;
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      if (permission !== 'granted') {
        return;
      }
    }

    async function subscribeToPushNotifications() {
      try {
        const registration = await navigator.serviceWorker.register('/ServiceWorker.js');

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        const authorization = getCookie("authorization");
        if (!authorization) {
          throw new Error('No authorization token found');
        }

        await fetch('http://localhost:1337/api/notification/save-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization,
          },
          body: JSON.stringify({ subscription }),
        });

        const adviceResponse = await fetch('http://localhost:1337/api/advice', {
          method: 'GET',
          headers: {
            'Authorization': authorization,
          },
        });

        if (!adviceResponse.ok) {
          throw new Error('Failed to fetch advice');
        }

        const adviceData = await adviceResponse.json();
        const { time, date } = adviceData;

        await fetch('http://localhost:1337/api/notification/send-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization,
          },
          body: JSON.stringify({
            notificationToken: subscription,
            time,
            date,
          }),
        });

      } catch (error) {
        console.error('Error subscribing to push notifications:', error);
      }
    }

    async function init() {
      await requestNotificationPermission();
      await subscribeToPushNotifications();
    }

    init();
  }, []);

  return <div>Push Notification Component</div>;
};

export default PushNotificationComponent;
