<template>
    <span>
        <header class="map-panel-header">
            <button class="map-panel-back button-blank" @click="goBack">Back</button>
        </header>
        <Artist
            v-for="artist in artistsList"
            :artist="artist"
            :key="artist.id"
            :showImageThumb="true"
            :showPreview="true"
        />
    </span>
</template>

<script>
    import { mapGetters } from 'vuex'
    import Artist from '../artists/Artist'

    export default {
      components: { Artist },

      computed: {
        ...mapGetters([
          'artists'
        ]),
        artistsList() {
          let ids = this.$route.params.ids || ''
          ids = ids.split(',')
          return this.artists.filter(artist => {
            return ids.includes(artist.id.toString())
          })
        }
      },

      updated() {
        let artists = this.artistsList
        if (artists.length) {
          this.$emit('center', {
            lat: artists[0].address.lat,
            lng: artists[0].address.lng
          })
        }
      },

      methods: {
        goBack() {
          this.$router.push({name: 'Map'})
        }
      }

    }
</script>
