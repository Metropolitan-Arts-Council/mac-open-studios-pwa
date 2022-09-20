<template>
    <span>
        <header class="map-panel-header">
            <button class="map-panel-back button-blank" @click="goBack">Back</button>
            <img class="map-panel-image" :src="artist.image" role="presentation" />
        </header>
        <Artist
            :artist="artist"
            :key="artist.id"
            :showPreview="false"
            :showFavorite="true"
            :showAddress="true"
            :showListingNumber="false"
        />
    </span>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Artist from '../artists/Artist'
  import _ from 'lodash'

  export default {
    components: { Artist },

    computed: {
      ...mapGetters([
        'artists'
      ]),
      artist() {
        const id = parseInt(this.$route.params.id) || null;
        let artist = _.chain(this.artists)
          .filter({id})
          .head()
          .value();

        return artist || {};
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.center()
      })
    },

    updated() {
      this.center()
    },

    methods: {
      goBack() {
        this.$router.back()
      },
      center() {
        if (this.artist
          && this.artist.address
          && this.artist.address.lat
          && this.artist.address.lng
        ) {
          this.$emit('center', {
            lat: this.artist.address.lat,
            lng: this.artist.address.lng
          })
        }
      }
    }

  }
</script>
