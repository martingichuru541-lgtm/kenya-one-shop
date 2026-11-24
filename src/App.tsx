import React, { useState } from 'react';
import { CommerceProvider, useCommerce } from './context/CommerceContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MarketplaceHero } from './components/shop/MarketplaceHero';
import { LiveStreamsStrip } from './components/shop/LiveStreamsStrip';
import { LiveAuctionsStrip } from './components/shop/LiveAuctionsStrip';
import { ProductCatalog } from './components/shop/ProductCatalog';
import { StoresShowcase } from './components/shop/StoresShowcase';
import { ProductDetailModal } from './components/shop/ProductDetailModal';
import { LivestreamModal } from './components/live/LivestreamModal';
import { CreatorBroadcastStudio } from './components/live/CreatorBroadcastStudio';
import { AuctionsArena } from './components/auctions/AuctionsArena';
import { SellerStorefront } from './components/sellers/SellerStorefront';
import { SellerRegistrationModal } from './components/sellers/SellerRegistrationModal';
import { SellerPortal } from './components/sellers/SellerPortal';
import { BuyerDashboard } from './components/buyer/BuyerDashboard';
import { AdminControlCentre } from './components/admin/AdminControlCentre';
import { CartDrawer } from './components/checkout/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { RafikiAIAssistant } from './components/ai/RafikiAIAssistant';
import { Product, Auction, Order } from './types';

