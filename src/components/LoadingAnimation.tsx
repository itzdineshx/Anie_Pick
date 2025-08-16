import { Sparkles, Star } from 'lucide-react';

const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-16 animate-fade-in">
      {/* Main Loading Icon */}
      <div className="relative elegant-glow">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-muted/30 border-t-primary shadow-lg"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-primary animate-pulse drop-shadow-lg" />
        </div>
        <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-2 border-primary/20"></div>
      </div>

      {/* Floating Stars */}
      <div className="relative w-32 h-16">
        <Star className="absolute left-0 top-0 w-4 h-4 text-accent animate-float drop-shadow-sm" style={{ animationDelay: '0s' }} />
        <Star className="absolute right-0 top-2 w-3 h-3 text-secondary animate-float drop-shadow-sm" style={{ animationDelay: '0.5s' }} />
        <Star className="absolute left-8 bottom-0 w-5 h-5 text-primary animate-float drop-shadow-sm" style={{ animationDelay: '1s' }} />
        <Star className="absolute right-8 bottom-2 w-3 h-3 text-accent animate-float drop-shadow-sm" style={{ animationDelay: '1.5s' }} />
        <div className="absolute left-4 top-4 w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute right-4 top-6 w-1 h-1 bg-accent/80 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold bg-gradient-red-moon bg-clip-text text-transparent drop-shadow-sm">
          Finding Your Anime...
        </h3>
        <p className="text-muted-foreground animate-pulse text-sm">
          Searching through our anime database
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-accent rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.4s' }}></div>
      </div>
      
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-red-moon opacity-5 blur-3xl -z-10"></div>
    </div>
  );
};

export default LoadingAnimation;