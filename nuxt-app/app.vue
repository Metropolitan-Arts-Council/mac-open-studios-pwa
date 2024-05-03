<template>
  <div id="container">
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

const artistsStore = useArtistsStore();
const favoritesStore = useFavoritesStore();

onMounted(() => {
  artistsStore.getArtists();
  favoritesStore.getFavorites();
});
</script>
