<template>
    <div class="results-item">
        <div class="results-item-preview" v-if="showPreview">
            <img
                class="results-item-image"
                :src="imgSrc"
                alt="Photo of artist"
                @click="goToProfile"
            />
            <button
                class="results-item-favorite button-blank"
                :class="{ active: isFavorited }"
                @click="favorite"
            >
                <img src="~/assets/icons/favorite-outline.png" v-show="!isFavorited" />
                <img src="~/assets/icons/favorite-filled.png" v-show="isFavorited" />
                <span>Favorite</span>
            </button>
        </div>
        <div class="results-item-info">
            <div class="results-item-title-container">
              <h3 class="results-item-title" @click="goToProfile">
                {{ artist.full_name }}
              </h3>
              <a v-if="showPreview && artist.youtube_link" class="results-item-title-youtube" :href="artist.youtube_link" target="_blank">
                <img src="~/assets/icons/youtube.png" alt="YouTube" />
              </a>
            </div>
            <span class="results-item-num" v-show="artist.listing_number">{{ artist.listing_number }}</span>
            <div class="results-item-tags">
            <span class="results-item-accessible-tag" v-if="artist.handicap_accessible">
                <img src="~/assets/icons/accessible-circle.png" alt="Accessible" />
            </span>
            <!-- <span class="results-item-friday-tag" v-if="artist.open_friday">
                <img src="~/assets/icons/friday-circle.png" alt="Open Friday" />
                Open Friday
            </span> -->
            <span class="results-item-friday-tag results-item-appointment-tag" v-if="artist.preview && artist.preview !== 'No'">
                <img src="~/assets/icons/preview-filter.png" alt="By Appointment" />
                <strong>Friday Preview</strong>
            </span>
            <span class="results-item-friday-tag results-item-appointment-tag" v-if="artist.appointment && artist.appointment !== 'No'">
                <img src="~/assets/icons/appointment-only.png" alt="By Appointment" />
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
                <img src="~/assets/icons/youtube.png" alt="YouTube" />
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
                    <img src="~/assets/icons/favorite-outline.png" v-show="!isFavorited" />
                    <img src="~/assets/icons/favorite-filled.png" v-show="isFavorited" />
                    <span>Favorite</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import _ from 'lodash'
import moment from 'moment';
import {useFavoritesStore} from "~/stores/favorites.js";

const route = useRoute();
const router = useRouter();
const favoritesStore = useFavoritesStore();

const props = defineProps({
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
});

const isFavorited = computed(() => {
  return favoritesStore.favorites.includes(props.artist.id);
});
const address = computed(() => {
  return props.artist.address || {}
});
const street = computed(() => {
  const secondary = address.value.secondary;
  return address.value.street + (secondary ? ' ' + secondary : '');
});
const mailto = computed(() => {
  return 'mailto:' + props.artist.email_address;
});
const website = computed(() => {
  return _.startsWith(props.artist.website, 'http')
    ? props.artist.website
    : 'http://' + props.artist.website
});
const hostname = computed(() => {
    let tmp = document.createElement('a');
    tmp.href = website.value;

    return tmp.hostname;
  });
const imgSrc = computed(() => {
  return props.showImage ? props.artist.image : props.artist.image_thumb;
});

const favorite = () => favoritesStore.toggleFavorite(props.artist.id);
const openMap = () => {
  const addr = props.artist.address;
  const lat = addr.lat
  const lng = addr.lng
  let location = '';

  if (!lat || !lng) {
    let address_param = encodeURIComponent(addr.address1 + ' ' + addr.state + ' ' + addr.state_zip);
    location = `maps.google.com/maps?daddr=${address_param}&amp;ll=`;
  } else {
    location = `maps.google.com/maps?daddr=${lat + ',' + lng}&amp;ll=`;
  }

  if( window.navigator.userAgent.indexOf('Win') !== -1) {
    window.open(`https://${location}`);
  }
  else {
    window.open(`maps://${location}`);
  }
};
const goToProfile = () => {
  if (route.name === 'map-artist-show-id'
    && parseInt(route.params.id) === props.artist.id
  ) {
    return
  }

  router.push({
    name: 'map-artist-show-id',
    params: { id: props.artist.id }
  })
};
const formatDate = (date) => {
  return moment(date, 'DD/MM/YYYY').format('ddd Do');
};
</script>
