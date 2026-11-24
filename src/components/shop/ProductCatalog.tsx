import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Heart, 
  ShoppingBag, 
  Eye, 
  Star, 
  MapPin, 
  Plane, 
  CheckCircle,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { formatCurrency } from '../../utils/formatters';
import { Product, SellerCategory } from '../../types';
import { KENYA_COUNTIES } from '../../data/initialData';

const CATEGORIES: ('All' | SellerCategory)[] = [
  'All',
  'Specialty Coffee & Tea',
  'Artisanal & Crafts',
  'Fashion & Kitenge',
  'Kenyan Leatherworks',
  'Agri & Fresh Farm',
  'Tech & Hardware'
];

interface ProductCatalogProps {
  onSelectProduct: (productId: string) => void;
  onOpenStore: (storeSlug: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onSelectProduct,
  onOpenStore
}) => {
  const { 
    products, 
    currency, 
    addToCart, 
    wishlist, 
    toggleWishlist 
  } = useCommerce();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | SellerCategory>('All');
  const [selectedCounty, setSelectedCounty] = useState<string>('All');
  const [exportOnly, setExportOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      // County filter
      if (selectedCounty !== 'All' && p.countyOrigin !== selectedCounty) return false;
      // Export filter
      if (exportOnly && !p.isExportReady) return false;
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesStore = p.storeName.toLowerCase().includes(query);
        const matchesTags = p.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesStore && !matchesTags) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceKes - b.priceKes;
      if (sortBy === 'price-desc') return b.priceKes - a.priceKes;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured/default
    });
  }, [products, selectedCategory, selectedCounty, exportOnly, searchQuery, sortBy]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToast(`Added "${product.title}" to bag`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <section className="py-10 bg-stone-950 text-stone-100 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block mb-1">
              Direct From Origin
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Verified Kenyan Marketplace
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Handcrafted artifacts, single-origin coffees, and indigenous textiles from 47 counties
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coffee, beadwork, jackets..."
              className="w-full pl-9 pr-8 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="space-y-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Filters Bar: County Origin, Export Ready & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-900 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* County Origin dropdown */}
              <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 px-2.5 py-1.5 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-stone-400 text-[11px]">County:</span>
                <select
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  className="bg-transparent text-stone-200 text-xs focus:outline-none cursor-pointer"
                  aria-label="Filter by Kenyan County"
                >
                  <option value="All" className="bg-stone-900">All 47 Counties</option>
                  {KENYA_COUNTIES.map(c => (
                    <option key={c} value={c} className="bg-stone-900">{c}</option>
                  ))}
                </select>
              </div>

              {/* Export Ready Toggle */}
              <button
                onClick={() => setExportOnly(!exportOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                  exportOnly 
                    ? 'bg-teal-950/80 border-teal-600 text-teal-300' 
                    : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <Plane className="w-3.5 h-3.5 text-teal-400" />
                <span>Global Export Ready</span>
              </button>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-stone-400 text-[11px]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-stone-900 border border-stone-800 text-stone-200 rounded px-2.5 py-1.5 text-xs focus:outline-none cursor-pointer"
                aria-label="Sort Products"
              >
                <option value="featured">Featured / Best Match</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Floating Added Toast */}
        {addedToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-slide-up">
            <CheckCircle className="w-4 h-4 text-white" />
            <span>{addedToast}</span>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-stone-900/40 rounded-xl border border-stone-800/80">
            <Filter className="w-8 h-8 text-stone-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No products found</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              Try adjusting your category, county filter, or search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedCounty('All');
                setExportOnly(false);
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product.id)}
                  className="group bg-stone-900 border border-stone-800/80 hover:border-emerald-700/60 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all flex flex-col"
                >
                  {/* Product Image Box */}
                  <div className="relative aspect-[4/3] bg-stone-950 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Top action icons: Wishlist & Export badge */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      {product.isExportReady ? (
                        <span className="bg-teal-950/85 border border-teal-700/80 text-teal-300 text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                          <Plane className="w-3 h-3 text-teal-400" />
                          <span>Export Certified</span>
                        </span>
                      ) : <div />}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                          isWishlisted 
                            ? 'bg-rose-600/90 text-white shadow' 
                            : 'bg-black/50 text-stone-300 hover:text-white'
                        }`}
                        aria-label="Toggle Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Quick View Button on Hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(product.id);
                        }}
                        className="py-2 px-3 bg-white text-stone-950 font-semibold text-xs rounded-lg shadow-md hover:bg-stone-100 flex items-center gap-1.5 transition-transform active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick View</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Metadata & Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Store line with County */}
                      <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenStore(product.storeSlug);
                          }}
                          className="hover:text-emerald-400 flex items-center gap-1 font-medium truncate text-left"
                        >
                          <span className="truncate">{product.storeName}</span>
                          {product.storeVerified && (
                            <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0 fill-emerald-950" />
                          )}
                        </button>
                        <span className="text-[11px] text-stone-500 shrink-0">
                          {product.countyOrigin}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 group-hover:text-emerald-300 transition-colors mb-2">
                        {product.title}
                      </h3>

                      {/* Star rating */}
                      <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-3">
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="ml-1 text-xs font-semibold text-white">{product.rating}</span>
                        </div>
                        <span>·</span>
                        <span className="text-stone-500">({product.reviewCount} reviews)</span>
                      </div>
                    </div>

                    {/* Price & Add to Cart button */}
                    <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-mono text-base font-bold text-white block">
                          {formatCurrency(product.priceKes, currency)}
                        </span>
                        {product.comparePriceKes && (
                          <span className="text-[11px] line-through text-stone-500 font-mono">
                            {formatCurrency(product.comparePriceKes, currency)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
