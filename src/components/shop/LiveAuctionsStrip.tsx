import React, { useState, useEffect } from 'react';
import { Gavel, Clock, ShieldAlert, Award, ChevronRight, Zap, Flame } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { formatCurrency, formatAuctionCountdown } from '../../utils/formatters';
import { Auction } from '../../types';

interface LiveAuctionsStripProps {
  onGoToAuctions?: () => void;
}

export const LiveAuctionsStrip: React.FC<LiveAuctionsStripProps> = ({ onGoToAuctions }) => {
  const { auctions, currency, placeBid, user } = useCommerce();
  const [bidStatus, setBidStatus] = useState<{ [id: string]: string }>({});
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 250);
    return () => clearInterval(timer);
  }, []);

  const activeAuctions = auctions.filter(a => a.status === 'active');

  const handleQuickBid = (auction: Auction) => {
    const nextBid = auction.currentBidKes + auction.minIncrementKes;
    const res = placeBid(auction.id, nextBid);
    setBidStatus(prev => ({ ...prev, [auction.id]: res.message }));
    setTimeout(() => {
      setBidStatus(prev => {
        const copy = { ...prev };
        delete copy[auction.id];
        return copy;
      });
    }, 4000);
  };

  if (activeAuctions.length === 0) return null;

  return (
    <section className="py-8 bg-stone-900 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800/80 flex items-center justify-center text-amber-400">
              <Gavel className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold text-white tracking-tight">
                  KenyaOne Live Auctions
                </h2>
                <span className="bg-amber-500 text-stone-950 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-stone-950" />
                  KenyaOne Rapid Bidding
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Verified Kenyan collector artifacts · Server-side atomic validation · 15s anti-sniping protection
              </p>
            </div>
          </div>

          {onGoToAuctions && (
            <button
              onClick={onGoToAuctions}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
            >
              <span>Auction Arena</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Auction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {activeAuctions.map(auction => {
            const msRemaining = Math.max(0, auction.endTime - now);
            const totalSec = Math.floor(msRemaining / 1000);
            const isCritical = msRemaining > 0 && totalSec < 15;
            const isUrgent = msRemaining > 0 && totalSec < 60;
            const isEnded = msRemaining <= 0;
            const { text: timeText } = formatAuctionCountdown(msRemaining);
            const statusMsg = bidStatus[auction.id];

            return (
              <div
                key={auction.id}
                className={`bg-stone-950 border rounded-xl p-5 shadow-lg relative overflow-hidden flex flex-col sm:flex-row gap-5 transition-all ${
                  isCritical 
                    ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.25)] ring-1 ring-rose-500/50' 
                    : isUrgent 
                    ? 'border-amber-500/80' 
                    : 'border-stone-800 hover:border-amber-700/60'
                }`}
              >
                {/* Product Image Thumbnail */}
                <div className="sm:w-44 h-44 rounded-lg bg-stone-900 overflow-hidden relative shrink-0">
                  <img
                    src={auction.productImage}
                    alt={auction.productTitle}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {auction.reserveMet && (
                    <div className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                      Reserve Met
                    </div>
                  )}
                  {isCritical && (
                    <div className="absolute bottom-2 left-2 bg-rose-950/90 border border-rose-500 text-rose-200 text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm flex items-center gap-1 animate-pulse">
                      <Zap className="w-3 h-3 fill-rose-400" />
                      <span>Snipe Zone</span>
                    </div>
                  )}
                </div>

                {/* Auction Info & Bidding Station */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs text-stone-400 truncate">
                        {auction.storeName}
                      </span>
                      
                      {/* Live Countdown Badge */}
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold ${
                        isEnded
                          ? 'bg-stone-800 text-stone-500 border border-stone-700'
                          : isCritical
                          ? 'bg-rose-950 text-rose-300 border border-rose-700 animate-pulse'
                          : isUrgent 
                          ? 'bg-amber-950 text-amber-400 border border-amber-800' 
                          : 'bg-stone-800 text-amber-400 border border-stone-700'
                      }`}>
                        {isCritical ? (
                          <Flame className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        <span>{isEnded ? 'CONCLUDED' : timeText}</span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-white text-base leading-snug line-clamp-2 mb-3">
                      {auction.productTitle}
                    </h3>

                    {/* Price & Current Bidder */}
                    <div className="bg-stone-900/90 rounded-lg p-3 border border-stone-800/80 mb-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[11px] text-stone-400 block uppercase tracking-wider">
                            Current High Bid
                          </span>
                          <span className="text-xl font-bold font-mono text-emerald-400">
                            {formatCurrency(auction.currentBidKes, currency)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-stone-400 block">
                            {auction.bidCount} bids placed
                          </span>
                          {auction.highestBidder ? (
                            <span className="text-xs text-stone-300 font-medium">
                              By {auction.highestBidder.userName} ({auction.highestBidder.county})
                            </span>
                          ) : (
                            <span className="text-xs text-stone-500">No bids yet</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Feedback */}
                  <div>
                    {statusMsg && (
                      <div className="text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded mb-2 font-medium">
                        {statusMsg}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuickBid(auction)}
                        className="flex-1 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
                      >
                        <Gavel className="w-4 h-4 text-stone-950" />
                        <span>
                          Quick Bid: {formatCurrency(auction.currentBidKes + auction.minIncrementKes, currency)}
                        </span>
                      </button>

                      {onGoToAuctions && (
                        <button
                          onClick={onGoToAuctions}
                          className="py-2 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700"
                        >
                          Custom Bid
                        </button>
                      )}
                    </div>

                    <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between">
                      <span>Min increment: KES {auction.minIncrementKes.toLocaleString()}</span>
                      {auction.antiSnipeExtensionCount > 0 && (
                        <span className="text-amber-500 font-medium">
                          +{auction.antiSnipeExtensionCount * 15}s anti-snipe extended
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
