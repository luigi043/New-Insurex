/**
 * Push Notifications Utility
 * Handles push notification subscription and management
 */

const VAPID_PUBLIC_KEY = process.env.VITE_VAPID_PUBLIC_KEY || '';

/**
 * Convert VAPID key from base64 to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Check if push notifications are supported
 */
export function isPushNotificationSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Register service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });
    console.log('Service Worker registered successfully:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    console.log('Push subscription successful:', subscription);
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
}

/**
 * Get existing push subscription
 */
export async function getPushSubscription(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  try {
    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  } catch (error) {
    console.error('Failed to get push subscription:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(
  subscription: PushSubscription
): Promise<boolean> {
  try {
    const result = await subscription.unsubscribe();
    console.log('Unsubscribed from push notifications:', result);
    return result;
  } catch (error) {
    console.error('Failed to unsubscribe from push notifications:', error);
    return false;
  }
}

/**
 * Send subscription to server
 */
export async function sendSubscriptionToServer(
  subscription: PushSubscription
): Promise<boolean> {
  try {
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      throw new Error('Failed to send subscription to server');
    }

    console.log('Subscription sent to server successfully');
    return true;
  } catch (error) {
    console.error('Error sending subscription to server:', error);
    return false;
  }
}

/**
 * Remove subscription from server
 */
export async function removeSubscriptionFromServer(
  subscription: PushSubscription
): Promise<boolean> {
  try {
    const response = await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      throw new Error('Failed to remove subscription from server');
    }

    console.log('Subscription removed from server successfully');
    return true;
  } catch (error) {
    console.error('Error removing subscription from server:', error);
    return false;
  }
}

/**
 * Show local notification
 */
export async function showNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      icon: '/logo192.png',
      badge: '/badge-72x72.png',
      vibrate: [200, 100, 200],
      ...options,
    });
  }
}

/**
 * Initialize push notifications
 */
export async function initializePushNotifications(): Promise<{
  success: boolean;
  subscription?: PushSubscription;
  error?: string;
}> {
  // Check support
  if (!isPushNotificationSupported()) {
    return {
      success: false,
      error: 'Push notifications are not supported in this browser',
    };
  }

  // Request permission
  const permission = await requestNotificationPermission();
  if (permission !== 'granted') {
    return {
      success: false,
      error: 'Notification permission denied',
    };
  }

  // Register service worker
  const registration = await registerServiceWorker();
  if (!registration) {
    return {
      success: false,
      error: 'Failed to register service worker',
    };
  }

  // Check for existing subscription
  let subscription = await getPushSubscription(registration);

  // Subscribe if not already subscribed
  if (!subscription) {
    subscription = await subscribeToPushNotifications(registration);
    if (!subscription) {
      return {
        success: false,
        error: 'Failed to subscribe to push notifications',
      };
    }
  }

  // Send subscription to server
  const sent = await sendSubscriptionToServer(subscription);
  if (!sent) {
    return {
      success: false,
      error: 'Failed to send subscription to server',
    };
  }

  return {
    success: true,
    subscription,
  };
}

/**
 * Disable push notifications
 */
export async function disablePushNotifications(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await getPushSubscription(registration);

    if (subscription) {
      await removeSubscriptionFromServer(subscription);
      await unsubscribeFromPushNotifications(subscription);
    }

    return true;
  } catch (error) {
    console.error('Failed to disable push notifications:', error);
    return false;
  }
}

export default {
  isPushNotificationSupported,
  requestNotificationPermission,
  registerServiceWorker,
  subscribeToPushNotifications,
  getPushSubscription,
  unsubscribeFromPushNotifications,
  sendSubscriptionToServer,
  removeSubscriptionFromServer,
  showNotification,
  initializePushNotifications,
  disablePushNotifications,
};
