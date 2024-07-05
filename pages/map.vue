<template>
  <div>
    <div v-if="online && artistsStore.hasLoaded" ref="loader">
      <div id="map" class="map-box" :class="{ secondary: data.showPanel }"></div>
    </div>

    <div v-if="!online" id="map-offline">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.0001 17.9999C12.7144 17.9999 13.3704 18.2496 13.8856 18.6664L12.0001 20.9999L10.1145 18.6664C10.6297 18.2496 11.2857 17.9999 12.0001 17.9999ZM2.80766 1.39331L20.4853 19.071L19.0711 20.4852L15.3895 16.8043L15.1425 17.1106C14.2838 16.416 13.1905 15.9999 12.0001 15.9999C10.81 15.9999 9.71712 16.4156 8.85862 17.1098L6.97363 14.7758C8.24961 13.7441 9.84925 13.0967 11.5964 13.0099L9.82328 11.2375C8.29284 11.5772 6.89439 12.2677 5.71658 13.2201L3.83099 10.8867C4.89946 10.0225 6.10763 9.32426 7.41633 8.83106L5.88489 7.29894C4.69082 7.8327 3.5793 8.51797 2.57479 9.33031L0.689453 6.99662C1.60358 6.25735 2.59156 5.60576 3.64058 5.05467L1.39345 2.80752L2.80766 1.39331ZM16.0844 11.8693L12.2165 8.00231L12.0001 7.99991C15.0948 7.99991 17.9369 9.08129 20.1693 10.8868L18.284 13.2205C17.6163 12.6805 16.8777 12.2247 16.0844 11.8693ZM12.0001 2.99991C16.2849 2.99991 20.22 4.49707 23.3109 6.99679L21.4254 9.33035C18.8497 7.24742 15.5706 5.99991 12.0001 5.99991C11.4284 5.99991 10.8642 6.03189 10.3091 6.09416L7.72455 3.51076C9.09498 3.17689 10.5268 2.99991 12.0001 2.99991Z"></path></svg>
      <h3>You are currently offline.<br />Please connect to a network to view the map.</h3>
    </div>

    <button
      v-if="online && artistsStore.isFiltering"
      class="map-clear-filters clear-filters-icon-bg button-circle"
      :class="{ hidden: !artistsStore.isFiltering }"
      @click="clearFilters"
    >
      Clear Filters
    </button>
    <button
      v-if="online"
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
import {useOnline} from "@vueuse/core";

const online = useOnline();
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

const data = reactive({
  showPanel: false,
  filterFavorited: false,
});

const togglePanel = () => {
  data.showPanel = ['map-artist-list-ids', 'map-artist-show-id'].includes(route.name);
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
const recenter = (artist_id, retry) => {
  retry = retry || 0
  const max = 10

  if (retry > max) return

  // Coming to a details window from another route
  // can trigger the event before the map has rendered.
  // Doing a little retry loop here gives the map
  // a chance to catch up.
  if (!mapStore.getMap()) {
    setTimeout(() => {
      recenter(artist_id, ++retry);
    }, 50)
  } else {
    mapStore.activateMarker(artist_id || 0)
  }
}
const toggleFavorites = () => {
  const favorites = favoritesStore.favorites || []

  if (data.filterFavorited === false) {
    artistsStore.artists.forEach(artist => {
      mapStore.showMarker(artist.id);
    });
  } else {
    artistsStore.artists.forEach(artist => {
      if (favorites.includes(artist.id)) return;

      mapStore.hideMarker(artist.id);
    });
  }
}

watch(() => route.name, () => {
  const {name} = route;
  togglePanel(name);

  if (name === 'map') {
    mapStore.activateMarker(0);
  }
});

watch(() => data.filterFavorited, toggleFavorites);

const mountMap = async () => {
  if (!online.value || !loader.value) return;

  await mapStore.load();

  const mapContainer = loader.value.querySelector('#map');
  mapStore.initialize(mapContainer);

  resetMap();
  togglePanel(route);
};

const resetMap = () => {
  mapStore.addMarker({
    title: '0',
    position: mapStore.mapConfig.center,
    icon: `icons/marker-mac.png`,
    size: 60,
    clickable: false,
  });

  artistsStore.filteredArtists.forEach(artist => {
    mapStore.addMarker({
      position: {
        lat: artist.address.lat,
        lng: artist.address.lng,
      },
      title: String(artist.id),
    });
  });
  mapStore.wrapInCluster();
};

const clearFilters = () => {
  artistsStore.clearFilters();
  mapStore.clearMap();
  resetMap();
}

watch([online, loader], mountMap, {immediate: true});
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
