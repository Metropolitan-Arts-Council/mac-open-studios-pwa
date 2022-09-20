<template></template>
<script>
  function isMarkerCentered(markerPosition, mapCenter) {
    const mapLng = mapCenter.lng().toFixed(4)
    const mapLat = mapCenter.lat().toFixed(4)
    const markerLng = markerPosition.lng.toFixed(4)
    const markerLat = markerPosition.lat.toFixed(4)

    return mapLng === markerLng
      && mapLat === markerLat
  }

  export default {
    props: {
      isMAC: false,
      google: Object,
      map: Object,
      position: Object,
      extra: Object,
      activeMarker: {
        default: undefined
      },
      iconUrl: {
        default: 'static/icons/marker-location.png'
      },
      iconUrlActive: {
        default: 'static/icons/marker-location-active.png'
      }
    },

    data(){
      return { marker: null}
    },

    computed: {
      icon() {
        return {
          url: this.iconUrl,
          scaledSize: new this.google.maps.Size(40, 50)
        };
      }
    },

    watch: {
      activeMarker(marker) {
        if (marker === this.marker) return

        this.deactivate()
      }
    },

    mounted(){
      const { Marker } = this.google.maps

      this.marker = new Marker(Object.assign(
        {},
        {
          map: this.map,
          position: this.position,
          icon: this.icon
        },
        this.extra || {}
      ))

      this.marker.addListener('click', () => {
        this.map.setCenter(this.position)
        this.marker.setIcon(Object.assign({}, this.icon, { url: this.iconUrlActive }))
        this.$emit('show', this.marker)
      })
    },

    beforeDestroy() {
      this.marker.setMap(null)
    },

    methods: {
      makeActive() {
        console.log('make active')
        this.marker.setIcon(Object.assign({}, this.icon, { url: this.iconUrlActive }))
      },
      deactivate() {
        this.marker.setIcon(this.icon)
      },
      visible(visible = true) {
        this.marker.setVisible(visible)
      }
    }
  }
</script>
