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
    </div>

    <TabBar />
  </div>
</template>

<script setup>
import '~/assets/styles.css';
import {useArtistsStore} from "~/stores/artists.js";
import {useFavoritesStore} from "~/stores/favorites.js";

const config = useRuntimeConfig();
const artistsStore = useArtistsStore();
const favoritesStore = useFavoritesStore();

useFetch(`${config.public.apiDomain}${config.public.apiPages}`, {key: 'apiData', cache: 'no-cache'});

onMounted(() => {
  artistsStore.getArtists();
  favoritesStore.getFavorites();
});
</script>
