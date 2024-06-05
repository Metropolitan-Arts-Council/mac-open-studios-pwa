<template>
  <div id="container">
    <Head>
      <Title>Greenville Arts Openstudios</Title>
      <Meta name="description" content="Greenville Arts Openstudios" />

      <Link rel="icon" href="/img/favicon.ico" />
      <Link rel="apple-touch-icon" href="/img/icons/apple-touch-icon.png" sizes="180x180" />
      <Link rel="mask-icon" href="/mask-icon.svg" color="#FFFFFF" />
      <Meta name="theme-color" content="#ffffff" />
    </Head>

    <VitePwaManifest />

    <div class="scrollview">
      <KeepAlive>
        <NuxtPage/>
      </KeepAlive>

      <ClientOnly>
        <div v-if="$pwa">
          <div v-show="$pwa.needRefresh">
            <span>New content available, click on reload button to update.</span>

            <button @click="$pwa.updateServiceWorker()">Reload</button>
          </div>
        </div>
      </ClientOnly>
    </div>

    <TabBar />
  </div>
</template>

<script setup>
import '~/assets/styles.css';
import {useArtistsStore} from "~/stores/artists.js";
import {useFavoritesStore} from "~/stores/favorites.js";

const { $pwa } = useNuxtApp();

console.log($pwa ? Object.keys($pwa) : null, $pwa);

function spillPwa() {
  console.log('PWA:', {
    getSWRegistration: $pwa.getSWRegistration(),
    isInstalled: $pwa.isInstalled,
    isPWAInstalled: $pwa.isPWAInstalled,
    needRefresh: $pwa.needRefresh,
    offlineReady: $pwa.offlineReady,
    registrationError: $pwa.registrationError,
    showInstallPrompt: $pwa.showInstallPrompt,
    swActivated: $pwa.swActivated,
  });
}

onMounted(() => {
  spillPwa();
  if ($pwa.offlineReady)
    alert('App ready to work offline');
});

watch($pwa, spillPwa);

const artistsStore = useArtistsStore();
const favoritesStore = useFavoritesStore();

onMounted(() => {
  artistsStore.getArtists();
  favoritesStore.getFavorites();
});
</script>
