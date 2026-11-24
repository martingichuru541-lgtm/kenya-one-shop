import { 
  Store, 
  Product, 
  Livestream, 
  Auction, 
  SellerProfile, 
  Order, 
  CustomerReview, 
  SellerSettlement, 
  CommerceAuditLog,
  CreatorAffiliate,
  GuestCoHostRequest
} from '../types';

export const KENYA_COUNTIES = [
  'Nairobi', 'Mombasa', 'Kiambu', 'Nakuru', 'Uasin Gishu', 'Kisumu', 'Machakos', 
  'Kilifi', 'Narok', 'Kisii', 'Meru', 'Nyeri', 'Kericho', 'Murang\'a', 
  'Kakamega', 'Kajiado', 'Laikipia', 'Embu', 'Bomet', 'Kirinyaga', 'Garissa',
  'Turkana', 'Trans Nzoia', 'Nandi', 'Homa Bay', 'Migori', 'Kitui', 'Makueni',
  'Nyandarua', 'Taita Taveta', 'Baringo', 'Elgeyo Marakwet', 'Siaya', 'Busia',
  'Vihiga', 'Nyamira', 'Isiolo', 'Tharaka Nithi', 'Marsabit', 'Samburu', 'Mandera',
  'Wajir', 'Tana River', 'Lamu', 'Kwale', 'Bungoma', 'West Pokot'
];

export const KENYA_COURIERS = [
  { id: 'fargo', name: 'Fargo Courier Kenya', baseRateKes: 350, eta: '24-48 Hours' },
  { id: 'g4s', name: 'G4S Kenya Secure Courier', baseRateKes: 400, eta: '24-48 Hours' },
  { id: 'sendy', name: 'Sendy Express Direct', baseRateKes: 300, eta: 'Same Day / Next Day' },
  { id: 'speedaf', name: 'Speedaf Logistics Kenya', baseRateKes: 280, eta: '24-72 Hours' },
  { id: 'boda', name: 'Nairobi Express Boda Dispatch', baseRateKes: 250, eta: '2-4 Hours (Nairobi)' },
  { id: 'dhl', name: 'DHL Express International Global', baseRateKes: 3500, eta: '3-5 Business Days Worldwide' }
];

export const CURRENCY_RATES = {
  KES: 1,
  USD: 0.0077, // 1 USD ~ 130 KES
  GBP: 0.0061, // 1 GBP ~ 164 KES
  EUR: 0.0071, // 1 EUR ~ 140 KES
};

