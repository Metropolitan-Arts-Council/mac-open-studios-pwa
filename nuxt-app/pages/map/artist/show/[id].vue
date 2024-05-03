<template>
    <div v-if="artist">
        <header class="map-panel-header">
            <button class="map-panel-back button-blank" @click="goBack">Back</button>
            <img alt="artist image" class="map-panel-image" :src="artist.image || artist.image_thumb " role="presentation" />
        </header>
        <Artist
            :artist="artist"
            :key="artist.id"
            :showPreview="false"
            :showFavorite="true"
            :showAddress="true"
            :showListingNumber="false"
        />
    </div>
</template>

<script setup>
import {useArtistsStore} from "~/stores/artists.js";
import _ from "lodash";

const emit = defineEmits(['center']);

const route = useRoute();
const router = useRouter();
const artistsStore = useArtistsStore();

const artists = computed(() => artistsStore.artists);
const artist = computed(() => {
  const id = parseInt(route.params.id) || null;
  return _.chain(artists.value).filter({id}).head().value();
});

const goBack = () => router.back();
const center = () => {
  if (artist.value
    && artist.value.address
    && artist.value.address.lat
    && artist.value.address.lng
  ) {
    emit('center', {
      lat: artist.value.address.lat,
      lng: artist.value.address.lng
    })
  }
};

onMounted(() => {
  nextTick(center);
});
onUpdated(center);
</script>
<script setup lang="ts">
</script>
