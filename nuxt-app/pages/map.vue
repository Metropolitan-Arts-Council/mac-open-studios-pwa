<template>
  <div>

    <div ref="loader">
      <div id="map" class="map-box" :class="{ secondary: data.showPanel }"></div>
    </div>

    <button
      class="map-favorites-toggle fav-icon-bg button-circle"
      :class="{ active: data.filterFavorited }"
      @click="data.filterFavorited = !data.filterFavorited"
    >
      Toggle Favorites
    </button>
    <div class="map-panel" :class="{ hide: !data.showPanel }">
      <KeepAlive>
        <NuxtPage @center="recenter"></NuxtPage>
      </KeepAlive>
    </div>
  </div>
</template>

<script setup>
import {useArtistsStore} from "~/stores/artists.js";
import {useFavoritesStore} from "~/stores/favorites.js";

const route = useRoute();
const router = useRouter();
const mapStore = useMap(
  (markerEl) => {
    mapStore.activateMarker(markerEl.title);
    showArtists(markerEl.title)
  },
  (cluster) => {
    showArtists(cluster.markers.map(m => m.title));
  },
);
const artistsStore = useArtistsStore();
const favoritesStore = useFavoritesStore();

const loader = ref();
const childMarkers = ref();

const data = reactive({
  map: null,
  showPanel: false,
  filterFavorited: false,
});

const locations = computed(() => {
  return artistsStore.locations || []
});
const markers = computed(() => {
  return locations.value.map(artists => {
    return {
      lat: artists[0].address.lat,
      lng: artists[0].address.lng
    }
  })
});

const togglePanel = () => {
  data.showPanel = ['map-artists-list-ids', 'map-artist-show-id'].includes(route.name);
};
const showArtists = (id) => {
  if (Array.isArray(id)) {
    router.push({
      name: 'map-artist-list-ids',
      params: { ids: id.join(',') }
    })
  } else {
    router.push({
      name: 'map-artist-show-id',
      params: { id: id }
    })
  }
}
const recenter = (position, retry) => {
  retry = retry || 0
  const max = 10

  if (retry > max) return

  // Coming to a details window from another route
  // can trigger the event before the map has rendered.
  // Doing a little retry loop here gives the map
  // a chance to catch up.
  if (!mapStore.map.value) {
    setTimeout(() => {
      recenter(position, ++retry);
    }, 10)
  } else {
    mapStore.activateMarker(position || 0)
  }
}
const toggleFavorites = () => {
  const favorites = favoritesStore.favorites || []

  if (data.filterFavorited === false) {
    markers.value.forEach((marker, index) => {
      childMarkers.value[index].visible(true)
    })
  } else {
    if (favorites.length === 0) {
      childMarkers.value[index].visible(false)
    } else {
      const foundMarkerIndexes = []

      locations.value.forEach((artists, index) => {
        artists.forEach(artist => {
          if (favorites.includes(artist.id)) {
            foundMarkerIndexes.push(index)
          }
        })
      })

      // Now, loop through all markers and either turn them on or off
      markers.value.forEach((marker, index) => {
        childMarkers.value[index].visible(foundMarkerIndexes.includes(index))
      })
    }
  }
}

watch(() => route.name, () => {
  const {name} = route;
  togglePanel(name);

  if (name === 'map') {
    mapStore.activateMarker(0);
  }
});

watch(() => data.filterFavorited, () => {
  toggleFavorites();
});

onMounted(async () => {
  await mapStore.load();

  const mapContainer = loader.value.querySelector('#map');
  mapStore.initialize(mapContainer);

  mapStore.addMarker({
    title: '0',
    position: mapStore.mapConfig.center,
    icon: 'icons/marker-mac.png',
    size: 60,
    clickable: false,
  });

  artistsStore.artists.forEach(artist => {
    mapStore.addMarker({
      position: {
        lat: artist.address.lat,
        lng: artist.address.lng,
      },
      title: String(artist.id),
    });
  });
  mapStore.wrapInCluster();

  togglePanel(route);
});
</script>

<style scoped>
#map {
  height: 100vh;
  width: 100%;
}
#map.secondary {
  height: 40vh;
}
</style>
