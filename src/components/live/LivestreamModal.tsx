import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Users, 
  Heart, 
  Send, 
  ShoppingBag, 
  Camera, 
  Volume2, 
  VolumeX, 
  Share2, 
  ShieldCheck, 
  Sparkles, 
  Radio, 
  Tag, 
  CheckCircle,
  Gavel,
  MessageSquare,
  Gift,
  DollarSign,
  Smartphone,
  Sliders,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Video,
  Mic,
  Copy,
  Clock,
  Flame,
  Award,
  Layers,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { formatCurrency } from '../../utils/formatters';
import { LivestreamComment, Product, GiftTier, VideoResolution, ProductVariant } from '../../types';

interface LivestreamModalProps {
  onClose: () => void;
  onInstantBuy: (product: Product) => void;
  onOpenStore: (slug: string) => void;
  onOpenBroadcasterStudio?: () => void;
}

export const LivestreamModal: React.FC<LivestreamModalProps> = ({
  onClose,
  onInstantBuy,
  onOpenStore,
  onOpenBroadcasterStudio
}) => {
  const { 
    activeLivestreamId, 
    livestreams, 
    products, 
    currency, 
    followedStoreIds, 
    toggleFollowStore, 
    likeLivestream,
    giftTiers,
    sendLiveGift,
    sendDirectMpesaTip,
    activeGiftAlert,
    addToCart,
    user,
    // Co-Hosting & TikTok Share
    coHostRequests,
    requestToJoinLive,
    endCoHostSession,
    shareLiveStream,
    // Deals & Offers
    liveOffers,
    submitLiveOffer,
    joinGroupBuyDeal,
    voteLivePoll,
    // Shared Shopping
    createSharedShoppingRoom,
    activeSharedRoom
  } = useCommerce();

  const stream = livestreams.find(l => l.id === activeLivestreamId);
  const [isMuted, setIsMuted] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number }[]>([]);
  const [isUsingWebcam, setIsUsingWebcam] = useState(false);
  
  // Drawers & Modals
  const [showGiftDrawer, setShowGiftDrawer] = useState(false);
  const [showShareDrawer, setShowShareDrawer] = useState(false);
  const [showJoinRequestModal, setShowJoinRequestModal] = useState(false);
  const [showOfferDrawer, setShowOfferDrawer] = useState(false);
  const [showChaptersDrawer, setShowChaptersDrawer] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  
  // Gifting state
  const [giftTab, setGiftTab] = useState<'zawadi' | 'direct_tip'>('zawadi');
  const [customTipAmount, setCustomTipAmount] = useState('250');
  const [customTipMessage, setCustomTipMessage] = useState('');
  const [giftAnimationOverlay, setGiftAnimationOverlay] = useState<GiftTier | null>(null);

  // Video resolution
  const [selectedResolution, setSelectedResolution] = useState<VideoResolution>('1080p');

  // Co-Host Request state
  const [joinTopic, setJoinTopic] = useState('');
  const [joinAudioOnly, setJoinAudioOnly] = useState(false);
  const [joinSuccessMsg, setJoinSuccessMsg] = useState<string | null>(null);

  // Pinned products index navigation
  const pinnedIds = (stream?.pinnedProductIds && stream.pinnedProductIds.length > 0)
    ? stream.pinnedProductIds 
    : stream?.pinnedProductId 
      ? [stream.pinnedProductId] 
      : products.slice(0, 3).map(p => p.id);

  const [activePinnedIndex, setActivePinnedIndex] = useState(0);
  const currentPinnedId = pinnedIds[activePinnedIndex] || pinnedIds[0];
  const pinnedProduct = products.find(p => p.id === currentPinnedId) || products[0];

  // Variant Selection State
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [addedToCartToast, setAddedToCartToast] = useState(false);

  // Live Offer / Haggle State
  const [offerAmount, setOfferAmount] = useState<string>('');
  const [offerSuccessToast, setOfferSuccessToast] = useState<string | null>(null);

  // Share state
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [sharedRoomCode, setSharedRoomCode] = useState<string | null>(null);

  // Comparison State
  const [compareProductId, setCompareProductId] = useState<string>(products[1]?.id || products[0].id);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const guestVideoRef = useRef<HTMLVideoElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Setup default variant on product change
  useEffect(() => {
    if (pinnedProduct?.variants && pinnedProduct.variants.length > 0) {
      setSelectedVariant(pinnedProduct.variants[0]);
    } else {
      setSelectedVariant(null);
    }
    if (pinnedProduct) {
      const discountSuggestion = Math.round(pinnedProduct.priceKes * 0.85);
      setOfferAmount(String(discountSuggestion));
    }
  }, [currentPinnedId, pinnedProduct]);

  // Initial stream comments
  const [comments, setComments] = useState<LivestreamComment[]>([
    {
      id: 'c1',
      livestreamId: stream?.id || '',
      userId: 'u_ann',
      userName: 'Ann Nduta',
      text: 'Jambo! How does the single-origin coffee aroma compare to peaberry?',
      timestamp: '14:02'
    },
    {
      id: 'c2',
      livestreamId: stream?.id || '',
      userId: 'u_seller',
      userName: stream?.storeName || 'Host',
      text: 'Karibuni sana! Tap the pinned drop below for 15% off + Lipa na M-Pesa instant checkout!',
      timestamp: '14:03',
      isSeller: true,
      isPinned: true
    },
    {
      id: 'c3',
      livestreamId: stream?.id || '',
      userId: 'u_brian',
      userName: 'Brian Omondi (Kisumu)',
      text: 'Can I join your live broadcast to ask about wholesale cooperative shipping?',
      timestamp: '14:04'
    },
    {
      id: 'c4',
      livestreamId: stream?.id || '',
      userId: 'u_seller',
      userName: stream?.storeName || 'Host',
      text: 'Yes Brian! Hit "Request to Join" and I will bring you up on split-screen live right now!',
      timestamp: '14:04',
      isSeller: true
    }
  ]);

  const isStoreFollowed = stream ? followedStoreIds.includes(stream.storeId) : false;
  const isUserPendingCoHost = coHostRequests.some(r => r.streamId === stream?.id && r.userId === user.id && r.status === 'pending');
  const isUserLiveCoHost = stream?.coHost?.userId === user.id;

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [comments]);

  // Periodic incoming community comments
  useEffect(() => {
    const audienceMessages = [
      { user: 'Faith Chebet (Eldoret)', text: 'The stitching on this is gorgeous! Ordering one now.' },
      { user: 'Dennis Mutua (Mombasa)', text: 'Just sent Chai Moto! Love your energy.' },
      { user: 'Wanjiku K. (Nairobi)', text: 'Love the vibrant orange and cobalt Kitenge pattern!' },
      { user: 'David Otieno (Kisumu)', text: 'Just completed M-Pesa STK push, got receipt instant!' },
      { user: 'Mercy Achieng (Nakuru)', text: 'Just voted in the live poll!' },
      { user: 'Sarah M. (London UK)', text: 'Does DHL shipping cover UK delivery?' }
    ];

    const interval = setInterval(() => {
      const randomMsg = audienceMessages[Math.floor(Math.random() * audienceMessages.length)];
      setComments(prev => [
        ...prev,
        {
          id: `c_${Date.now()}`,
          livestreamId: stream?.id || '',
          userId: `u_${Date.now()}`,
          userName: randomMsg.user,
          text: randomMsg.text,
          timestamp: new Date().toTimeString().substring(0, 5)
        }
      ]);
    }, 8000);

    return () => clearInterval(interval);
  }, [stream]);

  // Handle webcam streaming in viewer room
  const toggleWebcam = async () => {
    if (isUsingWebcam) {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => track.stop());
        webcamStreamRef.current = null;
      }
      setIsUsingWebcam(false);
    } else {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1920, height: 1080 },
          audio: true
        });
        webcamStreamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
        setIsUsingWebcam(true);
      } catch (err) {
        console.warn('Webcam permission not granted or device unavailable:', err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setComments(prev => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        livestreamId: stream?.id || '',
        userId: user.id,
        userName: `${user.name} (${user.county})`,
        text: commentText.trim(),
        timestamp: new Date().toTimeString().substring(0, 5)
      }
    ]);
    setCommentText('');
  };

  const handleLike = () => {
    if (stream) {
      likeLivestream(stream.id);
      const heartId = Date.now();
      const leftPos = 20 + Math.random() * 60;
      setFloatingHearts(prev => [...prev, { id: heartId, left: leftPos }]);
      setTimeout(() => {
        setFloatingHearts(prev => prev.filter(h => h.id !== heartId));
      }, 2000);
    }
  };

  // Send Gift Handler
  const handleTriggerGift = (gift: GiftTier) => {
    if (!stream) return;
    sendLiveGift(stream.id, gift.id);

    // Trigger visual confetti / animation overlay
    setGiftAnimationOverlay(gift);
    setTimeout(() => setGiftAnimationOverlay(null), 3500);

    // Add celebration comment
    setComments(prev => [
      ...prev,
      {
        id: `c_gift_${Date.now()}`,
        livestreamId: stream.id,
        userId: user.id,
        userName: user.name,
        text: `🎁 Sent ${gift.name} ${gift.icon} (${formatCurrency(gift.amountKes, currency)}) to host!`,
        timestamp: new Date().toTimeString().substring(0, 5),
        isPinned: true
      }
    ]);

    setShowGiftDrawer(false);
  };

  // Send Direct M-Pesa Tip Handler
  const handleSendTip = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customTipAmount, 10);
    if (isNaN(parsed) || parsed < 10 || !stream) return;

    sendDirectMpesaTip(stream.id, parsed, customTipMessage);

    setComments(prev => [
      ...prev,
      {
        id: `c_tip_${Date.now()}`,
        livestreamId: stream.id,
        userId: user.id,
        userName: user.name,
        text: `💸 Sent direct M-Pesa tip of KES ${parsed.toLocaleString()}! ${customTipMessage ? `"${customTipMessage}"` : ''}`,
        timestamp: new Date().toTimeString().substring(0, 5),
        isPinned: true
      }
    ]);

    setShowGiftDrawer(false);
    setCustomTipMessage('');
  };

  // 1-Click In-Stream Add to Cart
  const handleAddToCartInStream = () => {
    if (!pinnedProduct) return;
    addToCart(pinnedProduct, 1);
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 2500);
  };

  // Send Request to Join Live as TikTok Co-Host
  const handleJoinLiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stream) return;
    const res = requestToJoinLive(stream.id, joinTopic, joinAudioOnly);
    setJoinSuccessMsg(res.message);
    setTimeout(() => {
      setShowJoinRequestModal(false);
      setJoinSuccessMsg(null);
    }, 2000);
  };

  // Submit Live Haggle / Bargaining Offer
  const handleLiveOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(offerAmount, 10);
    if (isNaN(parsed) || parsed <= 0 || !stream || !pinnedProduct) return;

    const res = submitLiveOffer(stream.id, pinnedProduct.id, parsed);
    setOfferSuccessToast(res.message);

    setComments(prev => [
      ...prev,
      {
        id: `c_offer_${Date.now()}`,
        livestreamId: stream.id,
        userId: user.id,
        userName: user.name,
        text: `🏷️ Made a live bargaining offer of KES ${parsed.toLocaleString()} on "${pinnedProduct.title}"!`,
        timestamp: new Date().toTimeString().substring(0, 5)
      }
    ]);

    setTimeout(() => {
      setShowOfferDrawer(false);
      setOfferSuccessToast(null);
    }, 2000);
  };

  // TikTok-Style Share Live
  const handleShareTrigger = (platform: 'whatsapp' | 'copy' | 'room') => {
    if (!stream) return;
    const res = shareLiveStream(stream.id, platform);
    
    if (platform === 'whatsapp') {
      const shareText = `🔴 Watch "${stream.title}" LIVE on KenyaOne! Buy authenticated Kenyan products directly, join live auctions & send Zawadi tips: ${res.shareLink}`;
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank');
      setShareToast('Opening WhatsApp to share live stream...');
    } else if (platform === 'copy') {
      navigator.clipboard?.writeText(res.shareLink);
      setShareToast('Live stream link copied to clipboard!');
    } else if (platform === 'room') {
      const room = createSharedShoppingRoom(stream.id);
      setSharedRoomCode(room.roomCode);
      setShareToast(`Shared Shopping Room created! Room PIN: ${room.roomCode}`);
    }

    setTimeout(() => setShareToast(null), 3000);
  };

  if (!stream) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-0 md:p-4 overflow-hidden animate-fade-in font-sans">
      <div className="relative w-full h-full md:max-w-6xl md:h-[90vh] bg-stone-950 md:rounded-2xl border border-stone-800 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT / CENTER: High-Definition Video Stream Viewport */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          
          {/* TIKTOK-STYLE DUAL SPLIT-SCREEN CO-HOST MODE */}
          {stream.coHost ? (
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-1 bg-stone-950">
              {/* Host Stream (Left/Top) */}
              <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
                {isUsingWebcam ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={isMuted}
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                ) : (
                  <img
                    src={stream.streamPoster}
                    alt={stream.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5 text-[11px] font-bold text-white z-10">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>Host: {stream.storeName}</span>
                </div>
              </div>

              {/* Guest Co-Host Stream (Right/Bottom) */}
              <div className="relative w-full h-full overflow-hidden bg-stone-900 flex items-center justify-center border-t md:border-t-0 md:border-l border-stone-800">
                {stream.coHost.isAudioOnly ? (
                  <div className="text-center p-6 text-stone-300">
                    <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-2 animate-pulse">
                      <Mic className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h5 className="font-bold text-white text-sm">{stream.coHost.userName}</h5>
                    <span className="text-[11px] text-emerald-400 font-medium">Audio Co-Host · {stream.coHost.county} County</span>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={stream.coHost.userAvatar}
                      alt={stream.coHost.userName}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                )}

                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/50 flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 z-10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Guest: {stream.coHost.userName} ({stream.coHost.county})</span>
                </div>

                {/* If the current logged-in user is this co-host, allow leaving */}
                {isUserLiveCoHost && (
                  <button
                    onClick={() => endCoHostSession(stream.id)}
                    className="absolute bottom-4 right-4 z-20 py-1.5 px-3 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs rounded-lg shadow"
                  >
                    Leave Stage
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Single Host High-Definition Viewport */
            <div className="relative w-full h-full flex items-center justify-center">
              {selectedResolution === 'audio_only' ? (
                <div className="text-center p-8 text-stone-300">
                  <div className="w-20 h-20 rounded-full bg-emerald-950 border-2 border-emerald-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Radio className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">Rural Data-Saver Audio Stream</h3>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto mt-1">
                    Optimized for 2G/3G low-bandwidth connections across rural Kenyan counties.
                  </p>
                </div>
              ) : isUsingWebcam ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted={isMuted}
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={stream.streamPoster}
                    alt={stream.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none" />
                </div>
              )}
            </div>
          )}

          {/* Floating Hearts Animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {floatingHearts.map(heart => (
              <div
                key={heart.id}
                style={{ left: `${heart.left}%` }}
                className="absolute bottom-16 text-rose-500 animate-float-heart"
              >
                <Heart className="w-8 h-8 fill-rose-500 drop-shadow-lg" />
              </div>
            ))}
          </div>

          {/* FULL SCREEN GIFT CELEBRATION OVERLAY */}
          {giftAnimationOverlay && (
            <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none animate-slide-up">
              <div className="text-6xl sm:text-7xl mb-2 animate-bounce">
                {giftAnimationOverlay.icon}
              </div>
              <div className="text-center text-white space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  ZAWADI GIFT SENT!
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold">
                  {giftAnimationOverlay.name}
                </h3>
                <span className="font-mono text-xl font-bold text-emerald-400 block">
                  {formatCurrency(giftAnimationOverlay.amountKes, currency)}
                </span>
                <p className="text-xs text-stone-300 max-w-xs mx-auto">
                  {giftAnimationOverlay.description}
                </p>
              </div>
            </div>
          )}

          {/* TOP BAR: Seller Info, Quality selector & Actions */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-auto">
            {/* Seller profile header with Follow button */}
            <div className="flex items-center gap-2.5 bg-black/70 backdrop-blur-md p-1.5 pr-3 rounded-full border border-white/10 shadow">
              <img
                src={stream.sellerAvatar}
                alt={stream.storeName}
                className="w-9 h-9 rounded-full object-cover border border-emerald-500 cursor-pointer"
                onClick={() => onOpenStore(stream.storeSlug)}
              />
              <div className="cursor-pointer" onClick={() => onOpenStore(stream.storeSlug)}>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white truncate max-w-[110px] sm:max-w-[140px]">
                    {stream.storeName}
                  </span>
                  <CheckCircle className="w-3 h-3 text-emerald-400 fill-emerald-950" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-amber-400 font-semibold">{stream.county || 'Nairobi'}</span>
                  {stream.isFarmLive && (
                    <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1 rounded font-bold">FARM</span>
                  )}
                  {stream.isWholesaleLive && (
                    <span className="text-[9px] bg-blue-950 text-blue-400 border border-blue-800 px-1 rounded font-bold">B2B</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => toggleFollowStore(stream.storeId)}
                className={`ml-1 text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                  isStoreFollowed
                    ? 'bg-stone-800 text-stone-300 border border-stone-700'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                }`}
              >
                {isStoreFollowed ? 'Following' : 'Follow'}
              </button>
            </div>

            {/* Video Controls & Resolution Picker */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>LIVE</span>
              </div>

              {/* TIKTOK-STYLE CO-HOST REQUEST BUTTON */}
              {!stream.coHost && (
                <button
                  onClick={() => setShowJoinRequestModal(true)}
                  disabled={isUserPendingCoHost}
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all shadow ${
                    isUserPendingCoHost
                      ? 'bg-amber-950 text-amber-300 border border-amber-700 opacity-90'
                      : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white border border-teal-400/30'
                  }`}
                  title="Request to join broadcast live as a co-host or buyer guest"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {isUserPendingCoHost ? 'Requested ⏳' : 'Join Live'}
                  </span>
                </button>
              )}

              {/* Resolution Dropdown */}
              <div className="relative hidden sm:block">
                <select
                  value={selectedResolution}
                  onChange={(e) => setSelectedResolution(e.target.value as VideoResolution)}
                  className="bg-black/70 backdrop-blur-md text-stone-200 border border-white/10 rounded-full px-2.5 py-1 text-xs font-mono font-bold focus:outline-none cursor-pointer"
                  aria-label="Select Video Quality"
                >
                  <option value="1080p" className="bg-stone-900">1080p FHD</option>
                  <option value="720p" className="bg-stone-900">720p HD</option>
                  <option value="480p" className="bg-stone-900">480p SD</option>
                  <option value="audio_only" className="bg-stone-900">Audio (2G/3G)</option>
                </select>
              </div>

              <div className="bg-black/70 backdrop-blur-md text-stone-200 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10">
                <Users className="w-3.5 h-3.5 text-stone-400" />
                <span>{stream.viewerCount.toLocaleString()}</span>
              </div>

              {/* Chapters & Comparison tools */}
              {stream.chapters && stream.chapters.length > 0 && (
                <button
                  onClick={() => setShowChaptersDrawer(!showChaptersDrawer)}
                  title="Stream Chapters & Product Timestamps"
                  className="p-2 rounded-full bg-black/70 text-stone-300 hover:text-white border border-white/10 backdrop-blur-md transition-colors"
                >
                  <Clock className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setShowComparisonModal(true)}
                title="Compare Pinned Products"
                className="p-2 rounded-full bg-black/70 text-stone-300 hover:text-white border border-white/10 backdrop-blur-md transition-colors"
              >
                <Layers className="w-4 h-4" />
              </button>

              {/* Toggle Webcam */}
              <button
                onClick={toggleWebcam}
                title={isUsingWebcam ? 'Switch to Studio Video' : 'Test Camera'}
                className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                  isUsingWebcam 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-black/70 text-stone-300 hover:text-white border border-white/10'
                }`}
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Broadcaster Studio Shortcut */}
              {onOpenBroadcasterStudio && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenBroadcasterStudio();
                  }}
                  title="Open Creator Broadcast Studio Suite"
                  className="p-2 rounded-full bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/80 backdrop-blur-md transition-colors"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              )}

              {/* Mute Audio */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full bg-black/70 backdrop-blur-md text-stone-300 hover:text-white border border-white/10 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* TikTok-Style Share Button */}
              <button
                onClick={() => setShowShareDrawer(true)}
                className="p-2 rounded-full bg-black/70 hover:bg-emerald-600 text-stone-300 hover:text-white border border-white/10 transition-colors relative"
                title="Share Live Drop"
              >
                <Share2 className="w-4 h-4" />
                {stream.shareCount && stream.shareCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-black font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {stream.shareCount}
                  </span>
                )}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/70 hover:bg-rose-600 text-stone-300 hover:text-white backdrop-blur-md border border-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* NOTIFICATION TOAST OVERLAYS */}
          {shareToast && (
            <div className="absolute top-20 z-30 bg-emerald-600 text-white text-xs px-4 py-2 rounded-lg shadow-xl animate-fade-in flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{shareToast}</span>
            </div>
          )}

          {addedToCartToast && (
            <div className="absolute top-20 z-30 bg-emerald-600 text-white text-xs px-4 py-2 rounded-lg shadow-xl animate-fade-in flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Item added to your shopping cart! Tap checkout anytime.</span>
            </div>
          )}

          {offerSuccessToast && (
            <div className="absolute top-20 z-30 bg-teal-600 text-white text-xs px-4 py-2 rounded-lg shadow-xl animate-fade-in flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>{offerSuccessToast}</span>
            </div>
          )}

          {/* ACTIVE IN-STREAM GIFT ALERT BANNER */}
          {activeGiftAlert && (
            <div className="absolute top-20 z-30 bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 px-4 py-2 rounded-full font-bold text-xs shadow-xl flex items-center gap-2 animate-bounce">
              <Gift className="w-4 h-4 text-stone-950" />
              <span>
                {activeGiftAlert.senderName} sent {activeGiftAlert.giftName || 'M-Pesa Tip'} (+KES {activeGiftAlert.amountKes.toLocaleString()})!
              </span>
            </div>
          )}

          {/* ACTIVE IN-STREAM LIVE POLL BANNER */}
          {stream.activePoll && (
            <div className="absolute top-20 right-4 z-30 w-72 bg-stone-950/90 backdrop-blur-md border border-teal-500/50 rounded-xl p-3 shadow-2xl text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Live Stream Poll
                </span>
                <span className="text-stone-400 text-[10px]">{stream.activePoll.totalVotes} votes</span>
              </div>
              <p className="font-semibold text-white mb-2">{stream.activePoll.question}</p>
              <div className="space-y-1.5">
                {stream.activePoll.options.map((opt, idx) => {
                  const pct = stream.activePoll && stream.activePoll.totalVotes > 0 
                    ? Math.round((opt.votes / stream.activePoll.totalVotes) * 100) 
                    : 0;
                  const isVoted = stream.activePoll?.userVotedIndex === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => voteLivePoll(stream.id, idx)}
                      className={`w-full text-left p-1.5 rounded-lg border text-[11px] relative overflow-hidden transition-all ${
                        isVoted
                          ? 'border-teal-500 bg-teal-950/50 text-teal-200'
                          : 'border-stone-800 bg-stone-900/80 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-teal-600/20 rounded pointer-events-none transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                      <div className="relative flex items-center justify-between z-10 px-1">
                        <span className="font-medium">{opt.text}</span>
                        <span className="font-mono font-bold text-[10px]">{pct}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ACTIVE CHAMA GROUP BUY OR FLASH DEAL BADGE */}
          {stream.activeGroupDeal && (
            <div className="absolute top-36 left-4 z-30 max-w-xs bg-amber-950/90 backdrop-blur-md border border-amber-600/70 rounded-xl p-2.5 text-xs shadow-xl animate-fade-in">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Chama Group Buy Deal Active!</span>
              </div>
              <p className="text-[11px] text-stone-300">
                {stream.activeGroupDeal.currentCount}/{stream.activeGroupDeal.targetCount} joined. Group price: <span className="font-mono text-emerald-400 font-bold">KES {stream.activeGroupDeal.groupPriceKes.toLocaleString()}</span> (Save KES {(stream.activeGroupDeal.regularPriceKes - stream.activeGroupDeal.groupPriceKes).toLocaleString()})
              </p>
              <button
                onClick={() => joinGroupBuyDeal(stream.id)}
                className="mt-2 w-full py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] rounded transition-transform active:scale-95"
              >
                Join Chama Group Deal Now
              </button>
            </div>
          )}

          {/* BOTTOM IN-STREAM PINNED PRODUCT CAROUSEL WITH VARIANT SELECTOR */}
          {pinnedProduct && (
            <div className="absolute bottom-4 left-4 right-4 z-30 pointer-events-auto max-w-2xl mx-auto">
              <div className="bg-stone-950/95 backdrop-blur-md border border-amber-500/60 rounded-xl p-3 shadow-2xl space-y-2.5 animate-slide-up">
                
                {/* Product Header & Index Navigation */}
                <div className="flex items-center justify-between gap-2 border-b border-stone-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500 text-stone-950 font-extrabold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                      Live Drop {activePinnedIndex + 1} of {pinnedIds.length}
                    </span>
                    {pinnedProduct.countyOrigin && (
                      <span className="text-[10px] text-stone-400">· {pinnedProduct.countyOrigin} County</span>
                    )}
                  </div>

                  {/* Multi-Pin Switcher Buttons */}
                  {pinnedIds.length > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setActivePinnedIndex(prev => (prev > 0 ? prev - 1 : pinnedIds.length - 1))}
                        className="p-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800"
                        title="Previous Drop"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setActivePinnedIndex(prev => (prev < pinnedIds.length - 1 ? prev + 1 : 0))}
                        className="p-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800"
                        title="Next Drop"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Product Details & Variant Selection */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={pinnedProduct.images[0]}
                      alt={pinnedProduct.title}
                      className="w-14 h-14 rounded-lg object-cover shrink-0 border border-stone-700"
                    />

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                        {pinnedProduct.title}
                      </h4>

                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-mono text-sm sm:text-base font-bold text-emerald-400">
                          {formatCurrency(selectedVariant?.priceKes ?? pinnedProduct.priceKes, currency)}
                        </span>
                        {pinnedProduct.comparePriceKes && (
                          <span className="font-mono text-xs line-through text-stone-500">
                            {formatCurrency(pinnedProduct.comparePriceKes, currency)}
                          </span>
                        )}
                        <span className="text-[10px] text-stone-400">
                          Stock: {selectedVariant?.stock ?? pinnedProduct.stock}
                        </span>
                      </div>

                      {/* In-Stream Variant Selector Chips */}
                      {pinnedProduct.variants && pinnedProduct.variants.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto">
                          <span className="text-[10px] text-stone-400">Option:</span>
                          {pinnedProduct.variants.map(variant => (
                            <button
                              key={variant.id}
                              onClick={() => setSelectedVariant(variant)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                selectedVariant?.id === variant.id
                                  ? 'bg-amber-500 text-stone-950 border-amber-400'
                                  : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
                              }`}
                            >
                              {variant.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Rack: Offer / Gift / Add to Cart / Buy Now */}
                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end shrink-0 pt-1 sm:pt-0">
                    {/* Make an Offer / Haggle button */}
                    <button
                      onClick={() => setShowOfferDrawer(true)}
                      className="py-2 px-2.5 bg-stone-900 hover:bg-stone-800 text-amber-400 border border-stone-700 hover:border-amber-500 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                      title="Make an offer / Haggle price live with seller"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Haggle</span>
                    </button>

                    {/* Send Gift / Zawadi Trigger */}
                    <button
                      onClick={() => setShowGiftDrawer(!showGiftDrawer)}
                      className="py-2 px-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs rounded-lg shadow flex items-center gap-1 transition-transform active:scale-95"
                    >
                      <Gift className="w-3.5 h-3.5 text-stone-950" />
                      <span className="hidden xs:inline">Zawadi</span>
                    </button>

                    {/* Instant In-Stream Add to Cart */}
                    <button
                      onClick={handleAddToCartInStream}
                      className="py-2 px-2.5 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs rounded-lg border border-stone-700 flex items-center gap-1 transition-colors"
                      title="Add to cart without leaving stream"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">+ Cart</span>
                    </button>

                    {/* Buy Now Button */}
                    <button
                      onClick={() => onInstantBuy(pinnedProduct)}
                      className="py-2 px-3 sm:px-4 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow flex items-center gap-1.5 transition-all transform active:scale-95"
                    >
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TIKTOK-STYLE SHARE MODAL */}
          {showShareDrawer && (
            <div className="absolute inset-x-4 bottom-24 z-40 bg-stone-950/95 backdrop-blur-xl border border-emerald-500/60 rounded-2xl p-5 shadow-2xl animate-slide-up max-w-md mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-display font-bold text-white text-sm">
                    Share Live Stream & Earn Rewards
                  </h4>
                </div>
                <button onClick={() => setShowShareDrawer(false)} className="text-stone-400 hover:text-white p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {/* 1-Click WhatsApp Share */}
                <button
                  onClick={() => handleShareTrigger('whatsapp')}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow transition-colors"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Share on WhatsApp (Direct Link)</span>
                </button>

                {/* Copy Direct Link */}
                <button
                  onClick={() => handleShareTrigger('copy')}
                  className="w-full py-2.5 px-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Copy className="w-4 h-4 text-stone-400" />
                  <span>Copy Stream Link with Referral Code</span>
                </button>

                {/* Create Shared Shopping Session */}
                <button
                  onClick={() => handleShareTrigger('room')}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow transition-colors"
                >
                  <Users className="w-4 h-4 text-stone-950" />
                  <span>Start Shared Shopping Room with Friends</span>
                </button>

                {sharedRoomCode && (
                  <div className="p-2.5 bg-stone-900 rounded-lg border border-amber-600/50 text-center">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Your Shopping Room PIN:</span>
                    <span className="font-mono text-lg font-bold text-amber-400">{sharedRoomCode}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TIKTOK-STYLE REQUEST TO JOIN LIVE MODAL */}
          {showJoinRequestModal && (
            <div className="absolute inset-x-4 bottom-24 z-40 bg-stone-950/95 backdrop-blur-xl border border-teal-500/60 rounded-2xl p-5 shadow-2xl animate-slide-up max-w-md mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-teal-400" />
                  <h4 className="font-display font-bold text-white text-sm">
                    Request to Join Live Broadcast
                  </h4>
                </div>
                <button onClick={() => setShowJoinRequestModal(false)} className="text-stone-400 hover:text-white p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {joinSuccessMsg ? (
                <div className="p-4 bg-teal-950/80 border border-teal-500 rounded-xl text-center text-teal-200 text-xs">
                  <CheckCircle className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                  <p className="font-bold">{joinSuccessMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleJoinLiveSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="text-stone-300 block mb-1 font-semibold">
                      Reason for joining (seen by Host):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sizing check, wholesale inquiry, live product inspection"
                      value={joinTopic}
                      onChange={(e) => setJoinTopic(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-white"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-stone-900 p-2.5 rounded-lg border border-stone-800">
                    <input
                      type="checkbox"
                      id="audioOnlyChk"
                      checked={joinAudioOnly}
                      onChange={(e) => setJoinAudioOnly(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <label htmlFor="audioOnlyChk" className="text-stone-300 text-xs cursor-pointer">
                      Audio-only mode (Save mobile data / No camera required)
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Send Co-Host Request to Host</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* MAKE AN OFFER / LIVE BARGAINING DRAWER */}
          {showOfferDrawer && pinnedProduct && (
            <div className="absolute inset-x-4 bottom-24 z-40 bg-stone-950/95 backdrop-blur-xl border border-amber-500/60 rounded-2xl p-5 shadow-2xl animate-slide-up max-w-md mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-amber-400" />
                  <h4 className="font-display font-bold text-white text-sm">
                    Make a Live Offer / Haggle
                  </h4>
                </div>
                <button onClick={() => setShowOfferDrawer(false)} className="text-stone-400 hover:text-white p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 p-2.5 bg-stone-900 rounded-xl border border-stone-800 mb-3 text-xs">
                <img src={pinnedProduct.images[0]} alt="" className="w-12 h-12 rounded object-cover" />
                <div>
                  <h5 className="font-bold text-white truncate max-w-[200px]">{pinnedProduct.title}</h5>
                  <span className="text-stone-400">Regular: </span>
                  <span className="font-mono text-emerald-400 font-bold">{formatCurrency(pinnedProduct.priceKes, currency)}</span>
                </div>
              </div>

              <form onSubmit={handleLiveOfferSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-stone-300 block mb-1 font-semibold">Your Proposed Offer (KES):</label>
                  <input
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-white font-mono text-base font-bold"
                    required
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    Host will review and can accept, counter-offer, or decline instantly live on stream.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow flex items-center justify-center gap-2"
                >
                  <Tag className="w-4 h-4 text-stone-950" />
                  <span>Submit Offer to Seller</span>
                </button>
              </form>
            </div>
          )}

          {/* STREAM DEMO CHAPTERS DRAWER */}
          {showChaptersDrawer && stream.chapters && (
            <div className="absolute top-16 right-4 z-40 bg-stone-950/95 backdrop-blur-xl border border-stone-700 rounded-2xl p-4 shadow-2xl animate-fade-in w-72 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800 mb-3">
                <span className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Broadcast Chapters
                </span>
                <button onClick={() => setShowChaptersDrawer(false)} className="text-stone-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {stream.chapters.map(chap => (
                  <div
                    key={chap.id}
                    className="p-2 bg-stone-900 rounded-lg border border-stone-800 flex items-center justify-between hover:border-emerald-500 cursor-pointer"
                  >
                    <div>
                      <span className="font-mono text-emerald-400 font-bold text-[10px] block">{chap.timestamp}</span>
                      <span className="text-stone-200 font-medium">{chap.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SIDE-BY-SIDE PRODUCT COMPARISON MODAL */}
          {showComparisonModal && (
            <div className="absolute inset-4 z-40 bg-stone-950/95 backdrop-blur-xl border border-stone-700 rounded-2xl p-5 shadow-2xl animate-fade-in flex flex-col text-xs overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-display font-bold text-white text-base">
                    Side-by-Side Live Product Comparison
                  </h4>
                </div>
                <button onClick={() => setShowComparisonModal(false)} className="text-stone-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 flex-1">
                {/* Column 1: Current Pinned Product */}
                <div className="p-4 bg-stone-900/80 rounded-xl border border-stone-800 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Item A (Featured Drop)</span>
                  <img src={pinnedProduct.images[0]} alt="" className="w-full h-32 object-cover rounded-lg" />
                  <h5 className="font-bold text-white text-sm">{pinnedProduct.title}</h5>
                  <div className="font-mono text-lg font-bold text-emerald-400">
                    {formatCurrency(pinnedProduct.priceKes, currency)}
                  </div>
                  <div className="space-y-1 text-stone-300 text-[11px] border-t border-stone-800 pt-2">
                    <div><strong className="text-stone-400">Origin:</strong> {pinnedProduct.countyOrigin} County</div>
                    <div><strong className="text-stone-400">Category:</strong> {pinnedProduct.category}</div>
                    <div><strong className="text-stone-400">Rating:</strong> {pinnedProduct.rating} ★ ({pinnedProduct.reviewCount} reviews)</div>
                    <div><strong className="text-stone-400">Stock:</strong> {pinnedProduct.stock} left</div>
                  </div>
                  <button
                    onClick={() => {
                      setShowComparisonModal(false);
                      onInstantBuy(pinnedProduct);
                    }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg"
                  >
                    Buy Item A
                  </button>
                </div>

                {/* Column 2: Selected Comparison Product */}
                {(() => {
                  const compProd = products.find(p => p.id === compareProductId) || products[1] || products[0];
                  return (
                    <div className="p-4 bg-stone-900/80 rounded-xl border border-stone-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">Item B (Compare)</span>
                        <select
                          value={compareProductId}
                          onChange={(e) => setCompareProductId(e.target.value)}
                          className="bg-stone-950 text-stone-300 text-[10px] rounded border border-stone-700 px-1 py-0.5"
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.title.slice(0, 20)}...</option>
                          ))}
                        </select>
                      </div>
                      <img src={compProd.images[0]} alt="" className="w-full h-32 object-cover rounded-lg" />
                      <h5 className="font-bold text-white text-sm">{compProd.title}</h5>
                      <div className="font-mono text-lg font-bold text-emerald-400">
                        {formatCurrency(compProd.priceKes, currency)}
                      </div>
                      <div className="space-y-1 text-stone-300 text-[11px] border-t border-stone-800 pt-2">
                        <div><strong className="text-stone-400">Origin:</strong> {compProd.countyOrigin} County</div>
                        <div><strong className="text-stone-400">Category:</strong> {compProd.category}</div>
                        <div><strong className="text-stone-400">Rating:</strong> {compProd.rating} ★ ({compProd.reviewCount} reviews)</div>
                        <div><strong className="text-stone-400">Stock:</strong> {compProd.stock} left</div>
                      </div>
                      <button
                        onClick={() => {
                          setShowComparisonModal(false);
                          onInstantBuy(compProd);
                        }}
                        className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg"
                      >
                        Buy Item B
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* INTERACTIVE ZAWADI GIFTING DRAWER */}
          {showGiftDrawer && (
            <div className="absolute inset-x-4 bottom-24 z-40 bg-stone-950/95 backdrop-blur-xl border border-amber-500/60 rounded-2xl p-5 shadow-2xl animate-slide-up max-w-xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-400" />
                  <h4 className="font-display font-bold text-white text-sm">
                    Send Zawadi & Monetize Creators
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-stone-900 rounded-lg p-0.5 border border-stone-800 text-[11px]">
                    <button
                      onClick={() => setGiftTab('zawadi')}
                      className={`px-2.5 py-1 rounded font-bold ${
                        giftTab === 'zawadi' ? 'bg-amber-500 text-stone-950' : 'text-stone-400'
                      }`}
                    >
                      Virtual Gifts
                    </button>
                    <button
                      onClick={() => setGiftTab('direct_tip')}
                      className={`px-2.5 py-1 rounded font-bold ${
                        giftTab === 'direct_tip' ? 'bg-emerald-600 text-white' : 'text-stone-400'
                      }`}
                    >
                      M-Pesa Direct Tip
                    </button>
                  </div>

                  <button onClick={() => setShowGiftDrawer(false)} className="text-stone-400 hover:text-white p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {giftTab === 'zawadi' ? (
                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  {giftTiers.map(gift => (
                    <button
                      key={gift.id}
                      onClick={() => handleTriggerGift(gift)}
                      className="p-3 bg-stone-900/90 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/80 rounded-xl text-center flex flex-col items-center justify-between gap-1 transition-all active:scale-95 group shadow"
                    >
                      <span className="text-3xl group-hover:scale-125 transition-transform">{gift.icon}</span>
                      <span className="font-bold text-white text-xs">{gift.name}</span>
                      <span className="font-mono text-emerald-400 font-bold text-xs">
                        {formatCurrency(gift.amountKes, currency)}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSendTip} className="space-y-3 text-xs">
                  <div className="grid grid-cols-4 gap-2">
                    {[100, 250, 500, 1000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setCustomTipAmount(String(amt))}
                        className={`py-2 rounded-lg font-mono font-bold border ${
                          customTipAmount === String(amt)
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-stone-900 border-stone-800 text-stone-300'
                        }`}
                      >
                        KES {amt}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="text-stone-400 block mb-1">Custom Tip Amount (KES):</label>
                    <input
                      type="number"
                      min="10"
                      value={customTipAmount}
                      onChange={(e) => setCustomTipAmount(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 block mb-1">Shoutout Message (optional):</label>
                    <input
                      type="text"
                      placeholder="e.g. Keep up the high quality Kitenge fashion!"
                      value={customTipMessage}
                      onChange={(e) => setCustomTipMessage(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow flex items-center justify-center gap-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Send KES {customTipAmount} Tip to Creator Wallet</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR: Community Chat & Live Comment Stream */}
        <div className="w-full md:w-80 lg:w-96 bg-stone-900 border-t md:border-t-0 md:border-l border-stone-800 flex flex-col h-72 md:h-full">
          <div className="px-4 py-3 border-b border-stone-800 flex items-center justify-between bg-stone-900/90">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Live Community Chat
              </span>
            </div>
            <span className="text-[11px] text-stone-400">47 Counties Live</span>
          </div>

          {/* Comments Stream */}
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-xs"
          >
            {comments.map((c) => (
              <div
                key={c.id}
                className={`p-2.5 rounded-lg ${
                  c.isPinned
                    ? 'bg-amber-950/70 border border-amber-800'
                    : c.isSeller
                    ? 'bg-emerald-950/50 border border-emerald-800/60'
                    : 'bg-stone-950/60 border border-stone-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-semibold ${c.isSeller ? 'text-emerald-400' : 'text-stone-300'}`}>
                      {c.userName}
                    </span>
                    {c.isSeller && (
                      <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded uppercase">
                        Host
                      </span>
                    )}
                    {c.isPinned && (
                      <span className="text-[9px] bg-amber-500 text-stone-950 font-bold px-1.5 py-0.2 rounded uppercase">
                        Pinned
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-500">{c.timestamp}</span>
                </div>
                <p className="text-stone-200 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>

          {/* Chat Form & Like Reaction */}
          <div className="p-3 border-t border-stone-800 bg-stone-950/90">
            <form onSubmit={handleSendComment} className="flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Ask seller or send shoutout..."
                className="flex-1 bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
              />

              <button
                type="submit"
                className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                title="Send Message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleLike}
                className="p-2 bg-rose-950 border border-rose-800 hover:bg-rose-900 text-rose-400 rounded-lg transition-colors active:scale-95"
                title="Send Love"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
