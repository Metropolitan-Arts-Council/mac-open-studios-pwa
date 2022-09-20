<template>
    <div>
        <SearchBar @search="searchString = $event" @filter="applyFilters"/>
        <FilterDropdown :useDateFilter="false" :mediums="mediums" :results-count="filteredArtists.length" @filterByDate="checkedDates = $event" @filterByMedium="checkedMediums = $event" />

        <div class="results ">
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
            <div v-show="checkedMediums.length > 0" class="text-center dark-box pad-y-20">
                <h3 class="pad-b-10">Selected Mediums</h3>
                <p>You are viewing only artists with:</p>
                <ul class="medium-list buttons-list">
                    <li v-for="medium in checkedMediums">
                        <button class="active" @click.stop="toggleMedium(medium)" v-html="medium"></button>
                    </li>
                </ul>
            </div>
            <div class="results-blank" v-show="filteredArtists.length === 0 && isFiltering">
                <h3 class="results-blank-title">Yikes!</h3>
                <p class="results-blank-explanation" v-show="filterFavorited === false">
                    There are no results for your search. Try a new search or filter combination.
                </p>
                <p class="results-blank-explanation" v-show="filterFavorited === true">
                    You have no favorites yet. Heart an artist.
                </p>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Artist from '../artists/Artist'
  import FilterDropdown from '../artists/FilterDropdown';
  import SearchBar from '../artists/SearchBar'
  import moment from 'moment';

  export default {
    components: { Artist, FilterDropdown, SearchBar },

    data() {
      return {
        checkedDates: [],
        checkedMediums: [],
        searchString: '',
        filterAccessible: false,
        filterOpenFriday: false,
        filterAppointmentOnly: false,
        filterFavorited: false,
        filterPreviewDay: false
      };
    },

    computed: {
      ...mapGetters([
        'artists',
        'mediums'
      ]),
      isFiltering() {
          let filtering = false;

          if(this.filterAccessible || this.filterOpenFriday || this.filterAppointmentOnly || this.filterFavorited || this.filterPreviewDay) {
              filtering = true;
          }

          if(this.searchString.length > 0) {
              filtering = true;
          }

          return filtering;
      },
      filteredArtists() {
        let artists = this.artists;

        if (this.checkedDates.length) {
          artists = artists.filter(artist => {
            return artist.days
                && artist.days.some(date => this.checkedDates.includes(moment(date.day, 'DD/MM/YYYY').date()))
          })
        }

        if (this.checkedMediums.length) {
          artists = artists.filter(artist => {
            return artist.mediums
                && artist.mediums.some(medium => this.checkedMediums.includes(medium))
          })
        }

        if (this.searchString !== '') {
          artists = artists.filter(artist => {
            return artist.full_name.toLowerCase().includes(this.searchString.toLowerCase());
          })
        }

        if (this.filterAccessible) {
          artists = artists.filter(artist => {
            return artist.handicap_accessible;
          })
        }

        if (this.filterOpenFriday) {
          artists = artists.filter(artist => {
            return artist.open_friday;
          })
        }

        if (this.filterAppointmentOnly) {
          artists = artists.filter(artist => {
            return artist.appointment && artist.appointment !== 'No';
          })
        }

        if (this.filterPreviewDay) {
          artists = artists.filter(artist => {
            return artist.preview && artist.preview !== 'No';
          })
        }

        if (this.filterFavorited) {
          const favorites = this.$store.getters.favorties;
          artists = artists.filter(artist => {
            return favorites.includes(artist.id);
          })
        }

        return artists.sort(function (a, b) {
            return a.last_name.localeCompare(b.last_name);
        });
      }
    },

    methods: {
      applyFilters(prop, val) {
        this[prop] = val;
      },
        toggleMedium(medium) {
            if (this.checkedMediums.includes(medium)) {
                this.checkedMediums.splice(this.checkedMediums.indexOf(medium), 1)
            } else {
                this.checkedMediums.push(medium);
            }
        }
    }
  }
</script>
