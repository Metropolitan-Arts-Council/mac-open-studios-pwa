<template>
  <div>
    <MapLoader
      :map-config="data.mapConfig"
      :api-key="data.apiKey"
      :is-secondary="data.showPanel"
      ref="loader"
    >
      <template v-slot="slot_data">
        <ChildMarker
          :position="data.mapConfig.center"
          :google="slot_data.google"
          :map="slot_data.map"
          :extra="macOptions"
          :isMAC="true"
        />
        <ChildMarker
          v-for="(marker,i) in markers"
          :key="i"
          :position="marker"
          :activeMarker="data.activeMarker"
          :google="slot_data.google"
          :map="slot_data.map"
          @show="showArtists(i, $event)"
          ref="childMarkers"
        />
      </template>
    </MapLoader>
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
import Config from "../app.config.js";
import {useArtistsStore} from "~/stores/artists.js";
import _ from "lodash";
import {useFavoritesStore} from "~/stores/favorites.js";

const route = useRoute();
const router = useRouter();
const artistsStore = useArtistsStore();
const favoritesStore = useFavoritesStore();

const loader = ref();
const childMarkers = ref();

const data = reactive({
  map: null,
  showPanel: false,
  apiKey: Config.googleMapsKey,
  filterFavorited: false,
  artistList: [],
  activeMarker: undefined,
  mapConfig: {
    center: { lat: 34.844021, lng: -82.404925, },
    zoom: 16,
    styles: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }]
      }
    ]
  }
});

const artists = computed(() => [...artistsStore.artists]);
const macOptions = computed(() => {
  return {
    icon: {
      url: "/icons/marker-mac.png",
      scaledSize: new loader.value.data.google.maps.Size(60, 50)
    }
  };
});
const locations = computed(() => {
  return artistsStore.locations || []
});
const markers = computed(() => {
  console.log('markers', locations.value.length)

  return locations.value.map(artists => {
    return {
      lat: artists[0].address.lat,
      lng: artists[0].address.lng
    }
  })
});

const togglePanel = () => {
  console.log(route.name);
  data.showPanel = ['map-artists-list-ids', 'map-artist-show-id'].includes(route.name);
};
const showArtists = (index, activeMarker) => {
  console.log('route', route);
  let artists = locations.value[index];
  data.activeMarker = activeMarker;

  if (artists.length > 1) {
    router.push({
      name: 'map-artists-list-ids',
      params: { ids: _.map(artists, 'id').join(',') }
    })
  } else {
    router.push({
      name: 'map-artist-show-id',
      params: { id: artists[0].id }
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
  if (_.isNull(loader.value.data.map)) {
    setTimeout(() => {
      recenter(position, ++retry);
      console.log('attempting a retry', retry);
    }, 10)
  } else {
    deactivateChildren();
    loader.value.data.map.setCenter(position);
    activateChildMarker();
  }
}
const activateChildMarker = () => {
  let marker = undefined
  const mapCenter = loader.value.data.map.getCenter()
  const mapLat = mapCenter.lat().toFixed(5)
  const mapLng = mapCenter.lng().toFixed(5)
  const BreakException = {};

  // Since when we add locations to the map and only add
  // the first artist in a group's location, we have to
  // loop through locations, then all artists, to match
  // a set of coordinates to the map center, now we know
  // which marker is on the map. We're also doing a
  // `toFixed(5)` because when adding coords to the map,
  // some weird things happen like adding a bunch of "9"s
  // to the end of the coordinates.
  try {
    locations.value.forEach((artists, index) => {
      artists.forEach(artist => {
        if (artist.address.lat.toFixed(5) === mapLat
          && artist.address.lng.toFixed(5) === mapLng
        ) {
          marker = childMarkers.value[index]

          // break out of the loop
          throw BreakException;
        }
      })
    })
  } catch (e) {
    if (e !== BreakException) throw e;
  }

  if (marker) {
    marker.makeActive();
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
            console.log('Artist is favorited')
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
const deactivateChildren = () => {
  if(markers.value.length > 0) {
    markers.value.forEach((marker, index) => {
      console.log(index)
      childMarkers.value[index].deactivate()
    })
  }
}

watch(() => route.name, () => {
  const {name} = route;
  console.log('router watcher triggered');

  togglePanel(name);

  if (name === 'map') {
    console.log('To Map');
    deactivateChildren();
  }
});

watch(() => data.filterFavorited, () => {
  toggleFavorites();
});

onMounted(() => {
  togglePanel(route);
});
</script>
