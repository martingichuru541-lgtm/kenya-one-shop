import React, { useState, useEffect } from 'react';
import { 
  Gavel, 
  Clock, 
  ShieldCheck, 
  Award, 
  Users, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp,
  History,
  Info,
  Zap,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { formatCurrency, formatAuctionCountdown } from '../../utils/formatters';
import { Auction } from '../../types';

interface AuctionsArenaProps {
  onWinAuctionCheckout: (auction: Auction) => void;
  onOpenStore: (slug: string) => void;
}

export const AuctionsArena: React.FC<AuctionsArenaProps> = ({
  onWinAuctionCheckout,
  onOpenStore
}) => {
  const { auctions, currency, placeBid, user, createAuction, products, stores } = useCommerce();
  
  const [selectedAuctionId, setSelectedAuctionId] = useState<string>(
    auctions.find(a => a.status === 'active')?.id || auctions[0]?.id || ''
  );
  const [customBidAmount, setCustomBidAmount] = useState<string>('');
  const [bidNotification, setBidNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [now, setNow] = useState<number>(Date.now());

  // High-frequency live ticker for real-time countdown urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 150);
    return () => clearInterval(timer);
  }, []);

  // New auction form state
  const [newAuctionProductId, setNewAuctionProductId] = useState(products[0]?.id || '');
  const [newAuctionStartPrice, setNewAuctionStartPrice] = useState('2000');
  const [newAuctionMinIncrement, setNewAuctionMinIncrement] = useState('200');
  const [newAuctionReserve, setNewAuctionReserve] = useState('3000');
  const [newAuctionDurationMinutes, setNewAuctionDurationMinutes] = useState('5');

  const selectedAuction = auctions.find(a => a.id === selectedAuctionId) || auctions[0];

  const handlePlaceBid = (amountKes: number) => {
    if (!selectedAuction) return;
    const res = placeBid(selectedAuction.id, amountKes);
    if (res.success) {
      setBidNotification({ type: 'success', message: res.message });
      setCustomBidAmount('');
    } else {
      setBidNotification({ type: 'error', message: res.message });
    }

    setTimeout(() => setBidNotification(null), 5000);
  };

  const handleCustomBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customBidAmount, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setBidNotification({ type: 'error', message: 'Please enter a valid bid amount in KES.' });
      return;
    }
    handlePlaceBid(parsed);
  };

  const handleCreateNewAuction = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === newAuctionProductId);
    if (!prod) return;

    const startPrice = parseInt(newAuctionStartPrice, 10) || 1000;
    const minInc = parseInt(newAuctionMinIncrement, 10) || 100;
    const reserve = parseInt(newAuctionReserve, 10) || startPrice;
    const durationMs = (parseInt(newAuctionDurationMinutes, 10) || 5) * 60 * 1000;

    createAuction({
      productId: prod.id,
      productTitle: prod.title,
      productImage: prod.images[0],
      storeId: prod.storeId,
      storeName: prod.storeName,
      startingPriceKes: startPrice,
      currentBidKes: startPrice,
      minIncrementKes: minInc,
      reservePriceKes: reserve,
      status: 'active',
      startTime: new Date().toISOString(),
      endTime: Date.now() + durationMs
    });

    setShowScheduleModal(false);
  };

  if (!selectedAuction) {
    return (
      <div className="py-20 text-center text-stone-400 bg-stone-950">
        <Gavel className="w-10 h-10 mx-auto mb-3 text-stone-600" />
        <h3 className="text-lg font-bold text-white">No active auctions at this moment</h3>
      </div>
    );
  }

  // Dynamic live countdown calculation driven by 'now' state
  const msRemaining = Math.max(0, selectedAuction.endTime - now);
  const totalSeconds = Math.floor(msRemaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((msRemaining % 1000) / 100);

  const isEnded = msRemaining <= 0;
  const isCritical = !isEnded && totalSeconds < 15;
  const isUrgent = !isEnded && totalSeconds < 60;
  const isWarning = !isEnded && totalSeconds < 180;

  // Approximate duration for progress bar percentage
  const totalDurationMs = Math.max(
    60000,
    selectedAuction.startTime 
      ? selectedAuction.endTime - new Date(selectedAuction.startTime).getTime() 
      : 300000
  );
  const progressPercent = isEnded ? 0 : Math.min(100, Math.max(0, (msRemaining / totalDurationMs) * 100));

  const { text: timeText } = formatAuctionCountdown(msRemaining);
  const minRequiredBid = selectedAuction.currentBidKes + selectedAuction.minIncrementKes;
  const isUserWinning = selectedAuction.highestBidder?.userId === user.id;

  return (
    <div className="py-10 bg-stone-950 text-stone-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/80 text-amber-300 text-xs font-semibold mb-2">
              <Gavel className="w-3.5 h-3.5" />
              <span>KenyaOne Live Auction Arena</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Real-Time Kenyan Heritage & Rare Drops
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Atomic bid validation · Instant outbid alerts · Anti-sniping protection guarantee
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'seller' && (
              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs rounded-lg shadow-md transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-stone-950" />
                <span>Launch New Auction</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Grid: Left Featured Live Auction + Right Auction Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Stage (2 Columns) */}
          <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              {/* Status Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-400">Seller:</span>
                  <button
                    onClick={() => onOpenStore(selectedAuction.storeId)}
                    className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>{selectedAuction.storeName}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-950" />
                  </button>
                </div>

                {/* Quick Status Pill */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                    isEnded 
                      ? 'bg-stone-800 text-stone-400 border border-stone-700' 
                      : isCritical 
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-800 animate-pulse' 
                      : isUrgent 
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-800' 
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      isEnded ? 'bg-stone-500' : isCritical ? 'bg-rose-500 animate-ping' : isUrgent ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                    }`} />
                    <span>
                      {isEnded ? 'Auction Ended' : isCritical ? 'Closing Zone' : isUrgent ? 'Final Minute' : 'Active Auction'}
                    </span>
                  </span>
                </div>
              </div>

              {/* HIGH-IMPACT VISUAL COUNTDOWN TIMER ENGINE */}
              <div className={`mb-6 rounded-2xl border p-4 sm:p-5 transition-all duration-300 relative overflow-hidden ${
                isEnded 
                  ? 'bg-stone-950/90 border-stone-800' 
                  : isCritical 
                  ? 'bg-gradient-to-br from-rose-950/95 via-stone-950 to-red-950/90 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)] ring-1 ring-rose-500/50' 
                  : isUrgent 
                  ? 'bg-gradient-to-br from-amber-950/90 via-stone-950 to-orange-950/80 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.2)]' 
                  : 'bg-gradient-to-br from-stone-950/90 via-stone-900/60 to-stone-950/90 border-stone-800 shadow-md'
              }`}>
                {/* Background ambient pulse when critical */}
                {isCritical && (
                  <div className="absolute inset-0 bg-rose-600/5 animate-pulse pointer-events-none" />
                )}

                {/* Urgency Status Title & Anti-Snipe Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      {!isEnded && (
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          isCritical ? 'bg-rose-400' : isUrgent ? 'bg-amber-400' : 'bg-emerald-400'
                        }`} />
                      )}
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${
                        isEnded ? 'bg-stone-600' : isCritical ? 'bg-rose-500' : isUrgent ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                    </span>
                    <span className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                      isEnded 
                        ? 'text-stone-400' 
                        : isCritical 
                        ? 'text-rose-400 animate-pulse' 
                        : isUrgent 
                        ? 'text-amber-400' 
                        : 'text-emerald-400'
                    }`}>
                      {isEnded ? (
                        <span>Auction Concluded</span>
                      ) : isCritical ? (
                        <>
                          <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
                          <span>CRITICAL CLOSING ZONE — ANTI-SNIPE ACTIVE</span>
                        </>
                      ) : isUrgent ? (
                        <>
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          <span>FINAL MINUTE RUSH — PLACE YOUR BID</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          <span>LIVE RAPID AUCTION COUNTDOWN</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedAuction.antiSnipeExtensionCount > 0 && !isEnded && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                        <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>+{selectedAuction.antiSnipeExtensionCount * 15}s Anti-Snipe Extended</span>
                      </span>
                    )}
                    <span className="text-[11px] text-stone-400 hidden sm:inline">
                      {isEnded ? 'Winning lot finalized' : isCritical ? 'Any bid adds +15s to clock' : 'Anti-Snipe: 15s Soft Close'}
                    </span>
                  </div>
                </div>

                {/* Digital Time Flip Cards Display */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 py-2 relative z-10 font-mono">
                  {/* Hours Block (if > 0) */}
                  {hours > 0 && (
                    <>
                      <div className="flex flex-col items-center">
                        <div className="bg-stone-900/90 border border-stone-700/80 rounded-xl px-3.5 py-2 text-2xl sm:text-3xl font-extrabold text-white tracking-wider shadow-inner min-w-[56px] text-center">
                          {String(hours).padStart(2, '0')}
                        </div>
                        <span className="text-[9px] font-semibold tracking-widest uppercase text-stone-400 mt-1">Hours</span>
                      </div>
                      <span className="text-xl sm:text-2xl font-bold text-stone-500 -mt-4">:</span>
                    </>
                  )}

                  {/* Minutes Block */}
                  <div className="flex flex-col items-center">
                    <div className={`border rounded-xl px-3.5 py-2 text-2xl sm:text-3xl font-extrabold tracking-wider shadow-inner min-w-[56px] text-center transition-colors ${
                      isEnded
                        ? 'bg-stone-900 border-stone-800 text-stone-500'
                        : isCritical
                        ? 'bg-rose-950/80 border-rose-500 text-rose-100'
                        : isUrgent
                        ? 'bg-amber-950/70 border-amber-500 text-amber-200'
                        : 'bg-stone-900 border-stone-700/80 text-white'
                    }`}>
                      {String(minutes).padStart(2, '0')}
                    </div>
                    <span className="text-[9px] font-semibold tracking-widest uppercase text-stone-400 mt-1">Mins</span>
                  </div>

                  <span className={`text-xl sm:text-2xl font-bold -mt-4 ${
                    isCritical ? 'text-rose-500 animate-pulse' : 'text-stone-500'
                  }`}>:</span>

                  {/* Seconds Block */}
                  <div className="flex flex-col items-center">
                    <div className={`border rounded-xl px-3.5 py-2 text-2xl sm:text-3xl font-extrabold tracking-wider shadow-inner min-w-[56px] text-center transition-all ${
                      isEnded
                        ? 'bg-stone-900 border-stone-800 text-stone-500'
                        : isCritical
                        ? 'bg-rose-900/90 border-rose-400 text-white scale-105 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                        : isUrgent
                        ? 'bg-amber-900/70 border-amber-400 text-white'
                        : 'bg-stone-900 border-stone-700/80 text-white'
                    }`}>
                      {String(seconds).padStart(2, '0')}
                    </div>
                    <span className={`text-[9px] font-semibold tracking-widest uppercase mt-1 ${
                      isCritical ? 'text-rose-400 font-bold' : 'text-stone-400'
                    }`}>Secs</span>
                  </div>

                  {/* Sub-Seconds / Tenths (when in Critical Zone < 15s) */}
                  {isCritical && !isEnded && (
                    <>
                      <span className="text-xl sm:text-2xl font-bold text-rose-500 -mt-4">.</span>
                      <div className="flex flex-col items-center">
                        <div className="bg-rose-950 border border-rose-500 rounded-xl px-2.5 py-2 text-xl sm:text-2xl font-extrabold text-rose-400 tracking-wider shadow-inner min-w-[42px] text-center">
                          {tenths}
                        </div>
                        <span className="text-[9px] font-semibold tracking-widest uppercase text-rose-400 mt-1">MS</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Animated Urgency Progress Bar */}
                <div className="mt-3 pt-3 border-t border-stone-800/80 relative z-10">
                  <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
                    <span className="text-stone-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      <span>{isEnded ? 'Auction Concluded' : `${Math.round(progressPercent)}% Time Left`}</span>
                    </span>
                    <span className={`font-mono text-xs font-bold ${
                      isEnded ? 'text-stone-500' : isCritical ? 'text-rose-400 animate-pulse' : isUrgent ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {timeText}
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-stone-950 rounded-full overflow-hidden border border-stone-800 relative">
                    <div 
                      className={`h-full rounded-full transition-all duration-150 relative ${
                        isEnded
                          ? 'bg-stone-800'
                          : isCritical
                          ? 'bg-gradient-to-r from-rose-600 via-red-500 to-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.9)]'
                          : isUrgent
                          ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400'
                          : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    >
                      {!isEnded && (
                        <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/90 rounded-full shadow-[0_0_8px_white]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Anti-snipe notice banner in Critical state */}
                {isCritical && !isEnded && (
                  <div className="mt-3 p-2 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-200 text-xs font-semibold flex items-center justify-between gap-2 relative z-10">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0 animate-bounce" />
                      <span>Bids placed now automatically extend the timer by +15 seconds!</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-rose-900/80 px-2 py-0.5 rounded text-rose-300 shrink-0">
                      Soft Close On
                    </span>
                  </div>
                )}
              </div>

              {/* Auction Item Hero View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="relative aspect-square rounded-xl bg-stone-950 overflow-hidden border border-stone-800">
                  <img
                    src={selectedAuction.productImage}
                    alt={selectedAuction.productTitle}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Floating Live Countdown Badge on Image */}
                  <div className={`absolute top-3 right-3 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg border ${
                    isEnded 
                      ? 'bg-stone-900/90 text-stone-400 border-stone-700' 
                      : isCritical 
                      ? 'bg-rose-950/95 text-rose-200 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse' 
                      : isUrgent 
                      ? 'bg-amber-950/90 text-amber-200 border-amber-500' 
                      : 'bg-stone-950/90 text-emerald-400 border-stone-700'
                  }`}>
                    {isCritical ? (
                      <Flame className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    <span>{isEnded ? 'CONCLUDED' : timeText}</span>
                  </div>

                  {selectedAuction.reserveMet && (
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow">
                      Reserve Price Met
                    </div>
                  )}
                  {selectedAuction.antiSnipeExtensionCount > 0 && (
                    <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-amber-400 text-[11px] font-semibold px-2 py-1 rounded border border-amber-500/40 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>Anti-Snipe: +{selectedAuction.antiSnipeExtensionCount * 15}s Extended</span>
                    </div>
                  )}
                </div>

                {/* Bid Dashboard Information */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-white mb-3 leading-snug">
                      {selectedAuction.productTitle}
                    </h2>

                    {/* Current Bid Card */}
                    <div className="bg-stone-950 rounded-xl p-4 border border-stone-800 mb-4">
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                          Current Highest Bid
                        </span>
                        <span className="text-xs text-stone-400">
                          {selectedAuction.bidCount} bids placed
                        </span>
                      </div>

                      <div className="font-mono text-3xl font-extrabold text-emerald-400 mb-2">
                        {formatCurrency(selectedAuction.currentBidKes, currency)}
                      </div>

                      <div className="text-xs text-stone-300 flex items-center justify-between pt-2 border-t border-stone-800/80">
                        <span>Leading Bidder:</span>
                        {selectedAuction.highestBidder ? (
                          <span className={`font-semibold ${isUserWinning ? 'text-emerald-400' : 'text-amber-300'}`}>
                            {selectedAuction.highestBidder.userName} ({selectedAuction.highestBidder.county})
                            {isUserWinning && ' · (YOU)'}
                          </span>
                        ) : (
                          <span className="text-stone-500">No bids submitted yet</span>
                        )}
                      </div>
                    </div>

                    {/* Terms & Integrity Guarantee */}
                    <div className="space-y-1.5 text-xs text-stone-400 mb-4">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Minimum bid increment: KES {selectedAuction.minIncrementKes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Starting bid was KES {selectedAuction.startingPriceKes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Anti-Sniping: Bids placed in final 15s extend timer by 15s.</span>
                      </div>
                    </div>
                  </div>

                  {/* Winning State Alert (if ended) */}
                  {isEnded && (
                    <div className="p-4 rounded-xl bg-amber-950/80 border border-amber-700/80 mb-4">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-1">
                        <Award className="w-5 h-5 text-amber-400" />
                        <span>AUCTION COMPLETED</span>
                      </div>
                      <p className="text-xs text-stone-300">
                        {selectedAuction.highestBidder
                          ? `Winning Bid: KES ${selectedAuction.currentBidKes.toLocaleString()} by ${selectedAuction.highestBidder.userName}`
                          : 'No bids met the reserve.'}
                      </p>
                      {isUserWinning && (
                        <button
                          onClick={() => onWinAuctionCheckout(selectedAuction)}
                          className="mt-3 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-lg flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                          <span>Complete M-Pesa Checkout for Your Winning Bid</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bidding Control Panel */}
            {!isEnded && (
              <div className="bg-stone-950 rounded-xl p-5 border border-stone-800">
                {/* Critical Zone Alert Banner */}
                {isCritical && (
                  <div className="mb-4 p-2.5 rounded-lg bg-rose-950/80 border border-rose-600/80 text-rose-200 text-xs font-semibold flex items-center justify-between shadow-sm animate-pulse">
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0" />
                      <span>Closing soon! Bids placed now extend timer by +15 seconds.</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-rose-900 px-2 py-0.5 rounded text-white font-bold shrink-0">
                      ⚡ Soft Close
                    </span>
                  </div>
                )}

                {/* Outbid Alert / Notification */}
                {bidNotification && (
                  <div className={`mb-4 p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                    bidNotification.type === 'success'
                      ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/80 border border-rose-800 text-rose-300'
                  }`}>
                    {bidNotification.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{bidNotification.message}</span>
                  </div>
                )}

                {/* You are winning banner */}
                {isUserWinning && !bidNotification && (
                  <div className="mb-4 p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-800/60 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>You are currently the highest bidder! Keep watching for outbids.</span>
                  </div>
                )}

                {/* Rapid Preset Increments */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[200, 500, 1000].map(inc => {
                    const target = selectedAuction.currentBidKes + inc;
                    return (
                      <button
                        key={inc}
                        onClick={() => handlePlaceBid(target)}
                        className="py-2.5 px-3 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 font-bold text-xs flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 shadow"
                      >
                        <span className="text-amber-400 font-mono">+{formatCurrency(inc, currency)}</span>
                        <span className="text-[10px] text-stone-400 font-normal">
                          Total: {formatCurrency(target, currency)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Bid Input */}
                <form onSubmit={handleCustomBidSubmit} className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-mono text-xs">
                      KES
                    </span>
                    <input
                      type="number"
                      min={minRequiredBid}
                      step={selectedAuction.minIncrementKes}
                      value={customBidAmount}
                      onChange={(e) => setCustomBidAmount(e.target.value)}
                      placeholder={`Min bid: ${minRequiredBid.toLocaleString()}`}
                      className="w-full pl-12 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-lg text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
                  >
                    <Gavel className="w-4 h-4 text-stone-950" />
                    <span>Place Bid</span>
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right Column: Other Live & Upcoming Auctions Queue */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 flex items-center justify-between">
              <span>All Scheduled Auctions ({auctions.length})</span>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            </h3>

            {auctions.map(auc => {
              const isSelected = auc.id === selectedAuction.id;
              const qMs = Math.max(0, auc.endTime - now);
              const qSec = Math.floor(qMs / 1000);
              const qIsEnded = qMs <= 0;
              const qIsCritical = !qIsEnded && qSec < 15;
              const qIsUrgent = !qIsEnded && qSec < 60;
              const { text: qTime } = formatAuctionCountdown(qMs);

              return (
                <div
                  key={auc.id}
                  onClick={() => setSelectedAuctionId(auc.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-stone-900 border-amber-500/80 shadow-md ring-1 ring-amber-500/40'
                      : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg bg-stone-900 overflow-hidden shrink-0 border border-stone-800 relative">
                      <img src={auc.productImage} alt="" className="w-full h-full object-cover" />
                      {qIsCritical && (
                        <div className="absolute inset-0 bg-rose-600/20 animate-pulse pointer-events-none" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                        <span className="truncate">{auc.storeName}</span>
                        <span className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                          qIsEnded
                            ? 'bg-stone-800 text-stone-500'
                            : qIsCritical
                            ? 'bg-rose-950 text-rose-300 border border-rose-700 animate-pulse'
                            : qIsUrgent
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'text-amber-400 font-semibold'
                        }`}>
                          {qIsEnded ? 'ENDED' : qTime}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-white truncate mb-1">
                        {auc.productTitle}
                      </h4>

                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-emerald-400">
                          {formatCurrency(auc.currentBidKes, currency)}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {auc.bidCount} bids
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Seller Schedule Auction Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-white">Schedule Live Rapid Auction</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-stone-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateNewAuction} className="space-y-4 text-xs">
              <div>
                <label className="text-stone-300 block mb-1">Select Product to Auction</label>
                <select
                  value={newAuctionProductId}
                  onChange={(e) => setNewAuctionProductId(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.title} (Stock: {p.stock})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 block mb-1">Starting Price (KES)</label>
                  <input
                    type="number"
                    value={newAuctionStartPrice}
                    onChange={(e) => setNewAuctionStartPrice(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-stone-300 block mb-1">Min Increment (KES)</label>
                  <input
                    type="number"
                    value={newAuctionMinIncrement}
                    onChange={(e) => setNewAuctionMinIncrement(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 block mb-1">Reserve Price (KES)</label>
                  <input
                    type="number"
                    value={newAuctionReserve}
                    onChange={(e) => setNewAuctionReserve(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-stone-300 block mb-1">Duration (Minutes)</label>
                  <select
                    value={newAuctionDurationMinutes}
                    onChange={(e) => setNewAuctionDurationMinutes(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="2">2 Minutes (Rapid Flash)</option>
                    <option value="5">5 Minutes</option>
                    <option value="15">15 Minutes</option>
                    <option value="60">1 Hour</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg shadow"
                >
                  Start Live Auction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
