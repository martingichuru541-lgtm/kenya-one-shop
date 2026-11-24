import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  X, 
  Camera, 
  Mic, 
  MicOff, 
  Sliders, 
  Sparkles, 
  Users, 
  DollarSign, 
  Gift, 
  Zap, 
  ShoppingBag, 
  Pin, 
  Tag, 
  CheckCircle, 
  Smartphone, 
  Maximize2, 
  ShieldCheck,
  RefreshCw,
  Video,
  VideoOff,
  UserPlus,
  Flame,
  MessageSquare,
  Percent,
  Check,
  Send,
  FileText,
  Copy
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { formatCurrency } from '../../utils/formatters';
import { VideoFilterMode, VideoResolution } from '../../types';

interface CreatorBroadcastStudioProps {
  onClose: () => void;
}

export const CreatorBroadcastStudio: React.FC<CreatorBroadcastStudioProps> = ({ onClose }) => {
  const { 
    products, 
    livestreams, 
    creatorWallets, 
    liveGifts, 
    cashOutCreatorWallet, 
    currency, 
    broadcastSettings, 
    updateBroadcastSettings,
    user,
    // Co-Hosting
    coHostRequests,
    respondToCoHostRequest,
    endCoHostSession,
    // Multi-pinning & Deals
    pinProductToStream,
    unpinProductFromStream,
    liveOffers,
    respondToLiveOffer
  } = useCommerce();

  const [streamActive, setStreamActive] = useState(true);
  const [streamDuration, setStreamDuration] = useState(0);
  const [activeTab, setActiveTab] = useState<'pinned' | 'guests' | 'offers' | 'gifts' | 'studio-controls' | 'wallet'>('pinned');
  const [pinnedProdId, setPinnedProdId] = useState<string>(products[0]?.id || '');
  const [flashDiscountActive, setFlashDiscountActive] = useState(false);
  const [flashDiscountSecs, setFlashDiscountSecs] = useState(300);

  // AI Script Teleprompter state
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [showTeleprompter, setShowTeleprompter] = useState(false);

  // Counter offer state
  const [counterPriceInput, setCounterPriceInput] = useState<{ [offerId: string]: string }>({});

  // Cashout State
  const [cashoutAmount, setCashoutAmount] = useState('2000');
  const [cashoutPhone, setCashoutPhone] = useState(user.phone || '+254 712 900 123');
  const [cashoutSuccess, setCashoutSuccess] = useState<string | null>(null);

  // Audio VU Meter
  const [audioLevel, setAudioLevel] = useState(42);

  // Video Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const activeStream = livestreams[0];
  const pendingGuestRequests = coHostRequests.filter(r => r.status === 'pending');
  const pendingOffers = liveOffers.filter(o => o.status === 'pending');

  const storeWallet = creatorWallets['store_2'] || {
    storeId: 'store_2',
    totalGiftsReceivedKes: 12400,
    totalTipsReceivedKes: 6500,
    totalSalesReceivedKes: 165000,
    totalCashedOutKes: 5000,
    availableBalanceKes: 13900
  };

  // Timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setStreamDuration(prev => prev + 1);
      if (flashDiscountActive && flashDiscountSecs > 0) {
        setFlashDiscountSecs(prev => prev - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [flashDiscountActive, flashDiscountSecs]);

  // Real Camera & Audio VU Meter Initialization
  useEffect(() => {
    let isCancelled = false;

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: broadcastSettings.resolution === '1080p' ? 1920 : broadcastSettings.resolution === '720p' ? 1280 : 854,
            height: broadcastSettings.resolution === '1080p' ? 1080 : broadcastSettings.resolution === '720p' ? 720 : 480,
            facingMode: broadcastSettings.facingMode
          },
          audio: true
        });

        if (isCancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        mediaStreamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        // Web Audio API for Live VU Meter
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioContextRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const updateVolume = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            const normalized = Math.min(100, Math.round((avg / 128) * 100));
            setAudioLevel(normalized);
            animationFrameRef.current = requestAnimationFrame(updateVolume);
          };
          updateVolume();
        }
      } catch (err) {
        console.warn('Physical camera/mic not accessible, simulated studio stream active:', err);
      }
    }

    initCamera();

    return () => {
      isCancelled = true;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [broadcastSettings.resolution, broadcastSettings.facingMode]);

  // Toggle Mute Audio
  const toggleMic = () => {
    const nextMuted = !broadcastSettings.isMicMuted;
    updateBroadcastSettings({ isMicMuted: nextMuted });
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !nextMuted;
      });
    }
  };

  // Toggle Camera
  const toggleCamera = () => {
    const nextCamOff = !broadcastSettings.isCameraOff;
    updateBroadcastSettings({ isCameraOff: nextCamOff });
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !nextCamOff;
      });
    }
  };

  // Filter styles
  const getFilterCSS = (mode: VideoFilterMode): string => {
    switch (mode) {
      case 'studio_warm':
        return 'sepia(0.12) brightness(1.05) contrast(1.08) saturate(1.15)';
      case 'crisp_detail':
        return 'contrast(1.15) brightness(1.03) saturate(1.08)';
      case 'vibrant':
        return 'saturate(1.3) contrast(1.06) brightness(1.02)';
      case 'soft_glow':
        return 'brightness(1.06) contrast(0.98)';
      default:
        return 'none';
    }
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleCashoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(cashoutAmount, 10);
    if (isNaN(parsed) || parsed <= 0) return;

    const res = cashOutCreatorWallet('store_2', cashoutPhone, parsed);
    if (res.success) {
      setCashoutSuccess(`Successfully disbursed KES ${parsed.toLocaleString()} to ${cashoutPhone}! M-Pesa Ref: ${res.receipt}`);
      setTimeout(() => setCashoutSuccess(null), 6000);
    }
  };

  // Generate AI Sales Pitch Script using Rafiki AI
  const handleGenerateAIScript = async () => {
    setIsGeneratingScript(true);
    const prod = products.find(p => p.id === pinnedProdId) || products[0];

    try {
      const res = await fetch('/api/ai/pitch-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: prod.title,
          category: prod.category,
          priceKes: prod.priceKes,
          countyOrigin: prod.countyOrigin
        })
      });
      const data = await res.json();
      setGeneratedScript(data.script || `🔥 "Karibuni sana wadau! Right now on KenyaOne we have the authentic ${prod.title} directly from ${prod.countyOrigin || 'Kenya'}! Pure quality, handmade craftsmanship, and available right now at KES ${prod.priceKes.toLocaleString()}. Hit the pinned drop below for Lipa na M-Pesa instant checkout with guaranteed county delivery!"`);
    } catch {
      setGeneratedScript(
        `🔥 "Karibuni sana wadau! Right now on KenyaOne we have the authentic ${prod.title} directly from ${prod.countyOrigin || 'Kenya'}! Pure quality, handmade craftsmanship, and available right now at KES ${prod.priceKes.toLocaleString()}. Hit the pinned drop below for Lipa na M-Pesa instant checkout with guaranteed county delivery!"`
      );
    } finally {
      setIsGeneratingScript(false);
      setShowTeleprompter(true);
    }
  };

  const pinnedProduct = products.find(p => p.id === pinnedProdId) || products[0];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950 flex flex-col overflow-hidden text-stone-100 font-sans">
      {/* Top Broadcaster Control Bar */}
      <header className="h-14 bg-stone-900 border-b border-stone-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold shadow">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                KenyaOne HD Creator Studio
              </span>
              <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.2 rounded-full uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                ON AIR
              </span>
              <span className="font-mono text-xs text-stone-400 font-semibold">
                {formatDuration(streamDuration)}
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry Status: Bitrate, Resolution, Viewers */}
        <div className="hidden md:flex items-center gap-5 text-xs text-stone-400">
          <div className="flex items-center gap-1.5 bg-stone-950 px-2.5 py-1 rounded-md border border-stone-800">
            <span className="text-emerald-400 font-mono font-bold">1080p FHD</span>
            <span className="text-stone-600">·</span>
            <span className="font-mono text-stone-300">60 FPS</span>
            <span className="text-stone-600">·</span>
            <span className="font-mono text-stone-400">4,500 kbps</span>
          </div>

          {/* AI Script Teleprompter Trigger */}
          <button
            onClick={handleGenerateAIScript}
            disabled={isGeneratingScript}
            className="flex items-center gap-1.5 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white px-2.5 py-1 rounded-md border border-teal-500 font-bold text-xs shadow transition-transform active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isGeneratingScript ? 'Writing Script...' : 'AI Pitch Script'}</span>
          </button>

          <div className="flex items-center gap-1 text-stone-300">
            <Users className="w-3.5 h-3.5 text-rose-500" />
            <span className="font-mono font-bold text-white">428</span>
            <span>viewers</span>
          </div>

          <div className="flex items-center gap-1 text-emerald-400">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-bold text-white">
              {formatCurrency(storeWallet.availableBalanceKes, currency)}
            </span>
            <span className="text-stone-400 text-[11px]">Zawadi Wallet</span>
          </div>
        </div>

        {/* End Stream CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="py-1.5 px-3 bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>Leave Studio</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body: Left Viewport (70%) + Right Creator Control Rack (30%) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT: Video Viewport & On-Screen Overlays */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          
          {/* TIKTOK-STYLE DUAL SPLIT-SCREEN CO-HOST PREVIEW */}
          {activeStream?.coHost ? (
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-1 bg-stone-950">
              {/* Host Stream */}
              <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ filter: getFilterCSS(broadcastSettings.filter) }}
                  className={`w-full h-full object-cover ${broadcastSettings.facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5 text-[11px] font-bold text-white z-10">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>Host (You)</span>
                </div>
              </div>

              {/* Live Guest Stream Monitor */}
              <div className="relative w-full h-full overflow-hidden bg-stone-900 flex items-center justify-center border-t md:border-t-0 md:border-l border-stone-800">
                <img
                  src={activeStream.coHost.userAvatar}
                  alt={activeStream.coHost.userName}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/50 flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 z-10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Live Guest: {activeStream.coHost.userName} ({activeStream.coHost.county})</span>
                </div>

                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
                  <button
                    onClick={() => endCoHostSession(activeStream.id)}
                    className="py-1 px-3 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs rounded-lg shadow"
                  >
                    Disconnect Guest
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Single Host High-Definition Viewport */
            <div className="relative w-full h-full flex items-center justify-center">
              {broadcastSettings.isCameraOff ? (
                <div className="text-center p-8 text-stone-500">
                  <VideoOff className="w-16 h-16 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-white">Camera is Muted</h4>
                  <p className="text-xs text-stone-400 mt-1">Audio stream is still live to your viewers.</p>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ filter: getFilterCSS(broadcastSettings.filter) }}
                  className={`w-full h-full object-cover ${broadcastSettings.facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />
              )}

              {(!mediaStreamRef.current || broadcastSettings.isCameraOff) && (
                <img
                  src="/src/assets/images/livestream_studio_host_1794002336736.jpg"
                  alt="Studio Feed"
                  style={{ filter: getFilterCSS(broadcastSettings.filter) }}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-80"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
            </div>
          )}

          {/* TELEPROMPTER SCRIPT OVERLAY (IF OPEN) */}
          {showTeleprompter && generatedScript && (
            <div className="absolute top-16 inset-x-8 z-30 bg-black/85 backdrop-blur-md border border-teal-500/80 rounded-2xl p-4 shadow-2xl text-xs animate-slide-up max-w-xl mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800 mb-2">
                <div className="flex items-center gap-1.5 text-teal-400 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Rafiki AI Live Pitch Teleprompter (Sheng & Swahili)</span>
                </div>
                <button onClick={() => setShowTeleprompter(false)} className="text-stone-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-white text-sm leading-relaxed font-sans">{generatedScript}</p>
            </div>
          )}

          {/* TOP OVERLAYS: Audio VU meter & Resolution pill */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
            {/* Audio VU Decibel Meter */}
            <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs">
              {broadcastSettings.isMicMuted ? (
                <MicOff className="w-3.5 h-3.5 text-rose-500" />
              ) : (
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <div className="w-20 h-2 bg-stone-800 rounded-full overflow-hidden flex gap-0.5 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-75 ${
                    audioLevel > 75 ? 'bg-rose-500' : audioLevel > 45 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${broadcastSettings.isMicMuted ? 0 : audioLevel}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-stone-400">
                {broadcastSettings.isMicMuted ? 'MUTED' : `${audioLevel} dB`}
              </span>
            </div>

            {/* Active Studio Filter Badge */}
            <span className="bg-black/70 backdrop-blur-md border border-white/10 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
              Filter: {broadcastSettings.filter.replace('_', ' ')}
            </span>
          </div>

          {/* BOTTOM PINNED PRODUCT OVERLAY (Preview as seen by viewers) */}
          {pinnedProduct && (
            <div className="absolute bottom-4 left-4 right-4 z-20 max-w-lg pointer-events-auto">
              <div className="bg-stone-950/90 backdrop-blur-md border border-emerald-500/50 rounded-xl p-3 shadow-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={pinnedProduct.images[0]}
                    alt={pinnedProduct.title}
                    className="w-12 h-12 rounded-lg object-cover shrink-0 border border-stone-700"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                      Currently Pinned to Stream
                    </span>
                    <h4 className="text-xs font-semibold text-white truncate max-w-xs">
                      {pinnedProduct.title}
                    </h4>
                    <span className="font-mono text-sm font-bold text-white">
                      {formatCurrency(pinnedProduct.priceKes, currency)}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5">
                  <span className="text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-semibold">
                    Stock: {pinnedProduct.stock}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Broadcaster Control Rack */}
        <div className="w-full lg:w-96 bg-stone-900 border-t lg:border-t-0 lg:border-l border-stone-800 flex flex-col h-80 lg:h-full">
          {/* Studio Tab Switcher */}
          <div className="flex border-b border-stone-800 bg-stone-950 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('pinned')}
              className={`flex-1 py-3 px-2 text-center font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'pinned'
                  ? 'border-emerald-500 text-emerald-400 bg-stone-900'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              Pin Queue
            </button>
            <button
              onClick={() => setActiveTab('guests')}
              className={`flex-1 py-3 px-2 text-center font-bold border-b-2 whitespace-nowrap transition-colors relative ${
                activeTab === 'guests'
                  ? 'border-teal-500 text-teal-400 bg-stone-900'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              <span>Guests</span>
              {pendingGuestRequests.length > 0 && (
                <span className="ml-1 bg-teal-500 text-black text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {pendingGuestRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`flex-1 py-3 px-2 text-center font-bold border-b-2 whitespace-nowrap transition-colors relative ${
                activeTab === 'offers'
                  ? 'border-amber-500 text-amber-400 bg-stone-900'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              <span>Offers</span>
              {pendingOffers.length > 0 && (
                <span className="ml-1 bg-amber-500 text-stone-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {pendingOffers.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('gifts')}
              className={`flex-1 py-3 px-2 text-center font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'gifts'
                  ? 'border-amber-500 text-amber-400 bg-stone-900'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              Zawadi
            </button>
            <button
              onClick={() => setActiveTab('studio-controls')}
              className={`flex-1 py-3 px-2 text-center font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'studio-controls'
                  ? 'border-rose-500 text-rose-400 bg-stone-900'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              HD Video
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex-1 py-3 px-2 text-center font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'wallet'
                  ? 'border-emerald-500 text-emerald-400 bg-stone-900'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              Cashout
            </button>
          </div>

          {/* TAB 1: PIN PRODUCT QUEUE */}
          {activeTab === 'pinned' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white uppercase text-[11px] tracking-wider">
                  Select Product to Pin
                </span>
                <span className="text-stone-400 text-[10px]">Changes live in viewers room</span>
              </div>

              {products.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    setPinnedProdId(p.id);
                    if (activeStream) pinProductToStream(activeStream.id, p.id);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    p.id === pinnedProdId
                      ? 'bg-stone-950 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <h5 className="font-semibold text-white truncate max-w-[140px]">{p.title}</h5>
                      <span className="font-mono text-emerald-400 font-bold block">
                        {formatCurrency(p.priceKes, currency)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPinnedProdId(p.id);
                      if (activeStream) pinProductToStream(activeStream.id, p.id);
                    }}
                    className={`py-1 px-2.5 rounded text-[11px] font-bold ${
                      p.id === pinnedProdId
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-800 text-stone-300 hover:text-white'
                    }`}
                  >
                    {p.id === pinnedProdId ? 'PINNED' : 'Pin Drop'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: TIKTOK-STYLE CO-HOST GUEST REQUESTS */}
          {activeTab === 'guests' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white uppercase text-[11px] tracking-wider">
                  Co-Host & Guest Requests
                </span>
                <span className="text-stone-400 text-[10px]">{coHostRequests.length} total</span>
              </div>

              {coHostRequests.length === 0 ? (
                <div className="p-6 text-center text-stone-500">
                  <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No viewer join requests at the moment.</p>
                </div>
              ) : (
                coHostRequests.map(req => (
                  <div key={req.id} className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={req.userAvatar} alt="" className="w-8 h-8 rounded-full object-cover border border-teal-500" />
                        <div>
                          <span className="font-bold text-white block">{req.userName}</span>
                          <span className="text-[10px] text-teal-400">{req.county} County · {req.isAudioOnly ? 'Audio Only' : 'Video + Mic'}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        req.status === 'live' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        req.status === 'pending' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-stone-900 text-stone-500'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    {req.topic && (
                      <p className="text-[11px] text-stone-300 italic bg-stone-900 p-2 rounded">
                        "{req.topic}"
                      </p>
                    )}

                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => respondToCoHostRequest(req.id, true)}
                          className="flex-1 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept & Bring Live</span>
                        </button>
                        <button
                          onClick={() => respondToCoHostRequest(req.id, false)}
                          className="py-1.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: LIVE BUYER OFFERS / BARGAINING */}
          {activeTab === 'offers' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white uppercase text-[11px] tracking-wider">
                  Live In-Stream Buyer Offers
                </span>
                <span className="text-stone-400 text-[10px]">{liveOffers.length} offers</span>
              </div>

              {liveOffers.length === 0 ? (
                <div className="p-6 text-center text-stone-500">
                  <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No live offers submitted yet.</p>
                </div>
              ) : (
                liveOffers.map(offer => (
                  <div key={offer.id} className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{offer.buyerName} ({offer.buyerCounty})</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        offer.status === 'accepted' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        offer.status === 'pending' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        offer.status === 'countered' ? 'bg-teal-950 text-teal-300 border border-teal-800' :
                        'bg-rose-950 text-rose-300'
                      }`}>
                        {offer.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-300">
                      Product: <strong className="text-white">{offer.productTitle}</strong>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-stone-400">Regular: KES {offer.originalPriceKes.toLocaleString()}</span>
                      <span className="text-emerald-400 font-bold">Offered: KES {offer.offerPriceKes.toLocaleString()}</span>
                    </div>

                    {offer.status === 'pending' && (
                      <div className="space-y-2 pt-1 border-t border-stone-800">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => respondToLiveOffer(offer.id, 'accept')}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center justify-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept KES {offer.offerPriceKes.toLocaleString()}</span>
                          </button>
                          <button
                            onClick={() => respondToLiveOffer(offer.id, 'decline')}
                            className="py-1.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg"
                          >
                            Decline
                          </button>
                        </div>

                        {/* Counter offer input */}
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            placeholder="Counter price KES"
                            value={counterPriceInput[offer.id] || ''}
                            onChange={(e) => setCounterPriceInput({ ...counterPriceInput, [offer.id]: e.target.value })}
                            className="flex-1 bg-stone-900 border border-stone-800 rounded p-1 text-[11px] font-mono text-white"
                          />
                          <button
                            onClick={() => {
                              const cp = parseInt(counterPriceInput[offer.id], 10);
                              if (!isNaN(cp) && cp > 0) {
                                respondToLiveOffer(offer.id, 'counter', cp);
                              }
                            }}
                            className="py-1 px-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded text-[11px]"
                          >
                            Counter
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: LIVE GIFTS & M-PESA TIPS RECEIVED */}
          {activeTab === 'gifts' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-xs">
              <div className="p-3 bg-stone-950 rounded-xl border border-amber-800/80 mb-3">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                  Total Live Gift & Tip Earnings
                </span>
                <div className="font-mono text-2xl font-bold text-amber-400 mt-0.5">
                  {formatCurrency(storeWallet.totalGiftsReceivedKes + storeWallet.totalTipsReceivedKes, currency)}
                </div>
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Available in Zawadi Wallet for instant M-Pesa cashout.
                </span>
              </div>

              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider mb-2">
                Recent Gifts from Viewers
              </h5>

              {liveGifts.map(g => (
                <div key={g.id} className="p-3 bg-stone-950 rounded-xl border border-stone-800/80 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-950 border border-amber-700 flex items-center justify-center text-amber-400 text-base shrink-0">
                    {g.isTip ? '💸' : '🎁'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{g.senderName} ({g.senderCounty})</span>
                      <span className="font-mono font-bold text-emerald-400">
                        +{formatCurrency(g.amountKes, currency)}
                      </span>
                    </div>
                    <p className="text-stone-300 text-[11px] mt-0.5">{g.message}</p>
                    <span className="text-[10px] text-stone-500 mt-1 block">{g.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: HD VIDEO & STUDIO CONTROLS */}
          {activeTab === 'studio-controls' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar text-xs">
              {/* Camera & Mic toggles */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={toggleCamera}
                  className={`py-3 px-3 rounded-xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-colors ${
                    broadcastSettings.isCameraOff
                      ? 'bg-rose-950 border-rose-800 text-rose-300'
                      : 'bg-stone-950 border-stone-800 text-white'
                  }`}
                >
                  {broadcastSettings.isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5 text-emerald-400" />}
                  <span>{broadcastSettings.isCameraOff ? 'Camera Off' : 'Camera Active'}</span>
                </button>

                <button
                  onClick={toggleMic}
                  className={`py-3 px-3 rounded-xl border font-bold flex flex-col items-center justify-center gap-1.5 transition-colors ${
                    broadcastSettings.isMicMuted
                      ? 'bg-rose-950 border-rose-800 text-rose-300'
                      : 'bg-stone-950 border-stone-800 text-white'
                  }`}
                >
                  {broadcastSettings.isMicMuted ? <MicOff className="w-5 h-5 text-rose-400" /> : <Mic className="w-5 h-5 text-emerald-400" />}
                  <span>{broadcastSettings.isMicMuted ? 'Muted' : 'Mic Active'}</span>
                </button>
              </div>

              {/* Resolution Picker */}
              <div>
                <label className="text-stone-300 font-bold block mb-1.5 uppercase text-[11px]">
                  Broadcast Resolution
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: '1080p', label: '1080p FHD (Studio)' },
                    { id: '720p', label: '720p HD (Balanced)' },
                    { id: '480p', label: '480p SD (Low Data)' },
                    { id: 'audio_only', label: 'Rural 2G/3G Audio' }
                  ].map(res => (
                    <button
                      key={res.id}
                      onClick={() => updateBroadcastSettings({ resolution: res.id as VideoResolution })}
                      className={`p-2.5 rounded-lg border text-left font-medium ${
                        broadcastSettings.resolution === res.id
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                          : 'bg-stone-950 border-stone-800 text-stone-400'
                      }`}
                    >
                      {res.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Studio Color & Lighting Filters */}
              <div>
                <label className="text-stone-300 font-bold block mb-1.5 uppercase text-[11px]">
                  Studio Lighting & Color Grading Filter
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: 'studio_warm', name: 'Studio Warmth', desc: 'Flattering warm studio skin tone' },
                    { id: 'crisp_detail', name: 'Crisp Commercial', desc: 'Sharpened fabric and texture details' },
                    { id: 'vibrant', name: 'High-Contrast Vibrant', desc: 'Pops Kitenge and beadwork colors' },
                    { id: 'soft_glow', name: 'Soft Glow', desc: 'Gentle beauty diffused lighting' },
                    { id: 'normal', name: 'Raw / Unfiltered', desc: 'Natural sensor feed' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => updateBroadcastSettings({ filter: f.id as VideoFilterMode })}
                      className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between ${
                        broadcastSettings.filter === f.id
                          ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                          : 'bg-stone-950 border-stone-800 text-stone-400'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-white block">{f.name}</span>
                        <span className="text-[10px] text-stone-500">{f.desc}</span>
                      </div>
                      {broadcastSettings.filter === f.id && (
                        <CheckCircle className="w-4 h-4 text-amber-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CASHOUT ZAWADI TO M-PESA */}
          {activeTab === 'wallet' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
              <div className="p-4 bg-stone-950 rounded-2xl border border-emerald-800/80 shadow">
                <span className="text-stone-400 text-[10px] uppercase tracking-wider block">
                  Available Zawadi Balance
                </span>
                <div className="font-mono text-3xl font-extrabold text-emerald-400 mt-1">
                  {formatCurrency(storeWallet.availableBalanceKes, currency)}
                </div>
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Total Cashed Out to Date: {formatCurrency(storeWallet.totalCashedOutKes, currency)}
                </span>
              </div>

              {cashoutSuccess && (
                <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl leading-relaxed">
                  {cashoutSuccess}
                </div>
              )}

              <form onSubmit={handleCashoutSubmit} className="space-y-3">
                <div>
                  <label className="text-stone-300 block mb-1 font-semibold">Amount to Cash Out (KES)</label>
                  <input
                    type="number"
                    max={storeWallet.availableBalanceKes}
                    value={cashoutAmount}
                    onChange={(e) => setCashoutAmount(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-stone-300 block mb-1 font-semibold">M-Pesa Phone / Till Number</label>
                  <input
                    type="text"
                    value={cashoutPhone}
                    onChange={(e) => setCashoutPhone(e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={storeWallet.availableBalanceKes <= 0}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Disburse to M-Pesa Instantly</span>
                </button>
              </form>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-[11px] text-stone-400 space-y-1">
                <div className="font-semibold text-white">Direct Daraja B2C Transfer</div>
                <p>Funds are sent directly to your registered Safaricom M-Pesa line or Business Till with zero delay.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
