import React, { useEffect, useState, useMemo, useCallback, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  Sparkles,
  Copy,
  Check,
  Gift,
  Rocket,
  ArrowRight,
  Snowflake,
  TreePine,
  Compass,
  Video,
} from "lucide-react";

/* ===================== CONFIG ===================== */

const BRAND = {
  name: "Spankmas",
  tagline: "Christmas doesn't whisper… it spanks.",
};

const LINKS = {
  tg: "https://t.me/spankmastg",
  x: "https://x.com/i/communities/1998805948320686192",
};

const CA = "BMMWMuy1ZFBtDEzzdBvtrNvMZFetcGUfkrdDAYo3pump";

/* ===================== IMAGE GALLERY ===================== */
const MEME_IMAGES = [
  "https://i.ibb.co/23Thypp0/photo-2025-12-15-14-35-05.jpg",
  "https://i.ibb.co/0SJDTKv/photo-2025-12-15-14-35-11.jpg",
  "https://i.ibb.co/DP4Td1zF/photo-2025-12-15-14-35-40.jpg",
  "https://i.ibb.co/CsNm8J5M/photo-2025-12-15-14-35-42.jpg",
  "https://i.ibb.co/Fqg9ScQP/photo-2025-12-15-14-35-44.jpg",
  "https://i.ibb.co/CsKTh1C9/photo-2025-12-15-14-35-47.jpg",
  "https://i.ibb.co/8D5rKShp/photo-2025-12-15-14-35-49.jpg",
  "https://i.ibb.co/wZVsK38S/photo-2025-12-15-14-35-52.jpg",
  "https://i.ibb.co/nMZfSq5m/photo-2025-12-15-14-35-57.jpg",
  "https://i.ibb.co/p6rJvMXd/photo-2025-12-15-14-35-59.jpg",
  "https://i.ibb.co/p6bJpDxx/photo-2025-12-15-14-37-10.jpg",
  "https://i.ibb.co/Z1vnYhZs/photo-2025-12-15-14-37-13.jpg",
  "https://i.ibb.co/nsvw53hj/photo-2025-12-15-14-40-47.jpg",
  "https://i.ibb.co/Pv6tXPC1/photo-2025-12-15-14-40-52.jpg",
  "https://i.ibb.co/r2sN0DCR/photo-2025-12-15-14-40-55.jpg",
  "https://i.ibb.co/G3xTyqB9/photo-2025-12-15-14-40-58.jpg",
  "https://i.ibb.co/p6rJvMXd/photo-2025-12-15-14-35-59.jpg",
  "https://i.ibb.co/0SJDTKv/photo-2025-12-15-14-35-11.jpg",
  "https://i.ibb.co/23Thypp0/photo-2025-12-15-14-35-05.jpg",
  "https://i.ibb.co/yw1p2Tk/bg.jpg"
];

const LOGO_URL = "https://i.ibb.co/whtDqpwp/gogo.png";
const TOKEN_ADDRESS = "BMMWMuy1ZFBtDEzzdBvtrNvMZFetcGUfkrdDAYo3pump";

/* ===================== STREAMABLE VIDEOS ===================== */
const STREAMABLE_VIDEOS = [
  { id: "wxr480", title: "Spankmas Video 1", aspectRatio: 55.000 },
  { id: "2l71xc", title: "Spankmas Video 2", aspectRatio: 148.148 },
  { id: "o3lcd7", title: "Spankmas Video 3", aspectRatio: 55.000 },
  { id: "4cru3q", title: "Spankmas Video 4", aspectRatio: 55.000 },
  { id: "2rcx1c", title: "Spankmas Video 5", aspectRatio: 148.148 },
  { id: "kd8jk1", title: "Spankmas Video 6", aspectRatio: 148.148 },
];

/* ===================== DEXSCREENER TYPES ===================== */

interface DexScreenerPair {
  chainId: string;
  dexId: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  volume: {
    h24: number;
  };
  liquidity: {
    usd: number;
  };
  priceChange: {
    h24: number;
  };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
}

interface DexScreenerResponse {
  schemaVersion: string;
  pair: DexScreenerPair | null;
}

type TokenPairsResponse = DexScreenerPair[];

/* ===================== PERFORMANCE OPTIMIZATIONS ===================== */

// Memoized hooks and components
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

