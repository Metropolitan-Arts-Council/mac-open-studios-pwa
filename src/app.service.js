import Config from './app.config.js'
import appCache from './app.service.cache.js'

let service = {
  cacheRequest(path, cacheTime) {
    return new Promise((resolve, reject) => {
      appCache.get(path, cacheTime)
        .then(response => { resolve(response) })
        .catch(err => { reject(err) })
    })
  },
  fetchArtists() {
    return new Promise((resolve, reject) => {
      this.cacheRequest(Config.apiDomain, Config.apiCacheTime)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => { reject(error) })
    })
  },
  getFavorites() {
    return new Promise((resolve, reject) => {
      appCache.getLocal('favorites')
        .then(favorites => {
          resolve(favorites || [])
        })
        .catch(err => { reject(err) })
    })
  },
  toggleFavorite(artist_id) {
    return new Promise((resolve, reject) => {
      // First fetch the favorites
      this.getFavorites()
        .then(favorites => {
          // Then if the artis is already a favorite, remove them
          if (favorites.includes(artist_id)) {
            favorites.splice(favorites.indexOf(artist_id), 1)
          } else {
            // if not already a favorite, add them
            favorites.push(artist_id)
          }

          // Now update the favorites in the database
          appCache.setLocal('favorites', favorites)
            .then(value => resolve(value))
            .catch(err => reject(err))
        })
        .catch(err => { reject(err) })
    })
  }
}

export default service