const MainAppContent: React.FC = () => {
  const { 
    activeLivestreamId, 
    closeLivestream, 
    openLivestream,
    activeStoreSlug, 
    setActiveStoreSlug,
    activeProductId,
    setActiveProductId,
    isCreatorStudioOpen,
    setIsCreatorStudioOpen,
    user 
  } = useCommerce();

  const [currentTab, setCurrentTab] = useState<string>('shop');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSellerRegOpen, setIsSellerRegOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [directCheckoutProduct, setDirectCheckoutProduct] = useState<Product | null>(null);

  const handleInstantBuy = (product: Product) => {
    setDirectCheckoutProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleWinAuctionCheckout = (auction: Auction) => {
    setDirectCheckoutProduct({
      id: auction.productId,
      title: `Won Auction: ${auction.productTitle}`,
      description: 'Winning auction lot.',
      category: 'Artisanal & Crafts',
      priceKes: auction.currentBidKes,
      stock: 1,
      images: [auction.productImage],
      rating: 5,
      reviewCount: 1,
      isAuctionEligible: true,
      countyOrigin: 'Narok',
      isExportReady: true,
      tags: ['Auction'],
      specifications: {},
      storeId: auction.storeId,
      storeName: auction.storeName,
      storeSlug: 'store',
      storeVerified: true
    });
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setCurrentTab('buyer-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#140d0a] via-[#0d0907] to-[#120f0d] text-stone-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Universal Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openCart={() => setIsCartOpen(true)}
        openSellerRegistration={() => setIsSellerRegOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* If viewing a specific individual store */}
        {activeStoreSlug ? (
          <SellerStorefront
            storeSlug={activeStoreSlug}
            onBack={() => setActiveStoreSlug(null)}
            onSelectProduct={(id) => setActiveProductId(id)}
            onOpenLiveRoom={(id) => openLivestream(id)}
          />
        ) : (
          <>
            {/* TAB: SHOP / MARKETPLACE (DEFAULT) */}
            {currentTab === 'shop' && (
              <>
                <MarketplaceHero
                  onExploreLive={() => setCurrentTab('live')}
                  onExploreAuctions={() => setCurrentTab('auctions')}
                  onOpenSellerRegistration={() => setIsSellerRegOpen(true)}
                />
                <LiveStreamsStrip onViewAll={() => setCurrentTab('live')} />
                <LiveAuctionsStrip onGoToAuctions={() => setCurrentTab('auctions')} />
                <ProductCatalog
                  onSelectProduct={(id) => setActiveProductId(id)}
                  onOpenStore={(slug) => setActiveStoreSlug(slug)}
                />
              </>
            )}

            {/* TAB: LIVE STREAMING SHOWS */}
            {currentTab === 'live' && (
              <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between">
                  <div>
                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      KenyaOne Live Video Shows
                    </h1>
                    <p className="text-xs sm:text-sm text-stone-400 mt-1">
                      1080p FHD streams · Send Zawadi gifts & M-Pesa tips · In-stream instant buy
                    </p>
                  </div>

                  <button
                    onClick={() => setIsCreatorStudioOpen(true)}
                    className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-transform active:scale-95"
                  >
                    <span>Go Live Broadcast Studio</span>
                  </button>
                </div>

                <LiveStreamsStrip />
                <div className="mt-8">
                  <ProductCatalog
                    onSelectProduct={(id) => setActiveProductId(id)}
                    onOpenStore={(slug) => setActiveStoreSlug(slug)}
                  />
                </div>
              </div>
            )}

            {/* TAB: AUCTIONS ARENA */}
            {currentTab === 'auctions' && (
              <AuctionsArena
                onWinAuctionCheckout={handleWinAuctionCheckout}
                onOpenStore={(slug) => setActiveStoreSlug(slug)}
              />
            )}

            {/* TAB: STORES SHOWCASE */}
            {currentTab === 'stores' && (
              <StoresShowcase
                onOpenStore={(slug) => setActiveStoreSlug(slug)}
                onOpenSellerRegistration={() => setIsSellerRegOpen(true)}
              />
            )}

            {/* TAB: BUYER DASHBOARD */}
            {currentTab === 'buyer-dashboard' && (
              <BuyerDashboard
                onOpenStore={(slug) => setActiveStoreSlug(slug)}
                onSelectProduct={(id) => setActiveProductId(id)}
              />
            )}

            {/* TAB: SELLER PORTAL */}
            {currentTab === 'seller-portal' && (
              <SellerPortal />
            )}

            {/* TAB: ADMIN CONTROL CENTRE */}
            {currentTab === 'admin' && (
              <AdminControlCentre />
            )}
          </>
        )}
      </main>

      {/* Product Detail Modal */}
      {activeProductId && (
        <ProductDetailModal
          productId={activeProductId}
          onClose={() => setActiveProductId(null)}
          onInstantBuy={handleInstantBuy}
          onOpenStore={(slug) => {
            setActiveProductId(null);
            setActiveStoreSlug(slug);
          }}
        />
      )}

      {/* Flagship Live Stream Shopping Modal */}
      {activeLivestreamId && (
        <LivestreamModal
          onClose={closeLivestream}
          onInstantBuy={handleInstantBuy}
          onOpenStore={(slug) => {
            closeLivestream();
            setActiveStoreSlug(slug);
          }}
          onOpenBroadcasterStudio={() => setIsCreatorStudioOpen(true)}
        />
      )}

      {/* Creator Broadcast Studio Suite (Go Live with HD camera, VU meters, filters & cashout) */}
      {isCreatorStudioOpen && (
        <CreatorBroadcastStudio
          onClose={() => setIsCreatorStudioOpen(false)}
        />
      )}

      {/* Rafiki AI Shopping Assistant (Sheng, Swahili, English) */}
      <RafikiAIAssistant
        onSelectProduct={(id) => setActiveProductId(id)}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal (M-Pesa Daraja STK Push & Bank) */}
      {isCheckoutOpen && (
        <CheckoutModal
          onClose={() => {
            setIsCheckoutOpen(false);
            setDirectCheckoutProduct(null);
          }}
          onOrderSuccess={handleOrderSuccess}
          directBuyProduct={directCheckoutProduct}
        />
      )}

      {/* Seller Registration Onboarding Modal */}
      {isSellerRegOpen && (
        <SellerRegistrationModal
          onClose={() => setIsSellerRegOpen(false)}
        />
      )}

      {/* Universal Footer with functional navigation */}
      <Footer 
        onNavigateTab={(tab) => setCurrentTab(tab)}
        openSellerRegistration={() => setIsSellerRegOpen(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <CommerceProvider>
      <MainAppContent />
    </CommerceProvider>
  );
}