export const INITIAL_STORES: Store[] = [
  {
    id: 'store_1',
    slug: 'karibu-coffee-co',
    name: 'Karibu Coffee Co.',
    sellerId: 'seller_1',
    sellerName: 'David Mwangi',
    logo: '/src/assets/images/product_kenyan_aa_coffee_1794002334699.jpg',
    banner: '/src/assets/images/hero_kenyaone_marketplace_1794002334625.jpg',
    bio: 'Direct farm-to-cup Mount Kenya single-origin AA specialty coffees, wet-processed in Nyeri and roasted fresh in Nairobi.',
    county: 'Nyeri',
    location: 'Central Highlands & Industrial Area, Nairobi',
    contactEmail: 'orders@karibucoffee.co.ke',
    contactPhone: '+254 722 410 889',
    whatsapp: '+254 722 410 889',
    rating: 4.9,
    reviewCount: 342,
    followerCount: 5820,
    salesCount: 1420,
    isVerified: true,
    isFeatured: true,
    joinedDate: '2024-03-12'
  },
  {
    id: 'store_2',
    slug: 'wambui-designs',
    name: 'Wambui Designs Nairobi',
    sellerId: 'seller_2',
    sellerName: 'Grace Wambui',
    logo: '/src/assets/images/livestream_studio_host_1794002336736.jpg',
    banner: '/src/assets/images/hero_kenyaone_marketplace_1794002334625.jpg',
    bio: 'Contemporary African Kitenge wear, reversible bomber jackets, bespoke tailored blazers and artisanal street apparel.',
    county: 'Nairobi',
    location: 'Westlands Mall, Nairobi',
    contactEmail: 'contact@wambuidesigns.com',
    contactPhone: '+254 711 982 344',
    whatsapp: '+254 711 982 344',
    rating: 4.8,
    reviewCount: 215,
    followerCount: 9450,
    salesCount: 980,
    isVerified: true,
    isFeatured: true,
    joinedDate: '2024-01-19'
  },
  {
    id: 'store_3',
    slug: 'maasai-heritage-crafts',
    name: 'Maasai Mara Cultural Arts',
    sellerId: 'seller_3',
    sellerName: 'Ole Saitoti Lemayian',
    logo: '/src/assets/images/product_maasai_beadwork_1794002335625.jpg',
    banner: '/src/assets/images/hero_kenyaone_marketplace_1794002334625.jpg',
    bio: 'Authentic handcrafted Maasai glass bead collars, warriors bracelets, brass pendants, and ethically sourced leatherwork by Narok artisan collectives.',
    county: 'Narok',
    location: 'Talek Gate & Narok Town',
    contactEmail: 'arts@maasaicollective.or.ke',
    contactPhone: '+254 723 605 119',
    whatsapp: '+254 723 605 119',
    rating: 5.0,
    reviewCount: 178,
    followerCount: 12400,
    salesCount: 650,
    isVerified: true,
    isFeatured: true,
    joinedDate: '2024-02-04'
  },
  {
    id: 'store_4',
    slug: 'kisii-stone-masters',
    name: 'Kisii Stone Masters Cooperative',
    sellerId: 'seller_4',
    sellerName: 'Moses Nyachae',
    logo: '/src/assets/images/product_kisii_soapstone_1794002336977.jpg',
    banner: '/src/assets/images/hero_kenyaone_marketplace_1794002334625.jpg',
    bio: 'Hand-carved polished soapstone sculptures, chess sets, abstract family figures mined from the famous Tabaka quarries.',
    county: 'Kisii',
    location: 'Tabaka Hills, Kisii County',
    contactEmail: 'sales@kisiistonemasters.co.ke',
    contactPhone: '+254 734 511 200',
    whatsapp: '+254 734 511 200',
    rating: 4.9,
    reviewCount: 92,
    followerCount: 3890,
    salesCount: 410,
    isVerified: true,
    isFeatured: false,
    joinedDate: '2024-04-10'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    storeId: 'store_1',
    storeName: 'Karibu Coffee Co.',
    storeSlug: 'karibu-coffee-co',
    storeVerified: true,
    title: 'Mount Kenya AA Single Origin Specialty Coffee (250g)',
    description: '100% Arabica washed SL-28 & SL-34 varietal grown at 1,850m elevation on the volcanic slopes of Mt. Kenya. Notes of vibrant blackcurrant, juicy grapefruit, and rich brown sugar cane. Roasted fresh weekly.',
    category: 'Specialty Coffee & Tea',
    priceKes: 1200,
    comparePriceKes: 1450,
    stock: 45,
    images: ['/src/assets/images/product_kenyan_aa_coffee_1794002334699.jpg'],
    videoPreviewUrl: '',
    rating: 4.9,
    reviewCount: 184,
    isAuctionEligible: false,
    isLivePinned: true,
    countyOrigin: 'Nyeri',
    isExportReady: true,
    tags: ['Coffee', 'Single Origin', 'Mount Kenya', 'Fair Trade', 'Arabica'],
    specifications: {
      'Grade': 'Kenya AA',
      'Processing': 'Double Washed',
      'Altitude': '1,800m - 1,950m',
      'Roast Level': 'Medium Light Roast',
      'Weight': '250g Whole Bean'
    },
    variants: [
      { id: 'v_grind', name: 'Grind Type', options: ['Whole Bean', 'Medium Filter', 'Fine Espresso', 'French Press'] },
      { id: 'v_size', name: 'Pack Size', options: ['250g Tin', '500g Bag (Save KES 300)', '1kg Farm Direct'] }
    ],
    isFarmProduct: true,
    farmHarvestDate: 'October 2026 Season',
    farmOriginCooperative: 'Othaya Coffee Farmers Co-op (Nyeri)',
    isWholesaleAvailable: true,
    minOrderQuantity: 10,
    wholesaleTiers: [
      { minQty: 10, priceKes: 950 },
      { minQty: 50, priceKes: 820 },
      { minQty: 100, priceKes: 750 }
    ],
    bulkPackageSize: '60kg GrainPro Jute Bag / 10-pack Case'
  },
  {
    id: 'prod_2',
    storeId: 'store_3',
    storeName: 'Maasai Mara Cultural Arts',
    storeSlug: 'maasai-heritage-crafts',
    storeVerified: true,
    title: 'Ceremonial Royal Maasai Beaded Collar Necklace (Enkipai)',
    description: 'Museum-grade authentic Maasai Enkipai collar handcrafted by master beader Mama Nasieku in Narok. Constructed with thousands of vibrant geometric glass beads on durable cowhide leather backing. Symbolizes unity, celebration, and heritage.',
    category: 'Artisanal & Crafts',
    priceKes: 4800,
    comparePriceKes: 5500,
    stock: 12,
    images: ['/src/assets/images/product_maasai_beadwork_1794002335625.jpg'],
    rating: 5.0,
    reviewCount: 96,
    isAuctionEligible: true,
    isLivePinned: true,
    countyOrigin: 'Narok',
    isExportReady: true,
    tags: ['Maasai', 'Handmade', 'Beadwork', 'Cultural', 'Collectible'],
    specifications: {
      'Material': 'Czech Glass Beads & Cowhide Leather',
      'Inner Diameter': '16 cm (Flexible Hook Clasp)',
      'Origin': 'Narok County',
      'Artisan Collective': 'Mara Women Beaders Cooperative'
    }
  },
  {
    id: 'prod_3',
    storeId: 'store_4',
    storeName: 'Kisii Stone Masters Cooperative',
    storeSlug: 'kisii-stone-masters',
    storeVerified: true,
    title: 'Polished Kisii Soapstone "Undugu" Family Embrace Sculpture',
    description: 'Meticulously hand-carved from rare pinkish-grey Tabaka soapstone. This "Undugu" (Brotherhood/Family) sculpture depicts intertwined parents and children, hand-sanded with river sand and polished with natural beeswax for a silky marble-smooth finish.',
    category: 'Artisanal & Crafts',
    priceKes: 3800,
    comparePriceKes: 4400,
    stock: 8,
    images: ['/src/assets/images/product_kisii_soapstone_1794002336977.jpg'],
    rating: 4.8,
    reviewCount: 64,
    isAuctionEligible: true,
    isLivePinned: false,
    countyOrigin: 'Kisii',
    isExportReady: true,
    tags: ['Kisii Stone', 'Sculpture', 'Soapstone', 'Home Decor', 'Hand Carved'],
    specifications: {
      'Material': '100% Natural Tabaka Soapstone',
      'Height': '26 cm',
      'Weight': '2.4 kg',
      'Finish': 'Natural Beeswax Polish'
    }
  },
  {
    id: 'prod_4',
    storeId: 'store_2',
    storeName: 'Wambui Designs Nairobi',
    storeSlug: 'wambui-designs',
    storeVerified: true,
    title: 'Nairobi Kitenge Reversible Bomber Jacket',
    description: 'Modern statement jacket combining bold Ankara/Kitenge geometric patterns with water-repellent navy cotton twill on the reverse. Fitted with antique brass YKK zippers and ribbed knit collar.',
    category: 'Fashion & Kitenge',
    priceKes: 6500,
    comparePriceKes: 7800,
    stock: 24,
    images: ['/src/assets/images/livestream_studio_host_1794002336736.jpg'],
    rating: 4.9,
    reviewCount: 142,
    isAuctionEligible: false,
    isLivePinned: true,
    countyOrigin: 'Nairobi',
    isExportReady: true,
    tags: ['Fashion', 'Kitenge', 'Bomber Jacket', 'Streetwear', 'Made In Kenya'],
    specifications: {
      'Fabric': '100% Premium Cotton Wax Print & Twill',
      'Sizes': 'S, M, L, XL',
      'Care': 'Cold machine wash or dry clean',
      'Lining': 'Fully Reversible'
    },
    variants: [
      { id: 'v_size', name: 'Size', options: ['S (Chest 38)', 'M (Chest 40)', 'L (Chest 42)', 'XL (Chest 44)'] },
      { id: 'v_pattern', name: 'Kitenge Print', options: ['Nairobi Sunset Gold', 'Turkana Royal Indigo', 'Savannah Emerald'] }
    ],
    isWholesaleAvailable: true,
    minOrderQuantity: 5,
    wholesaleTiers: [
      { minQty: 5, priceKes: 5200 },
      { minQty: 20, priceKes: 4500 },
      { minQty: 50, priceKes: 3900 }
    ],
    bulkPackageSize: 'Boutique Case (10 Assorted Sizes)'
  },
  {
    id: 'prod_5',
    storeId: 'store_1',
    storeName: 'Karibu Coffee Co.',
    storeSlug: 'karibu-coffee-co',
    storeVerified: true,
    title: 'Kericho Reserve Hand-Plucked Purple Tea (100g Tin)',
    description: 'Rare anthocyanin-rich purple tea leaves cultivated at 2,200m elevation in Kericho. Naturally rich in antioxidants with a delicate sweet plum and floral aroma. Squeeze a drop of lemon to watch the tea turn bright pink!',
    category: 'Specialty Coffee & Tea',
    priceKes: 1500,
    comparePriceKes: 1800,
    stock: 30,
    images: ['/src/assets/images/hero_kenyaone_marketplace_1794002334625.jpg'],
    rating: 4.9,
    reviewCount: 88,
    isAuctionEligible: false,
    isLivePinned: false,
    countyOrigin: 'Kericho',
    isExportReady: true,
    tags: ['Purple Tea', 'Kericho', 'Antioxidants', 'Herbal', 'Specialty'],
    specifications: {
      'Grade': 'Superfine Whole Leaf',
      'Origin': 'Kericho Valley',
      'Packaging': 'Airtight UV Protective Tin',
      'Net Weight': '100g'
    }
  },
  {
    id: 'prod_6',
    storeId: 'store_3',
    storeName: 'Maasai Mara Cultural Arts',
    storeSlug: 'maasai-heritage-crafts',
    storeVerified: true,
    title: 'Collector\'s 1-of-1 Beaded Ceremonial Warrior Shield & Spear Crest',
    description: 'Historical reproduction of a 19th-century Maasai Morani ceremonial shield with traditional vegetable dyed hide and hand-strung beadwork talisman. Museum grade display artifact.',
    category: 'Artisanal & Crafts',
    priceKes: 18500,
    stock: 1,
    images: ['/src/assets/images/product_maasai_beadwork_1794002335625.jpg'],
    rating: 5.0,
    reviewCount: 14,
    isAuctionEligible: true,
    isLivePinned: false,
    countyOrigin: 'Narok',
    isExportReady: true,
    tags: ['Collector', 'Auction Only', 'Maasai Warrior', 'Heritage'],
    specifications: {
      'Rarity': 'Single Unique Piece',
      'Dimensions': '45cm x 30cm',
      'Certificate': 'Authenticated by Narok Cultural Center'
    }
  }
];

