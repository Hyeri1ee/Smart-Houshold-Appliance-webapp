import React, { useEffect } from 'react';
import { getCookie } from "./helpers/CookieHelper";

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
        console.error('This browser does not support notifications.');
        return;
      }

      let permission = Notification.permission;
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      if (permission !== 'granted') {
        console.error('Notification permission denied');
        return;
      }
      console.log('Notification permission granted');
    }

    async function subscribeToPushNotifications() {
      try {
        const registration = await navigator.serviceWorker.register('/ServiceWorker.js');
        console.log('Service Worker registered:', registration);

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        console.log('Push Subscription:', subscription);

        const authorization = getCookie("authorization"); // Fetch the JWT from cookies
        if (!authorization) {
          throw new Error('No authorization token found');
        }

        await fetch('http://localhost:1337/api/advice/save-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization, // Include the JWT token in the headers
          },
          body: JSON.stringify({ subscription }),
        });

        console.log('Subscription saved');

        await fetch('http://localhost:1337/api/advice/send-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization, // Include the JWT token in the headers
          },
          body: JSON.stringify({
            notificationToken: subscription,
          }),
        });

        console.log('Notification triggered');

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
