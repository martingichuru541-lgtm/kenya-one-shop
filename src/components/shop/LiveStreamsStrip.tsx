import React, { useState } from 'react';
import { 
  Radio, 
  Users, 
  Heart, 
  Play, 
  Sparkles, 
  ChevronRight, 
  MapPin, 
  Sprout, 
  Boxes, 
  Film, 
  Bell, 
  Check, 
  Share2, 
  Zap 
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { Livestream } from '../../types';
import { KENYA_COUNTIES } from '../../data/initialData';

interface LiveStreamsStripProps {
  onViewAll?: () => void;
}

export const LiveStreamsStrip: React.FC<LiveStreamsStripProps> = ({ onViewAll }) => {
  const { 
    livestreams, 
    openLivestream, 
    selectedCountyFilter, 
    setSelectedCountyFilter 
  } = useCommerce();

  const [activeTab, setActiveTab] = useState<'all' | 'farm' | 'wholesale' | 'counties' | 'replays'>('all');
  const [remindedStreamIds, setRemindedStreamIds] = useState<string[]>([]);

  // Filter streams based on active tab
  const activeStreams = livestreams.filter(l => {
    if (activeTab === 'farm') return l.isFarmLive && l.status === 'live';
    if (activeTab === 'wholesale') return l.isWholesaleLive && l.status === 'live';
    if (activeTab === 'counties') {
      if (!selectedCountyFilter) return l.status === 'live';
      return l.county === selectedCountyFilter && l.status === 'live';
    }
    if (activeTab === 'replays') return l.replayAvailable;
    return l.status === 'live';
  });

  const upcomingStreams = livestreams.filter(l => l.status === 'upcoming');

  const toggleReminder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRemindedStreamIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-8 bg-[#150f0c]/90 border-b border-[#2b1f18] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-950/90 border border-rose-800/80 flex items-center justify-center text-rose-500 shadow-md">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                  KenyaOne Live Commerce
                </h2>
                <span className="bg-gradient-to-r from-rose-600 to-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  Live Now
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Shared live shopping, Farm-direct broadcasts & B2B wholesale drops
              </p>
            </div>
          </div>

          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              <span>Explore All Shows</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Specialized Live Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-[#221712] text-stone-300 hover:text-white border border-[#38261e]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>All Live Drops</span>
          </button>

          <button
            onClick={() => setActiveTab('farm')}
            className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'farm'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-[#221712] text-stone-300 hover:text-emerald-400 border border-[#38261e]'
            }`}
          >
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span>🌱 Farm Live (Agri & Harvest)</span>
          </button>

          <button
            onClick={() => setActiveTab('wholesale')}
            className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'wholesale'
                ? 'bg-amber-600 text-stone-950 font-bold shadow-md'
                : 'bg-[#221712] text-stone-300 hover:text-amber-400 border border-[#38261e]'
            }`}
          >
            <Boxes className="w-3.5 h-3.5 text-amber-400" />
            <span>📦 Wholesale B2B Live</span>
          </button>

          <button
            onClick={() => setActiveTab('counties')}
            className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'counties'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-[#221712] text-stone-300 hover:text-teal-400 border border-[#38261e]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span>📍 Shop by 47 Counties</span>
          </button>

          <button
            onClick={() => setActiveTab('replays')}
            className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'replays'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-[#221712] text-stone-300 hover:text-purple-400 border border-[#38261e]'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-purple-400" />
            <span>🎬 Shoppable Replays</span>
          </button>
        </div>

        {/* 47-County Live Pill Selector Bar (When County Tab is active) */}
        {activeTab === 'counties' && (
          <div className="mb-6 p-3 bg-[#1e1410] border border-amber-900/40 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Select County to Discover Local Live Sellers
              </span>
              {selectedCountyFilter && (
                <button
                  onClick={() => setSelectedCountyFilter(null)}
                  className="text-[11px] text-stone-400 hover:text-white underline"
                >
                  Clear filter
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <button
                onClick={() => setSelectedCountyFilter(null)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  !selectedCountyFilter 
                    ? 'bg-amber-500 text-stone-950 font-bold' 
                    : 'bg-[#2c1d16] text-stone-300 hover:text-white'
                }`}
              >
                All Counties
              </button>
              {KENYA_COUNTIES.slice(0, 16).map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCountyFilter(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                    selectedCountyFilter === c 
                      ? 'bg-teal-500 text-stone-950 font-bold' 
                      : 'bg-[#2c1d16] text-stone-300 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Stream Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeStreams.map((stream: Livestream) => (
            <div
              key={stream.id}
              onClick={() => openLivestream(stream.id)}
              className="group relative bg-stone-900 border border-stone-800 hover:border-rose-700/60 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-rose-950/20 transition-all flex flex-col"
            >
              {/* Stream Thumbnail with Overlays */}
              <div className="relative aspect-[16/10] bg-stone-950 overflow-hidden">
                <img
                  src={stream.streamPoster}
                  alt={stream.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Measured Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-black/60" />

                {/* Top Overlay: LIVE Badge & Viewer Count */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <div className="bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded flex items-center gap-1.5 shadow">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>LIVE</span>
                  </div>

                  <div className="bg-black/70 backdrop-blur-md text-stone-200 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    <span>{stream.viewerCount.toLocaleString()} watching</span>
                  </div>
                </div>

                {/* Center Hover Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <div className="w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom Overlay inside image */}
                <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-xs text-white">
                  <span className="text-amber-400 font-semibold bg-stone-950/80 px-2 py-0.5 rounded backdrop-blur-sm">
                    {stream.category}
                  </span>
                  <div className="flex items-center gap-1 text-stone-300 bg-stone-950/80 px-2 py-0.5 rounded backdrop-blur-sm">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>{stream.likesCount}</span>
                  </div>
                </div>
              </div>

              {/* Stream Details Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={stream.sellerAvatar}
                      alt={stream.storeName}
                      className="w-7 h-7 rounded-full object-cover border border-stone-700"
                    />
                    <span className="text-xs font-medium text-stone-300 truncate">
                      {stream.storeName}
                    </span>
                  </div>

                  <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 group-hover:text-rose-400 transition-colors mb-1.5">
                    {stream.title}
                  </h3>

                  <p className="text-xs text-stone-400 line-clamp-2 mb-3">
                    {stream.description}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openLivestream(stream.id);
                  }}
                  className="w-full mt-2 py-2 px-3 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Join Live Shopping Room</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming scheduled streams */}
        {upcomingStreams.length > 0 && (
          <div className="mt-8 pt-6 border-t border-stone-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
              Upcoming Live Drops & Shows
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingStreams.map(stream => (
                <div key={stream.id} className="bg-stone-900 border border-stone-800/80 rounded-lg p-3 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-stone-800 overflow-hidden shrink-0">
                    <img src={stream.streamPoster} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-amber-400 font-semibold block uppercase">
                      Scheduled for Today · 18:00 EAT
                    </span>
                    <h5 className="text-xs font-medium text-white truncate">{stream.title}</h5>
                    <p className="text-[11px] text-stone-400 truncate">{stream.storeName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