export const INITIAL_LIVESTREAMS: Livestream[] = [
  {
    id: 'live_1',
    storeId: 'store_2',
    storeName: 'Wambui Designs Nairobi',
    storeSlug: 'wambui-designs',
    sellerAvatar: '/src/assets/images/livestream_studio_host_1794002336736.jpg',
    title: '🔥 LIVE: Wambui Designs — Kitenge Runway & Flash Drops!',
    description: 'Join designer Grace live from Westlands as she shows the newest batch of reversible bomber jackets and takes custom sizing orders live! 15% flash discount active during stream.',
    category: 'Fashion & Kitenge',
    status: 'live',
    viewerCount: 428,
    scheduledFor: '2026-11-06T14:00:00Z',
    streamPoster: '/src/assets/images/livestream_studio_host_1794002336736.jpg',
    pinnedProductId: 'prod_4',
    pinnedProductIds: ['prod_4', 'prod_2'],
    featuredProductIds: ['prod_4', 'prod_2'],
    likesCount: 1890,
    replayAvailable: true,
    county: 'Nairobi',
    shareCount: 142,
    chapters: [
      { id: 'ch_1', timestamp: '00:00', title: 'Runway Welcome & Kitenge Origins' },
      { id: 'ch_2', timestamp: '03:15', title: 'Reversible Bomber Jacket Fit Demo', productId: 'prod_4' },
      { id: 'ch_3', timestamp: '08:40', title: 'Maasai Brass & Beadwork Styling', productId: 'prod_2' },
      { id: 'ch_4', timestamp: '14:20', title: 'Live Sizing Q&A & Flash Drop' }
    ],
    activePoll: {
      id: 'poll_1',
      question: 'Which new Kitenge pattern should Grace drop next Friday?',
      options: [
        { text: 'Nairobi Sunset Geometric', votes: 142 },
        { text: 'Turkana Tribal Gold', votes: 89 },
        { text: 'Savannah Emerald Floral', votes: 114 }
      ],
      totalVotes: 345
    },
    activeFlashDeal: {
      productId: 'prod_4',
      productTitle: 'Nairobi Kitenge Reversible Bomber Jacket',
      originalPriceKes: 6500,
      discountPriceKes: 5200,
      discountPercent: 20,
      stockRemaining: 7,
      endsAt: Date.now() + 600000 // 10 mins
    },
    activeGroupDeal: {
      productId: 'prod_4',
      productTitle: 'Chama Deal: Kitenge Bomber Jacket (Buy Together & Save)',
      regularPriceKes: 6500,
      groupPriceKes: 4800,
      targetCount: 5,
      currentCount: 3,
      buyers: ['Ann N.', 'Peter K.', 'Faith W.'],
      expiresAt: Date.now() + 1200000
    },
    activePromoCode: {
      code: 'KENYAONE15',
      discountPercent: 15,
      expiresAt: Date.now() + 3600000
    }
  },
  {
    id: 'live_2',
    storeId: 'store_3',
    storeName: 'Maasai Mara Cultural Arts',
    storeSlug: 'maasai-heritage-crafts',
    sellerAvatar: '/src/assets/images/product_maasai_beadwork_1794002335625.jpg',
    title: '⚡ RARE AUCTION: Hand-Beaded Enkipai & Live Morani Crafting!',
    description: 'Live auction from the Mara! Ole Saitoti is demonstrating intricate bead threading and running real-time 90-second KenyaOne Rapid Auctions on certified collector collars.',
    category: 'Artisanal & Crafts',
    status: 'live',
    viewerCount: 615,
    scheduledFor: '2026-11-06T14:15:00Z',
    streamPoster: '/src/assets/images/product_maasai_beadwork_1794002335625.jpg',
    pinnedProductId: 'prod_2',
    pinnedProductIds: ['prod_2', 'prod_6', 'prod_3'],
    featuredProductIds: ['prod_2', 'prod_6', 'prod_3'],
    likesCount: 3410,
    replayAvailable: true,
    county: 'Narok',
    shareCount: 284,
    chapters: [
      { id: 'ch_2_1', timestamp: '00:00', title: 'Talek Gate Live Greeting' },
      { id: 'ch_2_2', timestamp: '04:10', title: 'Enkipai Collar Glass Bead Crafting', productId: 'prod_2' },
      { id: 'ch_2_3', timestamp: '11:00', title: 'Tabaka Soapstone Undugu Sculpture', productId: 'prod_3' },
      { id: 'ch_2_4', timestamp: '18:30', title: '1-of-1 Morani Shield Auction', productId: 'prod_6' }
    ]
  },
  {
    id: 'live_farm_1',
    storeId: 'store_1',
    storeName: 'Karibu Coffee Co. & Othaya Farmers',
    storeSlug: 'karibu-coffee-co',
    sellerAvatar: '/src/assets/images/product_kenyan_aa_coffee_1794002334699.jpg',
    title: '🌱 FARM LIVE: Mount Kenya Harvest & Fresh Roasting Demonstration',
    description: 'Live from the Othaya Cooperative farm in Nyeri! See fresh red coffee cherries on the trees, wet pulping demo, and bulk green bean quotations for domestic and export roasters.',
    category: 'Agri & Fresh Farm',
    status: 'live',
    isFarmLive: true,
    viewerCount: 382,
    scheduledFor: '2026-11-06T15:00:00Z',
    streamPoster: '/src/assets/images/product_kenyan_aa_coffee_1794002334699.jpg',
    pinnedProductId: 'prod_1',
    pinnedProductIds: ['prod_1', 'prod_5'],
    featuredProductIds: ['prod_1', 'prod_5'],
    likesCount: 1620,
    replayAvailable: true,
    county: 'Nyeri',
    shareCount: 96,
    chapters: [
      { id: 'ch_f1', timestamp: '00:00', title: 'Farm Walk: SL-28 & Ruiru 11 Trees' },
      { id: 'ch_f2', timestamp: '05:30', title: 'Cherry Brix Sugar Measurement & Pulping' },
      { id: 'ch_f3', timestamp: '12:15', title: 'Roasting Demo & Aroma Profiles', productId: 'prod_1' },
      { id: 'ch_f4', timestamp: '19:40', title: 'Wholesale & B2B Bag Ordering' }
    ],
    activeFlashDeal: {
      productId: 'prod_1',
      productTitle: 'Mount Kenya AA Single-Origin (500g Fresh Roast)',
      originalPriceKes: 1200,
      discountPriceKes: 950,
      discountPercent: 21,
      stockRemaining: 15,
      endsAt: Date.now() + 900000
    }
  },
  {
    id: 'live_wholesale_1',
    storeId: 'store_2',
    storeName: 'Wambui Designs Wholesale',
    storeSlug: 'wambui-designs',
    sellerAvatar: '/src/assets/images/livestream_studio_host_1794002336736.jpg',
    title: '📦 WHOLESALE B2B LIVE: Authentic Kitenge Rolls & Boutique Orders (MOQ 10pcs)',
    description: 'B2B sourcing livestream for fashion retailers, hotel gift shops, and diaspora distributors. Live fabric inspections, factory pricing tiers, and sample box requests.',
    category: 'Fashion & Kitenge',
    status: 'live',
    isWholesaleLive: true,
    viewerCount: 195,
    scheduledFor: '2026-11-06T15:30:00Z',
    streamPoster: '/src/assets/images/hero_kenyaone_marketplace_1794002334625.jpg',
    pinnedProductId: 'prod_4',
    pinnedProductIds: ['prod_4'],
    featuredProductIds: ['prod_4'],
    likesCount: 890,
    replayAvailable: true,
    county: 'Nairobi',
    shareCount: 54
  },
  {
    id: 'live_3',
    storeId: 'store_1',
    storeName: 'Karibu Coffee Co.',
    storeSlug: 'karibu-coffee-co',
    sellerAvatar: '/src/assets/images/product_kenyan_aa_coffee_1794002334699.jpg',
    title: '☕ Upcoming Cupping: Nyeri Mount Kenya AA Fresh Roast & Farm Talk',
    description: 'David Mwangi hosts a cupping session with farm leaders from Othaya, discussing export standards, brewing tips, and giving away 5 fresh roast tins.',
    category: 'Specialty Coffee & Tea',
    status: 'upcoming',
    viewerCount: 0,
    scheduledFor: '2026-11-12T18:00:00Z',
    streamPoster: '/src/assets/images/hero_kenyaone_marketplace_1794002334625.jpg',
    pinnedProductId: 'prod_1',
    featuredProductIds: ['prod_1', 'prod_5'],
    likesCount: 420,
    replayAvailable: false,
    county: 'Nyeri'
  }
];

