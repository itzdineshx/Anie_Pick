import { Heart, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFavorites } from '@/hooks/useFavorites';

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

interface FavoritesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FavoritesModal = ({ open, onOpenChange }: FavoritesModalProps) => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Your Favorites
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-12 space-y-6">
            <div className="text-6xl">💖</div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">No Favorites Yet</h3>
              <p className="text-muted-foreground">
                Start discovering anime and add them to your favorites by clicking the heart button!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Your Favorites ({favorites.length})
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-end mb-4">
          <Button
            onClick={clearFavorites}
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[500px] pr-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((anime) => (
              <Card key={anime.mal_id} className="overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                <div className="relative">
                  <img
                    src={anime.images.jpg.large_image_url}
                    alt={anime.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Button
                    onClick={() => removeFromFavorites(anime.mal_id)}
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full shadow-lg backdrop-blur-sm bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500 hover:text-destructive-foreground" />
                  </Button>
                </div>
                
                <CardContent className="p-3 space-y-2">
                  <h3 className="font-bold text-sm line-clamp-2 leading-tight">{anime.title}</h3>
                  
                  {anime.title_english && anime.title_english !== anime.title && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {anime.title_english}
                    </p>
                  )}

                  <div className="flex items-center gap-1 text-xs flex-wrap">
                    {anime.score && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        ⭐ {anime.score}
                      </Badge>
                    )}
                    {anime.type && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {anime.type}
                      </Badge>
                    )}
                    {anime.year && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {anime.year}
                      </Badge>
                    )}
                  </div>

                  {anime.synopsis && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {anime.synopsis}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {anime.genres.slice(0, 2).map((genre) => (
                      <Badge key={genre.mal_id} variant="outline" className="text-xs px-1 py-0">
                        {genre.name}
                      </Badge>
                    ))}
                    {anime.genres.length > 2 && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        +{anime.genres.length - 2}
                      </Badge>
                    )}
                  </div>

                  <Button
                    onClick={() => window.open(`https://myanimelist.net/anime/${anime.mal_id}`, '_blank')}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs h-7"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FavoritesModal;