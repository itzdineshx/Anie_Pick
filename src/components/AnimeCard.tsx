import { useState } from 'react';
import { Star, Calendar, Play, Hash, ExternalLink, Youtube, RotateCcw, Monitor, Sparkles, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFavorites } from '@/hooks/useFavorites';
import { AnimeCardFrame, AnimePowerAura, MangaBubble, AnimeSparkles } from '@/components/AnimeDecorations';

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
  type?: string;
  episodes?: number;
  year?: number;
  genres: Genre[];
  images: {
    jpg: {
      large_image_url: string;
    };
  };
}

interface AnimeCardProps {
  anime: AnimeData;
  isLoading?: boolean;
  onAnotherAnime?: () => void;
}

const AnimeCard = ({ anime, isLoading = false, onAnotherAnime }: AnimeCardProps) => {
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  
  const isFavorited = favorites.some(fav => fav.mal_id === anime.mal_id);
  
  const toggleFavorite = () => {
    if (isFavorited) {
      removeFromFavorites(anime.mal_id);
    } else {
      addToFavorites(anime);
    }
  };

  const watchOnAnimeKai = () => {
    // Convert anime title to URL-friendly format
    const urlTitle = anime.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
    
    // Create animekai.to URL with proper structure
    const animeKaiUrl = `https://animekai.to/watch/${urlTitle}-${anime.mal_id}#ep=1`;
    window.open(animeKaiUrl, '_blank', 'noopener,noreferrer');
  };

  const watchTrailer = () => {
    const query = encodeURIComponent(`${anime.title} anime trailer`);
    const youtubeUrl = `https://www.youtube.com/results?search_query=${query}`;
    window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
  };

  const viewOnMAL = () => {
    const malUrl = `https://myanimelist.net/anime/${anime.mal_id}`;
    window.open(malUrl, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <Card className="sophisticated-card w-full max-w-4xl mx-auto animate-crimson-pulse">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-80 h-96 bg-muted rounded-lg"></div>
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-muted rounded-full"></div>
                  <div className="h-6 w-16 bg-muted rounded-full"></div>
                  <div className="h-6 w-20 bg-muted rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const truncatedSynopsis = anime.synopsis?.length > 300 
    ? anime.synopsis.substring(0, 300) + '...' 
    : anime.synopsis;

  return (
    <AnimePowerAura intensity={anime.score > 8.5 ? "high" : anime.score > 7.5 ? "medium" : "low"}>
      <AnimeCardFrame glowing={anime.score > 8.5}>
        <Card className="sophisticated-card w-full max-w-4xl mx-auto overflow-hidden animate-slide-in relative">
          <AnimeSparkles count={anime.score > 8.5 ? 15 : 8} />
          {anime.score > 8.5 && (
            <MangaBubble position="top-right">
              LEGENDARY!
            </MangaBubble>
          )}
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
          {/* Anime Cover Image */}
          <div className="relative lg:w-96 w-full lg:flex-shrink-0">
            <div className="relative overflow-hidden lg:h-full">
              <img
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                className={`w-full h-auto sm:h-auto lg:h-full lg:min-h-full object-cover lg:object-cover sm:object-contain transition-all duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                  <Play className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              
              {/* Mobile overlay buttons */}
              <div className="absolute top-3 right-3 lg:hidden flex gap-2">
                <Button
                  onClick={toggleFavorite}
                  size="sm"
                  className="h-10 w-10 p-0 rounded-full shadow-lg backdrop-blur-sm bg-background/80 border-border/50 hover:bg-primary/80 group"
                >
                  <Heart className={`w-4 h-4 transition-all duration-300 group-hover:scale-125 ${
                    isFavorited ? 'fill-red-500 text-red-500' : 'text-foreground'
                  }`} />
                </Button>
                <Button
                  onClick={viewOnMAL}
                  size="sm"
                  className="h-10 w-10 p-0 rounded-full shadow-lg backdrop-blur-sm bg-background/80 border-border/50 hover:bg-primary/80 group"
                >
                  <ExternalLink className="w-4 h-4 transition-all duration-300 group-hover:scale-125 text-foreground" />
                </Button>
              </div>
            </div>
          </div>

          {/* Anime Details */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Title Section */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-anime bg-gradient-red-moon bg-clip-text text-transparent leading-tight">
                {anime.title}
              </h1>
              {anime.title_english && anime.title_english !== anime.title && (
                <p className="text-base sm:text-lg text-muted-foreground">
                  {anime.title_english}
                </p>
              )}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
              {anime.score && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="font-semibold text-accent text-sm sm:text-base">{anime.score}</span>
                </div>
              )}
              
              {anime.type && (
                <Badge variant="secondary" className="font-anime text-xs sm:text-sm">
                  {anime.type}
                </Badge>
              )}

              {anime.episodes && (
                <div className="flex items-center gap-1">
                  <Hash className="w-4 h-4" />
                  <span className="text-sm sm:text-base">{anime.episodes} episodes</span>
                </div>
              )}

              {anime.year && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm sm:text-base">{anime.year}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {anime.genres.slice(0, 6).map((genre) => (
                  <Badge key={genre.mal_id} variant="outline" className="text-primary border-primary">
                    {genre.name}
                  </Badge>
                ))}
                {anime.genres.length > 6 && (
                  <Badge variant="outline">+{anime.genres.length - 6} more</Badge>
                )}
              </div>
            )}

            {/* Synopsis */}
            {anime.synopsis && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Synopsis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {synopsisExpanded ? anime.synopsis : truncatedSynopsis}
                </p>
                {anime.synopsis.length > 300 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSynopsisExpanded(!synopsisExpanded)}
                    className="text-primary hover:text-primary-foreground p-0 h-auto font-medium"
                  >
                    {synopsisExpanded ? 'Show less' : 'Read more'}
                  </Button>
                )}
              </div>
            )}

            {/* Enhanced Action Buttons */}
            <div className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
              {/* Main action buttons - Full width on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={watchTrailer}
                  size="lg"
                  className="anime-button-secondary h-12 sm:h-14 rounded-xl text-sm font-bold tracking-wide w-full"
                >
                  <Youtube className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  TRAILER
                </Button>
                
                <Button
                  onClick={watchOnAnimeKai}
                  size="lg"
                  className="anime-button h-12 sm:h-14 rounded-xl text-sm font-bold tracking-wide w-full"
                >
                  <Monitor className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  WATCH
                </Button>
              </div>

              {/* Secondary buttons - Improved mobile layout */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                <Button
                  onClick={toggleFavorite}
                  size="lg"
                  className="anime-button h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-bold tracking-wide"
                >
                  <Heart className={`w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 ${
                    isFavorited ? 'fill-red-500 text-red-500' : ''
                  }`} />
                  <span className="hidden sm:inline">FAVORITE</span>
                  <span className="sm:hidden">FAV</span>
                </Button>
                
                <Button
                  onClick={viewOnMAL}
                  size="lg"
                  className="anime-button h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-bold tracking-wide"
                >
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">VIEW MORE</span>
                  <span className="sm:hidden">VIEW</span>
                </Button>
                
                {onAnotherAnime && (
                  <Button
                    onClick={onAnotherAnime}
                    size="lg"
                    className="anime-button-secondary h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-bold tracking-wide group col-span-2 sm:col-span-1"
                  >
                    <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 transition-transform group-hover:rotate-180 duration-700" />
                    NEXT
                  </Button>
                )}
              </div>
            </div>
          </div>
            </div>
          </CardContent>
        </Card>
      </AnimeCardFrame>
    </AnimePowerAura>
  );
};

export default AnimeCard;