export const INITIAL_CREATOR_AFFILIATES: CreatorAffiliate[] = [
  {
    id: 'aff_1',
    userId: 'user_main',
    creatorName: 'Martin Gichuru',
    handle: '@martinkenyalive',
    avatar: '/src/assets/images/livestream_studio_host_1794002336736.jpg',
    bio: 'Kenyan lifestyle, tech & artisanal craft ambassador. Highlighting verified local makers.',
    county: 'Nairobi',
    commissionRate: 0.08,
    affiliateCode: 'MARTIN8',
    totalClicks: 1840,
    totalOrders: 94,
    totalEarningsKes: 48500,
    pendingPayoutKes: 14200,
    approvedStores: ['store_1', 'store_2', 'store_3']
  },
  {
    id: 'aff_2',
    userId: 'user_sarah',
    creatorName: 'Sarah Zawadi',
    handle: '@sarahstyleke',
    avatar: '/src/assets/images/product_maasai_beadwork_1794002335625.jpg',
    bio: 'African fashion stylist & runway curator based between Mombasa and Nairobi.',
    county: 'Mombasa',
    commissionRate: 0.10,
    affiliateCode: 'ZAWADI10',
    totalClicks: 2450,
    totalOrders: 168,
    totalEarningsKes: 92400,
    pendingPayoutKes: 28600,
    approvedStores: ['store_2', 'store_3']
  }
];

