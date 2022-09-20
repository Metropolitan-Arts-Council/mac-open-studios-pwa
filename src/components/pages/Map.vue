<template>
    <div>
        <map-loader
            :map-config="mapConfig"
            :apiKey="apiKey"
            :isSecondary="showPanel"
            ref="loader"
        >
            <template slot-scope="scopeProps">
                <child-marker
                    :position="mapConfig.center"
                    :google="scopeProps.google"
                    :map="scopeProps.map"
                    :extra="macOptions"
                    :isMAC="true"
                />
                <child-marker
                    v-for="(marker,i) in markers"
                    :key="i"
                    :position="marker"
                    :activeMarker="activeMarker"
                    :google="scopeProps.google"
                    :map="scopeProps.map"
                    @show="showArtists(i, $event)"
                    ref="childMarkers"
                />
            </template>
        </map-loader>
        <button
            class="map-favorites-toggle fav-icon-bg button-circle"
            :class="{ active: filterFavorited }"
            @click="filterFavorited = !filterFavorited"
        >
            Toggle Favorites
        </button>
        <div class="map-panel" :class="{ hide: !showPanel }">
            <keep-alive>
                <router-view @center="recenter"></router-view>
            </keep-alive>
        </div>
    </div>
</template>

<script>
    // https://dev.to/terrierscript/example-for-google-map-with-vuejs-without-vue-library--3gf5
    import { mapGetters } from 'vuex'

    import Config from '@/app.config'
    import MapLoader from '../map/MapLoader'
    import ChildMarker from '../map/ChildMarker'
    import Artist from '../artists/Artist'
    import _ from 'lodash'

    export default {
      components: { MapLoader, ChildMarker, Artist },

      data() {
        return {
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
        };
      },

      computed: {
        ...mapGetters([
          'artists'
        ]),
        macOptions() {
          return {
            icon: {
              url: "/static/icons/marker-mac.png",
              scaledSize: new this.$refs.loader.$data.google.maps.Size(60, 50)
            }
          };
        },
        locations() {
          return this.$store.getters.locations || []
        },
        markers() {
          return this.locations.map(artists => {
            return {
              lat: artists[0].address.lat,
              lng: artists[0].address.lng
            }
          })
        }
      },

      mounted() {
        this.togglePanel(this.$route)
        console.log(this)
      },

      watch: {
        '$route' (to, from) {
          this.togglePanel(to)
          if (to.name === 'Map') {
            console.log('To Map')
            this.deactivateChildren()
          }
        },
        filterFavorited() {
          this.toggleFavorites()
        }
      },

      methods: {
        togglePanel(route) {
          this.showPanel = ['map.artists.list', 'map.artist.show'].includes(route.name)
        },
        showArtists(index, activeMarker) {
          let artists = this.locations[index]
          this.activeMarker = activeMarker

          if (artists.length > 1) {
            this.$router.push({
              name: 'map.artists.list',
              params: { ids: _.map(artists, 'id').join(',') }
            })
          } else {
            this.$router.push({
              name: 'map.artist.show',
              params: { id: artists[0].id }
            })
          }
        },
        recenter(position, retry) {
          retry = retry || 0
          const max = 10

          if (retry > max) return

          // Coming to a details window from another route
          // can trigger the event before the map has rendered.
          // Doing a little retry loop here gives the map
          // a chance to catch up.
          if (_.isNull(this.$refs.loader.$data.map)) {
            console.log('is null')
            setTimeout(() => {
              this.recenter(position, ++retry)
              console.log('attempting a retry', retry)
            }, 10)
          } else {
            console.log('not null')
            this.deactivateChildren()
            this.$refs.loader.$data.map.setCenter(position)
            this.activateChildMarker()
          }
        },

        activateChildMarker() {
          let marker = undefined
          const mapCenter = this.$refs.loader.$data.map.getCenter()
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
            this.locations.forEach((artists, index) => {
              artists.forEach(artist => {
                if (artist.address.lat.toFixed(5) === mapLat
                    && artist.address.lng.toFixed(5) === mapLng
                ) {
                  console.log('child marker found')
                  marker = this.$refs.childMarkers[index]

                  // break out of the loop
                  throw BreakException;
                }
              })
            })
          } catch (e) {
            if (e !== BreakException) throw e;
          }

          if (marker) {
            console.log('activating child marker')
            marker.makeActive()
          }
        },

        toggleFavorites() {
          const favorites = this.$store.getters.favorties || []

          if (this.filterFavorited === false) {
            console.log('Not filtering favorites, showing all')

            this.markers.forEach((marker, index) => {
              this.$refs.childMarkers[index].visible(true)
            })
          } else {
            if (favorites.length === 0) {
              console.log('Showing only favorites but there aren\'t any so we\'ll immediately hide all and not loop')
              this.$refs.childMarkers[index].visible(false)
            } else {
              console.log('Showing only favorites - performing loop')
              const foundMarkerIndexes = []

              this.locations.forEach((artists, index) => {
                artists.forEach(artist => {
                  if (favorites.includes(artist.id)) {
                    console.log('Artist is favorited')
                    foundMarkerIndexes.push(index)
                  }
                })
              })

              console.log('Found markers indexes', foundMarkerIndexes)

              // Now, loop through all markers and either turn them on or off
              this.markers.forEach((marker, index) => {
                this.$refs.childMarkers[index].visible(foundMarkerIndexes.includes(index))
              })
            }
          }
        },

        deactivateChildren() {
          console.log('deactivating children')
          this.markers.forEach((marker, index) => {
            this.$refs.childMarkers[index].deactivate()
          })
        }
      }
    }
</script>
