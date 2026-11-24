import React, { useState } from 'react';
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  CheckCircle, 
  Star, 
  Share2, 
  Heart, 
  Radio, 
  Gavel, 
  ShoppingBag,
  ArrowLeft,
  Check,
  Award
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { formatCurrency } from '../../utils/formatters';
import { Product } from '../../types';

interface SellerStorefrontProps {
  storeSlug: string;
  onBack: () => void;
  onSelectProduct: (productId: string) => void;
  onOpenLiveRoom: (livestreamId: string) => void;
}

export const SellerStorefront: React.FC<SellerStorefrontProps> = ({
  storeSlug,
  onBack,
  onSelectProduct,
  onOpenLiveRoom
}) => {
  const { 
    stores, 
    products, 
    livestreams, 
    currency, 
    followedStoreIds, 
    toggleFollowStore, 
    addToCart 
  } = useCommerce();

  const [activeTab, setActiveTab] = useState<'all' | 'auctions' | 'about'>('all');
  const [copiedUrl, setCopiedUrl] = useState(false);

  const store = stores.find(s => s.slug === storeSlug || s.id === storeSlug) || stores[0];
  const storeProducts = products.filter(p => p.storeId === store.id || p.storeSlug === store.slug);
  const activeStream = livestreams.find(l => l.storeId === store.id && l.status === 'live');
  const isFollowed = followedStoreIds.includes(store.id);

  const uniqueStoreUrl = `https://kenyaone.co.ke/shop/@${store.slug}`;

  const handleCopyStoreUrl = () => {
    navigator.clipboard?.writeText(uniqueStoreUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="py-8 bg-stone-950 text-stone-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        {/* Storefront Banner & Identity Header */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl mb-8">
          {/* Cover Banner */}
          <div className="relative h-48 sm:h-64 bg-stone-950 overflow-hidden">
            <img
              src={store.banner}
              alt={store.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

            {/* Unique Storefront URL Chip */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <button
                onClick={handleCopyStoreUrl}
                className="bg-black/70 hover:bg-black/90 backdrop-blur-md text-stone-200 border border-white/10 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition-colors"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? 'Copied URL!' : 'Share Shop URL'}</span>
              </button>
            </div>
          </div>

          {/* Store Profile Info Bar */}
          <div className="px-6 py-6 sm:px-8 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-4">
              <div className="flex items-end gap-4">
                {/* Store Avatar Logo */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-stone-900 border-4 border-stone-900 overflow-hidden shadow-2xl relative shrink-0">
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                      {store.name}
                    </h1>
                    {store.isVerified && (
                      <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-950 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    <span className="text-emerald-400 font-medium">@{store.slug}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-500" />
                      {store.location}, {store.county}
                    </span>
                  </div>
                </div>
              </div>

              {/* Follow & Contact Buttons */}
              <div className="flex items-center gap-3">
                <a
                  href={`https://wa.me/${store.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Seller</span>
                </a>

                <button
                  onClick={() => toggleFollowStore(store.id)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition-all shadow ${
                    isFollowed
                      ? 'bg-stone-800 text-stone-300 border border-stone-700'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isFollowed ? 'Following' : 'Follow Shop'}
                </button>
              </div>
            </div>

            {/* Store Bio & Stats Strip */}
            <p className="text-xs sm:text-sm text-stone-300 max-w-3xl leading-relaxed mb-6">
              {store.bio}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-stone-800/80 text-xs">
              <div>
                <span className="text-stone-500 block uppercase text-[10px]">Followers</span>
                <span className="text-sm font-bold text-white font-mono">
                  {store.followerCount.toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-stone-500 block uppercase text-[10px]">Rating</span>
                <span className="text-sm font-bold text-amber-400 font-mono flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {store.rating} ({store.reviewCount})
                </span>
              </div>

              <div>
                <span className="text-stone-500 block uppercase text-[10px]">Products Sold</span>
                <span className="text-sm font-bold text-white font-mono">
                  {store.salesCount.toLocaleString()} orders
                </span>
              </div>

              <div>
                <span className="text-stone-500 block uppercase text-[10px]">Verification</span>
                <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  KRA & County Audited
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Broadcast Banner (if currently live) */}
        {activeStream && (
          <div
            onClick={() => onOpenLiveRoom(activeStream.id)}
            className="mb-8 p-4 rounded-xl bg-gradient-to-r from-rose-950 via-stone-900 to-rose-950 border border-rose-800/80 cursor-pointer shadow-lg hover:border-rose-600 transition-all flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    Live Broadcast Now
                  </span>
                  <span className="text-xs text-stone-300">
                    {activeStream.viewerCount} viewers watching
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-0.5">{activeStream.title}</h4>
              </div>
            </div>

            <button className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow shrink-0">
              Enter Live Stream
            </button>
          </div>
        )}

        {/* Store Catalogue Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-800 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            Catalogue ({storeProducts.length})
          </button>

          <button
            onClick={() => setActiveTab('auctions')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'auctions'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            Auction Drops ({storeProducts.filter(p => p.isAuctionEligible).length})
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            About & Compliance
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'all' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {storeProducts.map(product => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product.id)}
                className="group bg-stone-900 border border-stone-800 rounded-xl overflow-hidden cursor-pointer shadow hover:shadow-xl transition-all flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-stone-950 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2 group-hover:text-emerald-300">
                      {product.title}
                    </h3>
                    <p className="text-xs text-stone-400 line-clamp-2 mb-3">
                      {product.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                    <span className="font-mono text-base font-bold text-white">
                      {formatCurrency(product.priceKes, currency)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 1);
                      }}
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'auctions' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {storeProducts.filter(p => p.isAuctionEligible).map(p => (
              <div key={p.id} className="bg-stone-900 border border-amber-800/60 rounded-xl p-5 flex gap-4">
                <img src={p.images[0]} alt="" className="w-24 h-24 rounded-lg object-cover" />
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase block mb-1">
                    Scheduled Rapid Auction Item
                  </span>
                  <h4 className="text-sm font-semibold text-white mb-2">{p.title}</h4>
                  <p className="text-xs text-emerald-400 font-mono font-bold mb-3">
                    Est. Value: {formatCurrency(p.priceKes, currency)}
                  </p>
                  <button
                    onClick={() => onSelectProduct(p.id)}
                    className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg"
                  >
                    View Product Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 max-w-3xl space-y-6 text-xs text-stone-300">
            <div>
              <h3 className="font-display text-base font-bold text-white mb-2">Artisan Heritage & Story</h3>
              <p className="leading-relaxed">{store.bio}</p>
            </div>

            <div>
              <h3 className="font-display text-base font-bold text-white mb-2">Location & County Presence</h3>
              <p className="leading-relaxed">
                Operating out of {store.location}, {store.county} County. Registered with KenyaOne verified merchant directory.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-800">
              <h3 className="font-display text-base font-bold text-white mb-3">Verified Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>{store.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{store.contactPhone}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
