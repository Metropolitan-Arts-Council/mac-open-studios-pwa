import * as GMaps from "@googlemaps/js-api-loader";
import * as GMapsClusterer from "@googlemaps/markerclusterer";

const { Loader } = GMaps;
const { MarkerClusterer } = GMapsClusterer;

export function useMap(onMarkerClick = () => {}, onClusterClick) {
  const config = useRuntimeConfig();
  const url = useRequestURL();
  const mapConfig = reactive({
    mapId: 'main',
    center: { lat: 34.844021, lng: -82.404925, },
    zoom: 14,
    maxZoom: 16,
    styles: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }]
      }
    ]
  });
  // const defaultIconSrc = `${url.origin}/icons/marker-location.png`;
  // const activeIconSrc = `${url.origin}/icons/marker-location-active.png`
  const google = ref();
  const markers = ref([]);
  let map = null;
  let cluster = null;

  const Map = ref();
  const AdvancedMarkerElement = ref();
  const PinElement = ref();

  const defaultMarker = {
    title: '',
    position: {},
    icon: null,
    size: 40,
    clickable: true,
  };

  const load = async () => {
    if (!google.value) {
      const loader = new Loader({
        apiKey: config.public.googleMapsKey,
        version: "weekly",
      });
      google.value = await loader.load();
      const {Map: GoogleMap } = await google.value.maps.importLibrary('maps');
      Map.value = GoogleMap;

    }

    if (!AdvancedMarkerElement.value || !PinElement.value) {
      const {AdvancedMarkerElement: AdvancedMarker, PinElement: Pin} = await google.value.maps.importLibrary("marker");
      AdvancedMarkerElement.value = AdvancedMarker;
      PinElement.value = Pin;
    }
  };
  const initialize = (el) => {
    map = new Map.value(
      el,
      toRaw(mapConfig),
    );

    cluster = new MarkerClusterer({
      map: map,
      onClusterClick: (event, cluster, map) => {
        onClusterClick(cluster);
      },
    });
  };
  const addMarker = (mrkr) => {
    const marker = {
      ...defaultMarker,
      ...mrkr,
    };
    let iconImg = null;

    if (marker.icon) {
      iconImg = document.createElement("img");

      iconImg.width = marker.size;
      iconImg.src = `${url.origin}/${marker.icon}`;
    }

    // const iconImg = document.createElement("img");
    // iconImg.width = marker.size;
    // iconImg.src = marker.icon ? `${url.origin}/${marker.icon}` : defaultIconSrc;

    const markerEl = new AdvancedMarkerElement.value({
      position: toRaw(marker.position),
      content: iconImg,
      map: map,
      title: marker.title,
    });

    if (marker.clickable) {
      markerEl.addListener("click", (event) => {
        onMarkerClick(markerEl)
      });
    }

    markers.value.push(markerEl);
  };
  const activateMarker = (markerId) => {
    const markerEl = markers.value.find(m => m.title * 1 === markerId * 1);

    map.setCenter(markerEl.position);

    if (markerId * 1 === 0) return;

    // markers.value.forEach(m => {
    //   m.content.src = defaultIconSrc;
    // });
    //
    // markerEl.content.src = activeIconSrc;
  };
  const wrapInCluster = () => {
    cluster.addMarkers(markers.value);
    cluster.render();
  };
  const showMarker = (markerId) => {
    const marker = markers.value.find(m => `${m.title}` === `${markerId}`);
    cluster.addMarker(marker);
  }
  const hideMarker = (markerId) => {
    const marker = markers.value.find(m => `${m.title}` === `${markerId}`);
    cluster.removeMarker(marker);
  }
  const getMap = () => {
    return map;
  }
  const clearMap = () => {
    if (cluster) {
      for (let i in markers.value) {
        const marker = markers.value[i];
        cluster.removeMarker(marker);
        marker.map = null;
      }

      markers.value = [];
      cluster.map = null;
    }

    cluster = new MarkerClusterer({
      map: map,
      onClusterClick: (event, cluster, map) => {
        onClusterClick(cluster);
      },
    });
  };

  return {
    markers,
    mapConfig,
    load, initialize,
    google, getMap, clearMap,
    addMarker, wrapInCluster,
    activateMarker, showMarker, hideMarker,
  };
}
