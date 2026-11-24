import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Store, 
  Livestream, 
  Auction, 
  CartItem, 
  Order, 
  SellerProfile, 
  Currency, 
  VerificationStatus, 
  CommerceAuditLog,
  SellerSettlement,
  OrderStatus,
  GiftTier,
  LiveGiftTransaction,
  CreatorWallet,
  BroadcastSettings,
  RafikiMessage,
  GuestCoHostRequest,
  LiveOffer,
  CreatorAffiliate
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_STORES, 
  INITIAL_LIVESTREAMS, 
  INITIAL_AUCTIONS, 
  INITIAL_ORDERS, 
  INITIAL_SELLER_PROFILES, 
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTLEMENTS,
  ZAWADI_GIFT_TIERS,
  INITIAL_CREATOR_WALLETS,
  INITIAL_CREATOR_AFFILIATES,
  INITIAL_COHOST_REQUESTS
} from '../data/initialData';
import { generateOrderNumber, generateMpesaReceipt } from '../utils/formatters';

interface UserState {
  id: string;
  name: string;
  email: string;
  phone: string;
  county: string;
  role: 'buyer' | 'seller' | 'admin';
}

interface CommerceContextType {
  user: UserState;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
  products: Product[];
  stores: Store[];
  livestreams: Livestream[];
  auctions: Auction[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  sellerProfiles: SellerProfile[];
  auditLogs: CommerceAuditLog[];
  settlements: SellerSettlement[];
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  activeLivestreamId: string | null;
  openLivestream: (id: string) => void;
  closeLivestream: () => void;
  activeStoreSlug: string | null;
  setActiveStoreSlug: (slug: string | null) => void;
  activeProductId: string | null;
  setActiveProductId: (id: string | null) => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotalKes: number;
  
  // Wishlist
  toggleWishlist: (productId: string) => void;
  
  // Store Following
  followedStoreIds: string[];
  toggleFollowStore: (storeId: string) => void;
  
  // Auction Engine
  placeBid: (auctionId: string, amountKes: number) => { success: boolean; message: string };
  createAuction: (auction: Omit<Auction, 'id' | 'bidCount' | 'antiSnipeExtensionCount' | 'highestBidder' | 'reserveMet'>) => void;
  
  // Checkout & Orders
  processCheckout: (orderData: {
    buyerName: string;
    buyerPhone: string;
    buyerEmail: string;
    courier: string;
    deliveryFeeKes: number;
    paymentMethod: 'mpesa_daraja' | 'mpesa_paybill' | 'equity_bank' | 'kcb' | 'card' | 'paypal';
    paymentRef?: string;
    address: { county: string; city: string; addressLine: string; instructions?: string };
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, courierTracking?: string) => void;
  
  // Seller Applications & Moderation
  submitSellerApplication: (app: Omit<SellerProfile, 'id' | 'status' | 'appliedDate'>) => void;
  updateSellerStatus: (sellerId: string, status: VerificationStatus, notes?: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  
  // Livestream Management & High-Definition Broadcaster Suite
  createLivestream: (stream: Omit<Livestream, 'id' | 'viewerCount' | 'likesCount' | 'replayAvailable'>) => void;
  likeLivestream: (livestreamId: string) => void;
  isBroadcasting: boolean;
  broadcastSettings: BroadcastSettings;
  updateBroadcastSettings: (settings: Partial<BroadcastSettings>) => void;
  startBroadcasting: () => void;
  stopBroadcasting: () => void;
  isCreatorStudioOpen: boolean;
  setIsCreatorStudioOpen: (open: boolean) => void;

  // Gifting & Monetization Engine
  giftTiers: GiftTier[];
  liveGifts: LiveGiftTransaction[];
  creatorWallets: Record<string, CreatorWallet>;
  activeGiftAlert: LiveGiftTransaction | null;
  sendLiveGift: (streamId: string, giftId: string, customMessage?: string) => { success: boolean; message: string; gift: LiveGiftTransaction };
  sendDirectMpesaTip: (streamId: string, amountKes: number, message?: string) => { success: boolean; message: string; tip: LiveGiftTransaction };
  cashOutCreatorWallet: (storeId: string, phoneOrTill: string, amountKes: number) => { success: boolean; message: string; receipt: string };

  // Rafiki AI Assistant (Sheng, Swahili, English)
  rafikiMessages: RafikiMessage[];
  isRafikiOpen: boolean;
  setIsRafikiOpen: (open: boolean) => void;
  sendRafikiMessage: (text: string) => Promise<void>;
  
  // Financial settlements
  releaseSettlement: (settlementId: string) => void;

  // TikTok-Style Shared Live & Guest Co-Hosting
  coHostRequests: GuestCoHostRequest[];
  requestToJoinLive: (streamId: string, topic?: string, isAudioOnly?: boolean) => { success: boolean; message: string };
  respondToCoHostRequest: (requestId: string, accept: boolean) => void;
  endCoHostSession: (streamId: string) => void;
  shareLiveStream: (streamId: string, method: string) => { success: boolean; shareLink: string; shareCount: number };

  // Advanced Live Shopping & Deals
  pinProductToStream: (streamId: string, productId: string) => void;
  unpinProductFromStream: (streamId: string, productId: string) => void;
  liveOffers: LiveOffer[];
  submitLiveOffer: (streamId: string, productId: string, offerPriceKes: number) => { success: boolean; message: string; offer: LiveOffer };
  respondToLiveOffer: (offerId: string, action: 'accept' | 'counter' | 'decline', counterPriceKes?: number) => void;
  joinGroupBuyDeal: (streamId: string) => { success: boolean; message: string };
  voteLivePoll: (streamId: string, optionIndex: number) => void;

  // Creator Commerce & Affiliates
  affiliates: CreatorAffiliate[];
  trackAffiliateClick: (code: string) => void;
  applyForAffiliate: (data: { creatorName: string; handle: string; bio: string; county: string }) => { success: boolean; message: string };

  // Farm & Wholesale Live
  submitFarmProduceQuotation: (streamId: string, data: { crop: string; quantity: string; deliveryCounty: string; notes?: string }) => { success: boolean; message: string; quoteNumber: string };
  requestWholesaleSample: (productId: string, companyName: string, phone: string) => { success: boolean; message: string };

  // County Discovery
  selectedCountyFilter: string | null;
  setSelectedCountyFilter: (county: string | null) => void;

  // Shared Shopping Sessions
  activeSharedRoom: { roomCode: string; participants: string[]; streamId: string } | null;
  createSharedShoppingRoom: (streamId: string) => { roomCode: string; message: string };
  joinSharedShoppingRoom: (roomCode: string) => { success: boolean; message: string };
  leaveSharedShoppingRoom: () => void;
}

const CommerceContext = createContext<CommerceContextType | null>(null);

export const CommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserState>({
    id: 'user_main',
    name: 'Martin Gichuru',
    email: 'martin@example.com',
    phone: '+254 712 900 123',
    county: 'Nairobi',
    role: 'buyer'
  });

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [livestreams, setLivestreams] = useState<Livestream[]>(INITIAL_LIVESTREAMS);
  const [auctions, setAuctions] = useState<Auction[]>(INITIAL_AUCTIONS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['prod_1', 'prod_2']);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [sellerProfiles, setSellerProfiles] = useState<SellerProfile[]>(INITIAL_SELLER_PROFILES);
  const [auditLogs, setAuditLogs] = useState<CommerceAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [settlements, setSettlements] = useState<SellerSettlement[]>(INITIAL_SETTLEMENTS);
  const [currency, setCurrency] = useState<Currency>('KES');
  const [followedStoreIds, setFollowedStoreIds] = useState<string[]>(['store_1', 'store_2']);
  
  // View states
  const [activeLivestreamId, setActiveLivestreamId] = useState<string | null>(null);
  const [activeStoreSlug, setActiveStoreSlug] = useState<string | null>(null);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [isCreatorStudioOpen, setIsCreatorStudioOpen] = useState<boolean>(false);

  // Broadcaster Studio State
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSettings, setBroadcastSettings] = useState<BroadcastSettings>({
    resolution: '1080p',
    filter: 'studio_warm',
    isMicMuted: false,
    isCameraOff: false,
    facingMode: 'user'
  });

  // Gifting & Monetization Engine State
  const [giftTiers] = useState<GiftTier[]>(ZAWADI_GIFT_TIERS);
  const [liveGifts, setLiveGifts] = useState<LiveGiftTransaction[]>([
    {
      id: 'g_init_1',
      streamId: 'live_1',
      senderName: 'Faith Wanjiku',
      senderCounty: 'Nairobi',
      giftId: 'gift_chai',
      giftName: 'Chai Moto',
      amountKes: 50,
      timestamp: '14:05',
      message: 'Keep going Grace! Love the jackets!'
    },
    {
      id: 'g_init_2',
      streamId: 'live_1',
      senderName: 'Kevin Kiprono',
      senderCounty: 'Eldoret',
      giftId: 'gift_simba',
      giftName: 'Simba Roar',
      amountKes: 2000,
      timestamp: '14:10',
      message: 'Big up from Eldoret!'
    }
  ]);
  const [creatorWallets, setCreatorWallets] = useState<Record<string, CreatorWallet>>(INITIAL_CREATOR_WALLETS);
  const [activeGiftAlert, setActiveGiftAlert] = useState<LiveGiftTransaction | null>(null);

  // Advanced Live Commerce: Co-hosting, Deals, Affiliates, County Filter
  const [coHostRequests, setCoHostRequests] = useState<GuestCoHostRequest[]>(INITIAL_COHOST_REQUESTS);
  const [liveOffers, setLiveOffers] = useState<LiveOffer[]>([]);
  const [affiliates, setAffiliates] = useState<CreatorAffiliate[]>(INITIAL_CREATOR_AFFILIATES);
  const [selectedCountyFilter, setSelectedCountyFilter] = useState<string | null>(null);
  const [activeSharedRoom, setActiveSharedRoom] = useState<{ roomCode: string; participants: string[]; streamId: string } | null>(null);

  // Rafiki AI Assistant State
  const [isRafikiOpen, setIsRafikiOpen] = useState(false);
  const [rafikiMessages, setRafikiMessages] = useState<RafikiMessage[]>([
    {
      id: 'r_1',
      sender: 'rafiki',
      text: 'Niaje! I am Rafiki, your KenyaOne shopping companion. You can ask me in Sheng, Swahili, or English about live drops, Nyeri AA coffee, Maasai beadwork, or M-Pesa escrow delivery!',
      timestamp: 'Just now'
    }
  ]);

  // Background ticker for active auctions (countdown decrement & simulated active community bids)
  useEffect(() => {
    const timer = setInterval(() => {
      setAuctions(prevAuctions => 
        prevAuctions.map(auc => {
          if (auc.status !== 'active') return auc;
          const timeLeft = auc.endTime - Date.now();
          if (timeLeft <= 0) {
            return {
              ...auc,
              status: auc.reserveMet ? 'ended' : 'reserve_not_met'
            };
          }
          return auc;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const openLivestream = (id: string) => {
    setActiveLivestreamId(id);
    // increment viewer count
    setLivestreams(prev => prev.map(l => l.id === id ? { ...l, viewerCount: l.viewerCount + 1 } : l));
  };

  const closeLivestream = () => {
    setActiveLivestreamId(null);
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const cartSubtotalKes = cart.reduce(
    (sum, item) => sum + item.product.priceKes * item.quantity, 
    0
  );

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const toggleFollowStore = (storeId: string) => {
    setFollowedStoreIds(prev => {
      const isFollowing = prev.includes(storeId);
      const next = isFollowing ? prev.filter(id => id !== storeId) : [...prev, storeId];
      // update follower count on store
      setStores(prevStores => prevStores.map(s => 
        s.id === storeId ? { ...s, followerCount: s.followerCount + (isFollowing ? -1 : 1) } : s
      ));
      return next;
    });
  };

  // Atomic Live Auction Bid Engine
  const placeBid = (auctionId: string, amountKes: number): { success: boolean; message: string } => {
    const auction = auctions.find(a => a.id === auctionId);
    if (!auction) {
      return { success: false, message: 'Auction item not found.' };
    }
    if (auction.status !== 'active') {
      return { success: false, message: 'This auction has ended or is not currently active.' };
    }

    const minRequired = auction.currentBidKes + auction.minIncrementKes;
    if (amountKes < minRequired) {
      return { 
        success: false, 
        message: `Bid must be at least KES ${minRequired.toLocaleString('en-KE')} (Current bid + min increment).` 
      };
    }

    if (auction.highestBidder?.userId === user.id) {
      return { success: false, message: 'You are already the highest bidder for this item!' };
    }

    const msRemaining = auction.endTime - Date.now();
    let extendedEndTime = auction.endTime;
    let antiSnipeTriggered = false;

    // ANTI-SNIPING RULE: If bid arrives within the last 15 seconds, automatically add 15 seconds!
    if (msRemaining < 15000 && msRemaining > 0) {
      extendedEndTime = Date.now() + 16000;
      antiSnipeTriggered = true;
    }

    const reserveMet = amountKes >= auction.reservePriceKes;

    setAuctions(prev => prev.map(a => {
      if (a.id === auctionId) {
        return {
          ...a,
          currentBidKes: amountKes,
          bidCount: a.bidCount + 1,
          reserveMet,
          endTime: extendedEndTime,
          antiSnipeExtensionCount: a.antiSnipeExtensionCount + (antiSnipeTriggered ? 1 : 0),
          highestBidder: {
            userId: user.id,
            userName: user.name,
            county: user.county
          }
        };
      }
      return a;
    }));

    // Log to audit log
    const logEntry: CommerceAuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: `${user.name} (${user.id})`,
      role: 'Verified Buyer',
      action: 'AUCTION_BID_PLACED',
      targetId: auction.id,
      details: `Bid KES ${amountKes.toLocaleString('en-KE')} placed on "${auction.productTitle}". ${antiSnipeTriggered ? 'ANTI-SNIPING EXTENSION +15s ACTIVATED.' : ''}`,
      severity: 'info'
    };
    setAuditLogs(prev => [logEntry, ...prev]);

    return { 
      success: true, 
      message: antiSnipeTriggered 
        ? `Bid KES ${amountKes.toLocaleString('en-KE')} accepted! Anti-sniping +15s extended.` 
        : `Bid KES ${amountKes.toLocaleString('en-KE')} accepted! You are now the highest bidder.` 
    };
  };

  const createAuction = (auctionData: Omit<Auction, 'id' | 'bidCount' | 'antiSnipeExtensionCount' | 'highestBidder' | 'reserveMet'>) => {
    const newAuction: Auction = {
      ...auctionData,
      id: `auc_${Date.now()}`,
      bidCount: 0,
      antiSnipeExtensionCount: 0,
      highestBidder: null,
      reserveMet: false
    };
    setAuctions(prev => [newAuction, ...prev]);

    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: `${user.name}`,
        role: 'Seller',
        action: 'AUCTION_SCHEDULED',
        targetId: newAuction.id,
        details: `Scheduled auction for "${newAuction.productTitle}", Starting KES ${newAuction.startingPriceKes}`,
        severity: 'info'
      },
      ...prev
    ]);
  };

  // Gifting & Tipping Monetization Handlers
  const sendLiveGift = (streamId: string, giftId: string, customMessage?: string) => {
    const gift = giftTiers.find(g => g.id === giftId);
    if (!gift) return { success: false, message: 'Gift not found.', gift: null as any };

    const stream = livestreams.find(l => l.id === streamId);
    const storeId = stream?.storeId || 'store_2';

    const tx: LiveGiftTransaction = {
      id: `gift_tx_${Date.now()}`,
      streamId,
      senderName: user.name,
      senderCounty: user.county,
      giftId: gift.id,
      giftName: gift.name,
      amountKes: gift.amountKes,
      timestamp: new Date().toTimeString().substring(0, 5),
      message: customMessage || `Sent ${gift.name} ${gift.icon}!`,
      isTip: false
    };

    setLiveGifts(prev => [tx, ...prev]);
    setActiveGiftAlert(tx);
    setTimeout(() => setActiveGiftAlert(null), 4000);

    // Deposit to creator wallet
    setCreatorWallets(prev => {
      const current = prev[storeId] || {
        storeId,
        totalGiftsReceivedKes: 0,
        totalTipsReceivedKes: 0,
        totalSalesReceivedKes: 0,
        totalCashedOutKes: 0,
        availableBalanceKes: 0
      };
      return {
        ...prev,
        [storeId]: {
          ...current,
          totalGiftsReceivedKes: current.totalGiftsReceivedKes + gift.amountKes,
          availableBalanceKes: current.availableBalanceKes + gift.amountKes
        }
      };
    });

    // Audit log
    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: user.name,
        role: 'Viewer / Patron',
        action: 'ZAWADI_GIFT_SENT',
        targetId: streamId,
        details: `Sent ${gift.name} (KES ${gift.amountKes}) to ${stream?.storeName || 'Host'}`,
        severity: 'info'
      },
      ...prev
    ]);

    return {
      success: true,
      message: `Sent ${gift.name} (${gift.icon}) to creator! KES ${gift.amountKes} deposited to their M-Pesa wallet.`,
      gift: tx
    };
  };

  const sendDirectMpesaTip = (streamId: string, amountKes: number, message?: string) => {
    if (amountKes < 10) {
      return { success: false, message: 'Minimum tip is KES 10.', tip: null as any };
    }

    const stream = livestreams.find(l => l.id === streamId);
    const storeId = stream?.storeId || 'store_2';

    const tx: LiveGiftTransaction = {
      id: `tip_tx_${Date.now()}`,
      streamId,
      senderName: user.name,
      senderCounty: user.county,
      amountKes,
      timestamp: new Date().toTimeString().substring(0, 5),
      message: message || `Sent direct M-Pesa tip of KES ${amountKes.toLocaleString()}!`,
      isTip: true
    };

    setLiveGifts(prev => [tx, ...prev]);
    setActiveGiftAlert(tx);
    setTimeout(() => setActiveGiftAlert(null), 5000);

    // Deposit to creator wallet
    setCreatorWallets(prev => {
      const current = prev[storeId] || {
        storeId,
        totalGiftsReceivedKes: 0,
        totalTipsReceivedKes: 0,
        totalSalesReceivedKes: 0,
        totalCashedOutKes: 0,
        availableBalanceKes: 0
      };
      return {
        ...prev,
        [storeId]: {
          ...current,
          totalTipsReceivedKes: current.totalTipsReceivedKes + amountKes,
          availableBalanceKes: current.availableBalanceKes + amountKes
        }
      };
    });

    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: user.name,
        role: 'Viewer / Patron',
        action: 'DIRECT_MPESA_TIP_SENT',
        targetId: streamId,
        details: `Sent direct tip of KES ${amountKes.toLocaleString()} to ${stream?.storeName || 'Host'}`,
        severity: 'info'
      },
      ...prev
    ]);