export const INITIAL_COHOST_REQUESTS: GuestCoHostRequest[] = [
  {
    id: 'req_1',
    streamId: 'live_1',
    userId: 'user_brian',
    userName: 'Brian Omondi',
    userAvatar: '/src/assets/images/product_maasai_beadwork_1794002335625.jpg',
    county: 'Kisumu',
    topic: 'Ask about sizing for XL Bomber Jacket & try on live',
    status: 'pending',
    requestedAt: '14:10',
    isAudioOnly: false
  },
  {
    id: 'req_2',
    streamId: 'live_1',
    userId: 'user_mercy',
    userName: 'Mercy Chebet',
    userAvatar: '/src/assets/images/product_kenyan_aa_coffee_1794002334699.jpg',
    county: 'Nakuru',
    topic: 'Wholesale question for Nakuru boutique',
    status: 'pending',
    requestedAt: '14:14',
    isAudioOnly: true
  }
];

export const INITIAL_AUCTIONS: Auction[] = [
  {
    id: 'auc_1',
    productId: 'prod_2',
    productTitle: 'Ceremonial Royal Maasai Beaded Collar Necklace (Enkipai)',
    productImage: '/src/assets/images/product_maasai_beadwork_1794002335625.jpg',
    storeId: 'store_3',
    storeName: 'Maasai Mara Cultural Arts',
    startingPriceKes: 2500,
    currentBidKes: 4600,
    minIncrementKes: 200,
    reservePriceKes: 3500,
    reserveMet: true,
    status: 'active',
    startTime: '2026-11-06T13:45:00Z',
    endTime: Date.now() + 185000, // 3+ minutes countdown
    highestBidder: {
      userId: 'user_grace',
      userName: 'Grace M.',
      county: 'Mombasa'
    },
    bidCount: 9,
    antiSnipeExtensionCount: 1
  },
  {
    id: 'auc_2',
    productId: 'prod_3',
    productTitle: 'Polished Kisii Soapstone "Undugu" Family Embrace Sculpture',
    productImage: '/src/assets/images/product_kisii_soapstone_1794002336977.jpg',
    storeId: 'store_4',
    storeName: 'Kisii Stone Masters Cooperative',
    startingPriceKes: 1500,
    currentBidKes: 2900,
    minIncrementKes: 200,
    reservePriceKes: 2500,
    reserveMet: true,
    status: 'active',
    startTime: '2026-11-06T13:50:00Z',
    endTime: Date.now() + 320000,
    highestBidder: {
      userId: 'user_kiprono',
      userName: 'Kevin Kiprono',
      county: 'Eldoret'
    },
    bidCount: 7,
    antiSnipeExtensionCount: 0
  },
  {
    id: 'auc_3',
    productId: 'prod_6',
    productTitle: 'Collector\'s 1-of-1 Beaded Ceremonial Warrior Shield & Spear Crest',
    productImage: '/src/assets/images/product_maasai_beadwork_1794002335625.jpg',
    storeId: 'store_3',
    storeName: 'Maasai Mara Cultural Arts',
    startingPriceKes: 10000,
    currentBidKes: 10000,
    minIncrementKes: 1000,
    reservePriceKes: 15000,
    reserveMet: false,
    status: 'upcoming',
    startTime: '2026-11-06T16:00:00Z',
    endTime: Date.now() + 7200000,
    highestBidder: null,
    bidCount: 0,
    antiSnipeExtensionCount: 0
  }
];

