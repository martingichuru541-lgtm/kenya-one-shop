import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Plane, 
  ShieldCheck, 
  Truck, 
  CheckCircle, 
  ShoppingBag, 
  Heart, 
  Store, 
  Share2, 
  Check,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { formatCurrency } from '../../utils/formatters';
import { CustomerReview, Product } from '../../types';
import { INITIAL_REVIEWS, KENYA_COURIERS } from '../../data/initialData';

interface ProductDetailModalProps {
  productId: string;
  onClose: () => void;
  onInstantBuy: (product: Product) => void;
  onOpenStore: (slug: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  productId,
  onClose,
  onInstantBuy,
  onOpenStore
}) => {
  const { products, currency, addToCart, wishlist, toggleWishlist } = useCommerce();
  const product = products.find(p => p.id === productId) || products[0];

  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    const rev: CustomerReview = {
      id: `rev_${Date.now()}`,
      productId: product.id,
      userId: 'user_main',
      userName: 'Martin Gichuru',
      rating: newReviewRating,
      title: newReviewTitle || 'Great Kenyan product!',
      comment: newReviewComment,
      verifiedPurchase: true,
      county: 'Nairobi',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setReviews(prev => [rev, ...prev]);
    setShowReviewForm(false);
    setNewReviewTitle('');
    setNewReviewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-white p-1.5 rounded-lg z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT: Product Photography */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl bg-stone-950 overflow-hidden border border-stone-800 shadow">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {product.isExportReady && (
                <div className="absolute top-3 left-3 bg-teal-950/90 border border-teal-700 text-teal-300 text-xs font-semibold px-2.5 py-1 rounded backdrop-blur-sm flex items-center gap-1.5 shadow">
                  <Plane className="w-3.5 h-3.5 text-teal-400" />
                  <span>KEPHIS / KEBS Export Certified</span>
                </div>
              )}
            </div>

            {/* Origin & Courier Quick Strip */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex items-center gap-2 text-stone-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Origin</span>
                  <span className="font-semibold text-white">{product.countyOrigin} County</span>
                </div>
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex items-center gap-2 text-stone-300">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Shipping</span>
                  <span className="font-semibold text-white">Fargo / Sendy / DHL</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Contiguous Purchase Module & Details */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Store link header */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenStore(product.storeSlug);
                  }}
                  className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-emerald-400 font-medium transition-colors"
                >
                  <Store className="w-3.5 h-3.5 text-stone-400" />
                  <span>{product.storeName}</span>
                  {product.storeVerified && (
                    <CheckCircle className="w-3 h-3 text-emerald-400 fill-emerald-950" />
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="text-stone-400 hover:text-white p-1 text-xs flex items-center gap-1"
                    title="Share product link"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="text-stone-400 hover:text-rose-400 p-1"
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title & Star Rating */}
              <h1 className="font-display text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
                {product.title}
              </h1>

              <div className="flex items-center gap-2 text-xs mb-4">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="ml-1 font-bold text-white text-sm">{product.rating}</span>
                </div>
                <span className="text-stone-500">·</span>
                <span className="text-stone-400">{product.reviewCount} customer reviews</span>
                <span className="text-stone-500">·</span>
                <span className="text-emerald-400 font-semibold">{product.stock} available</span>
              </div>

              {/* Price Banner */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 mb-4 flex items-baseline justify-between">
                <div>
                  <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white">
                    {formatCurrency(product.priceKes, currency)}
                  </span>
                  {product.comparePriceKes && (
                    <span className="ml-2 font-mono text-sm text-stone-500 line-through">
                      {formatCurrency(product.comparePriceKes, currency)}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-stone-400">
                  Includes VAT & Escrow Buyer Guarantee
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Specifications Matrix */}
              {product.specifications && (
                <div className="bg-stone-950/60 rounded-xl p-3 border border-stone-800/80 mb-6 text-xs space-y-1.5">
                  <div className="font-bold text-white text-[11px] uppercase tracking-wider mb-2">
                    Product Specifications
                  </div>
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-0.5 border-b border-stone-800/40 last:border-0">
                      <span className="text-stone-400">{key}:</span>
                      <span className="text-white font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Purchase Controls */}
            <div className="pt-4 border-t border-stone-800 space-y-3">
              {addedNotice && (
                <div className="p-2.5 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-emerald-300 font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Item added to bag!</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center bg-stone-950 border border-stone-800 rounded-lg p-1 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded text-stone-400 hover:text-white flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono text-xs font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-8 h-8 rounded text-stone-400 hover:text-white flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-stone-700"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>Add to Bag</span>
                </button>

                {/* Instant Buy Now (M-Pesa) */}
                <button
                  onClick={() => {
                    onClose();
                    onInstantBuy(product);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>Instant M-Pesa Buy</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-10 pt-8 border-t border-stone-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Verified Customer Reviews ({reviews.length})
              </h3>
              <p className="text-xs text-stone-400">Authentic buyer feedback from across Kenya and the diaspora</p>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="py-1.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>

          {/* Write Review Form */}
          {showReviewForm && (
            <form onSubmit={handleAddReview} className="bg-stone-950 p-4 rounded-xl border border-stone-800 mb-6 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-stone-300">Your Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-4 h-4 ${star <= newReviewRating ? 'fill-amber-400' : 'text-stone-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                placeholder="Review Headline (e.g. Excellent quality, fast dispatch)"
                value={newReviewTitle}
                onChange={(e) => setNewReviewTitle(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-white"
              />

              <textarea
                required
                rows={3}
                placeholder="Share details about the packaging, quality, and delivery experience..."
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-white"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow"
                >
                  Submit Verified Review
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map(rev => (
              <div key={rev.id} className="bg-stone-950 p-4 rounded-xl border border-stone-800/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-white text-xs">{rev.userName}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-500">{rev.createdAt}</span>
                </div>

                <div className="flex items-center text-amber-400 mb-2">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>

                <h4 className="font-semibold text-stone-200 text-xs mb-1">{rev.title}</h4>
                <p className="text-xs text-stone-400 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
