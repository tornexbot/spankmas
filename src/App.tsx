import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
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
];

const LOGO_URL = "https://i.ibb.co/whtDqpwp/gogo.png";
const TOKEN_ADDRESS = "BMMWMuy1ZFBtDEzzdBvtrNvMZFetcGUfkrdDAYo3pump";

/* ===================== STREAMABLE VIDEOS ===================== */
const STREAMABLE_VIDEOS = [
  { id: "wxr480", title: "Spankmas Video 1", aspectRatio: 55.000 },
  { id: "2l71xc", title: "Spankmas Video 2", aspectRatio: 148.148 },
  { id: "o3lcd7", title: "Spankmas Video 3", aspectRatio: 55.000 },
  { id: "4cru3q", title: "Spankmas Video 4", aspectRatio: 55.000 },
];

/* ===================== PERFORMANCE HOOKS ===================== */

// Simplified mobile detection
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    // Throttle resize events
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);
  
  return isMobile;
};

// Device performance detection
const useDevicePerformance = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  
  useEffect(() => {
    const checkPerformance = () => {
      // Check for common low-end devices or slow connections
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
      const isSlowConnection = navigator.connection && 
        (navigator.connection.saveData || 
         navigator.connection.effectiveType.includes('2g') || 
         navigator.connection.effectiveType.includes('3g'));
      
      setIsLowPerformance(isMobile && (hasLowMemory || isSlowConnection));
    };
    
    checkPerformance();
  }, []);
  
  return isLowPerformance;
};

/* ===================== OPTIMIZED IMAGE COMPONENT ===================== */

const OptimizedImage = React.memo(({ 
  src, 
  alt, 
  className = "", 
  placeholderColor = "bg-gray-200" 
}: { 
  src: string; 
  alt: string; 
  className?: string;
  placeholderColor?: string;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    
    if (img.complete) {
      setIsLoaded(true);
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
          }
        });
      },
      { rootMargin: '50px' }
    );
    
    observer.observe(img);
    return () => observer.disconnect();
  }, []);
  
  return (
    <div className={`relative ${className} ${!isLoaded ? placeholderColor : ''}`}>
      <img
        ref={imgRef}
        data-src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ contentVisibility: 'auto' }}
      />
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300"></div>
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

/* ===================== DEXSCREENER HOOK (SIMPLIFIED) ===================== */

function useDexScreenerStats(tokenAddress: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (res.ok) {
        const json = await res.json();
        setData(json.pairs?.[0] || null);
      }
    } catch (err) {
      console.error('API error:', err);
    } finally {
      setLoading(false);
    }
  }, [tokenAddress]);
  
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [fetchData]);
  
  return { data, loading };
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

/* ===================== ULTRA-LIGHT SNOW EFFECT ===================== */

const UltraLightSnow = React.memo(() => {
  const isMobile = useIsMobile();
  const particleCount = isMobile ? 20 : 40;
  
  const flakes = useMemo(() => 
    Array.from({ length: particleCount }).map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 10,
      size: 1 + Math.random() * 3,
    }))
  , [particleCount]);
  
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {flakes.map((f, i) => (
        <div
          key={i}
          className="absolute top-[-20px] rounded-full bg-white/70"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            animation: `snowfall ${f.duration}s linear ${f.delay}s infinite`,
            willChange: 'transform',
          }}
        />
      ))}
      <style>{`
        @keyframes snowfall {
          0% { transform: translateY(-20px) translateX(0); opacity: 1; }
          100% { transform: translateY(100vh) translateX(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
});

UltraLightSnow.displayName = 'UltraLightSnow';

/* ===================== STATIC GLITTERY BACKGROUND ===================== */

const StaticRedBackground = React.memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-red-900 via-red-800 to-red-900">
      {/* Static gradient overlay - no animations */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1), transparent 40%),
                          radial-gradient(circle at 80% 70%, rgba(255,215,0,0.05), transparent 40%)`
        }}
      />
    </div>
  );
});

StaticRedBackground.displayName = 'StaticRedBackground';

/* ===================== OPTIMIZED VIDEO PLAYER ===================== */