export const INITIAL_SELLER_PROFILES: SellerProfile[] = [
  {
    id: 'seller_1',
    sellerName: 'David Mwangi',
    businessName: 'Karibu Coffee Co.',
    email: 'orders@karibucoffee.co.ke',
    phone: '+254 722 410 889',
    location: 'Nyeri & Industrial Area Nairobi',
    county: 'Nyeri',
    category: 'Specialty Coffee & Tea',
    nationalIdNumber: '24981023',
    kraPin: 'P051289341K',
    businessRegNumber: 'BN/2021/98421',
    status: 'verified',
    settlementMethod: 'mpesa_paybill',
    settlementAccount: 'Paybill: 400200 · Acc: 0112938491',
    appliedDate: '2024-03-01',
    verifiedDate: '2024-03-05',
    notes: 'Verified single origin coffee roaster with KEPHIS export clearance.'
  },
  {
    id: 'seller_2',
    sellerName: 'Grace Wambui',
    businessName: 'Wambui Designs Nairobi',
    email: 'contact@wambuidesigns.com',
    phone: '+254 711 982 344',
    location: 'Westlands Mall, Nairobi',
    county: 'Nairobi',
    category: 'Fashion & Kitenge',
    nationalIdNumber: '29812743',
    kraPin: 'A009182745B',
    businessRegNumber: 'CPR/2022/44129',
    status: 'verified',
    settlementMethod: 'mpesa_till',
    settlementAccount: 'Buy Goods Till: 882910',
    appliedDate: '2024-01-10',
    verifiedDate: '2024-01-14',
    notes: 'Premium designer boutique with physical store in Westlands.'
  },
  {
    id: 'seller_3',
    sellerName: 'Ole Saitoti Lemayian',
    businessName: 'Maasai Mara Cultural Arts',
    email: 'arts@maasaicollective.or.ke',
    phone: '+254 723 605 119',
    location: 'Talek Gate & Narok Town',
    county: 'Narok',
    category: 'Artisanal & Crafts',
    nationalIdNumber: '19842011',
    kraPin: 'P051184920C',
    status: 'verified',
    settlementMethod: 'mpesa_paybill',
    settlementAccount: 'Paybill: 247247 · Acc: 0723605119',
    appliedDate: '2024-02-01',
    verifiedDate: '2024-02-03',
    notes: 'Narok Women Cooperative accredited cultural arts partner.'
  },
  {
    id: 'seller_applicant_1',
    sellerName: 'Josephat Kiptoo',
    businessName: 'Green Rift Valley Organic Honey & Herbs',
    email: 'kiptoo@greenriftproduce.co.ke',
    phone: '+254 798 123 456',
    location: 'Mau Narok & Nakuru Highway',
    county: 'Nakuru',
    category: 'Agri & Fresh Farm',
    nationalIdNumber: '31289450',
    kraPin: 'A010992384Z',
    businessRegNumber: 'BN/2023/11293',
    status: 'under_review',
    settlementMethod: 'mpesa_till',
    settlementAccount: 'Till: 541992',
    appliedDate: '2026-11-04',
    notes: 'Awaiting laboratory pollen and purity test certificate verification.'
  },
  {
    id: 'seller_applicant_2',
    sellerName: 'Amina Hassan',
    businessName: 'Mombasa Spice & Coastal Woven Kiondo',
    email: 'amina@swahilispices.co.ke',
    phone: '+254 712 345 678',
    location: 'Old Town, Mombasa',
    county: 'Mombasa',
    category: 'Artisanal & Crafts',
    nationalIdNumber: '28491022',
    kraPin: 'P051499211D',
    status: 'pending',
    settlementMethod: 'bank_account',
    settlementAccount: 'KCB Bank · Fort Jesus Branch · 1192837465',
    appliedDate: '2026-11-05',
    notes: 'New submission pending initial document check.'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_101',
    orderNumber: 'K1-89214',
    buyerId: 'user_main',
    buyerName: 'Martin Gichuru',
    buyerPhone: '+254 712 900 123',
    buyerEmail: 'martin@example.com',
    items: [
      {
        productId: 'prod_1',
        title: 'Mount Kenya AA Single Origin Specialty Coffee (250g)',
        image: '/src/assets/images/product_kenyan_aa_coffee_1794002334699.jpg',
        priceKes: 1200,
        quantity: 2,
        storeId: 'store_1',
        storeName: 'Karibu Coffee Co.'
      }
    ],
    subtotalKes: 2400,
    deliveryFeeKes: 350,
    totalKes: 2750,
    currency: 'KES',
    status: 'in_transit',
    paymentMethod: 'mpesa_daraja',
    paymentRef: 'QJD792KXL1',
    courier: 'Fargo Courier Kenya',
    trackingCode: 'FGO-KEN-89214-NAI',
    deliveryAddress: {
      county: 'Nairobi',
      city: 'Nairobi',
      addressLine: 'Kilimani, Ring Road, Gate 4B',
      instructions: 'Call upon arrival at the security barrier'
    },
    createdAt: '2026-11-05T09:30:00Z',
    confirmedAt: '2026-11-05T09:32:00Z',
    dispatchedAt: '2026-11-05T14:10:00Z'
  },
  {
    id: 'ord_102',
    orderNumber: 'K1-89209',
    buyerId: 'user_main',
    buyerName: 'Martin Gichuru',
    buyerPhone: '+254 712 900 123',
    buyerEmail: 'martin@example.com',
    items: [
      {
        productId: 'prod_3',
        title: 'Polished Kisii Soapstone "Undugu" Family Embrace Sculpture',
        image: '/src/assets/images/product_kisii_soapstone_1794002336977.jpg',
        priceKes: 3800,
        quantity: 1,
        storeId: 'store_4',
        storeName: 'Kisii Stone Masters Cooperative'
      }
    ],
    subtotalKes: 3800,
    deliveryFeeKes: 400,
    totalKes: 4200,
    currency: 'KES',
    status: 'delivered',
    paymentMethod: 'mpesa_daraja',
    paymentRef: 'QJC441PL99',
    courier: 'G4S Kenya Secure Courier',
    trackingCode: 'G4S-KIS-7712-NAI',
    deliveryAddress: {
      county: 'Nairobi',
      city: 'Nairobi',
      addressLine: 'Kilimani, Ring Road, Gate 4B'
    },
    createdAt: '2026-11-02T11:15:00Z',
    confirmedAt: '2026-11-02T11:18:00Z',
    dispatchedAt: '2026-11-02T16:00:00Z',
    deliveredAt: '2026-11-04T10:45:00Z'
  }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev_1',
    productId: 'prod_1',
    userId: 'user_john',
    userName: 'John Kamau',
    rating: 5,
    title: 'Outstanding brightness and true Kenyan AA notes!',
    comment: 'I brew with a V60 pour over every morning. The berry notes are phenomenal. Arrived in Kilimani less than 24 hours after roast.',
    verifiedPurchase: true,
    county: 'Nairobi',
    createdAt: '2026-11-03'
  },
  {
    id: 'rev_2',
    productId: 'prod_2',
    userId: 'user_sarah',
    userName: 'Sarah Jenkins (Diaspora - UK)',
    rating: 5,
    title: 'Breathtaking authenticity & quality',
    comment: 'Ordered from London for delivery to my mother in Karen. The leather work and bead symmetry is extraordinary.',
    verifiedPurchase: true,
    county: 'Nairobi',
    createdAt: '2026-10-28'
  }
];

