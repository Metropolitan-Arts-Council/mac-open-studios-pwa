export const usePushNotificationStore = defineStore('pushNotificationStore', () => {
  const granted = ref(false);
  const denied = ref(false);
  const requested = ref(false);
  const {$pwa} = useNuxtApp();
  const config = useRuntimeConfig();

  const status = computed(() => {
    if (!requested.value) return 'Not Requested';
    if (granted.value) return 'Granted';
    if (denied.value) return 'Denied';

    return window.Notification.permission;
  });

  const update = () => {
    granted.value = window.Notification?.permission === 'granted';
    denied.value = window.Notification?.permission === 'denied';
    requested.value = window.Notification?.permission !== 'default';
  };
  const request = async () => {
    await window.Notification.requestPermission();
    update();
    await subscribe();
  };
  const subscribe = async () => {
    if (!granted.value) return;

    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: config.public.vapidKey,
    };

    const registration = await $pwa.getSWRegistration();
    const data = await registration.pushManager.subscribe(subscribeOptions);

    const response = await $fetch(`${config.public.apiDomain}${config.public.apiNotificationsPush}`, {
      method: 'POST',
      body: data.toJSON(),
    });
  };

  update();

  return {
    granted, denied, requested,
    request, status,
    subscribe,
  };
});
