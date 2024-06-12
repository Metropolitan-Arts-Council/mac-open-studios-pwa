<template>
  <div class="page-info">
    <div class="notification-section">
      <h3>Push Notifications</h3>
      <p>Receive push notifications to your device.</p>
      <p v-if="notificationStore.granted">Notifications have been enabled.</p>
      <p v-else-if="notificationStore.denied">Notifications have been turned off.</p>
      <button
        v-else
        :disabled="!canRequestPushNotifications"
        @click="notificationStore.request"
      >Enable</button>
    </div>

    <form class="notification-section" @submit.prevent="requestEmailNotifications">
      <h3>Email Notifications</h3>
      <p>Receive e-mail notifications to your address.</p>
      <label>
        <span>E-mail Address</span>
        <input type="email" required v-model="email" :disabled="pending && status !== 'idle'" />
      </label>
      <button :disabled="pending && status !== 'idle'">Sign Up</button>
    </form>

    <div class="email-success" v-if="status === 'success'">
      <span></span>
      <span class="center">{{ email }} is signed up for email updates.</span>
      <span class="right"><button @click="clear">&#x2715;</button></span>
    </div>
  </div>
</template>

<script setup>
import {usePushNotificationStore} from "~/stores/PushNotifications.js";

const config = useRuntimeConfig();
const {$pwa} = useNuxtApp();
const notificationStore = usePushNotificationStore();
const email = ref('');
const { data, pending, execute, status, error, clear } = await useFetch(
  `${config.public.apiDomain}${config.public.apiNotificationsEmail}`,
  {
    method: 'POST',
    body: {email},
    immediate: false,
    watch: false,
  },
);

const canRequestPushNotifications = computed(() => {
  if (!$pwa.swActivated) return false;
  if (notificationStore.requested) return false;

  return true;
});

const requestEmailNotifications = async () => {
  await execute();
};
</script>