    return {
      success: true,
      message: `Direct M-Pesa tip of KES ${amountKes.toLocaleString()} sent successfully!`,
      tip: tx
    };
  };

  const cashOutCreatorWallet = (storeId: string, phoneOrTill: string, amountKes: number) => {
    const current = creatorWallets[storeId] || {
      storeId,
      totalGiftsReceivedKes: 0,
      totalTipsReceivedKes: 0,
      totalSalesReceivedKes: 0,
      totalCashedOutKes: 0,
      availableBalanceKes: 0
    };

    if (amountKes <= 0 || amountKes > current.availableBalanceKes) {
      return { success: false, message: 'Invalid cashout amount or insufficient balance.', receipt: '' };
    }

    const receipt = `B2C-MPESA-${generateMpesaReceipt()}`;

    setCreatorWallets(prev => ({
      ...prev,
      [storeId]: {
        ...current,
        totalCashedOutKes: current.totalCashedOutKes + amountKes,
        availableBalanceKes: current.availableBalanceKes - amountKes
      }
    }));

    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: user.name,
        role: 'Seller / Creator',
        action: 'CREATOR_ZAWADI_CASHOUT',
        targetId: storeId,
        details: `Disbursed KES ${amountKes.toLocaleString()} to ${phoneOrTill} via Daraja B2C. Ref: ${receipt}`,
        severity: 'info'
      },
      ...prev
    ]);

    return {
      success: true,
      message: `KES ${amountKes.toLocaleString()} cashed out successfully to ${phoneOrTill}!`,
      receipt
    };
  };

  // Broadcaster settings & state
  const updateBroadcastSettings = (newSettings: Partial<BroadcastSettings>) => {
    setBroadcastSettings(prev => ({ ...prev, ...newSettings }));
  };

  const startBroadcasting = () => {
    setIsBroadcasting(true);
    // add an active stream
    const newStreamId = `live_creator_${Date.now()}`;
    const newStream: Livestream = {
      id: newStreamId,
      storeId: 'store_2',
      storeName: 'Wambui Designs Nairobi (Live Studio)',
      storeSlug: 'wambui-designs',
      sellerAvatar: '/src/assets/images/livestream_studio_host_1794002336736.jpg',
      title: '🔴 LIVE HD: Wambui Studio 1080p Runway & Zawadi Gifting!',
      description: 'Broadcasting live in 1080p FHD from Nairobi Studio! Send Zawadi gifts, chat live, and grab exclusive flash drops.',
      category: 'Fashion & Kitenge',
      status: 'live',
      viewerCount: 142,
      scheduledFor: new Date().toISOString(),
      streamPoster: '/src/assets/images/livestream_studio_host_1794002336736.jpg',
      pinnedProductId: 'prod_4',
      featuredProductIds: ['prod_4', 'prod_2', 'prod_1'],
      likesCount: 520,
      replayAvailable: true
    };
    setLivestreams(prev => [newStream, ...prev]);
    setActiveLivestreamId(newStreamId);
  };

  const stopBroadcasting = () => {
    setIsBroadcasting(false);
  };

  // Rafiki AI Assistant Chat
  const sendRafikiMessage = async (text: string) => {
    const userMsg: RafikiMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setRafikiMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/ai/rafiki', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      const replyText = data.reply || 'Sasa! Nipo hapa kukusaidia kwenye KenyaOne. Uliza kuhusu bidhaa zetu au malipo ya M-Pesa.';

      // Extract relevant product links if user asks about coffee, beadwork, or jacket
      const lower = text.toLowerCase();
      let matchedProds: string[] = [];
      if (lower.includes('coffee') || lower.includes('kahawa')) matchedProds.push('prod_1');
      if (lower.includes('bead') || lower.includes('maasai')) matchedProds.push('prod_2');
      if (lower.includes('stone') || lower.includes('kisii')) matchedProds.push('prod_3');
      if (lower.includes('jacket') || lower.includes('kitenge')) matchedProds.push('prod_4');

      const botMsg: RafikiMessage = {
        id: `raf_${Date.now()}`,
        sender: 'rafiki',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProductIds: matchedProds.length > 0 ? matchedProds : undefined
      };
      setRafikiMessages(prev => [...prev, botMsg]);
    } catch (err) {
      // Fallback if offline
      const botMsg: RafikiMessage = {
        id: `raf_${Date.now()}`,
        sender: 'rafiki',
        text: 'Niaje! Niko hapa. We offer single-origin Mt. Kenya AA coffee, authentic Kisii stone art, and handmade Kitenge jackets across Kenya with Lipa na M-Pesa escrow.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setRafikiMessages(prev => [...prev, botMsg]);
    }
  };

  const processCheckout = (orderData: {
    buyerName: string;
    buyerPhone: string;
    buyerEmail: string;
    courier: string;
    deliveryFeeKes: number;
    paymentMethod: 'mpesa_daraja' | 'mpesa_paybill' | 'equity_bank' | 'kcb' | 'card' | 'paypal';
    paymentRef?: string;
    address: { county: string; city: string; addressLine: string; instructions?: string };
  }): Order => {
    const orderItems = cart.map(item => ({
      productId: item.product.id,
      title: item.product.title,
      image: item.product.images[0],
      priceKes: item.product.priceKes,
      quantity: item.quantity,
      storeId: item.product.storeId,
      storeName: item.product.storeName
    }));

    const totalKes = cartSubtotalKes + orderData.deliveryFeeKes;
    const paymentRef = orderData.paymentRef || (
      orderData.paymentMethod === 'mpesa_daraja' || orderData.paymentMethod === 'mpesa_paybill'
        ? generateMpesaReceipt() 
        : `BNK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    );

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: generateOrderNumber(),
      buyerId: user.id,
      buyerName: orderData.buyerName,
      buyerPhone: orderData.buyerPhone,
      buyerEmail: orderData.buyerEmail,
      items: orderItems,
      subtotalKes: cartSubtotalKes,
      deliveryFeeKes: orderData.deliveryFeeKes,
      totalKes,
      currency,
      status: 'confirmed',
      paymentMethod: orderData.paymentMethod,
      paymentRef,
      courier: orderData.courier,
      trackingCode: `TRK-${orderData.courier.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      deliveryAddress: orderData.address,
      createdAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    // deduct stock
    cart.forEach(item => {
      setProducts(prevProducts => prevProducts.map(p => 
        p.id === item.product.id ? { ...p, stock: Math.max(0, p.stock - item.quantity) } : p
      ));
    });

    clearCart();

    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: `${orderData.buyerName}`,
        role: 'Buyer',
        action: 'ORDER_PLACED_PAID',
        targetId: newOrder.orderNumber,
        details: `Payment confirmed via ${orderData.paymentMethod} (Ref: ${paymentRef}) Total: KES ${totalKes.toLocaleString('en-KE')}`,
        severity: 'info'
      },
      ...prev
    ]);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, courierTracking?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          ...(courierTracking ? { trackingCode: courierTracking } : {}),
          ...(status === 'dispatched' ? { dispatchedAt: new Date().toISOString() } : {}),
          ...(status === 'delivered' ? { deliveredAt: new Date().toISOString() } : {})
        };
      }
      return o;
    }));

    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: user.name,
        role: user.role === 'admin' ? 'Administrator' : 'Seller / Logistics',
        action: 'ORDER_STATUS_CHANGED',
        targetId: orderId,
        details: `Order status advanced to "${status.toUpperCase()}"`,
        severity: 'info'
      },
      ...prev
    ]);
  };

  const submitSellerApplication = (appData: Omit<SellerProfile, 'id' | 'status' | 'appliedDate'>) => {
    const newProfile: SellerProfile = {
      ...appData,
      id: `seller_${Date.now()}`,
      status: 'under_review',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    setSellerProfiles(prev => [newProfile, ...prev]);

    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: appData.sellerName,
        role: 'Seller Applicant',
        action: 'SELLER_APPLICATION_SUBMITTED',
        targetId: newProfile.id,
        details: `Application submitted for store "${appData.businessName}" in ${appData.county} County.`,
        severity: 'info'
      },
      ...prev
    ]);
  };

  const updateSellerStatus = (sellerId: string, status: VerificationStatus, notes?: string) => {
    setSellerProfiles(prev => prev.map(s => {
      if (s.id === sellerId) {
        return {
          ...s,
          status,
          notes: notes || s.notes,
          verifiedDate: status === 'verified' ? new Date().toISOString().split('T')[0] : s.verifiedDate
        };
      }
      return s;
    }));

    if (status === 'verified') {
      const profile = sellerProfiles.find(s => s.id === sellerId);
      if (profile && !stores.some(st => st.sellerId === sellerId)) {
        const slug = profile.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newStore: Store = {
          id: `store_${Date.now()}`,
          slug,
          name: profile.businessName,
          sellerId: profile.id,
          sellerName: profile.sellerName,
          logo: '/src/assets/images/hero_kenyaone_marketplace_1794002334625.jpg',
          banner: '/src/assets/images/hero_kenyaone_marketplace_1794002334625.jpg',
          bio: `Verified KenyaOne seller in ${profile.county} County specializing in ${profile.category}.`,
          county: profile.county,
          location: profile.location,
          contactEmail: profile.email,
          contactPhone: profile.phone,
          whatsapp: profile.phone,
          rating: 5.0,
          reviewCount: 0,
          followerCount: 1,
          salesCount: 0,
          isVerified: true,
          isFeatured: false,
          joinedDate: new Date().toISOString().split('T')[0]
        };
        setStores(prev => [...prev, newStore]);
      }
    }

    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: user.name,
        role: 'Administrator',
        action: 'SELLER_STATUS_CHANGED',
        targetId: sellerId,
        details: `Seller status updated to "${status.toUpperCase()}". Note: ${notes || 'None'}`,
        severity: status === 'suspended' || status === 'rejected' ? 'warning' : 'info'
      },
      ...prev
    ]);
  };

  const addProduct = (prodData: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const newProd: Product = {
      ...prodData,
      id: `prod_${Date.now()}`,
      rating: 5.0,
      reviewCount: 0
    };
    setProducts(prev => [newProd, ...prev]);

    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: user.name,
        role: 'Seller',
        action: 'PRODUCT_PUBLISHED',
        targetId: newProd.id,
        details: `Published "${newProd.title}" under ${newProd.category}. Stock: ${newProd.stock}`,
        severity: 'info'
      },
      ...prev
    ]);
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
  };

  const createLivestream = (streamData: Omit<Livestream, 'id' | 'viewerCount' | 'likesCount' | 'replayAvailable'>) => {
    const newStream: Livestream = {
      ...streamData,
      id: `live_${Date.now()}`,
      viewerCount: 1,
      likesCount: 0,
      replayAvailable: true
    };
    setLivestreams(prev => [newStream, ...prev]);

    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: user.name,
        role: 'Seller',
        action: 'LIVESTREAM_CREATED',
        targetId: newStream.id,
        details: `Started live stream show "${newStream.title}"`,
        severity: 'info'
      },
      ...prev
    ]);
  };

  const likeLivestream = (livestreamId: string) => {
    setLivestreams(prev => prev.map(l => 
      l.id === livestreamId ? { ...l, likesCount: l.likesCount + 1 } : l
    ));
  };

  const releaseSettlement = (settlementId: string) => {
    setSettlements(prev => prev.map(s => {
      if (s.id === settlementId) {
        return {
          ...s,
          status: 'settled',
          reference: `B2C-MPESA-${Math.floor(100000 + Math.random() * 900000)}`,
          processedDate: new Date().toISOString().split('T')[0]
        };
      }
      return s;
    }));

    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: user.name,
        role: 'Administrator',
        action: 'SETTLEMENT_PAYOUT_EXECUTED',
        targetId: settlementId,
        details: `Released M-Pesa B2C settlement payment for settlement ${settlementId}`,
        severity: 'info'
      },
      ...prev
    ]);
  };

  // TikTok-Style Live Co-Hosting Handlers
  const requestToJoinLive = (streamId: string, topic?: string, isAudioOnly: boolean = false) => {
    const existing = coHostRequests.find(r => r.streamId === streamId && r.userId === user.id && r.status === 'pending');
    if (existing) {
      return { success: false, message: 'Your request to join live is already pending review by the host.' };
    }

    const newReq: GuestCoHostRequest = {
      id: `req_${Date.now()}`,
      streamId,
      userId: user.id,
      userName: user.name,
      userAvatar: '/src/assets/images/livestream_studio_host_1794002336736.jpg',
      county: user.county,
      topic: topic || 'Buyer questions & live demo',
      status: 'pending',
      requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAudioOnly
    };

    setCoHostRequests(prev => [newReq, ...prev]);
    return { success: true, message: 'Request sent to host! When accepted, you will appear live on split-screen.' };
  };

  const respondToCoHostRequest = (requestId: string, accept: boolean) => {
    setCoHostRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return { ...r, status: accept ? 'live' : 'declined' };
      }
      return r;
    }));

    const req = coHostRequests.find(r => r.id === requestId);
    if (req && accept) {
      setLivestreams(prev => prev.map(l => {
        if (l.id === req.streamId) {
          return {
            ...l,
            coHost: {
              userId: req.userId,
              userName: req.userName,
              userAvatar: req.userAvatar,
              county: req.county,
              isAudioOnly: req.isAudioOnly
            }
          };
        }
        return l;
      }));
    }
  };

  const endCoHostSession = (streamId: string) => {
    setLivestreams(prev => prev.map(l => {
      if (l.id === streamId) {
        return { ...l, coHost: null };
      }
      return l;
    }));
    setCoHostRequests(prev => prev.map(r => r.streamId === streamId ? { ...r, status: 'declined' } : r));
  };

  const shareLiveStream = (streamId: string, method: string) => {
    const target = livestreams.find(l => l.id === streamId);
    const shareLink = `${window.location.origin}?tab=live&stream=${streamId}&ref=${user.id}`;
    
    setLivestreams(prev => prev.map(l => l.id === streamId ? { ...l, shareCount: (l.shareCount || 0) + 1 } : l));

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareLink).catch(() => {});
    }

    return {
      success: true,
      shareLink,
      shareCount: (target?.shareCount || 0) + 1
    };
  };

  // Multi-Product Pinning
  const pinProductToStream = (streamId: string, productId: string) => {
    setLivestreams(prev => prev.map(l => {
      if (l.id === streamId) {
        const currentPins = l.pinnedProductIds || (l.pinnedProductId ? [l.pinnedProductId] : []);
        const updated = Array.from(new Set([productId, ...currentPins]));
        return {
          ...l,
          pinnedProductId: productId,
          pinnedProductIds: updated
        };
      }
      return l;
    }));
  };

  const unpinProductFromStream = (streamId: string, productId: string) => {
    setLivestreams(prev => prev.map(l => {
      if (l.id === streamId) {
        const currentPins = (l.pinnedProductIds || []).filter(id => id !== productId);
        return {
          ...l,
          pinnedProductId: currentPins[0] || undefined,
          pinnedProductIds: currentPins
        };
      }
      return l;
    }));
  };

  // Live Bargaining / Offers
  const submitLiveOffer = (streamId: string, productId: string, offerPriceKes: number) => {
    const product = products.find(p => p.id === productId);
    const newOffer: LiveOffer = {
      id: `offer_${Date.now()}`,
      streamId,
      productId,
      productTitle: product ? product.title : 'Live Product',
      originalPriceKes: product ? product.priceKes : offerPriceKes,
      offerPriceKes,
      buyerId: user.id,
      buyerName: user.name,
      buyerCounty: user.county,
      status: 'pending',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiresAt: Date.now() + 300000
    };

    setLiveOffers(prev => [newOffer, ...prev]);
    return {
      success: true,
      message: `Offer of KES ${offerPriceKes.toLocaleString()} submitted to host!`,
      offer: newOffer
    };
  };

  const respondToLiveOffer = (offerId: string, action: 'accept' | 'counter' | 'decline', counterPriceKes?: number) => {
    setLiveOffers(prev => prev.map(o => {
      if (o.id === offerId) {
        return {
          ...o,
          status: action === 'accept' ? 'accepted' : action === 'counter' ? 'countered' : 'declined',
          counterPriceKes: action === 'counter' ? counterPriceKes : undefined
        };
      }
      return o;
    }));
  };

  const joinGroupBuyDeal = (streamId: string) => {
    setLivestreams(prev => prev.map(l => {
      if (l.id === streamId && l.activeGroupDeal) {
        const buyers = l.activeGroupDeal.buyers || [];
        if (!buyers.includes(user.name)) {
          const updatedBuyers = [...buyers, user.name];
          return {
            ...l,
            activeGroupDeal: {
              ...l.activeGroupDeal,
              buyers: updatedBuyers,
              currentCount: updatedBuyers.length
            }
          };
        }
      }
      return l;
    }));
    return { success: true, message: 'You joined the Chama Group Deal! You will receive the bulk discount.' };
  };

  const voteLivePoll = (streamId: string, optionIndex: number) => {
    setLivestreams(prev => prev.map(l => {
      if (l.id === streamId && l.activePoll) {
        const options = l.activePoll.options.map((opt, idx) => {
          if (idx === optionIndex) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });
        return {
          ...l,
          activePoll: {
            ...l.activePoll,
            options,
            totalVotes: l.activePoll.totalVotes + 1,
            userVotedIndex: optionIndex
          }
        };
      }
      return l;
    }));
  };

  // Creator Affiliate Commerce
  const trackAffiliateClick = (code: string) => {
    setAffiliates(prev => prev.map(a => 
      a.affiliateCode.toUpperCase() === code.toUpperCase() 
        ? { ...a, totalClicks: a.totalClicks + 1 } 
        : a
    ));
  };

  const applyForAffiliate = (data: { creatorName: string; handle: string; bio: string; county: string }) => {
    const code = data.handle.replace(/[@\s]/g, '').toUpperCase().slice(0, 8) + '10';
    const newAffiliate: CreatorAffiliate = {
      id: `aff_${Date.now()}`,
      userId: user.id,
      creatorName: data.creatorName,
      handle: data.handle,
      avatar: '/src/assets/images/livestream_studio_host_1794002336736.jpg',
      bio: data.bio,
      county: data.county,
      commissionRate: 0.10,
      affiliateCode: code,
      totalClicks: 0,
      totalOrders: 0,
      totalEarningsKes: 0,
      pendingPayoutKes: 0,
      approvedStores: stores.map(s => s.id)
    };
    setAffiliates(prev => [newAffiliate, ...prev]);
    return { success: true, message: `Congratulations! Your affiliate partner profile is approved. Code: ${code}` };
  };

  // Farm Produce Quotation
  const submitFarmProduceQuotation = (streamId: string, data: { crop: string; quantity: string; deliveryCounty: string; notes?: string }) => {
    const quoteNumber = `K1-FARM-${Math.floor(1000 + Math.random() * 9000)}`;
    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: user.name,
        role: 'Buyer',
        action: 'FARM_QUOTE_REQUESTED',
        targetId: quoteNumber,
        details: `Requested bulk quote for ${data.quantity} of ${data.crop} to ${data.deliveryCounty} County`,
        severity: 'info'
      },
      ...prev
    ]);
    return {
      success: true,
      message: `Quotation request ${quoteNumber} submitted directly to cooperative farm managers.`,
      quoteNumber
    };
  };

  // Wholesale Sample
  const requestWholesaleSample = (productId: string, companyName: string, phone: string) => {
    const prod = products.find(p => p.id === productId);
    return {
      success: true,
      message: `Sample request for "${prod?.title || 'Wholesale Lot'}" submitted. Supplier dispatch will contact ${companyName} via ${phone}.`
    };
  };

  // Shared Shopping Room
  const createSharedShoppingRoom = (streamId: string) => {
    const roomCode = `K1-${Math.floor(100000 + Math.random() * 900000)}`;
    setActiveSharedRoom({
      roomCode,
      participants: [user.name],
      streamId
    });
    return { roomCode, message: `Shared shopping room ${roomCode} created! Share this code with friends.` };
  };

  const joinSharedShoppingRoom = (roomCode: string) => {
    setActiveSharedRoom({
      roomCode,
      participants: ['Host Friend', user.name],
      streamId: livestreams[0]?.id || 'live_1'
    });
    return { success: true, message: `Connected to shared shopping room ${roomCode}!` };
  };

  const leaveSharedShoppingRoom = () => {
    setActiveSharedRoom(null);
  };

  return (
    <CommerceContext.Provider
      value={{
        user,
        setUser,
        products,
        stores,
        livestreams,
        auctions,
        cart,
        wishlist,
        orders,
        sellerProfiles,
        auditLogs,
        settlements,
        currency,
        setCurrency,
        activeLivestreamId,
        openLivestream,
        closeLivestream,
        activeStoreSlug,
        setActiveStoreSlug,
        activeProductId,
        setActiveProductId,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotalKes,
        toggleWishlist,
        followedStoreIds,
        toggleFollowStore,
        placeBid,
        createAuction,
        processCheckout,
        updateOrderStatus,
        submitSellerApplication,
        updateSellerStatus,
        addProduct,
        updateProductStock,
        createLivestream,
        likeLivestream,
        releaseSettlement,
        // Gifting & Monetization
        giftTiers,
        liveGifts,
        creatorWallets,
        activeGiftAlert,
        sendLiveGift,
        sendDirectMpesaTip,
        cashOutCreatorWallet,
        // Broadcaster Studio Suite
        isBroadcasting,
        broadcastSettings,
        updateBroadcastSettings,
        startBroadcasting,
        stopBroadcasting,
        isCreatorStudioOpen,
        setIsCreatorStudioOpen,
        // Rafiki AI Assistant
        rafikiMessages,
        isRafikiOpen,
        setIsRafikiOpen,
        sendRafikiMessage,
        // Live Commerce TikTok-Style Co-Hosting & Sharing
        coHostRequests,
        requestToJoinLive,
        respondToCoHostRequest,
        endCoHostSession,
        shareLiveStream,
        // Advanced Live Shopping & Deals
        pinProductToStream,
        unpinProductFromStream,
        liveOffers,
        submitLiveOffer,
        respondToLiveOffer,
        joinGroupBuyDeal,
        voteLivePoll,
        // Creator Commerce & Affiliates
        affiliates,
        trackAffiliateClick,
        applyForAffiliate,
        // Farm & Wholesale Live
        submitFarmProduceQuotation,
        requestWholesaleSample,
        // County Discovery
        selectedCountyFilter,
        setSelectedCountyFilter,
        // Shared Shopping Sessions
        activeSharedRoom,
        createSharedShoppingRoom,
        joinSharedShoppingRoom,
        leaveSharedShoppingRoom
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
};

export const useCommerce = () => {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error('useCommerce must be used within a CommerceProvider');
  }
  return context;
};
