
import { useState, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAnimeAPI } from '@/hooks/useAnimeAPI';
import { useFavorites } from '@/hooks/useFavorites';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import DiscoverSection from '@/components/DiscoverSection';
import AboutSection from '@/components/AboutSection';
import { FloatingPatterns, SacredGeometry, AnimeEnergyCircles } from '@/components/AnimePatterns';
import { JapaneseCornerOrnaments, AnimeSectionDivider } from '@/components/AnimeDecorations';

import narutoRedMoonBg from '@/assets/naruto-red-moon-bg.jpg';
import AnieLogo from '/lovable-uploads/sugoipick-logo1.png';

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

const Index = () => {
  const { toast } = useToast();
  const { genres, currentAnime, loading, shownCount, isExhausted, getNextAnime, resetSession } = useAnimeAPI();
  const { favoritesCount } = useFavorites();
  
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    type: '',
    minScore: 1,
    status: '',
    season: '',
    year: null,
    endYear: null,
    episodeCount: '',
    rating: '',
    source: '',
    orderBy: 'score',
    sort: 'desc'
  });

  const handleSummonAnime = useCallback(() => {
    console.log('Summoning anime with filters:', filters);
    getNextAnime(filters);
  }, [getNextAnime, filters]);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    console.log('Filters changing from:', filters, 'to:', newFilters);
    setFilters(newFilters);
    // Clear cache when filters change so new filters take effect
    resetSession();
  }, [filters, resetSession]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      genres: [],
      type: '',
      minScore: 1,
      status: '',
      season: '',
      year: null,
      endYear: null,
      episodeCount: '',
      rating: '',
      source: '',
      orderBy: 'score',
      sort: 'desc'
    });
  }, []);

  const handleResetSession = useCallback(() => {
    resetSession();
    toast({
      title: "Session Reset",
      description: "Ready to explore anime again! All recommendations are back in the pool.",
    });
  }, [resetSession, toast]);

  return (
    <div className="min-h-screen relative">
      {/* Enhanced Background with anime patterns */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${narutoRedMoonBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Anime Pattern Overlays */}
      <FloatingPatterns />
      <SacredGeometry />
      <AnimeEnergyCircles />
      
      {/* Japanese Corner Ornaments */}
      <JapaneseCornerOrnaments />
      
      {/* Header */}
      <Header 
        genres={genres}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onResetFilters={handleResetFilters}
        favoritesCount={favoritesCount}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 space-y-12 sm:space-y-16">
        <HeroSection 
          shownCount={shownCount}
          onResetSession={handleResetSession}
          onSummonAnime={handleSummonAnime}
          loading={loading}
        />
        
        <AnimeSectionDivider />
        
        <DiscoverSection
          genres={genres}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onResetFilters={handleResetFilters}
          onSummonAnime={handleSummonAnime}
          loading={loading}
          currentAnime={currentAnime}
          isExhausted={isExhausted}
          onResetSession={handleResetSession}
        />
        
        <AnimeSectionDivider />
        
        <AboutSection />
        
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/95 backdrop-blur-xl mt-12 sm:mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <div className="relative">
              <img 
                src={AnieLogo} 
                alt="AniePick Logo" 
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
              />
            </div>
            <span className="font-display text-lg sm:text-xl text-primary tracking-wider">
              Anie Pick
            </span>
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-primary text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">© 2025 AniePick. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">Your next favorite anime is just a click away.</p>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 fill-primary text-primary" /> for anime lovers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
