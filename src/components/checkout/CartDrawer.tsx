import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { formatCurrency } from '../../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onCheckout
}) => {
  const { cart, removeFromCart, updateCartQuantity, cartSubtotalKes, currency } = useCommerce();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-l border-stone-800 text-stone-100 flex flex-col shadow-2xl animate-slide-left">
          {/* Header */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h2 className="font-display font-bold text-base text-white">Your Shopping Bag</h2>
              <span className="text-xs text-stone-400">({cart.length} items)</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Note */}
          <div className="px-5 py-2.5 bg-emerald-950/40 border-b border-emerald-900/60 flex items-center gap-2 text-[11px] text-emerald-300">
            <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Direct dispatch across 47 Kenyan counties + Global DHL export available</span>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-stone-400">
                <ShoppingBag className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                <h3 className="font-semibold text-white text-base">Your bag is empty</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Explore verified artisanal coffee, Maasai beadwork and Kitenge drops in the marketplace!
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex gap-3 relative group"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-16 h-16 rounded-lg object-cover bg-stone-900 shrink-0 border border-stone-800"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h4 className="font-semibold text-white text-xs truncate max-w-[190px]">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stone-500 hover:text-rose-400 p-0.5"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-stone-400 mb-2 truncate">
                      {item.product.storeName}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {formatCurrency(item.product.priceKes * item.quantity, currency)}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-stone-900 border border-stone-800 rounded px-1">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 text-stone-400 hover:text-white flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-mono text-xs text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 text-stone-400 hover:text-white flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-800 bg-stone-950/80 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal:</span>
                  <span className="font-mono text-white font-semibold">
                    {formatCurrency(cartSubtotalKes, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Courier Delivery:</span>
                  <span className="text-stone-300">Calculated at checkout</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Estimated Total:</span>
                <span className="font-mono text-xl font-extrabold text-emerald-400">
                  {formatCurrency(cartSubtotalKes, currency)}
                </span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Protected by KenyaOne Escrow & Lipa na M-Pesa</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
