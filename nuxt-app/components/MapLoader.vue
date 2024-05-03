<template>
    <div ref="el">
        <div id="map" class="map-box" :class="{ secondary: isSecondary }"></div>
        <template v-if="!!data.google && !!data.map">
            <slot
                :google="data.google"
                :map="data.map"
            />
        </template>
    </div>
</template>

<script setup>
import GoogleMapsApiLoader from 'google-maps-api-loader';

const props = defineProps({
  mapConfig: Object,
  apiKey: String,
  isSecondary: {
    type: Boolean,
    default: false
  }
});

const el = ref();
const data = reactive({
  google: null,
  map: null
});

const initializeMap = () => {
  const mapContainer = el.value.querySelector('#map'); // point 1
  const { Map } = data.google.maps;
  data.map = new Map(mapContainer, props.mapConfig);
};

onMounted(() => {
  GoogleMapsApiLoader({
    apiKey: props.apiKey
  }).then((google) => {
    data.google = google;
    initializeMap();
  });
});

defineExpose({data});
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
