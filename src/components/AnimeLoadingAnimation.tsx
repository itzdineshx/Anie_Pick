import { Zap, Circle, Star, Sparkles } from 'lucide-react';

const AnimeLoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-16 animate-fade-in">
      {/* Main Magic Circle */}
      <div className="relative elegant-glow">
        {/* Outer Magic Circle */}
        <div className="animate-spin rounded-full h-32 w-32 border-2 border-dashed border-primary/40 shadow-lg" style={{ animationDuration: '8s' }}></div>
        
        {/* Middle Magic Circle */}
        <div className="absolute inset-4 animate-spin rounded-full h-24 w-24 border-2 border-primary/60" style={{ animationDuration: '4s', animationDirection: 'reverse' }}></div>
        
        {/* Inner Magic Circle */}
        <div className="absolute inset-8 animate-spin rounded-full h-16 w-16 border-2 border-accent/80" style={{ animationDuration: '2s' }}></div>
        
        {/* Central Energy Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <Zap className="w-8 h-8 text-primary animate-pulse drop-shadow-lg" />
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 blur-sm"></div>
          </div>
        </div>

        {/* Magic Circle Runes */}
        <div className="absolute inset-2 animate-spin" style={{ animationDuration: '12s' }}>
          <Circle className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 text-secondary animate-pulse" />
          <Circle className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 text-secondary animate-pulse" style={{ animationDelay: '0.5s' }} />
          <Circle className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 text-secondary animate-pulse" style={{ animationDelay: '1s' }} />
          <Circle className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 text-secondary animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Energy Particles */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
          <Sparkles className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 text-accent animate-pulse" />
          <Sparkles className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 text-accent animate-pulse" style={{ animationDelay: '1s' }} />
          <Sparkles className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-accent animate-pulse" style={{ animationDelay: '2s' }} />
          <Sparkles className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-accent animate-pulse" style={{ animationDelay: '3s' }} />
        </div>
      </div>

      {/* Floating Energy Orbs */}
      <div className="relative w-40 h-20">
        <div className="absolute left-4 top-2 w-3 h-3 bg-primary/80 rounded-full animate-float drop-shadow-lg" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
        <div className="absolute right-4 top-4 w-2 h-2 bg-secondary/80 rounded-full animate-float drop-shadow-lg" style={{ animationDelay: '0.7s', animationDuration: '3s' }}></div>
        <div className="absolute left-8 bottom-2 w-4 h-4 bg-accent/80 rounded-full animate-float drop-shadow-lg" style={{ animationDelay: '1.2s', animationDuration: '2.5s' }}></div>
        <div className="absolute right-8 bottom-4 w-2 h-2 bg-primary/60 rounded-full animate-float drop-shadow-lg" style={{ animationDelay: '1.8s', animationDuration: '2.2s' }}></div>
        <div className="absolute left-12 top-6 w-1 h-1 bg-accent/90 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        <div className="absolute right-12 top-8 w-1 h-1 bg-secondary/90 rounded-full animate-pulse" style={{ animationDelay: '1.1s' }}></div>
      </div>

      {/* Anime-style Loading Text */}
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-anime font-bold bg-gradient-red-moon bg-clip-text text-transparent drop-shadow-lg tracking-wider">
          召喚中...
        </h3>
        <p className="text-lg font-display bg-gradient-red-moon bg-clip-text text-transparent">
          Summoning Anime
        </p>
        <p className="text-muted-foreground animate-pulse text-sm font-body">
          Channeling magical energy from the anime realm
        </p>
      </div>

      {/* Energy Flow Bars */}
      <div className="flex space-x-3">
        <div className="flex flex-col space-y-1">
          <div className="w-1 h-8 bg-primary rounded-full animate-pulse shadow-sm" style={{ animationDelay: '0s' }}></div>
          <div className="w-1 h-6 bg-primary/80 rounded-full animate-pulse shadow-sm" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1 h-4 bg-primary/60 rounded-full animate-pulse shadow-sm" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <div className="flex flex-col space-y-1">
          <div className="w-1 h-6 bg-secondary rounded-full animate-pulse shadow-sm" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-1 h-8 bg-secondary/80 rounded-full animate-pulse shadow-sm" style={{ animationDelay: '0.4s' }}></div>
          <div className="w-1 h-4 bg-secondary/60 rounded-full animate-pulse shadow-sm" style={{ animationDelay: '0.5s' }}></div>
        </div>
        <div className="flex flex-col space-y-1">
          <div className="w-1 h-4 bg-accent rounded-full animate-pulse shadow-sm" style={{ animationDelay: '0.6s' }}></div>
          <div className="w-1 h-6 bg-accent/80 rounded-full animate-pulse shadow-sm" style={{ animationDelay: '0.7s' }}></div>
          <div className="w-1 h-8 bg-accent/60 rounded-full animate-pulse shadow-sm" style={{ animationDelay: '0.8s' }}></div>
        </div>
      </div>
      
      {/* Background Energy Aura */}
      <div className="absolute inset-0 bg-gradient-red-moon opacity-10 blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-ember opacity-5 blur-2xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default AnimeLoadingAnimation;