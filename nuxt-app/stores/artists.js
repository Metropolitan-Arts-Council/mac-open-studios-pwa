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
  const config = useRuntimeConfig();
  const hasLoaded = ref(false);
  const artists = ref([]);
  const meta = ref([]);

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

  const getArtists = () => {
    const url = `${config.public.apiDomain}${config.public.apiArtists}`;

    return $fetch(url).then(response => {
      artists.value = response.items;
      meta.value = response.meta;
      hasLoaded.value = true;
    }).catch(error => console.log(error));
  };

  return {
    hasLoaded, artists,
    meta, mediums, locations, getArtists
  };
});