export const INITIAL_SETTLEMENTS: SellerSettlement[] = [
  {
    id: 'set_1',
    storeId: 'store_1',
    storeName: 'Karibu Coffee Co.',
    period: 'Oct 2026 - Cycle 2',
    grossSalesKes: 248000,
    commissionRate: 0.08,
    commissionKes: 19840,
    deliveryFeesKes: 14200,
    netPayoutKes: 213960,
    settlementMethod: 'M-Pesa B2C Paybill',
    settlementAccount: '400200',
    status: 'settled',
    reference: 'B2C-MPESA-991823',
    processedDate: '2026-11-01'
  },
  {
    id: 'set_2',
    storeId: 'store_2',
    storeName: 'Wambui Designs Nairobi',
    period: 'Nov 2026 - Cycle 1 (Current)',
    grossSalesKes: 165000,
    commissionRate: 0.08,
    commissionKes: 13200,
    deliveryFeesKes: 8900,
    netPayoutKes: 142900,
    settlementMethod: 'M-Pesa B2C Till',
    settlementAccount: '882910',
    status: 'pending',
    reference: 'PENDING-SETTLE-091'
  }
];

export const INITIAL_AUDIT_LOGS: CommerceAuditLog[] = [
  {
    id: 'log_1',
    timestamp: '2026-11-06 12:45:10',
    actor: 'Admin Superuser',
    role: 'Marketplace Administrator',
    action: 'SELLER_VERIFICATION_APPROVED',
    targetId: 'seller_3 (Maasai Mara Cultural Arts)',
    details: 'Verified KRA PIN and Narok County Artisan Permit. Upgraded to Verified Status.',
    severity: 'info'
  },
  {
    id: 'log_2',
    timestamp: '2026-11-06 11:20:04',
    actor: 'Auction Engine',
    role: 'Automated Integrity Watchdog',
    action: 'ANTI_SNIPE_TRIGGERED',
    targetId: 'auc_1 (Maasai Collar)',
    details: 'Bid received with 7s remaining; automatic +15s anti-sniping protection extension triggered.',
    severity: 'info'
  },
  {
    id: 'log_3',
    timestamp: '2026-11-05 16:30:22',
    actor: 'Admin Superuser',
    role: 'Marketplace Administrator',
    action: 'COMMISSION_POLICY_REVIEW',
    targetId: 'Policy Standard v2',
    details: 'Confirmed standard live commerce rate at 8.0% and direct store checkout at 5.0%.',
    severity: 'info'
  }
];

