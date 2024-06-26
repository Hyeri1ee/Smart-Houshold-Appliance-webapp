import React, { useEffect, useState } from 'react';
import { getCookie } from "../helpers/CookieHelper";

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

const PushNotificationComponent = () => {
  const [vapidPublicKey, setVapidPublicKey] = useState(null);

  useEffect(() => {
    async function fetchVapidPublicKey() {
      try {
        const response = await fetch('http://localhost:1337/api/notification/vapid-public-key');
        const data = await response.json();
        setVapidPublicKey(data.publicKey);
      } catch (error) {
        console.error('Error fetching VAPID public key:', error);
      }
    }

    fetchVapidPublicKey();
  }, []);

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

    async function unsubscribeExistingSubscription(pushManager) {
      const subscription = await pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }
    }

    async function subscribeToPushNotifications() {
      try {
        if (!vapidPublicKey) {
          return;
        }

        const registration = await navigator.serviceWorker.register('/ServiceWorker.js');

        // Unsubscribe from existing subscriptions with different keys
        await unsubscribeExistingSubscription(registration.pushManager);

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
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

    if (vapidPublicKey) {
      init();
    }
  }, [vapidPublicKey]);

  return <div>Push Notification Component</div>;
};

export default PushNotificationComponent;
