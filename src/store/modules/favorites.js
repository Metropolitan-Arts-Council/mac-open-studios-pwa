import service from '@/app.service';

export default {

  state: {
    favorites: []
  },

  getters: {
    favorties(state) {
      return state.favorites;
    }
  },

  actions: {
    getFavorites({commit}) {
      return service.getFavorites().then(favorites => {
        commit('saveFavorites', favorites)
      }).catch(error => {
        console.log(error)
      })
    },
    toggleFavorite({commit}, artist_id) {
      return service.toggleFavorite(artist_id).then(favorites => {
        commit('saveFavorites', favorites)
      }).catch(error => {
        console.log(error)
      })
    }
  },

  mutations: {
    saveFavorites(state, favorites) {
      state.favorites = favorites;
    }
  }
}
