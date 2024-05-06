import {Loader} from "@googlemaps/js-api-loader";
import Config from "~/app.config.js";
import {MarkerClusterer} from "@googlemaps/markerclusterer";

export function useMap(onMarkerClick = () => {}, onClusterClick) {
  const url = useRequestURL();
  const mapConfig = reactive({
    mapId: 'main',
    center: { lat: 34.844021, lng: -82.404925, },
    zoom: 16,
    styles: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }]
      }
    ]
  });
  const defaultIconSrc = `${url.origin}/icons/marker-location.png`;
  const activeIconSrc = `${url.origin}/icons/marker-location-active.png`
  const google = ref();
  const map = ref();
  const markers = ref([]);
  const cluster = ref();

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
        apiKey: Config.googleMapsKey,
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
    map.value = new Map.value(
      el,
      toRaw(mapConfig),
    );
  };
  const addMarker = (mrkr) => {
    const marker = {
      ...defaultMarker,
      ...mrkr,
    };

    const iconImg = document.createElement("img");
    iconImg.width = marker.size;
    iconImg.src = marker.icon ? `${url.origin}/${marker.icon}` : defaultIconSrc;

    const markerEl = new AdvancedMarkerElement.value({
      position: toRaw(marker.position),
      content: iconImg,
      map: toRaw(map.value),
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
    console.log(markerEl, markerId);

    map.value.setCenter(markerEl.position);

    markers.value.forEach(m => {
      m.content.src = defaultIconSrc;
    });

    if (markerId * 1 === 0) return;

    markerEl.content.src = activeIconSrc;
  };
  const wrapInCluster = () => {
    if (cluster.value) {
      cluster.value.clearMarkers();
      cluster.value.setMap(null);
      cluster.value = null;
    }

    cluster.value = new MarkerClusterer({
      markers: markers.value,
      map: toRaw(map.value),
      onClusterClick: (event, cluster, map) => {
        onClusterClick(cluster);
      },
    });
  };

  return {
    mapConfig,
    load, initialize,
    google, map,
    addMarker, wrapInCluster,
    activateMarker,
    // AdvancedMarkerElement, PinElement,
  };
}