// Lazy load images
const LazyImage = React.memo(({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className={`${className} ${!isLoaded ? 'animate-pulse bg-gray-200' : ''}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

/* ===================== UPDATED DEXSCREENER HOOK ===================== */

function useDexScreenerStats(tokenAddress: string) {
  const [data, setData] = useState<DexScreenerPair | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const tokenRes = await fetch(
        `https://api.dexscreener.com/token-pairs/v1/solana/${tokenAddress}`
      );

      if (!tokenRes.ok) {
        throw new Error("Failed to fetch token pairs");
      }

      const pairs: TokenPairsResponse = await tokenRes.json();

      if (!pairs || pairs.length === 0) {
        throw new Error("No trading pairs found for this token");
      }

      const mainPair =
        pairs.find(p => p.dexId === "pumpswap") ||
        pairs.sort((a, b) => b.liquidity.usd - a.liquidity.usd)[0];

      if (!mainPair) {
        throw new Error("No valid trading pair found");
      }

      const pairRes = await fetch(
        `https://api.dexscreener.com/latest/dex/pairs/solana/${mainPair.pairAddress}`
      );

      if (!pairRes.ok) {
        throw new Error("Failed to fetch pair details");
      }

      const pairJson: DexScreenerResponse = await pairRes.json();

      if (!pairJson.pair) {
        throw new Error("Pair data is missing");
      }

      setData(pairJson.pair);
    } catch (err) {
      console.error("DexScreener API error:", err);
      setError(err instanceof Error ? err.message : "Failed to load market data");
    } finally {
      setLoading(false);
    }
  }, [tokenAddress]);

  useEffect(() => {
    fetchData(); // Initial fetch
    
    // Refresh less frequently for better performance
    const interval = setInterval(fetchData, 45000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error };
}

/* ===================== UTILS ===================== */

function cn(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ");
}

function useLockBody(lock: boolean) {
  useEffect(() => {
    if (!lock) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lock]);
}

/* ===================== OPTIMIZED STREAMABLE VIDEO COMPONENT ===================== */

const StreamableVideoPlayer = React.memo(({ videoId, title, aspectRatio }: { 
  videoId: string; 
  title: string;
  aspectRatio: number;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const handlePlayClick = useCallback(() => {
    setIsPlaying(true);
    setIsInView(true);
  }, []);

  // Only load video when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`video-${videoId}`);
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [videoId]);

  return (
    <div 
      id={`video-${videoId}`}
      className="group relative overflow-hidden rounded-[28px] border border-yellow-500/30 bg-white/95 p-4 shadow-lg backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative w-full overflow-hidden rounded-[22px] border border-zinc-200">
        <div style={{ position: 'relative', width: '100%', height: 0, paddingBottom: `${aspectRatio}%` }}>
          {isPlaying && isInView ? (
            <iframe
              src={`https://streamable.com/e/${videoId}?autoplay=1&muted=1`}
              title={title}
              width="100%"
              height="100%"
              style={{ border: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="rounded-[22px]"
              sandbox="allow-same-origin allow-scripts allow-popups"
            />
          ) : (
            <div 
              className="absolute inset-0 cursor-pointer bg-zinc-100"
              onClick={handlePlayClick}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50/50 to-blue-50/50">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-black/70 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-black/90">
                    <Video className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-sm font-bold text-zinc-700">Click to play</p>
                  <p className="mt-1 text-xs text-zinc-500">{title}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm font-black text-zinc-900">{title}</div>
        {!isPlaying && (
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <Video className="h-3 w-3" />
            Click to play
          </div>
        )}
        {isPlaying && (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            Playing
          </div>
        )}
      </div>
    </div>
  );
});

StreamableVideoPlayer.displayName = 'StreamableVideoPlayer';

function VideoGallery() {
  return (
    <div className="mt-12">
      <div className="mb-8 flex items-center gap-2">
        <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-2">
          <Video className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-2xl font-black text-yellow-100">Video Content</h3>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {STREAMABLE_VIDEOS.map((video) => (
          <StreamableVideoPlayer 
            key={video.id}
            videoId={video.id}
            title={video.title}
            aspectRatio={video.aspectRatio}
          />
        ))}
      </div>
    </div>
  );
}

/* ===================== OPTIMIZED UI PRIMITIVES ===================== */

const Button = React.memo(({
  children,
  href,
  onClick,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "soft";
  className?: string;
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-[0_12px_30px_rgba(220,38,38,.20)]"
      : variant === "soft"
      ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-100"
      : "bg-white/90 text-zinc-900 hover:bg-white border border-zinc-200";

  if (href) {
    return (
      <a
        className={cn(base, styles, className)}
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  return (
    <button className={cn(base, styles, className)} onClick={onClick} type="button">
      {children}
    </button>
  );
});

Button.displayName = 'Button';

/* ===================== OPTIMIZED GLITTERY RED BACKGROUND ===================== */

const GlitteryRedBackground = React.memo(() => {
  const glitterParticles = useMemo(() =>
    Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${1 + Math.random() * 2}s`,
    }))
  , []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/95 via-red-800/90 to-red-900/95" />
      
      <div className="absolute inset-0">
        {glitterParticles.map((particle, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 animate-ping rounded-full bg-yellow-300"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
            }}
          />
        ))}
      </div>
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,215,0,0.06),transparent_40%)]" />
      
      <div className="absolute inset-0 animate-shimmer-glitter" />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/10 md:hidden" />
      
      <style>{`
        @keyframes shimmer-glitter {
          0% { background-position: -200% -200%; }
          100% { background-position: 200% 200%; }
        }
        .animate-shimmer-glitter {
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(255, 255, 255, 0.03) 50%,
            transparent 70%
          );
          background-size: 200% 200%;
          animation: shimmer-glitter 4s linear infinite;
        }
      `}</style>
    </div>
  );
});

GlitteryRedBackground.displayName = 'GlitteryRedBackground';

/* ===================== DEXSCREENER STATS WIDGET ===================== */

const DexScreenerStats = React.memo(() => {
  const { data, loading, error } = useDexScreenerStats(TOKEN_ADDRESS);
  
  const formattedData = useMemo(() => {
    if (!data) return null;
    
    return {
      price: parseFloat(data.priceUsd).toFixed(6),
      volume: `$${data.volume.h24.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      liquidity: `$${data.liquidity.usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      change24h: data.priceChange.h24.toFixed(2),
      isPositive: data.priceChange.h24 >= 0,
      marketCap: data.marketCap ? `$${data.marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "Calculating...",
    };
  }, [data]);

  if (loading) {
    return (
      <div className="rounded-[30px] border border-yellow-500/30 bg-white/95 p-6 shadow-lg backdrop-blur-sm">
        <div className="min-h-[300px] flex items-center justify-center rounded-2xl border border-zinc-200 bg-gradient-to-br from-red-50 to-blue-50">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent mx-auto"></div>
            <p className="mt-3 text-sm text-zinc-600">Loading live market data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !formattedData) {
    return (
      <div className="rounded-[30px] border border-yellow-500/30 bg-white/95 p-6 shadow-lg backdrop-blur-sm">
        <div className="min-h-[300px] flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-gradient-to-br from-red-50 to-blue-50 p-8">
          <div className="rounded-full bg-red-100 p-3">
            <X className="h-6 w-6 text-red-600" />
          </div>
          <p className="mt-3 text-sm text-zinc-600">Unable to load live data</p>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href={`https://dexscreener.com/solana/${TOKEN_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-600 hover:underline"
            >
              View on DexScreener →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[30px] border border-yellow-500/30 bg-white/95 p-6 shadow-lg backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-black text-red-700">
            <Sparkles className="h-4 w-4" />
            Live Market Data
          </div>
          <h3 className="mt-2 text-xl font-black text-zinc-900">SPANKMAS / SOL Live Stats</h3>
          <p className="text-sm text-zinc-600">Real-time metrics powered by DexScreener</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-black text-zinc-500">Powered by</div>
          <div className="text-sm font-black text-purple-600">DexScreener</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-black text-zinc-500">Current Price</div>
          <div className="mt-2 text-2xl font-black text-zinc-900">${formattedData.price}</div>
          <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-black ${formattedData.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {formattedData.isPositive ? '↗' : '↘'} {formattedData.change24h}%
          </div>
        </div>
        
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-black text-zinc-500">24h Volume</div>
          <div className="mt-2 text-2xl font-black text-zinc-900">{formattedData.volume}</div>
          <div className="mt-2 text-xs text-zinc-600">Trading activity</div>
        </div>
        
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-black text-zinc-500">Liquidity</div>
          <div className="mt-2 text-2xl font-black text-zinc-900">{formattedData.liquidity}</div>
          <div className="mt-2 text-xs text-zinc-600">Pool depth</div>
        </div>
        
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-black text-zinc-500">Market Cap</div>
          <div className="mt-2 text-2xl font-black text-zinc-900">{formattedData.marketCap}</div>
          <div className="mt-2 text-xs text-zinc-600">Fully diluted</div>
        </div>
      </div>
      
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs font-black text-zinc-500">Pair</div>
            <div className="mt-1 text-sm font-black text-zinc-900">
              {data?.baseToken?.symbol || "SPANKMAS"} / {data?.quoteToken?.symbol || "SOL"}
            </div>
          </div>
          <div>
            <div className="text-xs font-black text-zinc-500">DEX</div>
            <div className="mt-1 text-sm font-black text-zinc-900">
              {data?.dexId ? data.dexId.toUpperCase() : "PumpSwap"}
            </div>
          </div>
          <div>
            <div className="text-xs font-black text-zinc-500">Last Updated</div>
            <div className="mt-1 text-sm font-black text-zinc-900">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 rounded-2xl border border-purple-200 bg-purple-50 p-4">
        <div className="text-xs font-black text-purple-700">Active Trading Pair</div>
        <div className="mt-1 break-all font-mono text-xs text-purple-800">
          {data?.pairAddress?.substring(0, 30)}...
        </div>
        <div className="mt-2 text-xs text-purple-600">
          Auto-detected from DexScreener • Updates every 45s
        </div>
      </div>
      
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-1">
          <span>Token:</span>
          <span className="font-mono bg-zinc-100 px-2 py-1 rounded">{TOKEN_ADDRESS.substring(0, 15)}...</span>
        </div>
        <div className="flex items-center gap-2">
          <div>Network: <span className="font-bold text-purple-600">Solana</span></div>
          <div className="h-3 w-px bg-zinc-300"></div>
          <div>Source: <span className="font-bold text-purple-600">DexScreener API</span></div>
        </div>
      </div>
    </div>
  );
});

DexScreenerStats.displayName = 'DexScreenerStats';

/* ===================== OPTIMIZED SNOW - REDUCED PARTICLES ===================== */

type EnhancedFlake = { 
  left: number; 
  delay: number; 
  duration: number; 
  size: number; 
  opacity: number;
  blur: number;
  depth: number;
  xStart: number;
  xEnd: number;
};

const EnhancedSnowOverlay = React.memo(({ density = 60, intensity = 0.6 }: { density?: number; intensity?: number }) => {
  const isMobile = useIsMobile();
  const actualDensity = isMobile ? Math.floor(density * 0.5) : density;
  
  const flakes = useMemo(() =>
    Array.from({ length: actualDensity }).map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 8 + Math.random() * 12, // Slower animation
      size: 2 + Math.random() * 4, // Smaller particles
      opacity: 0.3 + Math.random() * 0.3, // Less opaque
      blur: Math.random() * 1,
      depth: Math.random(),
      xStart: Math.random() * 20 - 10, // Reduced movement
      xEnd: Math.random() * 20 - 10,
    }))
  , [actualDensity]);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {flakes.map((f, i) => (
          <span
            key={i}
            className="absolute top-[-20px] animate-snow rounded-full bg-white"
            style={{
              left: `${f.left}%`,
              width: `${f.size}px`,
              height: `${f.size}px`,
              opacity: f.opacity * intensity,
              animationDelay: `${f.delay}s`,
              animationDuration: `${f.duration}s`,
              filter: `blur(${f.blur}px)`,
              transform: `translateZ(${f.depth * 10}px)`,
              '--x-start': `${f.xStart}px`,
              '--x-end': `${f.xEnd}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <style>{`
        @keyframes snow { 
          0% { 
            transform: translateY(-20px) translateX(var(--x-start)) rotate(0deg); 
          } 
          50% { 
            transform: translateY(50vh) translateX(var(--x-end)) rotate(180deg); 
          }
          100% { 
            transform: translateY(110vh) translateX(var(--x-start)) rotate(360deg); 
          } 
        }
        .animate-snow { 
          animation-name: snow; 
          animation-timing-function: linear; 
          animation-iteration-count: infinite; 
        }
      `}</style>
    </>
  );
});

EnhancedSnowOverlay.displayName = 'EnhancedSnowOverlay';

/* ===================== OPTIMIZED SHINY CHROME GOLD TEXT ===================== */

const ShinyChromeGoldText = React.memo(({ children, size = "large" }: { children: React.ReactNode; size?: "large" | "medium" }) => {
  const textSize = size === "large" ? "text-5xl md:text-7xl" : "text-4xl md:text-6xl";
  
  return (
    <div className="relative inline-block">
      <div className={`${textSize} font-black relative z-10`}>
        <div className="relative bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          {children}
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer-chrome {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
});

ShinyChromeGoldText.displayName = 'ShinyChromeGoldText';

/* ===================== OPTIMIZED MEME GALLERY WITH LAZY LOADING ===================== */

const MemeGallery = React.memo(() => {
  const displayedImages = MEME_IMAGES.slice(0, 8); // Show fewer images initially

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {displayedImages.map((img, i) => (
        <div
          key={i}
          className="group rounded-[28px] border border-yellow-500/30 bg-white/95 p-4 shadow-lg backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="aspect-[4/3] w-full overflow-hidden rounded-[22px] border border-zinc-200">
            <LazyImage 
              src={img}
              alt={`Spankmas Meme ${i + 1}`}
              className="h-full w-full"
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm font-black text-zinc-900">Polar Meme #{i + 1}</div>
            <div className="text-xs text-zinc-500">North Pole approved</div>
          </div>
        </div>
      ))}
    </div>
  );
});

MemeGallery.displayName = 'MemeGallery';

/* ===================== OPTIMIZED NAV ===================== */

const Nav = React.memo(({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) => {
  const items = useMemo(() => [
    { label: "Lore", href: "#lore" },
    { label: "Tokenomics", href: "#tokenomics" },
    { label: "Chart", href: "#chart" },
    { label: "Memes", href: "#memes" },
    { label: "Community", href: "#community" },
  ], []);

  const [copied, setCopied] = useState(false);

  const copyCA = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  return (
    <div className="fixed left-0 right-0 top-0 z-40 border-b border-zinc-200/50 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top" className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-2xl overflow-hidden bg-gradient-to-br from-red-600 to-green-600 shadow-lg">
            <LazyImage 
              src={LOGO_URL}
              alt="Spankmas Logo"
              className="h-full w-full"
            />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-black bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              {BRAND.name}
            </div>
            <div className="text-[11px] font-semibold text-zinc-500">North Pole Meme Season</div>
          </div>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {items.map((it) => (
            <a
              key={it.href}
              href={it.href}
              className="rounded-xl px-3 py-2 text-sm font-bold text-zinc-700 hover:bg-zinc-100/80 transition-colors"
            >
              {it.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyCA}
            className="hidden md:inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-xs font-extrabold text-zinc-900 hover:bg-zinc-50"
            type="button"
          >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy CA"}
          </button>
          <Button variant="ghost" href={LINKS.x} className="hidden md:inline-flex">
            X Community <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href={LINKS.tg} className="hidden sm:inline-flex">
            Join TG <ArrowRight className="h-4 w-4" />
          </Button>

          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Open menu"
            type="button"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
});

Nav.displayName = 'Nav';

const MobileMenu = React.memo(({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) => {
  useLockBody(open);
  const [copied, setCopied] = useState(false);

  const items = useMemo(() => [
    { label: "Lore", href: "#lore" },
    { label: "Tokenomics", href: "#tokenomics" },
    { label: "Chart", href: "#chart" },
    { label: "Memes", href: "#memes" },
    { label: "Community", href: "#community" },
  ], []);

  const copyCA = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-white shadow-xl"
            initial={{ x: 60 }}
            animate={{ x: 0 }}
            exit={{ x: 60 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 rounded-2xl overflow-hidden bg-gradient-to-br from-red-600 to-green-600">
                  <LazyImage 
                    src={LOGO_URL}
                    alt="Spankmas Logo"
                    className="h-full w-full"
                  />
                </div>
                <div className="text-sm font-black text-zinc-900">{BRAND.name}</div>
              </div>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-4 py-4">
              <div className="grid gap-2">
                {items.map((it) => (
                  <a
                    key={it.href}
                    href={it.href}
                    className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-800 hover:bg-zinc-50"
                    onClick={() => setOpen(false)}
                  >
                    {it.label}
                </a>
                ))}
              </div>

              <div className="mt-4 grid gap-2">
                <Button href={LINKS.tg} className="w-full">
                  Join Telegram <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" href={LINKS.x} className="w-full">
                  X Community <ArrowRight className="h-4 w-4" />
                </Button>
                <button
                  onClick={copyCA}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 hover:bg-zinc-50"
                  type="button"
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy CA"}
                </button>
              </div>

              <div className="mt-6 rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-xs font-bold text-zinc-600">Contract Address</div>
                <div className="mt-2 break-all rounded-2xl bg-white p-3 font-mono text-xs text-zinc-800 border border-zinc-200">
                  {CA}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

MobileMenu.displayName = 'MobileMenu';

/* ===================== COPY CA COMPONENT ===================== */

const CopyCA = React.memo(() => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);
  
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-extrabold text-zinc-900 hover:bg-zinc-50"
      onClick={copyToClipboard}
    >
      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied!" : "Copy CA"}
    </button>
  );
});

CopyCA.displayName = 'CopyCA';

/* ===================== MODAL COMING SOON ===================== */

const ModalComingSoon = React.memo(({ open, onClose }: { open: boolean; onClose: () => void }) => {
  useLockBody(open);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="w-full max-w-lg rounded-[30px] border border-zinc-200 bg-white p-6 shadow-xl"
            initial={{ scale: 0.98, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-black text-red-700">
                  <Gift className="h-4 w-4" />
                  Coming Soon
                </div>
                <h3 className="mt-3 text-2xl font-black text-zinc-900">Stay Tuned</h3>
                <p className="mt-2 text-sm text-zinc-600">
                  More Spankmas features are coming soon. Keep your eyes on the community drops.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button href={LINKS.tg} className="w-full sm:w-auto">
                Join Telegram <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" href={LINKS.x} className="w-full sm:w-auto">
                X Community <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="soft" onClick={onClose} className="w-full sm:w-auto">
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

ModalComingSoon.displayName = 'ModalComingSoon';

/* ===================== OPTIMIZED GLITTERY SECTION COMPONENT ===================== */

const GlitterySection = React.memo(({
  id,
  kicker,
  title,
  subtitle,
  children,
}: {
  id: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => {
  return (
    <section id={id} className="relative scroll-mt-24 px-4 py-16 sm:py-20 overflow-hidden">
      <GlitteryRedBackground />
      <div className="relative mx-auto w-full max-w-6xl z-10">
        <div className="max-w-3xl">
          {kicker && (
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/20 px-3 py-1 text-xs font-bold text-yellow-100 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              {kicker}
            </div>
          )}
          <h2 className="mt-4 text-3xl font-black tracking-tight text-yellow-100 sm:text-4xl">
            {title}
          </h2>
          {subtitle && <p className="mt-3 text-sm sm:text-base text-yellow-100/80">{subtitle}</p>}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
});

GlitterySection.displayName = 'GlitterySection';

/* ===================== REAL SPANKMAS LORE SECTION ===================== */

const RealSpankmasLore = React.memo(() => {
  return (
    <GlitterySection
      id="lore"
      kicker="The Ancient Christmas Lore"
      title="The Real Spankmas Story"
      subtitle="As told by Aussie, the Meme creator/artist of Spankmas"
    >
      <div className="relative rounded-[40px] border-2 border-yellow-200/50 bg-gradient-to-b from-yellow-50/80 to-amber-50/60 p-8 sm:p-12 shadow-2xl backdrop-blur-sm">
        <div className="relative space-y-6">
          <div className="text-center mb-8">
            <ShinyChromeGoldText size="medium">
              The Origin of Spankmas
            </ShinyChromeGoldText>
          </div>
          
          <div className="space-y-4 text-lg leading-relaxed text-zinc-700">
            <p>
              As the Meme creator/artist of Spankmas, Aussie wanted to create a Christmas OG meme never done before that actually means something! Something that is rooted in real folklore of Christmas, but twisted with modern crypto humour.
            </p>

            <p>
              While "Spankmas" is a new creation, it draws inspiration from genuine ancient European winter traditions where figures like Krampus and Saint Nicholas's companions used decorated rods or switches as symbolic, light-hearted "punishment" to nudge people back onto the right path.
            </p>

            <div className="my-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-50 to-green-50 px-4 py-2">
                <TreePine className="h-5 w-5 text-green-600" />
                <span className="text-sm font-bold text-zinc-700">Ancient Roots</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-50 to-red-50 px-4 py-2">
                <Snowflake className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-bold text-zinc-700">Modern Twist</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-50 to-yellow-50 px-4 py-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-bold text-zinc-700">Crypto Humor</span>
              </div>
            </div>

            <p>
              Spankmas takes that spirit and brings it on-chain: a cheeky, flirty, butt-spanking wink to say "Merry Christmas" to the entire crypto space. It's here to unite degens and dreamers under one banner of laughter, a little kink, a lot of cheekiness, and a new holiday greeting for the culture.
            </p>

            <div className="mt-10 rounded-2xl bg-gradient-to-r from-red-500/10 to-green-500/10 p-6">
              <p className="text-xl font-black italic text-zinc-800 text-center">
                "Merry Spankmas Everyone"
              </p>
              <p className="mt-4 text-sm font-bold text-zinc-600 text-center">- Team Spankmas 🫶🏼🤣</p>
            </div>
          </div>
        </div>
      </div>
    </GlitterySection>
  );
});

RealSpankmasLore.displayName = 'RealSpankmasLore';

/* ===================== OPTIMIZED HERO VIDEO ===================== */

const HeroVideo = React.memo(() => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  
  useEffect(() => {
    // Check if we should use fallback for mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      setUseFallback(true);
    }
  }, []);

  if (useFallback) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900 via-red-800 to-red-900"></div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full min-w-[100%] min-h-[100%]">
                <iframe
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  src="https://streamable.com/e/6zg015?autoplay=1&muted=1&loop=1&controls=0&background=1"
                  title="Spankmas Hero Video"
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] 
                    min-w-[200%] min-h-[200%] max-w-none
                    sm:w-[180%] sm:h-[180%]
                    md:w-[160%] md:h-[160%]
                    lg:w-[140%] lg:h-[140%]
                    xl:w-[120%] xl:h-[120%]
                    2xl:w-[110%] 2xl:h-[110%]
                    ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                  style={{ border: "none" }}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  onLoad={() => setIsLoaded(true)}
                />
                {!isLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-b from-red-900 via-red-800 to-red-900"></div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
      </div>
    </div>
  );
});

HeroVideo.displayName = 'HeroVideo';

/* ===================== MAIN APP COMPONENT ===================== */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div id="top" className="min-h-screen bg-white text-zinc-900 relative">
      {/* REDUCED SNOW EFFECT - Optimized for performance */}
      <EnhancedSnowOverlay density={isMobile ? 40 : 80} intensity={0.5} />
      <Nav open={menuOpen} setOpen={setMenuOpen} />
      <MobileMenu open={menuOpen} setOpen={setMenuOpen} />
      <ModalComingSoon open={comingSoon} onClose={() => setComingSoon(false)} />

      {/* HERO SECTION */}
      <header className="relative px-4 pt-28 sm:pt-32 overflow-hidden min-h-screen">
        <HeroVideo />
        
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 sm:gap-10 pb-14 h-full sm:grid-cols-2 sm:pb-20 z-20">
          <div className="mt-8 sm:mt-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/20 px-3 py-1 text-xs font-black text-yellow-100 backdrop-blur-sm">
              <Compass className="h-4 w-4 text-yellow-200" />
              North Pole HQ • Est. 2025
            </div>

            <div className="mt-5">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-yellow-100">
                Welcome to
              </div>
              <ShinyChromeGoldText size="large">
                {BRAND.name}
              </ShinyChromeGoldText>
            </div>

            <p className="mt-4 max-w-xl text-sm text-yellow-100/90 sm:text-base">
              Where ancient Christmas folklore meets modern crypto humour. 
              <span className="font-bold text-yellow-200"> {BRAND.tagline}</span>
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href={LINKS.tg} className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 border-yellow-500/30">
                Join TG <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" href={LINKS.x} className="bg-white/20 text-yellow-100 hover:bg-white/30 border-yellow-400/20">
                X Community <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Hero Card */}
          <div className="relative mt-2 sm:mt-0">
            <div className="absolute -inset-4 -z-10 rounded-[40px] bg-yellow-600/20 blur-2xl backdrop-blur-sm" />
            <div className="rounded-[34px] border border-yellow-500/30 bg-white/95 p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-black text-red-700">
                  <Rocket className="h-4 w-4" />
                  Live on Solana
                </div>
                <div className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-black text-zinc-700 sm:inline-flex">
                  <Snowflake className="h-4 w-4 text-blue-500" />
                  Festive AF
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[26px] border border-zinc-200 bg-white p-4">
                  <div className="text-xs font-black text-zinc-600">Ancient Roots</div>
                  <div className="mt-1 text-sm font-black text-zinc-900">Real Christmas Folklore</div>
                  <div className="mt-1 text-xs text-zinc-600">Krampus-inspired traditions</div>
                </div>
                <div className="rounded-[26px] border border-zinc-200 bg-white p-4">
                  <div className="text-xs font-black text-zinc-600">Modern Crypto</div>
                  <div className="mt-1 text-sm font-black text-zinc-900">Cheeky & Flirty</div>
                  <div className="mt-1 text-xs text-zinc-600">A new holiday greeting</div>
                </div>
              </div>

              <div className="mt-6 rounded-[26px] border border-red-100 bg-red-50 p-4">
                <div className="text-xs font-black text-red-700">Community Note</div>
                <div className="mt-1 text-sm font-bold text-zinc-900">
                  Uniting degens & dreamers under laughter and cheekiness.
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* REAL SPANKMAS LORE SECTION */}
      <RealSpankmasLore />

      {/* TOKENOMICS SECTION */}
      <GlitterySection
        id="tokenomics"
        kicker="Token"
        title="Spankmas Tokenomics"
        subtitle="Simple, transparent, and designed for the community"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[30px] border border-yellow-500/30 bg-white/95 p-6 shadow-lg backdrop-blur-sm">
            <div className="text-xs font-black text-zinc-600">Token Details</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-xs font-black text-zinc-500">Network</div>
                <div className="mt-1 text-sm font-black text-zinc-900">Solana</div>
              </div>
              <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-xs font-black text-zinc-500">Ticker</div>
                <div className="mt-1 text-sm font-black text-zinc-900">SPANKMAS</div>
              </div>
              <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-xs font-black text-zinc-500">Supply</div>
                <div className="mt-1 text-sm font-black text-zinc-900">1,000,000,000</div>
              </div>
              <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-xs font-black text-zinc-500">Tax</div>
                <div className="mt-1 text-sm font-black text-zinc-900">0 / 0</div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-yellow-500/30 bg-yellow-600/20 p-6 shadow-lg backdrop-blur-sm">
            <div className="text-xs font-black text-yellow-200">Contract Address</div>
            <div className="mt-3 rounded-[22px] border border-yellow-500/30 bg-yellow-700/30 p-4 font-mono text-xs text-yellow-100 break-all">
              {CA}
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl border border-yellow-500/30 bg-yellow-600/20 px-4 py-3 text-sm font-extrabold text-yellow-100 hover:bg-yellow-600/30"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(CA);
                  } catch (err) {
                    console.error('Failed to copy:', err);
                  }
                }}
              >
                <Copy className="h-4 w-4" />
                Copy CA
              </button>
              <Button variant="ghost" href={LINKS.x} className="bg-white/90 text-zinc-900 hover:bg-white">
                X Community <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </GlitterySection>

      {/* CHART SECTION */}
      <GlitterySection
        id="chart"
        kicker="Live Market Data"
        title="SPANKMAS Real-Time Stats"
        subtitle="Live price, volume, liquidity, and market metrics powered by DexScreener"
      >
        <DexScreenerStats />
      </GlitterySection>

      {/* MEMES SECTION */}
      <GlitterySection
        id="memes"
        kicker="Media Gallery"
        title="Spankmas Memes & Videos"
        subtitle="The hottest Spankmas content - memes and videos from the community"
      >
        <div className="mt-10">
          <div className="mb-8 flex items-center gap-2">
            <div className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 p-2">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-2xl font-black text-yellow-100">Meme Gallery</h3>
          </div>
          <MemeGallery />
        </div>

        <VideoGallery />
      </GlitterySection>

      {/* COMMUNITY SECTION */}
      <GlitterySection
        id="community"
        kicker="Join the Movement"
        title="Join the Spankmas Community"
        subtitle="Everything routes to TG + X. That's where the memes and momentum live."
      >
        <div className="rounded-[34px] border border-yellow-500/30 bg-white/95 p-6 shadow-xl backdrop-blur-sm">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="text-2xl font-black text-zinc-900">
                {BRAND.name} is more than a token - it's a cultural movement.
              </div>
              <p className="mt-2 text-sm text-zinc-600">
                Join thousands of degens and dreamers embracing the cheeky, flirty spirit of Christmas. 
                Be part of the revolution that's bringing ancient folklore to the blockchain with a wink and a smile.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button href={LINKS.tg}>
                  Join Telegram <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" href={LINKS.x}>
                  X Community <ArrowRight className="h-4 w-4" />
                </Button>
                <CopyCA />
              </div>
            </div>

            <div className="rounded-[26px] border border-red-100 bg-red-50 p-5">
              <div className="text-xs font-black text-red-700">Quick Links</div>
              <div className="mt-4 grid gap-2">
                <a
                  href="#memes"
                  className="w-full rounded-2xl border border-red-100 bg-white px-5 py-3 text-sm font-extrabold text-red-700 hover:bg-red-50 text-center"
                >
                  View Media Gallery
                </a>
                <a
                  href="#chart"
                  className="w-full rounded-2xl border border-red-100 bg-white px-5 py-3 text-sm font-extrabold text-red-700 hover:bg-red-50 text-center"
                >
                  View Live Chart
                </a>
              </div>
            </div>
          </div>
        </div>
      </GlitterySection>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 rounded-2xl overflow-hidden bg-gradient-to-br from-red-600 to-green-600">
                  <LazyImage 
                    src={LOGO_URL}
                    alt="Spankmas Logo"
                    className="h-full w-full"
                  />
                </div>
                <div className="text-sm font-black text-zinc-900">{BRAND.name}</div>
              </div>
              <div className="mt-1 text-xs text-zinc-500">© {new Date().getFullYear()} — The OG Christmas Meme Token</div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={LINKS.tg}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-xs font-black text-zinc-800 hover:bg-zinc-50"
              >
                Telegram
              </a>
              <a
                href={LINKS.x}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-xs font-black text-zinc-800 hover:bg-zinc-50"
              >
                X Community
              </a>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(CA);
                  } catch (err) {
                    console.error('Failed to copy:', err);
                  }
                }}
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-xs font-black text-zinc-800 hover:bg-zinc-50"
                type="button"
              >
                Copy CA
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-xs font-black text-zinc-600">Contract Address</div>
            <div className="mt-2 break-all font-mono text-xs text-zinc-800">{CA}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
