import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Download, Share2, Swords, Trophy, Users, Calendar, Star, Play, Clock, FileImage, FileText, Sparkles, Zap, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAnimeAPI } from '@/hooks/useAnimeAPI';
import { FloatingPatterns, SacredGeometry } from '@/components/AnimePatterns';
import { JapaneseCornerOrnaments } from '@/components/AnimeDecorations';
import narutoRedMoonBg from '@/assets/naruto-red-moon-bg.jpg';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface BattleAnime {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  synopsis?: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  episodes?: number;
  aired: {
    from: string;
    to?: string;
  };
  genres: Array<{ name: string }>;
  studios: Array<{ name: string }>;
  duration?: string;
  rating?: string;
}

const Battle = () => {
  const { toast } = useToast();
  const { searchAnime } = useAnimeAPI();
  const [anime1, setAnime1] = useState<BattleAnime | null>(null);
  const [anime2, setAnime2] = useState<BattleAnime | null>(null);
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [winner, setWinner] = useState<'anime1' | 'anime2' | null>(null);
  const [battleResults, setBattleResults] = useState<any>(null);
  const [battling, setBattling] = useState(false);
  const [battleProgress, setBattleProgress] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load shared results from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resultsParam = urlParams.get('results');
    
    if (resultsParam) {
      try {
        const decodedData = JSON.parse(atob(decodeURIComponent(resultsParam)));
        
        // Fetch full anime details for both anime
        const loadSharedBattle = async () => {
          try {
            const [results1, results2] = await Promise.all([
              searchAnime(decodedData.anime1.title),
              searchAnime(decodedData.anime2.title)
            ]);

            if (results1 && results1.length > 0 && results2 && results2.length > 0) {
              const battleAnime1: BattleAnime = {
                ...results1[0],
                score: results1[0].score || 0,
                scored_by: results1[0].scored_by || 0,
                rank: results1[0].rank || 999999,
                popularity: results1[0].popularity || 999999,
                members: results1[0].members || 0,
                favorites: results1[0].favorites || 0,
                aired: results1[0].aired || { from: new Date().toISOString() },
                genres: results1[0].genres || [],
                studios: results1[0].studios || []
              };

              const battleAnime2: BattleAnime = {
                ...results2[0],
                score: results2[0].score || 0,
                scored_by: results2[0].scored_by || 0,
                rank: results2[0].rank || 999999,
                popularity: results2[0].popularity || 999999,
                members: results2[0].members || 0,
                favorites: results2[0].favorites || 0,
                aired: results2[0].aired || { from: new Date().toISOString() },
                genres: results2[0].genres || [],
                studios: results2[0].studios || []
              };

              setAnime1(battleAnime1);
              setAnime2(battleAnime2);

              // Recalculate battle
              const score1 = calculateDetailedBattleScore(battleAnime1);
              const score2 = calculateDetailedBattleScore(battleAnime2);
              const detailedComparison = getDetailedComparison(battleAnime1, battleAnime2);
              
              const battleWinner = score1 > score2 ? 'anime1' : 'anime2';
              setWinner(battleWinner);
              
              setBattleResults({
                anime1: { ...battleAnime1, battleScore: score1 },
                anime2: { ...battleAnime2, battleScore: score2 },
                winner: battleWinner,
                detailedComparison,
                battleDate: new Date().toISOString()
              });

              toast({
                title: "Shared Battle Loaded!",
                description: "Viewing shared battle results.",
              });
            }
          } catch (error) {
            toast({
              title: "Failed to Load",
              description: "Could not load shared battle results.",
              variant: "destructive"
            });
          }
        };

        loadSharedBattle();
      } catch (error) {
        console.error("Failed to parse shared results:", error);
      }
    }
  }, []);

  const handleSearch = async (query: string, setAnime: (anime: BattleAnime | null) => void, setLoading: (loading: boolean) => void) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchAnime(query);
      if (results && results.length > 0) {
        // Convert AnimeData to BattleAnime format
        const battleAnime: BattleAnime = {
          ...results[0],
          score: results[0].score || 0,
          scored_by: results[0].scored_by || 0,
          rank: results[0].rank || 999999,
          popularity: results[0].popularity || 999999,
          members: results[0].members || 0,
          favorites: results[0].favorites || 0,
          aired: results[0].aired || { from: new Date().toISOString() },
          genres: results[0].genres || [],
          studios: results[0].studios || []
        };
        setAnime(battleAnime);
      } else {
        toast({
          title: "No Results",
          description: `No anime found for "${query}". Try a different search term.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search for anime. Please try again.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const calculateDetailedBattleScore = (anime: BattleAnime) => {
    // Core scoring metrics
    const score = anime.score || 0;
    const popularity = anime.popularity ? Math.max(0, (10000 - anime.popularity) / 100) : 0;
    const members = anime.members ? Math.log10(anime.members) : 0;
    const favorites = anime.favorites ? Math.log10(anime.favorites + 1) : 0;
    const scoredBy = anime.scored_by ? Math.log10(anime.scored_by) : 0;
    const rank = anime.rank ? Math.max(0, (10000 - anime.rank) / 100) : 0;
    
    // Additional quality metrics
    const episodeScore = anime.episodes ? Math.min(anime.episodes / 12, 3) : 1; // Normalized episode count
    const synopsisQuality = anime.synopsis ? Math.min(anime.synopsis.length / 200, 2) : 0; // Synopsis length as quality indicator
    const genreVariety = anime.genres ? Math.min(anime.genres.length / 3, 2) : 0; // Genre diversity
    const studioPrestige = anime.studios && anime.studios.length > 0 ? 1.5 : 1; // Studio presence bonus
    const recencyBonus = anime.aired?.from ? Math.max(0, (new Date().getFullYear() - new Date(anime.aired.from).getFullYear()) < 5 ? 1 : 0) : 0;
    
    // Weighted calculation with more comprehensive factors
    const baseScore = (score * 0.30) + (popularity * 0.20) + (members * 0.15) + (favorites * 0.10) + (scoredBy * 0.10) + (rank * 0.15);
    const qualityBonus = (episodeScore * 0.3) + (synopsisQuality * 0.2) + (genreVariety * 0.2) + (studioPrestige * 0.2) + (recencyBonus * 0.1);
    
    return baseScore + qualityBonus;
  };

  const getDetailedComparison = (anime1: BattleAnime, anime2: BattleAnime) => {
    const metrics = [
      {
        name: 'MyAnimeList Score',
        anime1Value: anime1.score || 0,
        anime2Value: anime2.score || 0,
        format: (val: number) => val.toFixed(2),
        weight: '30%'
      },
      {
        name: 'Popularity Rank',
        anime1Value: anime1.popularity || 999999,
        anime2Value: anime2.popularity || 999999,
        format: (val: number) => `#${val.toLocaleString()}`,
        weight: '20%',
        inverse: true // Lower is better
      },
      {
        name: 'Community Size',
        anime1Value: anime1.members || 0,
        anime2Value: anime2.members || 0,
        format: (val: number) => val.toLocaleString(),
        weight: '15%'
      },
      {
        name: 'User Favorites',
        anime1Value: anime1.favorites || 0,
        anime2Value: anime2.favorites || 0,
        format: (val: number) => val.toLocaleString(),
        weight: '10%'
      },
      {
        name: 'Users Scored',
        anime1Value: anime1.scored_by || 0,
        anime2Value: anime2.scored_by || 0,
        format: (val: number) => val.toLocaleString(),
        weight: '10%'
      },
      {
        name: 'Overall Rank',
        anime1Value: anime1.rank || 999999,
        anime2Value: anime2.rank || 999999,
        format: (val: number) => `#${val.toLocaleString()}`,
        weight: '15%',
        inverse: true
      }
    ];

    return metrics.map(metric => ({
      ...metric,
      winner: metric.inverse 
        ? (metric.anime1Value < metric.anime2Value ? 'anime1' : metric.anime2Value < metric.anime1Value ? 'anime2' : 'tie')
        : (metric.anime1Value > metric.anime2Value ? 'anime1' : metric.anime2Value > metric.anime1Value ? 'anime2' : 'tie')
    }));
  };

  const startBattle = async () => {
    if (!anime1 || !anime2) {
      toast({
        title: "Battle Requirements",
        description: "Please select two anime to start the battle!",
        variant: "destructive"
      });
      return;
    }

    setBattling(true);
    setBattleProgress(0);

    // Simulate battle animation
    const progressSteps = [20, 40, 60, 80, 100];
    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setBattleProgress(step);
    }

    const score1 = calculateDetailedBattleScore(anime1);
    const score2 = calculateDetailedBattleScore(anime2);
    const detailedComparison = getDetailedComparison(anime1, anime2);
    
    const battleWinner = score1 > score2 ? 'anime1' : 'anime2';
    setWinner(battleWinner);
    
    const results = {
      anime1: {
        ...anime1,
        battleScore: score1
      },
      anime2: {
        ...anime2,
        battleScore: score2
      },
      winner: battleWinner,
      detailedComparison,
      battleDate: new Date().toISOString()
    };
    
    setBattleResults(results);
    setBattling(false);
    
    toast({
      title: "🏆 Battle Complete!",
      description: `${battleWinner === 'anime1' ? anime1.title : anime2.title} wins the battle!`,
    });
  };

  const downloadAsImage = async () => {
    if (!resultsRef.current || !battleResults) return;

    try {
      toast({
        title: "Generating Image...",
        description: "Please wait while we create your battle results image.",
      });

      const canvas = await html2canvas(resultsRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        logging: false,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `anime-battle-${battleResults.anime1.title}-vs-${battleResults.anime2.title}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: "Image Downloaded!",
        description: "Battle results have been saved as an image.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadAsPDF = async () => {
    if (!resultsRef.current || !battleResults) return;

    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we create your battle results PDF.",
      });

      const canvas = await html2canvas(resultsRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`anime-battle-${battleResults.anime1.title}-vs-${battleResults.anime2.title}.pdf`);

      toast({
        title: "PDF Downloaded!",
        description: "Battle results have been saved as a PDF.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const shareResults = async () => {
    if (!battleResults) return;

    // Create shareable URL with battle data
    const battleData = {
      anime1: {
        id: battleResults.anime1.mal_id,
        title: battleResults.anime1.title,
        score: battleResults.anime1.battleScore.toFixed(2)
      },
      anime2: {
        id: battleResults.anime2.mal_id,
        title: battleResults.anime2.title,
        score: battleResults.anime2.battleScore.toFixed(2)
      },
      winner: battleResults.winner,
      date: new Date(battleResults.battleDate).toLocaleDateString()
    };

    const encodedData = btoa(JSON.stringify(battleData));
    const shareUrl = `${window.location.origin}/battle?results=${encodeURIComponent(encodedData)}`;
    
    const shareText = `🥊 Anime Battle Results 🥊\n\n${battleResults.anime1.title} vs ${battleResults.anime2.title}\n\n🏆 Winner: ${battleResults.winner === 'anime1' ? battleResults.anime1.title : battleResults.anime2.title}\n\nView full results: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Anime Battle Results',
          text: shareText,
          url: shareUrl
        });
        toast({
          title: "Shared Successfully!",
          description: "Battle results link has been shared.",
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied!",
          description: "Battle results link copied to clipboard.",
        });
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Battle results link copied to clipboard. Share it with anyone!",
      });
    }
  };

  const resetBattle = () => {
    setAnime1(null);
    setAnime2(null);
    setSearch1('');
    setSearch2('');
    setWinner(null);
    setBattleResults(null);
    setBattling(false);
    setBattleProgress(0);
  };

  const AnimeCard = ({ anime, isWinner, battleScore }: { anime: BattleAnime, isWinner?: boolean, battleScore?: number }) => (
    <Card className={`relative overflow-hidden sophisticated-card transition-all duration-500 ${isWinner ? 'ring-2 ring-primary shadow-lg shadow-primary/25' : ''}`}>
      {isWinner && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="default" className="bg-primary text-primary-foreground">
            <Trophy className="w-3 h-3 mr-1" />
            Winner
          </Badge>
        </div>
      )}
      
      <div className="aspect-[3/4] relative overflow-hidden">
        <img
          src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
          alt={anime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg leading-tight">{anime.title}</CardTitle>
        {anime.title_english && anime.title_english !== anime.title && (
          <CardDescription className="text-sm">{anime.title_english}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            <span>{anime.score || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>#{anime.rank || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Play className="w-3 h-3" />
            <span>{anime.episodes || '?'} eps</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{anime.aired?.from ? new Date(anime.aired.from).getFullYear() : 'N/A'}</span>
          </div>
        </div>
        
        {battleScore && (
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Battle Score:</span>
              <Badge variant="outline">{battleScore.toFixed(2)}</Badge>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-1">
          {anime.genres?.slice(0, 3).map((genre, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {genre.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen relative">
      {/* Background */}
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
      
      <FloatingPatterns />
      <SacredGeometry />
      <JapaneseCornerOrnaments />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Swords className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-display bg-gradient-red-moon bg-clip-text text-transparent">
              Battle Mode
            </h1>
          </div>
        </div>

        {/* Search Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="sophisticated-card">
            <CardHeader>
              <CardTitle className="text-lg">Fighter 1</CardTitle>
              <CardDescription>Search for the first anime</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter anime title..."
                  value={search1}
                  onChange={(e) => setSearch1(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(search1, setAnime1, setLoading1)}
                />
                <Button 
                  onClick={() => handleSearch(search1, setAnime1, setLoading1)}
                  disabled={loading1}
                >
                  {loading1 ? 'Searching...' : 'Search'}
                </Button>
              </div>
              {anime1 && (
                <AnimeCard 
                  anime={anime1} 
                  isWinner={winner === 'anime1'} 
                  battleScore={battleResults?.anime1.battleScore}
                />
              )}
            </CardContent>
          </Card>

          <Card className="sophisticated-card">
            <CardHeader>
              <CardTitle className="text-lg">Fighter 2</CardTitle>
              <CardDescription>Search for the second anime</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter anime title..."
                  value={search2}
                  onChange={(e) => setSearch2(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(search2, setAnime2, setLoading2)}
                />
                <Button 
                  onClick={() => handleSearch(search2, setAnime2, setLoading2)}
                  disabled={loading2}
                >
                  {loading2 ? 'Searching...' : 'Search'}
                </Button>
              </div>
              {anime2 && (
                <AnimeCard 
                  anime={anime2} 
                  isWinner={winner === 'anime2'} 
                  battleScore={battleResults?.anime2.battleScore}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Battle Controls */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center gap-4 flex-wrap">
            <Button 
              onClick={startBattle} 
              disabled={!anime1 || !anime2 || battling}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 relative overflow-hidden group"
            >
              <Swords className={`w-4 h-4 mr-2 ${battling ? 'animate-spin' : ''}`} />
              {battling ? 'Battling...' : 'Start Battle!'}
              <Sparkles className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            <Button onClick={resetBattle} variant="outline">
              Reset Battle
            </Button>
          </div>

          {battling && (
            <div className="max-w-md mx-auto space-y-2">
              <div className="flex items-center justify-center gap-2 text-primary animate-pulse">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Analyzing battle data...</span>
                <Zap className="w-4 h-4" />
              </div>
              <Progress value={battleProgress} className="h-2" />
            </div>
          )}

          {battleResults && (
            <div className="space-y-3">
              <div className="flex justify-center gap-3 flex-wrap">
                <Button onClick={downloadAsImage} variant="outline" className="gap-2">
                  <FileImage className="w-4 h-4" />
                  Download as Image
                </Button>
                <Button onClick={downloadAsPDF} variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Download as PDF
                </Button>
                <Button onClick={shareResults} variant="outline" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Results
                </Button>
              </div>
              <div className="flex justify-center">
                <Badge variant="secondary" className="text-xs px-3 py-1 gap-1">
                  <LinkIcon className="w-3 h-3" />
                  Share link copied when you click Share Results
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Battle Results */}
        {battleResults && (
          <div ref={resultsRef} className="space-y-6 mb-8 bg-background p-6 rounded-xl">
            {/* Winner Announcement */}
            <Card className="sophisticated-card bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 border-2 border-primary/50 shadow-2xl shadow-primary/20 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] animate-pulse pointer-events-none" />
              <CardHeader className="text-center relative">
                <div className="flex justify-center mb-4 animate-bounce">
                  <Trophy className="w-20 h-20 text-primary drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
                </div>
                <CardTitle className="text-4xl font-display bg-gradient-red-moon bg-clip-text text-transparent mb-2">
                  🏆 VICTORY ANNOUNCEMENT 🏆
                </CardTitle>
                <CardDescription className="text-xl font-semibold text-primary mt-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {battleResults.winner === 'anime1' ? battleResults.anime1.title : battleResults.anime2.title} emerges victorious!
                  <Sparkles className="w-5 h-5" />
                </CardDescription>
                <div className="mt-3 text-sm text-muted-foreground">
                  Battle completed on {new Date(battleResults.battleDate).toLocaleString()}
                </div>
              </CardHeader>
              <CardContent className="text-center relative">
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className={`p-6 rounded-xl transition-all duration-500 ${
                    battleResults.winner === 'anime1' 
                      ? 'bg-primary/25 border-2 border-primary shadow-lg shadow-primary/30 scale-105' 
                      : 'bg-muted/50 border border-border/50'
                  }`}>
                    <h3 className="font-bold text-xl mb-2">{battleResults.anime1.title}</h3>
                    <div className="mb-2">
                      <p className="text-4xl font-bold text-primary drop-shadow-lg">
                        {battleResults.anime1.battleScore.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Battle Score</p>
                    </div>
                    {battleResults.winner === 'anime1' && (
                      <Badge variant="default" className="mt-2 text-base px-4 py-1">
                        <Trophy className="w-4 h-4 mr-1" />
                        Champion
                      </Badge>
                    )}
                  </div>
                  <div className={`p-6 rounded-xl transition-all duration-500 ${
                    battleResults.winner === 'anime2' 
                      ? 'bg-primary/25 border-2 border-primary shadow-lg shadow-primary/30 scale-105' 
                      : 'bg-muted/50 border border-border/50'
                  }`}>
                    <h3 className="font-bold text-xl mb-2">{battleResults.anime2.title}</h3>
                    <div className="mb-2">
                      <p className="text-4xl font-bold text-primary drop-shadow-lg">
                        {battleResults.anime2.battleScore.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Battle Score</p>
                    </div>
                    {battleResults.winner === 'anime2' && (
                      <Badge variant="default" className="mt-2 text-base px-4 py-1">
                        <Trophy className="w-4 h-4 mr-1" />
                        Champion
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Comparison */}
            <Card className="sophisticated-card border-2 border-primary/20">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Star className="w-6 h-6 text-primary" />
                  Detailed Battle Analysis
                  <Star className="w-6 h-6 text-primary" />
                </CardTitle>
                <CardDescription>
                  Head-to-head comparison across all major anime metrics from MyAnimeList
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {battleResults.detailedComparison.map((metric: any, index: number) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 border-2 border-border/50 rounded-xl hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-card/50">
                      <div className="md:col-span-1 flex flex-col justify-center">
                        <h4 className="font-bold text-base flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          {metric.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">Weight: {metric.weight}</p>
                      </div>
                      <div className={`text-center p-4 rounded-lg transition-all duration-300 ${
                        metric.winner === 'anime1' 
                          ? 'bg-primary/20 ring-2 ring-primary text-primary font-bold shadow-lg scale-105' 
                          : 'bg-muted/50'
                      }`}>
                        <p className="text-sm font-semibold mb-1">{battleResults.anime1.title.length > 20 ? battleResults.anime1.title.substring(0, 20) + '...' : battleResults.anime1.title}</p>
                        <p className="text-xl font-bold">{metric.format(metric.anime1Value)}</p>
                        {metric.winner === 'anime1' && (
                          <Badge variant="default" className="mt-2 text-xs">Winner</Badge>
                        )}
                      </div>
                      <div className="text-center flex items-center justify-center">
                        <Swords className="w-6 h-6 text-primary" />
                      </div>
                      <div className={`text-center p-4 rounded-lg transition-all duration-300 ${
                        metric.winner === 'anime2' 
                          ? 'bg-primary/20 ring-2 ring-primary text-primary font-bold shadow-lg scale-105' 
                          : 'bg-muted/50'
                      }`}>
                        <p className="text-sm font-semibold mb-1">{battleResults.anime2.title.length > 20 ? battleResults.anime2.title.substring(0, 20) + '...' : battleResults.anime2.title}</p>
                        <p className="text-xl font-bold">{metric.format(metric.anime2Value)}</p>
                        {metric.winner === 'anime2' && (
                          <Badge variant="default" className="mt-2 text-xs">Winner</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Stats */}
                <div className="mt-8 pt-6 border-t-2 border-border">
                  <h4 className="font-bold text-xl mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Additional Battle Statistics
                  </h4>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className={`p-5 rounded-xl border-2 ${
                      battleResults.winner === 'anime1' 
                        ? 'bg-primary/10 border-primary/50' 
                        : 'bg-muted/30 border-border/50'
                    }`}>
                      <h5 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        {battleResults.anime1.title}
                        {battleResults.winner === 'anime1' && <Trophy className="w-4 h-4 text-primary ml-auto" />}
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center p-2 rounded bg-background/50">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-semibold">{battleResults.anime1.type || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-background/50">
                          <span className="text-muted-foreground">Episodes:</span>
                          <span className="font-semibold">{battleResults.anime1.episodes || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-background/50">
                          <span className="text-muted-foreground">Year:</span>
                          <span className="font-semibold">{battleResults.anime1.aired?.from ? new Date(battleResults.anime1.aired.from).getFullYear() : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-background/50">
                          <span className="text-muted-foreground">Rating:</span>
                          <span className="font-semibold">{battleResults.anime1.rating || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-background/50">
                          <span className="text-muted-foreground">Studios:</span>
                          <span className="font-semibold text-right">{battleResults.anime1.studios?.map((s: any) => s.name).join(', ') || 'N/A'}</span>
                        </div>
                        <div className="p-2 rounded bg-background/50">
                          <span className="text-muted-foreground block mb-1">Genres:</span>
                          <div className="flex flex-wrap gap-1">
                            {battleResults.anime1.genres?.slice(0, 5).map((g: any, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">{g.name}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`p-5 rounded-xl border-2 ${
                      battleResults.winner === 'anime2' 
                        ? 'bg-primary/10 border-primary/50' 
                        : 'bg-muted/30 border-border/50'
                    }`}>
                      <h5 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        {battleResults.anime2.title}
                        {battleResults.winner === 'anime2' && <Trophy className="w-4 h-4 text-primary ml-auto" />}
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center p-2 rounded bg-background/50">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-semibold">{battleResults.anime2.type || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-background/50">
                          <span className="text-muted-foreground">Episodes:</span>
                          <span className="font-semibold">{battleResults.anime2.episodes || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-background/50">
                          <span className="text-muted-foreground">Year:</span>
                          <span className="font-semibold">{battleResults.anime2.aired?.from ? new Date(battleResults.anime2.aired.from).getFullYear() : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-background/50">
                          <span className="text-muted-foreground">Rating:</span>
                          <span className="font-semibold">{battleResults.anime2.rating || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-background/50">
                          <span className="text-muted-foreground">Studios:</span>
                          <span className="font-semibold text-right">{battleResults.anime2.studios?.map((s: any) => s.name).join(', ') || 'N/A'}</span>
                        </div>
                        <div className="p-2 rounded bg-background/50">
                          <span className="text-muted-foreground block mb-1">Genres:</span>
                          <div className="flex flex-wrap gap-1">
                            {battleResults.anime2.genres?.slice(0, 5).map((g: any, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">{g.name}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Battle Explanation */}
        <Card className="sophisticated-card">
          <CardHeader>
            <CardTitle>How Battle Mode Works</CardTitle>
            <CardDescription>Understanding the comprehensive anime comparison algorithm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Battle Mode uses a sophisticated algorithm that analyzes multiple data points from Jikan API (MyAnimeList) to determine which anime is objectively "better" to watch:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Core Metrics (Weighted)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li><strong>• MAL Score (30%):</strong> User ratings average</li>
                  <li><strong>• Popularity Rank (20%):</strong> Overall popularity position</li>
                  <li><strong>• Community Size (15%):</strong> Total member count</li>
                  <li><strong>• Overall Rank (15%):</strong> MyAnimeList ranking</li>
                  <li><strong>• Users Scored (10%):</strong> Rating sample size</li>
                  <li><strong>• User Favorites (10%):</strong> Times favorited</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">Quality Bonuses</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li><strong>• Episode Balance:</strong> Optimal episode count scoring</li>
                  <li><strong>• Synopsis Quality:</strong> Description completeness</li>
                  <li><strong>• Genre Diversity:</strong> Multi-genre appeal</li>
                  <li><strong>• Studio Prestige:</strong> Production quality indicator</li>
                  <li><strong>• Recency Bonus:</strong> Recent releases get slight boost</li>
                </ul>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground pt-2 border-t border-border">
              The algorithm combines quantitative data with qualitative indicators to provide the most comprehensive anime comparison available, powered by real MyAnimeList data through Jikan API.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Battle;