import { Heart, Zap, Filter, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AboutSection = () => {
  return (
    <section id="about" className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          About SugoiPick
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your ultimate anime discovery companion powered by Jikan API
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group hover:scale-[1.02] transition-all duration-300 border-border/50 bg-background/10 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Smart Discovery</h3>
            <p className="text-muted-foreground">
              Get personalized anime recommendations based on your preferences. Our algorithm learns what you love and suggests hidden gems you'll enjoy.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:scale-[1.02] transition-all duration-300 border-border/50 bg-background/10 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Filter className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Advanced Filters</h3>
            <p className="text-muted-foreground">
              Fine-tune your search with comprehensive filters including genres, ratings, year, episode count, and more to find exactly what you're looking for.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:scale-[1.02] transition-all duration-300 border-border/50 bg-background/10 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Save Favorites</h3>
            <p className="text-muted-foreground">
              Keep track of anime that catch your interest. Build your personal collection and never lose track of what you want to watch next.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-8 text-center space-y-6">
          <h3 className="text-2xl font-bold">Powered by Jikan API</h3>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            SugoiPick leverages the powerful Jikan API to bring you the most accurate and up-to-date anime information from MyAnimeList. 
            From ratings and reviews to detailed synopses and episode counts, we ensure you have all the information you need to make informed decisions.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="px-3 py-1">
              <ExternalLink className="w-3 h-3 mr-1" />
              Jikan API Data
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              Real-time Updates
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              Comprehensive Database
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold">Ready to Discover?</h3>
        <p className="text-muted-foreground">
          Start your anime journey today and uncover your next favorite series!
        </p>
      </div>
    </section>
  );
};

export default AboutSection;