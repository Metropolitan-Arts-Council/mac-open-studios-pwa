<template>
  <div>
    <SearchBar @search="applySearch" @filter="applyFilters"/>
    <FilterDropdown
      :useDateFilter="true"
      :mediums="artistStore.mediums"
      :results-count="artistStore.filteredArtists.length"
      @filterByDate="artistStore.filters.dates = $event"
      @filterByMedium="setMediums"
    />

    <div class="results">
      <div class="results-list" v-show="artistStore.filteredArtists.length > 0">
        <div v-for="letter of Object.keys(groupedArtists)" :key="letter">
          <h2 class="results-group-header">{{letter}}</h2>

          <Artist
            v-for="artist in groupedArtists[letter]"
            :artist="artist"
            :key="artist.id"
            :artistsPage="true"
            :showImageThumb="true"
            :showPreview="true"
            :useDates="false"
          />
        </div>
      </div>
      <div v-show="artistStore.filters.mediums.length > 0" class="text-center dark-box pad-y-20">
        <h3 class="pad-b-10">Selected Mediums</h3>
        <p>You are viewing only artists with:</p>
        <ul class="medium-list buttons-list">
          <li v-for="medium in artistStore.mediums">
            <button class="active" @click.stop="toggleMedium(medium)" v-html="medium"></button>
          </li>
        </ul>
      </div>
      <div class="results-blank" v-show="artistStore.filteredArtists.length === 0 && artistStore.isFiltering">
        <h3 class="results-blank-title">Yikes!</h3>
        <p class="results-blank-explanation" v-show="artistStore.filters.favorited === false">
          There are no results for your search. Try a new search or filter combination.
        </p>
        <p class="results-blank-explanation" v-show="artistStore.filters.favorited === true">
          You have no favorites yet. Heart an artist.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useArtistsStore} from "~/stores/artists.js";

const artistStore = useArtistsStore();

const groupedArtists = computed(() => {
  const groups = {};

  for (let artist of artistStore.filteredArtists) {
    const letter = artist.last_name[0].toUpperCase();

    if (!(letter in groups)) {
      groups[letter] = [];
    }

    groups[letter].push(artist);
    groups[letter].sort((a, b) => {
      return a.last_name.localeCompare(b.last_name);
    });
  }

  return Object.keys(groups).sort((a, b) => a.localeCompare(b)).reduce((obj, key) => {
    obj[key] = groups[key];
    return obj;
  }, {});
});

const applySearch = (val) => artistStore.setFilter('query', val);
const applyFilters = (prop, val) => artistStore.setFilter(prop, val);
const setMediums = (mediums) => artistStore.setFilter('mediums', mediums);
const toggleMedium = (medium) => {
  const mediums = artistStore.getFilter('mediums');

  if (mediums.includes(medium)) {
    mediums.splice(mediums.indexOf(medium), 1)
  } else {
    mediums.push(medium);
  }

  artistStore.setFilter('mediums', mediums);
};

</script>
