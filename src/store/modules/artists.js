import service from '@/app.service';
import { concat, uniq } from 'lodash';

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


export default {

  state: {
    artists: [],
    meta: []
  },

  getters: {
    artists(state) {
      return state.artists;
    },
    mediums(state) {
      return state.meta.mediums
    },
    locations(state) {
      // filter out artists without a location
      let artists = state.artists.filter(artist => {
        return artist.address
          && artist.address.lat
          && artist.address.lng
      })

      return groupBy(artists, artist => {
        // return [artist.address.lat, artist.address.lng];
        return artist.address.street
      })
    }
  },

  actions: {
    getArtists({commit}) {
      return service.fetchArtists().then(response => {
        commit('saveArtists', response.items);
        commit('saveMeta', response.meta);
      }).catch(error => {
        console.log(error)
      })
    },
  },

  mutations: {
    saveArtists(state, artists) {
      state.artists = artists
    },
    saveMeta(state, meta) {
      state.meta = meta
    }
  }
}
