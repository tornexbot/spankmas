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

/* ===================== OPTIMIZED IMAGE GALLERY ===================== */
const MEME_IMAGES = [
  "https://i.ibb.co/23Thypp0/photo-2025-12-15-14-35-05.jpg",
  "https://i.ibb.co/0SJDTKv/photo-2025-12-15-14-35-11.jpg",
  "https://i.ibb.co/DP4Td1zF/photo-2025-12-15-14-35-40.jpg",
  "https://i.ibb.co/CsNm8J5M/photo-2025-12-15-14-35-42.jpg",
  "https://i.ibb.co/Fqg9ScQP/photo-2025-12-15-14-35-44.jpg",
  "https://i.ibb.co/CsKTh1C9/photo-2025-12-15-14-35-47.jpg",
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

/* ===================== CANVAS-BASED SNOW (PERFORMANT) ===================== */

function SnowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const snowflakesRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    // Initialize snowflakes
    const initSnowflakes = () => {
      snowflakesRef.current = [];
      const flakeCount = window.innerWidth < 768 ? 30 : 60; // Less on mobile
      
      for (let i = 0; i < flakeCount; i++) {
        snowflakesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1, // 1-3px
          speed: Math.random() * 0.5 + 0.2, // 0.2-0.7
          wind: Math.random() * 0.5 - 0.25, // -0.25 to 0.25
        });
      }
    };

    initSnowflakes();

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return;

      // Clear with slight fade effect for trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw snowflakes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      
      snowflakesRef.current.forEach(flake => {
        // Move flake
        flake.y += flake.speed;
        flake.x += flake.wind;

        // Reset if out of bounds
        if (flake.y > canvas.height) {
          flake.y = 0;
          flake.x = Math.random() * canvas.width;
        }
        if (flake.x > canvas.width) flake.x = 0;
        if (flake.x < 0) flake.x = canvas.width;

        // Draw flake
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    // Handle resize
    const handleResize = () => {
      setCanvasSize();
      initSnowflakes();
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20"
      style={{ opacity: 0.7 }}
    />
  );
}

/* ===================== STATIC CSS GRID BACKGROUND ===================== */

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950 via-red-900 to-red-950" />
      
      {/* Grid pattern - pure CSS, no DOM nodes per cell */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Diagonal subtle pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.1) 50%, transparent 51%)',
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Main glow effect - single element */}
      <div className="absolute inset-0">
        {/* Central glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-gradient-to-r from-red-600/10 via-yellow-600/5 to-red-600/10 rounded-full blur-3xl" />
        
        {/* Corner glows */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-red-600/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-red-600/10 to-transparent blur-3xl" />
      </div>
      
      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-950/50 via-transparent to-red-950/50" />
      
      {/* Very subtle shimmer (optional, safe) */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        .animate-shimmer {
          animation: shimmer 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

/* ===================== OPTIMIZED STREAMABLE VIDEO COMPONENT ===================== */

function StreamableVideoPlayer({ videoId, title, aspectRatio }: { 
  videoId: string; 
  title: string;
  aspectRatio: number;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-red-300/20 bg-white shadow-lg">
      <div className="relative w-full overflow-hidden rounded-lg border border-zinc-200">
        <div style={{ position: 'relative', width: '100%', height: 0, paddingBottom: `${aspectRatio}%` }}>
          {isPlaying ? (
            <iframe
              src={`https://streamable.com/e/${videoId}?autoplay=1&muted=1`}
              title={title}
              width="100%"
              height="100%"
              style={{ border: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="rounded-lg"
            />
          ) : (
            <div 
              className="absolute inset-0 cursor-pointer bg-gradient-to-br from-red-50 to-blue-50"
              onClick={() => setIsPlaying(true)}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-black/70">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-bold text-zinc-700">Click to play</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-3">
        <div className="text-sm font-bold text-zinc-900">{title}</div>
      </div>
    </div>
  );
}

function VideoGallery() {
  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-2">
          <Video className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-2xl font-black text-white">Video Content</h3>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
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

/* ===================== UI COMPONENTS ===================== */

function Button({
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
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition active:scale-[0.99]";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg"
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
}

/* ===================== DEXSCREENER HOOK ===================== */

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

function useDexScreenerStats(tokenAddress: string) {
  const [data, setData] = useState<DexScreenerPair | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const tokenRes = await fetch(
        `https://api.dexscreener.com/token-pairs/v1/solana/${tokenAddress}`
      );

      if (!tokenRes.ok) return;

      const pairs: any[] = await tokenRes.json();
      if (!pairs || pairs.length === 0) return;

      const mainPair =
        pairs.find(p => p.dexId === "pumpswap") ||
        pairs.sort((a, b) => b.liquidity.usd - a.liquidity.usd)[0];

      if (!mainPair) return;

      setData(mainPair);
    } catch (err) {
      console.error("DexScreener error:", err);
    } finally {
      setLoading(false);
    }
  }, [tokenAddress]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading };
}

/* ===================== DEXSCREENER STATS ===================== */

function DexScreenerStats() {
  const { data, loading } = useDexScreenerStats(TOKEN_ADDRESS);

  if (loading) {
    return (
      <div className="rounded-xl border border-red-300/20 bg-white/95 p-6 backdrop-blur-sm">
        <div className="flex h-48 items-center justify-center rounded-lg border border-zinc-200">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const price = parseFloat(data.priceUsd).toFixed(8);
  const volume = `$${(data.volume.h24 || 0).toLocaleString()}`;
  const liquidity = `$${(data.liquidity.usd || 0).toLocaleString()}`;
  const change24h = (data.priceChange.h24 || 0).toFixed(2);
  const isPositive = (data.priceChange.h24 || 0) >= 0;

  return (
    <div className="rounded-xl border border-red-300/20 bg-white/95 p-6 backdrop-blur-sm">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
          <Sparkles className="h-4 w-4" />
          Live Market Data
        </div>
        <h3 className="mt-2 text-xl font-black text-zinc-900">SPANKMAS / SOL</h3>
        <p className="text-sm text-zinc-600">Real-time data from DexScreener</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="text-xs font-bold text-zinc-500">Price</div>
          <div className="mt-1 text-xl font-black text-zinc-900">${price}</div>
          <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isPositive ? '↗' : '↘'} {change24h}%
          </div>
        </div>
        
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="text-xs font-bold text-zinc-500">24h Volume</div>
          <div className="mt-1 text-xl font-black text-zinc-900">{volume}</div>
        </div>
        
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="text-xs font-bold text-zinc-500">Liquidity</div>
          <div className="mt-1 text-xl font-black text-zinc-900">{liquidity}</div>
        </div>
        
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="text-xs font-bold text-zinc-500">Market Cap</div>
          <div className="mt-1 text-xl font-black text-zinc-900">
            ${data.marketCap ? (data.marketCap / 1000000).toFixed(1) + 'M' : 'Calculating'}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== MEME GALLERY ===================== */

function MemeGallery() {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {MEME_IMAGES.map((img, i) => (
        <div
          key={i}
          className="group rounded-xl border border-red-300/20 bg-white p-3 shadow-lg"
        >
          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-zinc-200">
            <img 
              src={img} 
              alt={`Spankmas Meme ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-300"
              loading="lazy"
              onLoad={() => handleImageLoad(i)}
              style={{
                opacity: loadedImages.has(i) ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            />
            {!loadedImages.has(i) && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
                <div className="h-6 w-6 animate-spin rounded-full border-3 border-red-600 border-t-transparent"></div>
              </div>
            )}
          </div>
          <div className="mt-2">
            <div className="text-sm font-bold text-zinc-900">Spankmas Meme #{i + 1}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===================== NAV COMPONENT ===================== */

function Nav({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const items = [
    { label: "Lore", href: "#lore" },
    { label: "Tokenomics", href: "#tokenomics" },
    { label: "Chart", href: "#chart" },
    { label: "Memes", href: "#memes" },
    { label: "Community", href: "#community" },
  ];

  const [copied, setCopied] = useState(false);

  const copyCA = async () => {
    try {
      await navigator.clipboard.writeText(CA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-red-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top" className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-gradient-to-br from-red-600 to-green-600">
            <img 
              src={LOGO_URL}
              alt="Spankmas Logo" 
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-black text-white">
              {BRAND.name}
            </div>
            <div className="text-[11px] font-semibold text-red-300">North Pole Meme Season</div>
          </div>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {items.map((it) => (
            <a
              key={it.href}
              href={it.href}
              className="rounded-lg px-3 py-2 text-sm font-bold text-white hover:bg-white/10"
            >
              {it.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyCA}
            className="hidden md:inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20"
            type="button"
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy CA"}
          </button>
          <Button variant="ghost" href={LINKS.x} className="hidden md:inline-flex bg-white/10 text-white hover:bg-white/20 border-white/20">
            X Community <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href={LINKS.tg} className="hidden sm:inline-flex bg-gradient-to-r from-red-600 to-red-700">
            Join TG <ArrowRight className="h-4 w-4" />
          </Button>

          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 md:hidden"
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
}

function MobileMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  useLockBody(open);
  const [copied, setCopied] = useState(false);

  const items = [
    { label: "Lore", href: "#lore" },
    { label: "Tokenomics", href: "#tokenomics" },
    { label: "Chart", href: "#chart" },
    { label: "Memes", href: "#memes" },
    { label: "Community", href: "#community" },
  ];

  const copyCA = async () => {
    try {
      await navigator.clipboard.writeText(CA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-red-950 shadow-xl"
            initial={{ x: 60 }}
            animate={{ x: 0 }}
            exit={{ x: 60 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 rounded-xl overflow-hidden bg-gradient-to-br from-red-600 to-green-600">
                  <img 
                    src={LOGO_URL}
                    alt="Spankmas Logo" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-sm font-black text-white">{BRAND.name}</div>
              </div>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white"
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
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white hover:bg-white/10"
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
                <button
                  onClick={copyCA}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/20"
                  type="button"
                >
                  {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy CA"}
                </button>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-bold text-red-300">Contract Address</div>
                <div className="mt-2 break-all rounded-lg bg-white/10 p-3 font-mono text-xs text-white">
                  {CA}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ===================== GLITTERY SECTION ===================== */

function GlitterySection({
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
}) {
  return (
    <section id={id} className="relative scroll-mt-24 px-4 py-12 sm:py-16 overflow-hidden bg-red-950">
      <GridBackground />
      <div className="relative mx-auto w-full max-w-6xl z-10">
        <div className="max-w-3xl">
          {kicker && (
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/20 px-3 py-1 text-xs font-bold text-red-100">
              <Sparkles className="h-4 w-4" />
              {kicker}
            </div>
          )}
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          {subtitle && <p className="mt-3 text-sm sm:text-base text-red-100">{subtitle}</p>}
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

/* ===================== REAL SPANKMAS LORE ===================== */

function RealSpankmasLore() {
  return (
    <GlitterySection
      id="lore"
      kicker="The Ancient Christmas Lore"
      title="The Real Spankmas Story"
      subtitle="As told by Aussie, the Meme creator/artist of Spankmas"
    >
      <div className="relative rounded-2xl border border-red-500/30 bg-gradient-to-b from-red-900/80 to-red-950/80 p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
        <div className="relative space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-4xl font-black bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
              The Origin of Spankmas
            </h3>
          </div>
          
          <div className="space-y-4 text-lg leading-relaxed text-red-50">
            <p>
              As the Meme creator/artist of Spankmas, Aussie wanted to create a Christmas OG meme never done before that actually means something! Something that is rooted in real folklore of Christmas, but twisted with modern crypto humour.
            </p>

            <p>
              While "Spankmas" is a new creation, it draws inspiration from genuine ancient European winter traditions where figures like Krampus and Saint Nicholas's companions used decorated rods or switches as symbolic, light-hearted "punishment" to nudge people back onto the right path.
            </p>

            <div className="my-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-800 to-green-800 px-4 py-2">
                <TreePine className="h-5 w-5 text-green-300" />
                <span className="text-sm font-bold text-white">Ancient Roots</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-800 to-red-800 px-4 py-2">
                <Snowflake className="h-5 w-5 text-blue-300" />
                <span className="text-sm font-bold text-white">Modern Twist</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-800 to-yellow-800 px-4 py-2">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-bold text-white">Crypto Humor</span>
              </div>
            </div>

            <p>
              Spankmas takes that spirit and brings it on-chain: a cheeky, flirty, butt-spanking wink to say "Merry Christmas" to the entire crypto space. It's here to unite degens and dreamers under one banner of laughter, a little kink, a lot of cheekiness, and a new holiday greeting for the culture.
            </p>

            <div className="mt-10 rounded-2xl bg-gradient-to-r from-red-800/30 to-green-800/30 p-6">
              <p className="text-xl font-black italic text-white text-center">
                "Merry Spankmas Everyone"
              </p>
              <p className="mt-4 text-sm font-bold text-red-200 text-center">- Team Spankmas 🫶🏼🤣</p>
            </div>
          </div>
        </div>
      </div>
    </GlitterySection>
  );
}

/* ===================== MODERN HERO SECTION ===================== */

function HeroSection() {
  const [copied, setCopied] = useState(false);

  const copyCA = async () => {
    try {
      await navigator.clipboard.writeText(CA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <header className="relative min-h-screen px-4 pt-24 overflow-hidden">
      {/* Grid Background */}
      <GridBackground />
      
      {/* Canvas Snow - only in hero */}
      <SnowCanvas />
      
      <div className="relative mx-auto max-w-6xl z-30">
        {/* Hero Content */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            {/* Animated Glow Text */}
            <div className="inline-block mb-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/20 px-4 py-2 text-sm font-bold text-red-100">
                <Compass className="h-5 w-5" />
                North Pole HQ • Est. 2025
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              <div className="text-white mb-2">Welcome to</div>
              <div className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent">
                {BRAND.name}
              </div>
            </h1>
            
            <p className="text-lg sm:text-xl text-red-100 mb-8 max-w-xl mx-auto lg:mx-0">
              Where ancient Christmas folklore meets modern crypto humour.
              <span className="block font-bold text-yellow-200 mt-2">{BRAND.tagline}</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <Button href={LINKS.tg} className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800">
                Join Telegram <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" href={LINKS.x} className="bg-white/10 text-white hover:bg-white/20 border-white/20">
                X Community <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Contract Address */}
            <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 rounded-xl p-4 backdrop-blur-sm border border-red-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="text-sm font-bold text-red-200">Contract Address</div>
                <div className="font-mono text-xs text-white bg-red-900/50 p-2 rounded-lg truncate flex-1">
                  {CA}
                </div>
                <button
                  onClick={copyCA}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-600/30 px-4 py-2 text-sm font-bold text-white hover:bg-red-600/40"
                  type="button"
                >
                  {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>
          
          {/* Hero Card */}
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-r from-red-600/20 to-yellow-600/20 blur-2xl"></div>
            <div className="rounded-2xl border border-red-500/30 bg-white/95 p-6 backdrop-blur-md shadow-2xl">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                  <Rocket className="h-4 w-4" />
                  Live on Solana
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-bold text-zinc-700">
                  <Snowflake className="h-4 w-4 text-blue-500" />
                  Festive AF
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-lg border border-zinc-200 bg-white p-4">
                  <div className="text-xs font-bold text-zinc-600">Ancient Roots</div>
                  <div className="mt-1 text-sm font-bold text-zinc-900">Real Christmas Folklore</div>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white p-4">
                  <div className="text-xs font-bold text-zinc-600">Modern Crypto</div>
                  <div className="mt-1 text-sm font-bold text-zinc-900">Cheeky & Flirty</div>
                </div>
              </div>
              
              <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                <div className="text-xs font-bold text-red-700">Community Note</div>
                <div className="mt-1 text-sm font-bold text-zinc-900">
                  Uniting degens & dreamers under laughter and cheekiness.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="animate-bounce text-white">
          <ArrowRight className="h-6 w-6 rotate-90" />
        </div>
      </div>
    </header>
  );
}

/* ===================== MAIN APP ===================== */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div id="top" className="min-h-screen bg-white text-zinc-900 relative overflow-x-hidden">
      <Nav open={menuOpen} setOpen={setMenuOpen} />
      <MobileMenu open={menuOpen} setOpen={setMenuOpen} />
      
      {/* HERO SECTION */}
      <HeroSection />
      
      {/* LORE SECTION */}
      <RealSpankmasLore />
      
      {/* TOKENOMICS SECTION */}
      <GlitterySection
        id="tokenomics"
        kicker="Token"
        title="Spankmas Tokenomics"
        subtitle="Simple, transparent, and designed for the community"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-red-300/20 bg-white/95 p-6 backdrop-blur-sm">
            <div className="text-xs font-bold text-zinc-600">Token Details</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-xs font-bold text-zinc-500">Network</div>
                <div className="mt-1 text-sm font-bold text-zinc-900">Solana</div>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-xs font-bold text-zinc-500">Ticker</div>
                <div className="mt-1 text-sm font-bold text-zinc-900">SPANKMAS</div>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-xs font-bold text-zinc-500">Supply</div>
                <div className="mt-1 text-sm font-bold text-zinc-900">1,000,000,000</div>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-xs font-bold text-zinc-500">Tax</div>
                <div className="mt-1 text-sm font-bold text-zinc-900">0 / 0</div>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border border-red-500/30 bg-gradient-to-br from-red-900/50 to-red-800/50 p-6 backdrop-blur-sm">
            <div className="text-xs font-bold text-red-200">Quick Actions</div>
            <div className="mt-4 space-y-3">
              <button
                type="button"
                className="w-full inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-600/30 px-4 py-3 text-sm font-bold text-white hover:bg-red-600/40"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(CA);
                  } catch (err) {
                    console.error('Failed to copy:', err);
                  }
                }}
              >
                <Copy className="h-4 w-4" />
                Copy Contract Address
              </button>
              <Button variant="ghost" href={LINKS.tg} className="w-full bg-white/10 text-white hover:bg-white/20 border-white/20">
                Join Telegram <ArrowRight className="h-4 w-4" />
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
        subtitle="Live price, volume, liquidity, and market metrics"
      >
        <DexScreenerStats />
      </GlitterySection>
      
      {/* MEMES SECTION */}
      <GlitterySection
        id="memes"
        kicker="Media Gallery"
        title="Spankmas Memes & Videos"
        subtitle="The hottest Spankmas content from the community"
      >
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 p-2">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white">Meme Gallery</h3>
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
        <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-900/50 to-red-800/50 p-6 shadow-xl backdrop-blur-sm">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="text-2xl font-black text-white">
                {BRAND.name} is more than a token - it's a cultural movement.
              </div>
              <p className="mt-2 text-red-100">
                Join thousands of degens and dreamers embracing the cheeky, flirty spirit of Christmas. 
                Be part of the revolution that's bringing ancient folklore to the blockchain with a wink and a smile.
              </p>
              
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button href={LINKS.tg}>
                  Join Telegram <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" href={LINKS.x} className="bg-white/10 text-white hover:bg-white/20 border-white/20">
                  X Community <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="rounded-xl border border-red-500/30 bg-red-900/30 p-4">
              <div className="text-xs font-bold text-red-200">Quick Links</div>
              <div className="mt-4 space-y-2">
                <a
                  href="#memes"
                  className="block w-full rounded-lg border border-red-500/30 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/20 text-center"
                >
                  View Media Gallery
                </a>
                <a
                  href="#chart"
                  className="block w-full rounded-lg border border-red-500/30 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/20 text-center"
                >
                  View Live Chart
                </a>
              </div>
            </div>
          </div>
        </div>
      </GlitterySection>
      
      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-red-950 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 rounded-xl overflow-hidden bg-gradient-to-br from-red-600 to-green-600">
                  <img 
                    src={LOGO_URL}
                    alt="Spankmas Logo" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-sm font-black text-white">{BRAND.name}</div>
              </div>
              <div className="mt-1 text-xs text-red-300">© {new Date().getFullYear()} — The OG Christmas Meme Token</div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={LINKS.tg}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20"
              >
                Telegram
              </a>
              <a
                href={LINKS.x}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20"
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
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20"
                type="button"
              >
                Copy CA
              </button>
            </div>
          </div>
          
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs font-bold text-red-300">Contract Address</div>
            <div className="mt-2 break-all font-mono text-xs text-white">{CA}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
