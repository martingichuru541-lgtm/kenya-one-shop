export type Currency = 'KES' | 'USD' | 'GBP' | 'EUR';

export type SellerCategory = 
  | 'Agri & Fresh Farm'
  | 'Artisanal & Crafts'
  | 'Fashion & Kitenge'
  | 'Specialty Coffee & Tea'
  | 'Kenyan Leatherworks'
  | 'Tech & Hardware'
  | 'Beauty & Organics';

export type VerificationStatus = 
  | 'pending'
  | 'under_review'
  | 'verified'
  | 'rejected'
  | 'suspended';

export interface SellerProfile {
  id: string;
  sellerName: string;
  businessName: string;
  email: string;
  phone: string;
  location: string;
  county: string;
  category: SellerCategory;
  nationalIdNumber?: string;
  kraPin?: string;
  businessRegNumber?: string;
  status: VerificationStatus;
  settlementMethod: 'mpesa_till' | 'mpesa_paybill' | 'bank_account';
  settlementAccount: string;
  appliedDate: string;
  verifiedDate?: string;
  notes?: string;
}

export interface Store {
  id: string;
  slug: string;
  name: string;
  sellerId: string;
  sellerName: string;
  logo: string;
  banner: string;
  bio: string;
  county: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  rating: number;
  reviewCount: number;
  followerCount: number;
  salesCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  joinedDate: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
  priceKes?: number;
  stock?: number;
}

export interface Product {
  id: string;
  storeId: string;
  storeName: string;
  storeSlug: string;
  storeVerified: boolean;
  title: string;
  description: string;
  category: SellerCategory;
  priceKes: number;
  comparePriceKes?: number;
  stock: number;
  images: string[];
  videoPreviewUrl?: string;
  rating: number;
  reviewCount: number;
  isAuctionEligible: boolean;
  isLivePinned?: boolean;
  countyOrigin: string;
  isExportReady: boolean;
  tags: string[];
  specifications: Record<string, string>;
  // Advanced Live Commerce Extensions
  variants?: ProductVariant[];
  isFarmProduct?: boolean;
  farmHarvestDate?: string;
  farmOriginCooperative?: string;
  isWholesaleAvailable?: boolean;
  minOrderQuantity?: number;
  wholesaleTiers?: { minQty: number; priceKes: number }[];
  bulkPackageSize?: string;
}

export interface LivestreamComment {
  id: string;
  livestreamId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  timestamp: string;
  isSeller?: boolean;
  isPinned?: boolean;
  bidAmount?: number;
}

export interface StreamChapter {
  id: string;
  timestamp: string;
  title: string;
  productId?: string;
}

export interface StreamPollOption {
  text: string;
  votes: number;
}

export interface StreamPoll {
  id: string;
  question: string;
  options: StreamPollOption[];
  totalVotes: number;
  userVotedIndex?: number;
}

export interface FlashDeal {
  productId: string;
  productTitle: string;
  originalPriceKes: number;
  discountPriceKes: number;
  discountPercent: number;
  stockRemaining: number;
  endsAt: number;
}

export interface GroupBuyDeal {
  productId: string;
  productTitle: string;
  regularPriceKes: number;
  groupPriceKes: number;
  targetCount: number;
  currentCount: number;
  buyers: string[];
  expiresAt: number;
}

export interface GuestCoHostRequest {
  id: string;
  streamId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  county: string;
  topic?: string;
  status: 'pending' | 'accepted' | 'declined' | 'live';
  requestedAt: string;
  isAudioOnly?: boolean;
}

export interface LiveOffer {
  id: string;
  streamId: string;
  productId: string;
  productTitle: string;
  originalPriceKes: number;
  offerPriceKes: number;
  buyerId: string;
  buyerName: string;
  buyerCounty: string;
  status: 'pending' | 'accepted' | 'countered' | 'declined';
  counterPriceKes?: number;
  createdAt: string;
  expiresAt: number;
}

export interface CreatorAffiliate {
  id: string;
  userId: string;
  creatorName: string;
  handle: string;
  avatar: string;
  bio: string;
  county: string;
  commissionRate: number;
  affiliateCode: string;
  totalClicks: number;
  totalOrders: number;
  totalEarningsKes: number;
  pendingPayoutKes: number;
  approvedStores: string[];
}

