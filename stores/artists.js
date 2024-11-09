import {useFavoritesStore} from "~/stores/favorites.js";
import moment from 'moment';

function groupBy( array , fnc ) {
  let groups = {};
  array.forEach(item => {
    let group = JSON.stringify(fnc(item));
    groups[group] = groups[group] || [];
    groups[group].push(item);
  });
  return Object.keys(groups).map(group => {
    return groups[group];
  })
}

export const useArtistsStore = defineStore('artistsStore', () => {
  const favoritesStore = useFavoritesStore();

  const config = useRuntimeConfig();
  const hasLoaded = ref(false);
  const artists = ref([]);
  const meta = ref([]);
  const filters = reactive({
    query: '',
    mediums: [],
    dates: [],
    names: [],
    accessible: false,
    open_friday: false,
    appointment_only: false,
    favorited: false,
    preview_day: false,
  });

  const mediums = computed(() => meta.value.mediums);
  const locations = computed(() => {
    // filter out artists without a location
    let grouped_artists = artists.value.filter(artist => {
      return artist.address
        && artist.address.lat
        && artist.address.lng;
    });

    return groupBy(grouped_artists, artist => {
      // return [artist.address.lat, artist.address.lng];
      return artist.address.street;
    });
  });
  const isFiltering = computed(() => {
    if (filters.query.trim() !== '') return true;
    if (filters.mediums.length > 0) return true;
    if (filters.dates.length > 0) return true;
    if (filters.names.length > 0) return true;

    return filters.accessible || filters.open_friday || filters.appointment_only || filters.favorited || filters.preview_day;
  });
  const filteredArtists = computed(() => {
    return artists.value.filter((artist) => {
      if (!matchesAnyOfDates(artist)) return false;
      if (!matchesAnyOfMediums(artist)) return false;
      if (!matchesAnyOfNames(artist)) return false;
      if (!matchesQuery(artist)) return false;
      if (filters.accessible && !artist.handicap_accessible) return false;
      if (filters.open_friday && !artist.open_friday) return false;
      if (filters.appointment_only && artist.appointment && artist.appointment.toLowerCase() === 'no') return false;
      if (filters.preview_day && artist.preview && artist.preview.toLowerCase() === 'no') return false;
      if (filters.favorited) {
        const favorites = [...favoritesStore.favorites];

        if (!favorites.includes(artist.id)) return false;
      }

      return true;
    });
  });

  const matchesAnyOfDates = (artist) => {
    if (!filters.dates.length) return true;

    // Check if any of the dates in filters.dates is a Friday
    const includesFriday8th = filters.dates.some(date => {
      const momentDate = moment(date, 'DD/MM/YYYY');
      return momentDate.date() === 8 && momentDate.day() === 5; // 5 represents Friday
    });

    if(includesFriday8th && artist.open_friday) {
      return true;
    }

    if (!artist.days) return false;

    return artist.days.some(date => filters.dates.includes(moment(date.day, 'DD/MM/YYYY').date()));
  }
  const matchesAnyOfMediums = (artist) => {
    if (!filters.mediums.length) return true;
    if (!artist.mediums) return false;

    return artist.mediums.some(medium => filters.mediums.includes(medium));
  };
  const matchesAnyOfNames = (artist) => {
    if (!filters.names.length) return true;

    return filters.names.includes(artist.last_name[0]);
  };
  const matchesQuery = (artist) => {
    const query = filters.query.toLowerCase().trim();

    if (query === '') return true;

    for (let term of query.split(/\s+/g)) {
      if (!artist.full_name.toLowerCase().includes(term)) return false;
    }

    return true;
  };
  const getArtists = () => {
    const url = `${config.public.apiDomain}${config.public.apiArtists}`;

    return $fetch(url).then(response => {
      artists.value = response.items;
      meta.value = response.meta;
      hasLoaded.value = true;
    }).catch(error => console.log(error));
  };
  const setFilter = (key, value) => filters[key] = value;
  const getFilter = (key) => filters[key];
  const toggleFilter = (key) => {
    if (filters[key] === true) return filters[key] = false;
    if (filters[key] === false) return filters[key] = true;

    return null;
  };
  const clearFilters = () => {
    filters.query = '';
    filters.mediums = [];
    filters.dates = [];
    filters.names = [];
    filters.accessible = false;
    filters.open_friday = false;
    filters.appointment_only = false;
    filters.favorited = false;
    filters.preview_day = false;
  };

  return {
    hasLoaded, artists,
    meta, mediums, locations, getArtists,
    filters, isFiltering, filteredArtists,
    getFilter, setFilter, toggleFilter, clearFilters,
  };
});
