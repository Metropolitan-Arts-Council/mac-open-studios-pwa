<template>
  <div>
    <SearchBar @search="applySearch" @filter="applyFilters"/>
    <FilterDropdown
      :useDateFilter="false"
      :mediums="mediums"
      :results-count="filteredArtists.length"
      @filterByDate="data.checkedDates = $event"
      @filterByMedium="setMediums"
    />

    <div class="results">
      <ul class="results-list" v-show="filteredArtists.length > 0">
        <li>
          <Artist
            v-for="artist in filteredArtists"
            :artist="artist"
            :key="artist.id"
            :artistsPage="true"
            :showImageThumb="true"
            :showPreview="true"
            :useDates="false"
          />
        </li>
      </ul>
      <div v-show="data.checkedMediums.length > 0" class="text-center dark-box pad-y-20">
        <h3 class="pad-b-10">Selected Mediums</h3>
        <p>You are viewing only artists with:</p>
        <ul class="medium-list buttons-list">
          <li v-for="medium in data.checkedMediums">
            <button class="active" @click.stop="toggleMedium(medium)" v-html="medium"></button>
          </li>
        </ul>
      </div>
      <div class="results-blank" v-show="filteredArtists.length === 0 && isFiltering">
        <h3 class="results-blank-title">Yikes!</h3>
        <p class="results-blank-explanation" v-show="data.filterFavorited === false">
          There are no results for your search. Try a new search or filter combination.
        </p>
        <p class="results-blank-explanation" v-show="data.filterFavorited === true">
          You have no favorites yet. Heart an artist.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useArtistsStore} from "~/stores/artists.js";
import moment from "moment/moment.js";
import {useFavoritesStore} from "~/stores/favorites.js";

const artistStore = useArtistsStore();
const favoritesStore = useFavoritesStore();

const data = reactive({
  checkedDates: [],
  checkedMediums: [],
  searchString: '',
  filterAccessible: false,
  filterOpenFriday: false,
  filterAppointmentOnly: false,
  filterFavorited: false,
  filterPreviewDay: false,
});

const artists = computed(() => artistStore.artists);
const mediums = computed(() => artistStore.mediums);
const isFiltering = computed(() => {
  let filtering = false;

  if(data.filterAccessible || data.filterOpenFriday || data.filterAppointmentOnly || data.filterFavorited || data.filterPreviewDay) {
    filtering = true;
  }

  if(data.searchString.length > 0) {
    filtering = true;
  }

  return filtering;
});
const filteredArtists = computed(() => {
  let filtered_artists = [...artists.value];

  if (data.checkedDates.length) {
    filtered_artists = filtered_artists.filter(artist => {
      return artist.days
        && artist.days.some(date => data.checkedDates.includes(moment(date.day, 'DD/MM/YYYY').date()))
    })
  }

  if (data.checkedMediums.length) {
    filtered_artists = filtered_artists.filter(artist => {
      return artist.mediums
        && artist.mediums.some(medium => data.checkedMediums.includes(medium))
    })
  }

  if (data.searchString !== '') {
    filtered_artists = filtered_artists.filter(artist => {
      return artist.full_name.toLowerCase().includes(data.searchString.toLowerCase());
    })
  }

  if (data.filterAccessible) {
    filtered_artists = filtered_artists.filter(artist => {
      return artist.handicap_accessible;
    })
  }

  if (data.filterOpenFriday) {
    filtered_artists = filtered_artists.filter(artist => {
      return artist.open_friday;
    })
  }

  if (data.filterAppointmentOnly) {
    filtered_artists = filtered_artists.filter(artist => {
      return artist.appointment && artist.appointment !== 'No';
    })
  }

  if (data.filterPreviewDay) {
    filtered_artists = filtered_artists.filter(artist => {
      return artist.preview && artist.preview !== 'No';
    })
  }

  if (data.filterFavorited) {
    const favorites = [...favoritesStore.favorites];

    filtered_artists = filtered_artists.filter(artist => {
      return favorites.includes(artist.id);
    })
  }

  return filtered_artists.sort(function (a, b) {
    return a.last_name.localeCompare(b.last_name);
  });
});

const applySearch = (val) => data.searchString = val;
const applyFilters = (prop, val) => {
  data[prop] = val;
};
const setMediums = (mediums) => {
  data.checkedMediums = mediums;
};
const toggleMedium = (medium) => {
  if (data.checkedMediums.includes(medium)) {
    data.checkedMediums.splice(data.checkedMediums.indexOf(medium), 1)
  } else {
    data.checkedMediums.push(medium);
  }
};

</script>
