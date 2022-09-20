<template>
    <div class="results-item">
        <div class="results-item-preview" v-if="showPreview">
            <img
                class="results-item-image"
                :src="artist.image"
                alt="Photo of artist"
                v-if="showImage"
                @click="goToProfile"
            />
            <img
                class="results-item-image"
                :src="artist.image_thumb"
                alt="Photo of artist"
                v-if="showImageThumb"
                @click="goToProfile"
            />
            <button
                class="results-item-favorite button-blank"
                :class="{ active: isFavorited }"
                @click="favorite"
            >
                <img src="/static/icons/favorite-outline.png" v-show="!isFavorited" />
                <img src="/static/icons/favorite-filled.png" v-show="isFavorited" />
                <span>Favorite</span>
            </button>
        </div>
        <div class="results-item-info">
            <div class="results-item-title-container">
              <h3 class="results-item-title" @click="goToProfile">
                {{ artist.full_name }}
              </h3>
              <a v-if="showPreview && artist.youtube_link" class="results-item-title-youtube" :href="artist.youtube_link" target="_blank">
                <img src="static/icons/youtube.png" alt="YouTube" />
              </a>
            </div>
            <span class="results-item-num" v-show="artist.listing_number">{{ artist.listing_number }}</span>
            <div class="results-item-tags">
            <span class="results-item-accessible-tag" v-if="artist.handicap_accessible">
                <img src="static/icons/accessible-circle.png" alt="Accessible" />
            </span>
            <!-- <span class="results-item-friday-tag" v-if="artist.open_friday">
                <img src="static/icons/friday-circle.png" alt="Open Friday" />
                Open Friday
            </span> -->
            <span class="results-item-friday-tag results-item-appointment-tag" v-if="artist.preview && artist.preview !== 'No'">
                <img src="static/icons/preview-filter.png" alt="By Appointment" />
                <strong>Friday Preview</strong>
            </span>
            <span class="results-item-friday-tag results-item-appointment-tag" v-if="artist.appointment && artist.appointment !== 'No'">
                <img src="static/icons/appointment-only.png" alt="By Appointment" />
                <strong>By Appointment:&nbsp;</strong> {{ artist.appointment }}
            </span>
            </div>
            <address class="results-item-address" v-if="showAddress">
                {{ street }}
                <br />
                {{ address.city + ',' + address.state_zip }}
                <br>
                <span @click="openMap">Get Directions</span>
            </address>
            <p v-if="showAddress">{{ artist.phone_number }}</p>
            <div class="results-item-links" v-if="showAddress">
                <a :href="mailto" v-if="artist.email_address" target="_blank">{{ artist.email_address }}</a>
                <br />
                <a :href="website" v-if="artist.website" target="_blank">{{ hostname }}</a>
            </div>
            <a v-if="!showPreview && artist.youtube_link" class="results-item-youtube" :href="artist.youtube_link" target="_blank">
                <img src="static/icons/youtube.png" alt="YouTube" />
                <strong>YouTube</strong>
            </a>
            <footer>
                Medium:
                <span v-for="(medium, index) in artist.mediums" class="artist-medium">
                    <span v-html="medium"></span><span v-if="index != (artist.mediums.length - 1)">, </span>
                </span>
            </footer>
            <footer v-if="useDates && artist.days && artist.days.length">
                <div v-for="{day, hours} in artist.days">
                  {{ formatDate(day) }}: <span class="artist-medium">{{ hours }}</span>
                </div>
            </footer>
            <div v-if="showFavorite" class="results-item-favorite-block">
                <button
                    class="results-item-favorite button-blank"
                    :class="{ active: isFavorited }"
                    @click="favorite"
                >
                    <img src="/static/icons/favorite-outline.png" v-show="!isFavorited" />
                    <img src="/static/icons/favorite-filled.png" v-show="isFavorited" />
                    <span>Favorite</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
  import _ from 'lodash'
  import moment from 'moment';

  export default {
    props: {
      artist: {
        type: Object,
        default: {}
      },
      showAddress: {
        type: Boolean,
        default: false
      },
      useDates: {
        type: Boolean,
        default: false
      },
      showFavorite: {
        type: Boolean,
        default: false
      },
      artistsPage: {
        type: Boolean,
        default: false
      },
      showImage: {
        type: Boolean,
        default: false
      },
      showImageThumb: {
        type: Boolean,
        default: false
      },
      showPreview: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      isFavorited() {
        return this.$store.getters.favorties.includes(this.artist.id);
      },
      address() {
        return this.artist.address || {}
      },
      street() {
        const secondary = this.address.secondary;
        return this.address.street + (secondary ? ' ' + secondary : '');
      },
      mailto() {
        return 'mailto:' + this.artist.email_address;
      },
      website() {
        return _.startsWith(this.artist.website, 'http')
          ? this.artist.website
          : 'http://' + this.artist.website
      },
      hostname() {
        let tmp = document.createElement('a');
        tmp.href = this.website;

        return tmp.hostname;
      }
    },

    methods: {
      favorite() {
        this.$store.dispatch('toggleFavorite', this.artist.id)
      },
      openMap() {
        const addr = this.artist.address;
        const lat = addr.lat
        const lng = addr.lng

        console.log( addr);
        if (!lat || !lng) {
          let address_param = encodeURIComponent(addr.address1 + ' ' + addr.state + ' ' + addr.state_zip);
          window.open(`maps://maps.google.com/maps?daddr=${address_param}&amp;ll=`);
        }
        else if( (navigator.platform.indexOf('iPhone') !== -1)
          || (navigator.platform.indexOf('iPod') !== -1)
          || (navigator.platform.indexOf('iPad') !== -1)) {
          window.open(`maps://maps.google.com/maps?daddr=${lat + ',' + lng}&amp;ll=`);
        }
        else {
          window.open(`http://maps.google.com/maps?daddr=${lat + ',' + lng}&amp;ll=`);
        }
      },
      goToProfile() {
        if (this.$route.name === 'map.artist.show'
          && parseInt(this.$route.params.id) === this.artist.id
        ) {
          return
        }

        this.$router.push({
          name: 'map.artist.show',
          params: { id: this.artist.id }
        })
      },
      formatDate(date) {
        return moment(date, 'DD/MM/YYYY').format('ddd Do');
      },
    }
  }

</script>