export interface Livestream {
  id: string;
  storeId: string;
  storeName: string;
  storeSlug: string;
  sellerAvatar: string;
  title: string;
  description: string;
  category: SellerCategory;
  status: 'live' | 'upcoming' | 'ended';
  viewerCount: number;
  scheduledFor: string;
  streamPoster: string;
  sampleVideoUrl?: string;
  pinnedProductId?: string;
  pinnedProductIds?: string[];
  featuredProductIds: string[];
  likesCount: number;
  replayAvailable: boolean;
  // Advanced Live Commerce Extensions
  isFarmLive?: boolean;
  isWholesaleLive?: boolean;
  county?: string;
  shareCount?: number;
  coHost?: {
    userId: string;
    userName: string;
    userAvatar: string;
    county: string;
    isAudioOnly?: boolean;
  } | null;
  chapters?: StreamChapter[];
  activePoll?: StreamPoll | null;
  activeFlashDeal?: FlashDeal | null;
  activeGroupDeal?: GroupBuyDeal | null;
  activePromoCode?: { code: string; discountPercent: number; expiresAt: number } | null;
}

export interface Auction {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  storeId: string;
  storeName: string;
  startingPriceKes: number;
  currentBidKes: number;
  minIncrementKes: number;
  reservePriceKes: number;
  reserveMet: boolean;
  status: 'active' | 'upcoming' | 'ended' | 'reserve_not_met';
  startTime: string;
  endTime: number; // timestamp in ms
  highestBidder: {
    userId: string;
    userName: string;
    county: string;
  } | null;
  bidCount: number;
  antiSnipeExtensionCount: number;
}

export interface AuctionBid {
  id: string;
  auctionId: string;
  userId: string;
  userName: string;
  county: string;
  amountKes: number;
  timestamp: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export type OrderStatus = 
  | 'placed'
  | 'confirmed'
  | 'dispatched'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  priceKes: number;
  quantity: number;
  storeId: string;
  storeName: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  items: OrderItem[];
  subtotalKes: number;
  deliveryFeeKes: number;
  totalKes: number;
  currency: Currency;
  status: OrderStatus;
  paymentMethod: 'mpesa_daraja' | 'mpesa_paybill' | 'equity_bank' | 'kcb' | 'card' | 'paypal';
  paymentRef: string;
  courier: string;
  trackingCode: string;
  deliveryAddress: {
    county: string;
    city: string;
    addressLine: string;
    postalCode?: string;
    instructions?: string;
  };
  createdAt: string;
  confirmedAt?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
}

export interface CustomerReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  county: string;
  createdAt: string;
}

export interface SellerSettlement {
  id: string;
  storeId: string;
  storeName: string;
  period: string;
  grossSalesKes: number;
  commissionRate: number; // e.g. 0.08 for 8%
  commissionKes: number;
  deliveryFeesKes: number;
  netPayoutKes: number;
  settlementMethod: string;
  settlementAccount: string;
  status: 'settled' | 'pending';
  reference: string;
  processedDate?: string;
}

export interface CommerceAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  targetId: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface GiftTier {
  id: string;
  name: string;
  swahiliName: string;
  icon: string;
  amountKes: number;
  description: string;
  animationType: 'tea_steam' | 'ribbon_dance' | 'safari_sparkle' | 'shield_pulse' | 'simba_roar' | 'mt_kenya_gold';
}

export interface LiveGiftTransaction {
  id: string;
  streamId: string;
  senderName: string;
  senderCounty: string;
  giftId?: string;
  giftName?: string;
  amountKes: number;
  timestamp: string;
  message?: string;
  isTip?: boolean;
}

export interface CreatorWallet {
  storeId: string;
  totalGiftsReceivedKes: number;
  totalTipsReceivedKes: number;
  totalSalesReceivedKes: number;
  totalCashedOutKes: number;
  availableBalanceKes: number;
}

export type VideoFilterMode = 'normal' | 'studio_warm' | 'crisp_detail' | 'vibrant' | 'soft_glow';
export type VideoResolution = '1080p' | '720p' | '480p' | 'audio_only';

export interface BroadcastSettings {
  resolution: VideoResolution;
  filter: VideoFilterMode;
  isMicMuted: boolean;
  isCameraOff: boolean;
  facingMode: 'user' | 'environment';
}

export interface RafikiMessage {
  id: string;
  sender: 'user' | 'rafiki';
  text: string;
  timestamp: string;
  suggestedProductIds?: string[];
  actionPrompt?: string;
}
