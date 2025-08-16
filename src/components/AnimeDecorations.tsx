import { Star, Zap, Sparkles, Circle } from 'lucide-react';

// Anime-style section divider
export const AnimeSectionDivider = () => {
  return (
    <div className="flex items-center justify-center my-12 px-4">
      <div className="flex items-center gap-4 w-full max-w-md">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-primary/20"></div>
        
        <div className="relative">
          {/* Central ornament */}
          <div className="w-8 h-8 rounded-full border-2 border-primary/60 bg-background/50 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </div>
          
          {/* Orbiting decorations */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full"></div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-secondary rounded-full"></div>
            <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-primary rounded-full"></div>
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-accent rounded-full"></div>
          </div>
        </div>
        
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-primary/50 to-primary/20"></div>
      </div>
    </div>
  );
};

// Manga-style speech bubble decoration
export const MangaBubble = ({ children, position = "top-right" }: { children: React.ReactNode; position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" }) => {
  const positionClasses = {
    "top-right": "top-2 right-2",
    "top-left": "top-2 left-2", 
    "bottom-right": "bottom-2 right-2",
    "bottom-left": "bottom-2 left-2"
  };

  return (
    <div className={`absolute ${positionClasses[position]} z-20`}>
      <div className="relative bg-background/95 backdrop-blur-sm border-2 border-primary/30 rounded-2xl px-3 py-2 shadow-lg">
        {/* Speech bubble tail */}
        <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-background/95"></div>
        <div className="absolute -bottom-1 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary/30"></div>
        
        <div className="text-xs font-bold text-primary">
          {children}
        </div>
      </div>
    </div>
  );
};

// Anime-style power aura
export const AnimePowerAura = ({ children, intensity = "medium" }: { children: React.ReactNode; intensity?: "low" | "medium" | "high" }) => {
  const intensityClasses = {
    low: "shadow-lg",
    medium: "shadow-xl shadow-primary/20",
    high: "shadow-2xl shadow-primary/30"
  };

  return (
    <div className="relative group">
      {/* Multiple aura layers */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-red-moon opacity-10 blur-lg ${intensityClasses[intensity]} group-hover:opacity-20 transition-opacity duration-500`}></div>
      <div className="absolute inset-0 rounded-xl bg-gradient-ember opacity-5 blur-md group-hover:opacity-10 transition-opacity duration-500"></div>
      
      {/* Energy particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-2 right-2 w-1 h-1 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-4 left-3 w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-3 right-4 w-1 h-1 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-2 left-2 w-1 h-1 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      {children}
    </div>
  );
};

// Japanese-style corner ornaments
export const JapaneseCornerOrnaments = () => {
  return (
    <>
      {/* Top corners */}
      <div className="absolute top-4 left-4 w-8 h-8 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-accent to-transparent"></div>
        <div className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-primary via-accent to-transparent"></div>
        <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-secondary/50"></div>
      </div>
      
      <div className="absolute top-4 right-4 w-8 h-8 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-l from-primary via-accent to-transparent"></div>
        <div className="absolute top-0 right-0 h-full w-0.5 bg-gradient-to-b from-primary via-accent to-transparent"></div>
        <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-secondary/50"></div>
      </div>
      
      {/* Bottom corners */}
      <div className="absolute bottom-4 left-4 w-8 h-8 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-accent to-transparent"></div>
        <div className="absolute bottom-0 left-0 h-full w-0.5 bg-gradient-to-t from-primary via-accent to-transparent"></div>
        <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-secondary/50"></div>
      </div>
      
      <div className="absolute bottom-4 right-4 w-8 h-8 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-primary via-accent to-transparent"></div>
        <div className="absolute bottom-0 right-0 h-full w-0.5 bg-gradient-to-t from-primary via-accent to-transparent"></div>
        <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-secondary/50"></div>
      </div>
    </>
  );
};

// Anime-style energy beam
export const AnimeEnergyBeam = ({ direction = "horizontal" }: { direction?: "horizontal" | "vertical" | "diagonal" }) => {
  const directionClasses = {
    horizontal: "w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent",
    vertical: "h-full w-1 bg-gradient-to-b from-transparent via-primary/50 to-transparent",
    diagonal: "w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent transform rotate-45 origin-center"
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className={`absolute top-1/2 left-0 transform -translate-y-1/2 ${directionClasses[direction]} animate-pulse opacity-60`}></div>
      <div className={`absolute top-1/2 left-0 transform -translate-y-1/2 ${directionClasses[direction]} animate-pulse opacity-30`} style={{ animationDelay: '0.5s' }}></div>
    </div>
  );
};

// Mystical runes decoration
export const MysticalRunes = () => {
  const runes = ['⚡', '✦', '◉', '◈', '◊', '⬟', '⬢', '⬣'];
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
      {runes.map((rune, index) => (
        <div
          key={index}
          className="absolute text-primary animate-pulse"
          style={{
            left: `${10 + (index * 12)}%`,
            top: `${20 + (index % 3) * 30}%`,
            animationDelay: `${index * 0.3}s`,
            animationDuration: `${2 + (index % 3)}s`,
            fontSize: `${0.8 + (index % 3) * 0.2}rem`
          }}
        >
          {rune}
        </div>
      ))}
    </div>
  );
};

// Anime sparkle effect
export const AnimeSparkles = ({ count = 10 }: { count?: number }) => {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 1,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute text-accent animate-pulse"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
};

// Anime card frame
export const AnimeCardFrame = ({ children, glowing = false }: { children: React.ReactNode; glowing?: boolean }) => {
  return (
    <div className="relative">
      {/* Outer glow effect */}
      {glowing && (
        <div className="absolute -inset-1 bg-gradient-red-moon opacity-30 blur-sm rounded-xl animate-pulse"></div>
      )}
      
      {/* Main frame */}
      <div className="relative sophisticated-card border-2 border-primary/20 rounded-xl overflow-hidden">
        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-accent/60"></div>
        <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-accent/60"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-accent/60"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-accent/60"></div>
        
        {/* Side accent lines */}
        <div className="absolute top-8 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="absolute bottom-8 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        
        {children}
      </div>
    </div>
  );
};