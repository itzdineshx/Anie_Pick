import { useEffect, useState } from 'react';
import { Zap, Star, Sparkles, Eye, Heart } from 'lucide-react';

interface SiteLoadingAnimationProps {
  onLoadComplete: () => void;
}

const SiteLoadingAnimation = ({ onLoadComplete }: SiteLoadingAnimationProps) => {
  const [loadingText, setLoadingText] = useState("起動中...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const texts = [
      "起動中...", // Starting up...
      "アニメデータベース接続中...", // Connecting to anime database...
      "魔法円を描画中...", // Drawing magic circles...
      "準備完了！" // Ready!
    ];

    let textIndex = 0;
    let progressValue = 0;

    const textInterval = setInterval(() => {
      if (textIndex < texts.length - 1) {
        textIndex++;
        setLoadingText(texts[textIndex]);
      }
    }, 800);

    const progressInterval = setInterval(() => {
      progressValue += Math.random() * 15 + 5;
      if (progressValue >= 100) {
        progressValue = 100;
        setProgress(100);
        setTimeout(() => {
          onLoadComplete();
        }, 500);
        clearInterval(progressInterval);
        clearInterval(textInterval);
      } else {
        setProgress(progressValue);
      }
    }, 200);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-red-moon opacity-20 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-ember opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0">
        <Star className="absolute top-1/4 left-1/4 w-6 h-6 text-accent/30 animate-float" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <Star className="absolute top-1/3 right-1/4 w-4 h-4 text-primary/40 animate-float" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <Star className="absolute bottom-1/4 left-1/3 w-5 h-5 text-secondary/30 animate-float" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
        <Star className="absolute bottom-1/3 right-1/3 w-3 h-3 text-accent/40 animate-float" style={{ animationDelay: '0.5s', animationDuration: '2.8s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8 animate-fade-in">
        {/* Main Logo/Title Area */}
        <div className="text-center space-y-4">
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-red-moon bg-clip-text text-transparent tracking-wider drop-shadow-lg">
              AniePick
            </h1>
            <div className="absolute -inset-2 bg-gradient-red-moon opacity-20 blur-xl rounded-full animate-pulse"></div>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            Your Anime Discovery Portal
          </p>
        </div>

        {/* Central Magic Circle */}
        <div className="relative elegant-glow">
          {/* Outer Magic Circle */}
          <div className="animate-spin rounded-full h-40 w-40 border-2 border-dashed border-primary/40 shadow-xl" style={{ animationDuration: '10s' }}></div>
          
          {/* Middle Magic Circle */}
          <div className="absolute inset-6 animate-spin rounded-full h-28 w-28 border-2 border-primary/60" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
          
          {/* Inner Magic Circle */}
          <div className="absolute inset-12 animate-spin rounded-full h-16 w-16 border-2 border-accent/80" style={{ animationDuration: '3s' }}></div>
          
          {/* Central Energy Core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <Eye className="w-12 h-12 text-primary animate-pulse drop-shadow-xl" />
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/30 blur-lg"></div>
            </div>
          </div>

          {/* Rotating Runes */}
          <div className="absolute inset-4 animate-spin" style={{ animationDuration: '15s' }}>
            <Zap className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 text-secondary animate-pulse" />
            <Heart className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 text-secondary animate-pulse" style={{ animationDelay: '0.5s' }} />
            <Star className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary animate-pulse" style={{ animationDelay: '1s' }} />
            <Sparkles className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>

          {/* Energy Particles */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }}>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
          </div>
        </div>

        {/* Loading Progress */}
        <div className="w-80 max-w-sm space-y-4">
          {/* Loading Text */}
          <div className="text-center space-y-2">
            <p className="text-xl font-bold bg-gradient-red-moon bg-clip-text text-transparent">
              {loadingText}
            </p>
            <p className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </p>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-red-moon rounded-full transition-all duration-300 ease-out elegant-glow"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-elegant-shimmer"></div>
          </div>

          {/* Energy Dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-secondary rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.4s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.6s' }}></div>
            <div className="w-2 h-2 bg-secondary rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.8s' }}></div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center text-xs text-muted-foreground/60 space-y-1">
          <p>Initializing anime magic...</p>
          <p>✨ Powered by Jikan API ✨</p>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-2 border-primary/20 rounded-full animate-pulse"></div>
      <div className="absolute top-8 right-8 w-12 h-12 border-2 border-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-8 left-8 w-12 h-12 border-2 border-accent/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-2 border-primary/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
};

export default SiteLoadingAnimation;