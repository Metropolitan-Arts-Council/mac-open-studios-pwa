import {ref} from "vue";
import service from '../app.service.js';

export const useFavoritesStore = defineStore('favoritesStore', () => {
  const favorites = ref([]);

  const getFavorites = () => {
    return service.getFavorites().then(favorites => {
      favorites.value = favorites;
    }).catch(error => console.log(error));
  };
  const toggleFavorite = () => {
    return service.toggleFavorite(artist_id).then(favorites => {
      favorites.value = favorites;
    }).catch(error => console.log(error));
  };

  return {favorites, getFavorites, toggleFavorite};
});
