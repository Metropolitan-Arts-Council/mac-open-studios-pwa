import {useStorage} from "@vueuse/core";

export const useFavoritesStore = defineStore('favoritesStore', () => {
  const favorites = useStorage('favorites', []);

  const getFavorites = () => {
    return favorites.value;
  };
  const toggleFavorite = (artist_id) => {
    if (favorites.value.includes(artist_id)) {
      favorites.value.splice(favorites.value.indexOf(artist_id), 1);
    } else {
      favorites.value.push(artist_id);
    }

    return favorites.value;
  };

  return {favorites, getFavorites, toggleFavorite};
});
