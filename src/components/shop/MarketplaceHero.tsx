import React from 'react';
import { Radio, Gavel, Store, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface MarketplaceHeroProps {
  onExploreLive: () => void;
  onExploreAuctions: () => void;
  onOpenSellerRegistration: () => void;
}

export const MarketplaceHero: React.FC<MarketplaceHeroProps> = ({
  onExploreLive,
  onExploreAuctions,
  onOpenSellerRegistration
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#291309] via-[#140b07] to-[#072418] border-b border-amber-900/50 shadow-2xl">
      {/* Background Graphic Overlay with warm ambient gradient */}
      <div className="absolute inset-0 z-0 opacity-30 mix-blend-luminosity">
        <img
          src="/src/assets/images/hero_kenyaone_marketplace_1794002334625.jpg"
          alt="Authentic Kenyan Crafts and Commerce Atelier"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#170e0a] via-[#120a07]/90 to-[#072418]/80" />
      </div>

      {/* Decorative Warm Ambient Glow Spheres */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-700/60 text-amber-300 text-xs font-semibold mb-4 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Kenya's Native Live Commerce, Farm Direct & Real-Time Auctions</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight mb-3">
            KENYAONE SHOP
          </h1>
          <p className="font-display text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent tracking-wide mb-4">
            BUY. SELL. CONNECT.
          </p>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed mb-6">
            Discover single-origin Mount Kenya AA coffee, authentic Maasai beadwork, Tabaka soapstone art, Kitenge apparel, and fresh farm harvests directly from verified makers across all 47 Kenyan counties.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button
              onClick={onExploreLive}
              className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg transition-all group active:scale-95"
            >
              <Radio className="w-4 h-4 text-white animate-pulse" />
              <span>Watch Live Drops</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onExploreAuctions}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg transition-all group active:scale-95"
            >
              <Gavel className="w-4 h-4 text-stone-950" />
              <span>KenyaOne Rapid Auctions</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onOpenSellerRegistration}
              className="flex items-center gap-2 bg-[#1f1612] hover:bg-[#2c201a] text-stone-200 border border-amber-900/40 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Open Your Shop</span>
            </button>
          </div>
        </div>

        {/* Live Marketplace Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-stone-800/80 text-stone-300">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <div className="text-xs">
              <span className="font-semibold text-white block">Real-Time Video</span>
              <span className="text-stone-400">Live Drops & In-Stream Buys</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="text-xs">
              <span className="font-semibold text-white block">Rapid Auctions</span>
              <span className="text-stone-400">Anti-Sniping Engine Guaranteed</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div className="text-xs">
              <span className="font-semibold text-white block">Lipa na M-Pesa</span>
              <span className="text-stone-400">Instant STK & Verified Receipts</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-teal-400" />
            <div className="text-xs">
              <span className="font-semibold text-white block">Global Export Ready</span>
              <span className="text-stone-400">KEPHIS & KEBS Certified Goods</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
