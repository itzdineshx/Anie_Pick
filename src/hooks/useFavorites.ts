import { useState, useEffect, useCallback } from 'react';

interface AnimeData {
  mal_id: number;
  title: string;
  title_english?: string;
  synopsis?: string;
  score?: number;
  type?: string;
  episodes?: number;
  year?: number;
  genres: { mal_id: number; name: string; }[];
  images: {
    jpg: {
      large_image_url: string;
    };
  };
}

const FAVORITES_STORAGE_KEY = 'Aniepick_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<AnimeData[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  const saveFavorites = useCallback((newFavorites: AnimeData[]) => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Failed to save favorites to localStorage:', error);
    }
  }, []);

  const addToFavorites = useCallback((anime: AnimeData) => {
    const newFavorites = [...favorites, anime];
    saveFavorites(newFavorites);
  }, [favorites, saveFavorites]);

  const removeFromFavorites = useCallback((animeId: number) => {
    const newFavorites = favorites.filter(anime => anime.mal_id !== animeId);
    saveFavorites(newFavorites);
  }, [favorites, saveFavorites]);

  const isFavorite = useCallback((animeId: number) => {
    return favorites.some(anime => anime.mal_id === animeId);
  }, [favorites]);

  const toggleFavorite = useCallback((anime: AnimeData) => {
    if (isFavorite(anime.mal_id)) {
      removeFromFavorites(anime.mal_id);
    } else {
      addToFavorites(anime);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  const clearFavorites = useCallback(() => {
    saveFavorites([]);
  }, [saveFavorites]);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  };
};