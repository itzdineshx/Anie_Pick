import { useState, useEffect } from 'react';

// Floating anime-style geometric patterns
export const FloatingPatterns = () => {
  const [patterns] = useState(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 10,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      type: Math.floor(Math.random() * 4)
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
      {patterns.map((pattern) => (
        <div
          key={pattern.id}
          className="absolute opacity-10"
          style={{
            left: `${pattern.x}%`,
            top: `${pattern.y}%`,
            animationDuration: `${pattern.duration}s`,
            animationDelay: `${pattern.delay}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out'
          }}
        >
          {pattern.type === 0 && (
            <div 
              className="animate-float border-2 border-primary/20 rotate-45"
              style={{
                width: `${pattern.size}px`,
                height: `${pattern.size}px`,
                borderRadius: '20%'
              }}
            />
          )}
          {pattern.type === 1 && (
            <div 
              className="animate-float"
              style={{
                width: `${pattern.size}px`,
                height: `${pattern.size}px`,
                background: 'conic-gradient(from 0deg, hsl(var(--primary) / 0.1), hsl(var(--secondary) / 0.1), hsl(var(--accent) / 0.1), hsl(var(--primary) / 0.1))',
                borderRadius: '50%',
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
              }}
            />
          )}
          {pattern.type === 2 && (
            <div 
              className="animate-float border border-accent/15"
              style={{
                width: `${pattern.size}px`,
                height: `${pattern.size * 0.6}px`,
                borderRadius: '50%',
                transform: 'rotate(30deg)'
              }}
            />
          )}
          {pattern.type === 3 && (
            <div 
              className="animate-float bg-secondary/5"
              style={{
                width: `${pattern.size}px`,
                height: `${pattern.size}px`,
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Japanese-style decorative border
export const JapaneseBorder = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Corner decorations */}
      <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-primary/40"></div>
      <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-primary/40"></div>
      <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-primary/40"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-primary/40"></div>
      
      {/* Side decorations */}
      <div className="absolute top-1/2 -left-1 w-2 h-6 bg-gradient-to-r from-primary/20 to-transparent transform -translate-y-1/2"></div>
      <div className="absolute top-1/2 -right-1 w-2 h-6 bg-gradient-to-l from-primary/20 to-transparent transform -translate-y-1/2"></div>
      
      {children}
    </div>
  );
};

// Anime-style energy circles
export const AnimeEnergyCircles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-10 right-10 w-32 h-32 opacity-20">
        <div className="w-full h-full rounded-full border-2 border-dashed border-primary animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute inset-4 rounded-full border border-secondary animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
        <div className="absolute inset-8 rounded-full border border-accent animate-spin" style={{ animationDuration: '10s' }}></div>
      </div>
      
      <div className="absolute bottom-20 left-20 w-24 h-24 opacity-15">
        <div className="w-full h-full rounded-full border-2 border-dotted border-secondary animate-spin" style={{ animationDuration: '25s' }}></div>
        <div className="absolute inset-3 rounded-full border border-primary animate-spin" style={{ animationDuration: '18s', animationDirection: 'reverse' }}></div>
      </div>

      <div className="absolute top-1/3 left-10 w-16 h-16 opacity-10">
        <div className="w-full h-full rounded-full border border-accent animate-pulse"></div>
        <div className="absolute inset-2 rounded-full border border-primary animate-ping"></div>
      </div>
    </div>
  );
};

// Sacred geometry background
export const SacredGeometry = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
      <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
        {/* Flower of Life pattern */}
        <g className="animate-pulse" style={{ animationDuration: '8s' }}>
          <circle cx="600" cy="400" r="50" stroke="currentColor" strokeWidth="1" fill="none" className="text-primary" />
          <circle cx="557" cy="357" r="50" stroke="currentColor" strokeWidth="1" fill="none" className="text-secondary" />
          <circle cx="643" cy="357" r="50" stroke="currentColor" strokeWidth="1" fill="none" className="text-secondary" />
          <circle cx="557" cy="443" r="50" stroke="currentColor" strokeWidth="1" fill="none" className="text-secondary" />
          <circle cx="643" cy="443" r="50" stroke="currentColor" strokeWidth="1" fill="none" className="text-secondary" />
          <circle cx="514" cy="400" r="50" stroke="currentColor" strokeWidth="1" fill="none" className="text-accent" />
          <circle cx="686" cy="400" r="50" stroke="currentColor" strokeWidth="1" fill="none" className="text-accent" />
        </g>
        
        {/* Geometric lines */}
        <g className="animate-fade-in" style={{ animationDuration: '12s', animationIterationCount: 'infinite', animationDirection: 'alternate' }}>
          <line x1="100" y1="100" x2="1100" y2="700" stroke="currentColor" strokeWidth="0.5" className="text-primary" opacity="0.3" />
          <line x1="1100" y1="100" x2="100" y2="700" stroke="currentColor" strokeWidth="0.5" className="text-secondary" opacity="0.3" />
          <line x1="600" y1="0" x2="600" y2="800" stroke="currentColor" strokeWidth="0.5" className="text-accent" opacity="0.2" />
        </g>
      </svg>
    </div>
  );
};

// Anime-style decorative frame
export const AnimeFrame = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Main frame */}
      <div className="absolute inset-0 border-2 border-primary/30 rounded-lg"></div>
      
      {/* Inner accent frame */}
      <div className="absolute inset-1 border border-accent/20 rounded-md"></div>
      
      {/* Corner ornaments */}
      <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-primary rounded-tl-sm"></div>
      <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-primary rounded-tr-sm"></div>
      <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-primary rounded-bl-sm"></div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-primary rounded-br-sm"></div>
      
      {/* Content */}
      <div className="relative z-10 p-4">
        {children}
      </div>
    </div>
  );
};

// Anime sparkle effect
export const AnimeSparkles = ({ count = 10 }: { count?: number }) => {
  const [sparkles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 1,
    }))
  );

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