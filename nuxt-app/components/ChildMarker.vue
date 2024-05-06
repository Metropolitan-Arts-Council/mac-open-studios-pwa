<template></template>
<script setup>
const emit = defineEmits(['show']);
const props = defineProps({
  isMAC: false,
  google: Object,
  map: Object,
  position: Object,
  extra: Object,
  activeMarker: {
    default: undefined
  },
  iconUrl: {
    default: '/icons/marker-location.png'
  },
  iconUrlActive: {
    default: '/icons/marker-location-active.png'
  }
});

const marker = ref(null);

const icon = computed(() => ({
  url: props.iconUrl,
  scaledSize: new props.google.maps.Size(40, 50)
}));

const isMarkerCentered = (markerPosition, mapCenter) => {
  const mapLng = mapCenter.lng().toFixed(4)
  const mapLat = mapCenter.lat().toFixed(4)
  const markerLng = markerPosition.lng.toFixed(4)
  const markerLat = markerPosition.lat.toFixed(4)

  return mapLng === markerLng && mapLat === markerLat;
}

const makeActive = () => {
  marker.value.setIcon(Object.assign({}, icon.value, { url: props.iconUrlActive }))
};
const deactivate = () => {
  marker.value.setIcon(icon.value)
};
const visible = (visible = true) => {
  marker.value.setVisible(visible)
};

watch(() => props.activeMarker, () => {
  if (props.activeMarker === marker.value) return;

  deactivate();
});

onMounted(() => {
  const { Marker } = props.google.maps;

  marker.value = new Marker(Object.assign(
    {},
    {
      map: props.map,
      position: props.position,
      icon: icon.value,
    },
    props.extra || {}
  ))

  marker.value.addListener('click', () => {
    props.map.setCenter(props.position);
    marker.value.setIcon(Object.assign({}, icon.value, { url: props.iconUrlActive }));
    emit('show', marker.value);
  })
});
onUnmounted(() => marker.value.setMap(null));

defineExpose({deactivate, makeActive});
</script>