const OptimizedVideoPlayer = React.memo(({ videoId, title, aspectRatio }: { 
  videoId: string; 
  title: string;
  aspectRatio: number;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const isMobile = useIsMobile();
  
  const handlePlayClick = useCallback(() => {
    setIsPlaying(true);
  }, []);
  
  // On mobile, don't use iframes - use Streamable's native player
  if (isMobile) {
    return (
      <div className="rounded-[20px] border border-yellow-500/20 bg-white/90 p-3 shadow">
        <div style={{ position: 'relative', width: '100%', height: 0, paddingBottom: `${aspectRatio}%` }}>
          {isPlaying ? (
            <div className="absolute inset-0">
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <iframe
                  src={`https://streamable.com/e/${videoId}?autoplay=1&muted=1`}
                  title={title}
                  width="100%"
                  height="100%"
                  style={{ border: 'none', position: 'absolute', top: 0, left: 0 }}
                  allowFullScreen
                  allow="autoplay"
                  loading="lazy"
                  className="rounded-[16px]"
                  sandbox="allow-same-origin allow-scripts allow-popups"
                />
              </div>
            </div>
          ) : (
            <div 
              className="absolute inset-0 cursor-pointer bg-gradient-to-br from-red-50/50 to-blue-50/50 rounded-[16px]"
              onClick={handlePlayClick}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-black/60">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-xs font-bold text-zinc-700">Tap to play</p>
                  <p className="mt-1 text-[10px] text-zinc-500">{title}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs font-bold text-zinc-900 truncate">{title}</div>
          {!isPlaying && (
            <div className="flex items-center gap-1 text-[10px] text-zinc-500">
              <Video className="h-3 w-3" />
              Tap
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Desktop version
  return (
    <div className="rounded-[24px] border border-yellow-500/30 bg-white/95 p-4 shadow">
      <div style={{ position: 'relative', width: '100%', height: 0, paddingBottom: `${aspectRatio}%` }}>
        {isPlaying ? (
          <iframe
            src={`https://streamable.com/e/${videoId}?autoplay=1`}
            title={title}
            width="100%"
            height="100%"
            style={{ border: 'none', position: 'absolute', top: 0, left: 0 }}
            allowFullScreen
            allow="autoplay"
            loading="lazy"
            className="rounded-[18px]"
            sandbox="allow-same-origin allow-scripts allow-popups"
          />
        ) : (
          <div 
            className="absolute inset-0 cursor-pointer bg-gradient-to-br from-red-50/50 to-blue-50/50 rounded-[18px]"
            onClick={handlePlayClick}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-black/70 backdrop-blur-sm">
                  <Video className="h-7 w-7 text-white" />
                </div>
                <p className="text-sm font-bold text-zinc-700">Click to play</p>
                <p className="mt-1 text-xs text-zinc-500">{title}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm font-bold text-zinc-900">{title}</div>
        {!isPlaying && (
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <Video className="h-3 w-3" />
            Click
          </div>
        )}
      </div>
    </div>
  );
});

OptimizedVideoPlayer.displayName = 'OptimizedVideoPlayer';

/* ===================== SIMPLE DEXSCREENER WIDGET ===================== */

const SimpleDexScreenerWidget = React.memo(() => {
  const { data, loading } = useDexScreenerStats(TOKEN_ADDRESS);
  const isMobile = useIsMobile();
  
  if (loading) {
    return (
      <div className="rounded-[24px] border border-yellow-500/20 bg-white/95 p-4">
        <div className="h-48 flex items-center justify-center">
          <div className="text-center">
            <div className="h-6 w-6 animate-spin rounded-full border-3 border-red-600 border-t-transparent mx-auto"></div>
            <p className="mt-2 text-sm text-zinc-600">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="rounded-[24px] border border-yellow-500/20 bg-white/95 p-4">
        <div className="h-48 flex flex-col items-center justify-center">
          <div className="rounded-full bg-red-100 p-2">
            <X className="h-5 w-5 text-red-600" />
          </div>
          <p className="mt-2 text-sm text-zinc-600">Data unavailable</p>
          <a
            href={`https://dexscreener.com/solana/${TOKEN_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-xs text-purple-600 hover:underline"
          >
            View on DexScreener →
          </a>
        </div>
      </div>
    );
  }
  
  const price = data.priceUsd ? parseFloat(data.priceUsd).toFixed(8) : "0.00000000";
  const volume = data.volume?.h24 ? `$${(data.volume.h24 / 1000).toFixed(1)}K` : "$0";
  const liquidity = data.liquidity?.usd ? `$${(data.liquidity.usd / 1000).toFixed(1)}K` : "$0";
  const change = data.priceChange?.h24 ? data.priceChange.h24.toFixed(2) : "0.00";
  const isPositive = data.priceChange?.h24 >= 0;
  
  return (
    <div className="rounded-[24px] border border-yellow-500/20 bg-white/95 p-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-red-600" />
          <h3 className="text-lg font-bold text-zinc-900">SPANKMAS / SOL</h3>
        </div>
        <p className="text-xs text-zinc-600">Live market data</p>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-zinc-600">Price</span>
          <span className="text-lg font-bold text-zinc-900">${price}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-50 rounded-xl p-3">
            <div className="text-xs text-zinc-500">24h Volume</div>
            <div className="text-sm font-bold text-zinc-900">{volume}</div>
          </div>
          <div className="bg-zinc-50 rounded-xl p-3">
            <div className="text-xs text-zinc-500">Liquidity</div>
            <div className="text-sm font-bold text-zinc-900">{liquidity}</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-zinc-600">24h Change</span>
          <span className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '↗' : '↘'} {change}%
          </span>
        </div>
        
        {!isMobile && (
          <a
            href={`https://dexscreener.com/solana/${TOKEN_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-xs text-purple-600 hover:underline pt-2"
          >
            View full chart →
          </a>
        )}
      </div>
    </div>
  );
});

SimpleDexScreenerWidget.displayName = 'SimpleDexScreenerWidget';

/* ===================== OPTIMIZED BUTTON ===================== */

const SimpleButton = React.memo(({
  children,
  href,
  onClick,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
}) => {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[0.98]";
  const styles = variant === "primary" 
    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow"
    : "bg-white text-zinc-900 border border-zinc-200";
  
  const content = (
    <span className="flex items-center gap-2">
      {children}
    </span>
  );
  
  if (href) {
    return (
      <a
        className={cn(base, styles, className)}
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
      >
        {content}
      </a>
    );
  }
  
  return (
    <button className={cn(base, styles, className)} onClick={onClick} type="button">
      {content}
    </button>
  );
});

SimpleButton.displayName = 'SimpleButton';

/* ===================== SIMPLE NAVBAR ===================== */

const SimpleNav = React.memo(({ setMenuOpen }: { setMenuOpen: (v: boolean) => void }) => {
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
    <div className="fixed left-0 right-0 top-0 z-40 border-b border-zinc-200/50 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl overflow-hidden bg-gradient-to-br from-red-600 to-green-600">
            <OptimizedImage 
              src={LOGO_URL}
              alt="Spankmas Logo"
              className="h-full w-full"
            />
          </div>
          <div>
            <div className="text-sm font-bold text-zinc-900">{BRAND.name}</div>
            <div className="text-[10px] text-zinc-500">North Pole Meme</div>
          </div>
        </a>
        
        <div className="flex items-center gap-2">
          <button
            onClick={copyCA}
            className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-900"
            type="button"
          >
            {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy CA"}
          </button>
          
          <SimpleButton href={LINKS.tg} className="hidden sm:inline-flex">
            Join TG
          </SimpleButton>
          
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-900 sm:hidden"
            onClick={() => setMenuOpen(true)}
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

SimpleNav.displayName = 'SimpleNav';

/* ===================== SIMPLE MOBILE MENU ===================== */

const SimpleMobileMenu = React.memo(({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) => {
  useLockBody(open);
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
  
  const menuItems = [
    { label: "Lore", href: "#lore" },
    { label: "Tokenomics", href: "#tokenomics" },
    { label: "Chart", href: "#chart" },
    { label: "Memes", href: "#memes" },
    { label: "Community", href: "#community" },
  ];
  
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-white shadow-lg"
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            exit={{ x: 100 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-xl overflow-hidden bg-gradient-to-br from-red-600 to-green-600">
                  <OptimizedImage 
                    src={LOGO_URL}
                    alt="Logo"
                    className="h-full w-full"
                  />
                </div>
                <div className="text-sm font-bold text-zinc-900">{BRAND.name}</div>
              </div>
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 bg-white"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="px-4 py-4">
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-800"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              
              <div className="mt-6 space-y-2">
                <SimpleButton href={LINKS.tg} className="w-full">
                  Join Telegram
                </SimpleButton>
                <SimpleButton href={LINKS.x} variant="secondary" className="w-full">
                  X Community
                </SimpleButton>
                <button
                  onClick={copyCA}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-900"
                  type="button"
                >
                  {copied ? "✓ Copied!" : "Copy Contract Address"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SimpleMobileMenu.displayName = 'SimpleMobileMenu';

/* ===================== SIMPLE SECTION ===================== */

const SimpleSection = React.memo(({
  id,
  title,
  subtitle,
  children,
  noPadding = false,
}: {
  id: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  noPadding?: boolean;
}) => {
  return (
    <section id={id} className={`scroll-mt-16 ${noPadding ? '' : 'px-4 py-12'}`}>
      <div className="mx-auto max-w-6xl">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && <h2 className="text-2xl font-bold text-zinc-900">{title}</h2>}
            {subtitle && <p className="mt-2 text-sm text-zinc-600">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
});

SimpleSection.displayName = 'SimpleSection';

/* ===================== SIMPLE HERO SECTION ===================== */

const SimpleHero = React.memo(() => {
  const isMobile = useIsMobile();
  
  return (
    <section className="relative px-4 pt-24 pb-12 overflow-hidden min-h-[70vh] flex items-center">
      {/* Static background for mobile, video for desktop */}
      {isMobile ? (
        <div className="absolute inset-0 bg-gradient-to-b from-red-900 via-red-800 to-red-900"></div>
      ) : (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/90 via-red-800/80 to-red-900/90"></div>
          <div className="absolute inset-0 opacity-30">
            <div className="h-full w-full bg-gradient-to-br from-red-600/20 to-green-600/20"></div>
          </div>
        </div>
      )}
      
      <div className="relative mx-auto max-w-6xl z-10">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/20 px-3 py-1 text-xs font-bold text-yellow-100 mb-4">
              <Compass className="h-3 w-3" />
              North Pole HQ • Est. 2025
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-100 mb-3">
              Welcome to
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent">
                {BRAND.name}
              </span>
            </h1>
            
            <p className="text-lg text-yellow-100/90 mb-6">
              Where ancient Christmas folklore meets modern crypto humour.
              <br />
              <span className="font-bold text-yellow-200">{BRAND.tagline}</span>
            </p>
            
            <div className="flex flex-wrap gap-3">
              <SimpleButton href={LINKS.tg}>
                Join Telegram <ArrowRight className="h-4 w-4" />
              </SimpleButton>
              <SimpleButton href={LINKS.x} variant="secondary">
                X Community <ArrowRight className="h-4 w-4" />
              </SimpleButton>
            </div>
          </div>
          
          {/* Hero Card */}
          <div className="rounded-3xl border border-yellow-500/30 bg-white/95 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                <Rocket className="h-3 w-3" />
                Live on Solana
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-bold text-zinc-700">
                <Snowflake className="h-3 w-3 text-blue-500" />
                Festive AF
              </div>
            </div>
            
            <div className="grid gap-3 sm:grid-cols-2 mb-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-3">
                <div className="text-xs text-zinc-600">Ancient Roots</div>
                <div className="text-sm font-bold text-zinc-900">Real Christmas Folklore</div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-3">
                <div className="text-xs text-zinc-600">Modern Crypto</div>
                <div className="text-sm font-bold text-zinc-900">Cheeky & Flirty</div>
              </div>
            </div>
            
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
              <div className="text-xs font-bold text-red-700">Community Note</div>
              <div className="mt-1 text-sm text-zinc-900">
                Uniting degens & dreamers under laughter and cheekiness.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

SimpleHero.displayName = 'SimpleHero';

/* ===================== SIMPLE LORE SECTION ===================== */

const SimpleLoreSection = React.memo(() => {
  return (
    <SimpleSection
      id="lore"
      title="The Real Spankmas Story"
      subtitle="As told by Aussie, the Meme creator/artist of Spankmas"
    >
      <div className="rounded-3xl border-2 border-yellow-200/50 bg-gradient-to-b from-yellow-50 to-amber-50 p-6 md:p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-zinc-900 mb-2">The Origin of Spankmas</h3>
          <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-green-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="space-y-4 text-zinc-700">
          <p>
            As the Meme creator/artist of Spankmas, Aussie wanted to create a Christmas OG meme never done before that actually means something! Something that is rooted in real folklore of Christmas, but twisted with modern crypto humour.
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center my-6">
            <div className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5">
              <TreePine className="h-4 w-4 text-green-600" />
              <span className="text-sm font-bold text-zinc-700">Ancient Roots</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5">
              <Snowflake className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-bold text-zinc-700">Modern Twist</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-1.5">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-bold text-zinc-700">Crypto Humor</span>
            </div>
          </div>
          
          <p>
            While "Spankmas" is a new creation, it draws inspiration from genuine ancient European winter traditions where figures like Krampus and Saint Nicholas's companions used decorated rods or switches as symbolic, light-hearted "punishment" to nudge people back onto the right path.
          </p>
          
          <p>
            Spankmas takes that spirit and brings it on-chain: a cheeky, flirty, butt-spanking wink to say "Merry Christmas" to the entire crypto space. It's here to unite degens and dreamers under one banner of laughter, a little kink, a lot of cheekiness, and a new holiday greeting for the culture.
          </p>
          
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-red-500/10 to-green-500/10 p-6">
            <p className="text-lg font-bold italic text-zinc-800 text-center">
              "Merry Spankmas Everyone"
            </p>
            <p className="mt-3 text-sm text-zinc-600 text-center">- Team Spankmas 🫶🏼🤣</p>
          </div>
        </div>
      </div>
    </SimpleSection>
  );
});

SimpleLoreSection.displayName = 'SimpleLoreSection';

/* ===================== SIMPLE MEME GALLERY ===================== */

const SimpleMemeGallery = React.memo(() => {
  const [loadedCount, setLoadedCount] = useState(4);
  const isMobile = useIsMobile();
  
  const loadMore = useCallback(() => {
    setLoadedCount(prev => Math.min(prev + 4, MEME_IMAGES.length));
  }, []);
  
  const displayedImages = MEME_IMAGES.slice(0, loadedCount);
  
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {displayedImages.map((img, i) => (
          <div
            key={i}
            className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm"
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
              <OptimizedImage 
                src={img}
                alt={`Spankmas Meme ${i + 1}`}
                className="h-full w-full"
                placeholderColor="bg-gray-100"
              />
            </div>
            <div className="mt-2 text-xs text-zinc-500 text-center">
              Polar Meme #{i + 1}
            </div>
          </div>
        ))}
      </div>
      
      {loadedCount < MEME_IMAGES.length && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            className="rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-900"
            type="button"
          >
            Load More Memes
          </button>
        </div>
      )}
    </div>
  );
});

SimpleMemeGallery.displayName = 'SimpleMemeGallery';

/* ===================== SIMPLE VIDEO GALLERY ===================== */

const SimpleVideoGallery = React.memo(() => {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {STREAMABLE_VIDEOS.map((video) => (
        <OptimizedVideoPlayer 
          key={video.id}
          videoId={video.id}
          title={video.title}
          aspectRatio={video.aspectRatio}
        />
      ))}
    </div>
  );
});

SimpleVideoGallery.displayName = 'SimpleVideoGallery';

/* ===================== MAIN APP ===================== */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const [heroLoaded, setHeroLoaded] = useState(false);
  
  // Performance optimization: delay non-critical renders
  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div id="top" className="min-h-screen bg-white text-zinc-900 relative">
      {/* Ultra light snow effect - disabled on very low-end devices */}
      {!isMobile && <UltraLightSnow />}
      
      <SimpleNav setMenuOpen={setMenuOpen} />
      <SimpleMobileMenu open={menuOpen} setOpen={setMenuOpen} />
      
      {/* HERO SECTION */}
      <SimpleHero />
      
      {/* LORE SECTION */}
      <SimpleLoreSection />
      
      {/* TOKENOMICS SECTION */}
      <SimpleSection
        id="tokenomics"
        title="Spankmas Tokenomics"
        subtitle="Simple, transparent, and designed for the community"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">Token Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <div className="text-xs text-zinc-500">Network</div>
                <div className="text-sm font-bold text-zinc-900">Solana</div>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <div className="text-xs text-zinc-500">Ticker</div>
                <div className="text-sm font-bold text-zinc-900">SPANKMAS</div>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <div className="text-xs text-zinc-500">Supply</div>
                <div className="text-sm font-bold text-zinc-900">1B</div>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <div className="text-xs text-zinc-500">Tax</div>
                <div className="text-sm font-bold text-zinc-900">0 / 0</div>
              </div>
            </div>
          </div>
          
          <div className="rounded-3xl border border-yellow-500/30 bg-yellow-600/10 p-6">
            <h3 className="text-lg font-bold text-yellow-800 mb-4">Contract Address</h3>
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-700/10 p-3 font-mono text-xs text-yellow-800 break-all mb-4">
              {CA}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(CA);
                  } catch (err) {
                    console.error('Failed to copy:', err);
                  }
                }}
                className="rounded-xl border border-yellow-500/30 bg-yellow-600/20 px-4 py-2 text-sm font-bold text-yellow-800"
                type="button"
              >
                <Copy className="h-3 w-3 inline mr-1" />
                Copy CA
              </button>
              <SimpleButton href={LINKS.x} variant="secondary" className="bg-white">
                X Community
              </SimpleButton>
            </div>
          </div>
        </div>
      </SimpleSection>
      
      {/* CHART SECTION */}
      <SimpleSection
        id="chart"
        title="Live Market Data"
        subtitle="Real-time SPANKMAS stats powered by DexScreener"
      >
        <SimpleDexScreenerWidget />
      </SimpleSection>
      
      {/* MEMES SECTION */}
      <SimpleSection
        id="memes"
        title="Spankmas Memes"
        subtitle="Community memes and content"
      >
        <SimpleMemeGallery />
      </SimpleSection>
      
      {/* VIDEOS SECTION */}
      <SimpleSection
        id="videos"
        title="Spankmas Videos"
        subtitle="Watch the hottest Spankmas content"
      >
        <SimpleVideoGallery />
      </SimpleSection>
      
      {/* COMMUNITY SECTION */}
      <SimpleSection
        id="community"
        title="Join the Community"
        subtitle="Everything routes to TG + X. That's where the memes and momentum live."
      >
        <div className="rounded-3xl border border-zinc-200 bg-white p-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-zinc-900 mb-3">
                {BRAND.name} is more than a token - it's a cultural movement.
              </h3>
              <p className="text-zinc-600 mb-6">
                Join thousands of degens and dreamers embracing the cheeky, flirty spirit of Christmas. 
                Be part of the revolution that's bringing ancient folklore to the blockchain with a wink and a smile.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <SimpleButton href={LINKS.tg}>
                  Join Telegram <ArrowRight className="h-4 w-4" />
                </SimpleButton>
                <SimpleButton href={LINKS.x} variant="secondary">
                  X Community <ArrowRight className="h-4 w-4" />
                </SimpleButton>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(CA);
                    } catch (err) {
                      console.error('Failed to copy:', err);
                    }
                  }}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-zinc-900"
                  type="button"
                >
                  <Copy className="h-3 w-3 inline mr-1" />
                  Copy CA
                </button>
              </div>
            </div>
            
            <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
              <h4 className="text-sm font-bold text-red-700 mb-3">Quick Links</h4>
              <div className="space-y-2">
                <a
                  href="#memes"
                  className="block rounded-xl border border-red-100 bg-white px-4 py-3 text-sm font-bold text-red-700 text-center"
                >
                  View Memes
                </a>
                <a
                  href="#chart"
                  className="block rounded-xl border border-red-100 bg-white px-4 py-3 text-sm font-bold text-red-700 text-center"
                >
                  View Chart
                </a>
                <a
                  href="#videos"
                  className="block rounded-xl border border-red-100 bg-white px-4 py-3 text-sm font-bold text-red-700 text-center"
                >
                  View Videos
                </a>
              </div>
            </div>
          </div>
        </div>
      </SimpleSection>
      
      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-lg overflow-hidden bg-gradient-to-br from-red-600 to-green-600">
                  <OptimizedImage 
                    src={LOGO_URL}
                    alt="Logo"
                    className="h-full w-full"
                  />
                </div>
                <div className="text-sm font-bold text-zinc-900">{BRAND.name}</div>
              </div>
              <div className="text-xs text-zinc-500">© {new Date().getFullYear()} — The OG Christmas Meme Token</div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <a
                href={LINKS.tg}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-800"
              >
                Telegram
              </a>
              <a
                href={LINKS.x}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-800"
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
                className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-800"
                type="button"
              >
                Copy CA
              </button>
            </div>
          </div>
          
          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-xs font-bold text-zinc-600 mb-2">Contract Address</div>
            <div className="font-mono text-xs text-zinc-800 break-all">{CA}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
