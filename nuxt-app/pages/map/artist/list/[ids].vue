<template>
  <div>
    <header class="map-panel-header">
      <button class="map-panel-back button-blank" @click="goBack">Back</button>
    </header>
    <Artist
      v-for="artist in artistsList"
      :artist="artist"
      :key="artist.id"
      :showImageThumb="true"
      :showPreview="true"
    />
  </div>
</template>

<script setup>
import {useArtistsStore} from "~/stores/artists.js";

const emit = defineEmits(['center']);

const route = useRoute();
const router = useRouter();
const artistsStore = useArtistsStore();

const artists = computed(() => artistsStore.artists);
const artistsList = computed(() => {
  let ids = route.params.ids || '';
  ids = ids.split(',');

  return artists.value.filter(artist => {
    return ids.includes(artist.id.toString());
  });
});

const goBack = () => {
  router.push('/map');
};

onUpdated(() => {
  const artists = artistsList.value;

  if (artists.length) {
    emit('center', {
      lat: artists[0].address.lat,
      lng: artists[0].address.lng
    })
  }
});
</script>
