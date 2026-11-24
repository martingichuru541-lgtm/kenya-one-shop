import React from 'react';
import { Store as StoreIcon, CheckCircle, Star, MapPin, ArrowRight, Radio, Sparkles } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

interface StoresShowcaseProps {
  onOpenStore: (slug: string) => void;
  onOpenSellerRegistration: () => void;
}

export const StoresShowcase: React.FC<StoresShowcaseProps> = ({
  onOpenStore,
  onOpenSellerRegistration
}) => {
  const { stores, followedStoreIds, toggleFollowStore, products, livestreams } = useCommerce();

  return (
    <div className="py-10 bg-stone-950 text-stone-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block mb-1">
              Verified Creator Ecosystem
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Kenyan Artisan, Farm & Designer Stores
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Every shop is independently audited with KRA PIN and county trading licenses
            </p>
          </div>

          <button
            onClick={onOpenSellerRegistration}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5 self-start md:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply to Open a Store</span>
          </button>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map(store => {
            const storeProductsCount = products.filter(p => p.storeId === store.id || p.storeSlug === store.slug).length;
            const isLive = livestreams.some(l => l.storeId === store.id && l.status === 'live');
            const isFollowed = followedStoreIds.includes(store.id);

            return (
              <div
                key={store.id}
                onClick={() => onOpenStore(store.slug)}
                className="bg-stone-900 border border-stone-800 hover:border-emerald-600/80 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all flex flex-col group"
              >
                {/* Banner Header with Logo */}
                <div className="relative h-32 bg-stone-950 overflow-hidden">
                  <img
                    src={store.banner}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />

                  {isLive && (
                    <div className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse shadow">
                      <Radio className="w-3 h-3" />
                      <span>LIVE NOW</span>
                    </div>
                  )}
                </div>

                <div className="p-6 pt-0 relative flex-1 flex flex-col justify-between">
                  <div>
                    {/* Logo & Identity */}
                    <div className="flex items-end justify-between -mt-10 mb-3">
                      <div className="w-16 h-16 rounded-xl bg-stone-900 border-2 border-stone-800 overflow-hidden shadow-lg">
                        <img src={store.logo} alt="" className="w-full h-full object-cover" />
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFollowStore(store.id);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors ${
                          isFollowed
                            ? 'bg-stone-800 text-stone-300 border border-stone-700'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {isFollowed ? 'Following' : 'Follow'}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="font-display font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                        {store.name}
                      </h3>
                      {store.isVerified && (
                        <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-950 shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-stone-400 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-500" />
                        {store.location}, {store.county} County
                      </span>
                    </div>

                    <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed mb-4">
                      {store.bio}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4 text-stone-400">
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {store.rating}
                      </span>
                      <span>·</span>
                      <span>{store.followerCount.toLocaleString()} followers</span>
                      <span>·</span>
                      <span>{storeProductsCount} items</span>
                    </div>

                    <span className="text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Visit Store</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
