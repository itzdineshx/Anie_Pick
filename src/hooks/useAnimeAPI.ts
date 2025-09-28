import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

interface Genre {
  mal_id: number;
  name: string;
}

interface AnimeData {
  mal_id: number;
  title: string;
  title_english?: string;
  synopsis?: string;
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  type?: string;
  episodes?: number;
  year?: number;
  genres: Genre[];
  images: {
    jpg: {
      large_image_url: string;
      image_url: string;
    };
  };
  aired?: {
    from: string;
    to?: string;
  };
  studios?: Array<{ name: string }>;
  duration?: string;
  rating?: string;
}

interface FilterState {
  genres: number[];
  type: string;
  minScore: number;
  status: string;
  season: string;
  year: number | null;
  endYear: number | null;
  episodeCount: string;
  rating: string;
  source: string;
  orderBy: string;
  sort: string;
}

export const useAnimeAPI = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [currentAnime, setCurrentAnime] = useState<AnimeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [shownAnimeIds, setShownAnimeIds] = useState<Set<number>>(new Set());
  const [availableAnime, setAvailableAnime] = useState<AnimeData[]>([]);

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${JIKAN_BASE_URL}/genres/anime`);
        setGenres(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };

    fetchGenres();
  }, []);

  // Add delay between API calls to respect rate limits
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchAnimeWithFilters = useCallback(async (filters: FilterState): Promise<AnimeData[]> => {
    try {
      console.log('Fetching anime with filters:', filters);
      await delay(1000); // Rate limit protection

      const params: any = {
        page: Math.floor(Math.random() * 10) + 1, // Random page for variety
        limit: 25,
        order_by: filters.orderBy || 'score',
        sort: filters.sort || 'desc'
      };

      if (filters.genres.length > 0) {
        params.genres = filters.genres.join(',');
        console.log('Adding genres filter:', params.genres);
      }

      if (filters.type && filters.type !== '') {
        params.type = filters.type;
        console.log('Adding type filter:', params.type);
      }

      if (filters.status && filters.status !== '') {
        params.status = filters.status;
        console.log('Adding status filter:', params.status);
      }

      if (filters.season && filters.season !== '') {
        params.season = filters.season;
        console.log('Adding season filter:', params.season);
      }

      if (filters.year) {
        params.start_date = `${filters.year}-01-01`;
        console.log('Adding start year filter:', params.start_date);
      }

      if (filters.endYear) {
        params.end_date = `${filters.endYear}-12-31`;
        console.log('Adding end year filter:', params.end_date);
      }

      if (filters.rating && filters.rating !== '') {
        params.rating = filters.rating;
        console.log('Adding rating filter:', params.rating);
      }

      if (filters.source && filters.source !== '') {
        params.producers = filters.source;
        console.log('Adding source filter:', params.producers);
      }

      if (filters.minScore > 1) {
        params.min_score = filters.minScore;
        console.log('Adding min_score filter:', params.min_score);
      }

      // Handle episode count filtering
      if (filters.episodeCount && filters.episodeCount !== '') {
        switch (filters.episodeCount) {
          case 'short':
            params.max_episodes = 12;
            break;
          case 'standard':
            params.min_episodes = 13;
            params.max_episodes = 26;
            break;
          case 'long':
            params.min_episodes = 27;
            break;
        }
        console.log('Adding episode count filter:', filters.episodeCount);
      }

      console.log('API request params:', params);
      const response = await axios.get(`${JIKAN_BASE_URL}/anime`, { params });
      console.log('API response received:', response.data?.data?.length, 'anime found');
      
      const filteredResults = response.data.data?.filter((anime: AnimeData) => 
        anime.images?.jpg?.large_image_url && 
        anime.synopsis &&
        anime.title
      ) || [];

      console.log('Filtered results:', filteredResults.length, 'anime after filtering');
      return filteredResults;
    } catch (error) {
      console.error('Failed to fetch filtered anime:', error);
      return [];
    }
  }, []);

  const fetchRandomAnime = useCallback(async (): Promise<AnimeData | null> => {
    try {
      await delay(1000); // Rate limit protection
      
      // Get a random page
      const randomPage = Math.floor(Math.random() * 50) + 1;
      const response = await axios.get(`${JIKAN_BASE_URL}/top/anime`, {
        params: { page: randomPage, limit: 25 }
      });

      const animeList = response.data.data?.filter((anime: AnimeData) => 
        anime.images?.jpg?.large_image_url && 
        anime.synopsis &&
        anime.title
      ) || [];

      if (animeList.length > 0) {
        const randomIndex = Math.floor(Math.random() * animeList.length);
        return animeList[randomIndex];
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch random anime:', error);
      return null;
    }
  }, []);

  const getNextAnime = useCallback(async (filters: FilterState) => {
    console.log('getNextAnime called with filters:', filters);
    setLoading(true);

    try {
      let nextAnime: AnimeData | null = null;

      // Use functional state updates to avoid dependency issues
      setAvailableAnime(currentAvailable => {
        setShownAnimeIds(currentShown => {
          // Check if we have available anime that haven't been shown
          const unshownAnime = currentAvailable.filter(anime => !currentShown.has(anime.mal_id));
          console.log('Unshown anime in cache:', unshownAnime.length);
          
          if (unshownAnime.length > 0) {
            // Use existing anime from cache
            const randomIndex = Math.floor(Math.random() * unshownAnime.length);
            nextAnime = unshownAnime[randomIndex];
            console.log('Using cached anime:', nextAnime.title);
            setCurrentAnime(nextAnime);
            return new Set(currentShown).add(nextAnime.mal_id);
          } else {
            // Need to fetch new anime - this will be handled outside the state updates
            return currentShown;
          }
        });
        return currentAvailable;
      });

      // If no cached anime found, fetch new ones
      if (!nextAnime) {
        const hasActiveFilters = filters.genres.length > 0 || 
          (filters.type && filters.type !== '') || 
          filters.minScore > 1 ||
          (filters.status && filters.status !== '') ||
          (filters.season && filters.season !== '') ||
          filters.year ||
          filters.endYear ||
          (filters.episodeCount && filters.episodeCount !== '') ||
          (filters.rating && filters.rating !== '') ||
          (filters.source && filters.source !== '');
        console.log('Has active filters:', hasActiveFilters);
        
        if (hasActiveFilters) {
          // Fetch with filters
          const filteredAnime = await fetchAnimeWithFilters(filters);
          
          setShownAnimeIds(currentShown => {
            const unshownFiltered = filteredAnime.filter(anime => !currentShown.has(anime.mal_id));
            
            if (unshownFiltered.length > 0) {
              const randomIndex = Math.floor(Math.random() * unshownFiltered.length);
              nextAnime = unshownFiltered[randomIndex];
              setCurrentAnime(nextAnime);
              
              // Cache the remaining anime
              setAvailableAnime(prev => {
                const existing = new Set(prev.map(a => a.mal_id));
                const newAnime = filteredAnime.filter(a => !existing.has(a.mal_id));
                return [...prev, ...newAnime];
              });
              
              return new Set(currentShown).add(nextAnime!.mal_id);
            }
            return currentShown;
          });
        } else {
          // Get random anime
          nextAnime = await fetchRandomAnime();
          if (nextAnime) {
            setCurrentAnime(nextAnime);
            setShownAnimeIds(prev => new Set(prev).add(nextAnime!.mal_id));
          }
        }
      }

      if (!nextAnime) {
        // All anime exhausted
        setCurrentAnime(null);
      }
    } catch (error) {
      console.error('Error fetching next anime:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchAnimeWithFilters, fetchRandomAnime]);

  const searchAnime = useCallback(async (query: string): Promise<AnimeData[]> => {
    try {
      await delay(1000); // Rate limit protection
      console.log('Searching for anime:', query);
      
      const response = await axios.get(`${JIKAN_BASE_URL}/anime`, {
        params: { 
          q: query,
          limit: 10,
          order_by: 'score',
          sort: 'desc'
        }
      });
      
      const results = response.data.data?.filter((anime: AnimeData) => 
        anime.images?.jpg?.large_image_url && 
        anime.synopsis &&
        anime.title
      ) || [];
      
      console.log('Search results:', results.length, 'anime found for query:', query);
      return results;
    } catch (error) {
      console.error('Failed to search anime:', error);
      return [];
    }
  }, []);

  const resetSession = useCallback(() => {
    setShownAnimeIds(new Set());
    setAvailableAnime([]);
    setCurrentAnime(null);
  }, []);

  const isExhausted = availableAnime.length > 0 && 
                     availableAnime.every(anime => shownAnimeIds.has(anime.mal_id)) &&
                     !loading;

  return {
    genres,
    currentAnime,
    loading,
    shownCount: shownAnimeIds.size,
    isExhausted,
    getNextAnime,
    resetSession,
    searchAnime
  };
};