export const ZAWADI_GIFT_TIERS = [
  {
    id: 'gift_chai',
    name: 'Chai Moto',
    swahiliName: 'Chai ya Tangawizi',
    icon: '☕',
    amountKes: 50,
    description: 'Fresh hot ginger tea to warm up the stream host',
    animationType: 'tea_steam' as const
  },
  {
    id: 'gift_kikoy',
    name: 'Kikoy Wrap',
    swahiliName: 'Kikoy ya Pwani',
    icon: '🧣',
    amountKes: 150,
    description: 'Vibrant woven coastal wrap blessing',
    animationType: 'ribbon_dance' as const
  },
  {
    id: 'gift_kofia',
    name: 'Safari Kofia',
    swahiliName: 'Kofia ya Safari',
    icon: '🤠',
    amountKes: 300,
    description: 'Explorer badge of honor for great product curation',
    animationType: 'safari_sparkle' as const
  },
  {
    id: 'gift_ngao',
    name: 'Ngao ya Maasai',
    swahiliName: 'Ngao na Mkuki',
    icon: '🛡️',
    amountKes: 800,
    description: 'Warrior shield celebration for high-tier craftmanship',
    animationType: 'shield_pulse' as const
  },
  {
    id: 'gift_simba',
    name: 'Simba Roar',
    swahiliName: 'Mngurumo wa Simba',
    icon: '🦁',
    amountKes: 2000,
    description: 'Mighty Mara lion roar with stream-wide gold confetti',
    animationType: 'simba_roar' as const
  },
  {
    id: 'gift_dhahabu',
    name: 'Mt. Kenya Gold',
    swahiliName: 'Taji la Dhahabu',
    icon: '👑',
    amountKes: 5000,
    description: 'Ultimate patron golden crown with royal fireworks',
    animationType: 'mt_kenya_gold' as const
  }
];

export const INITIAL_CREATOR_WALLETS = {
  store_1: {
    storeId: 'store_1',
    totalGiftsReceivedKes: 4850,
    totalTipsReceivedKes: 2500,
    totalSalesReceivedKes: 248000,
    totalCashedOutKes: 3000,
    availableBalanceKes: 4350
  },
  store_2: {
    storeId: 'store_2',
    totalGiftsReceivedKes: 12400,
    totalTipsReceivedKes: 6500,
    totalSalesReceivedKes: 165000,
    totalCashedOutKes: 5000,
    availableBalanceKes: 13900
  },
  store_3: {
    storeId: 'store_3',
    totalGiftsReceivedKes: 18900,
    totalTipsReceivedKes: 11000,
    totalSalesReceivedKes: 320000,
    totalCashedOutKes: 15000,
    availableBalanceKes: 14900
  }
};
