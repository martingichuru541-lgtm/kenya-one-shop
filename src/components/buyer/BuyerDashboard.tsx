import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Heart, 
  Store, 
  Gavel, 
  Clock, 
  ShoppingBag, 
  ShieldCheck, 
  HelpCircle, 
  MapPin, 
  ArrowRight,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { formatCurrency } from '../../utils/formatters';
import { Order, OrderStatus } from '../../types';

interface BuyerDashboardProps {
  onOpenStore: (slug: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  onOpenStore,
  onSelectProduct
}) => {
  const { 
    orders, 
    wishlist, 
    products, 
    stores, 
    followedStoreIds, 
    currency, 
    updateOrderStatus,
    addToCart,
    user 
  } = useCommerce();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'stores' | 'support'>('orders');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [refundRequested, setRefundRequested] = useState<{ [id: string]: boolean }>({});
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0];
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));
  const followedStores = stores.filter(s => followedStoreIds.includes(s.id));

  const handleConfirmDelivery = (orderId: string) => {
    updateOrderStatus(orderId, 'delivered');
  };

  const handleRequestRefund = (orderId: string) => {
    setRefundRequested(prev => ({ ...prev, [orderId]: true }));
  };

  // Progression steps for order delivery
  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed': return 1;
      case 'confirmed': return 2;
      case 'dispatched': return 3;
      case 'in_transit': return 4;
      case 'delivered': return 5;
      default: return 1;
    }
  };

  return (
    <div className="py-8 bg-stone-950 text-stone-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Identity Header */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold text-xl flex items-center justify-center shadow">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {user.name}
                </h1>
                <span className="text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                  Verified Buyer
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
                <span>{user.email}</span>
                <span>·</span>
                <span>{user.phone}</span>
                <span>·</span>
                <span>{user.county} County</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-stone-400 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-800">
            <div>
              <span className="text-stone-500 block uppercase text-[10px]">Total Orders</span>
              <span className="font-mono text-base font-bold text-white">{orders.length}</span>
            </div>
            <div>
              <span className="text-stone-500 block uppercase text-[10px]">Wishlist</span>
              <span className="font-mono text-base font-bold text-white">{wishlist.length}</span>
            </div>
            <div>
              <span className="text-stone-500 block uppercase text-[10px]">Followed Shops</span>
              <span className="font-mono text-base font-bold text-white">{followedStores.length}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-800 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>My Orders & Live Tracking ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'wishlist'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlistedProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stores')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'stores'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Followed Stores ({followedStores.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'support'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Support & Buyer Protection</span>
          </button>
        </div>

        {/* TAB 1: ORDERS & TRACKING */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders List (Left) */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Order History
              </h3>

              {orders.map(order => {
                const isSelected = order.id === selectedOrder?.id;

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-stone-900 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono font-bold text-white">{order.orderNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        order.status === 'delivered'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : order.status === 'in_transit' || order.status === 'dispatched'
                          ? 'bg-blue-950 text-blue-400 border border-blue-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-stone-300 font-medium truncate mb-2">
                      {order.items.map(i => `${i.quantity}x ${i.title}`).join(', ')}
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span>{order.courier}</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {formatCurrency(order.totalKes, currency)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Order Detailed Tracking Timeline (Center / Right) */}
            {selectedOrder ? (
              <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800 mb-6">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                      Active Shipment Tracking
                    </span>
                    <h2 className="font-mono text-xl font-bold text-white">
                      {selectedOrder.orderNumber}
                    </h2>
                    <span className="text-xs text-stone-400">
                      Payment Ref: <strong className="text-emerald-400 font-mono">{selectedOrder.paymentRef}</strong>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">Assigned Courier:</span>
                    <span className="text-sm font-bold text-white block">{selectedOrder.courier}</span>
                    <span className="font-mono text-xs text-amber-400">{selectedOrder.trackingCode}</span>
                  </div>
                </div>

                {/* Interactive Progress Bar */}
                <div className="mb-8">
                  <div className="grid grid-cols-4 gap-2 text-center text-xs mb-3">
                    <span className={getStepIndex(selectedOrder.status) >= 2 ? 'text-emerald-400 font-bold' : 'text-stone-500'}>
                      1. Confirmed
                    </span>
                    <span className={getStepIndex(selectedOrder.status) >= 3 ? 'text-emerald-400 font-bold' : 'text-stone-500'}>
                      2. Dispatched
                    </span>
                    <span className={getStepIndex(selectedOrder.status) >= 4 ? 'text-emerald-400 font-bold' : 'text-stone-500'}>
                      3. In Transit
                    </span>
                    <span className={getStepIndex(selectedOrder.status) >= 5 ? 'text-emerald-400 font-bold' : 'text-stone-500'}>
                      4. Delivered
                    </span>
                  </div>

                  <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden border border-stone-800">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${(getStepIndex(selectedOrder.status) / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Items in this order */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Items Ordered</h4>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <div className="font-semibold text-white">{item.title}</div>
                          <div className="text-stone-400">{item.storeName}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-white font-bold">
                          {formatCurrency(item.priceKes * item.quantity, currency)}
                        </span>
                        <span className="text-[11px] text-stone-500 block">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Address Details */}
                <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 text-xs mb-6 space-y-1">
                  <div className="font-bold text-white mb-1">Destination Address:</div>
                  <div className="text-stone-300">{selectedOrder.buyerName} ({selectedOrder.buyerPhone})</div>
                  <div className="text-stone-400">{selectedOrder.deliveryAddress.addressLine}, {selectedOrder.deliveryAddress.county} County</div>
                </div>

                {/* Action Buttons: Confirm Receipt (Releases escrow) or Request Refund */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-800">
                  {selectedOrder.status !== 'delivered' ? (
                    <button
                      onClick={() => handleConfirmDelivery(selectedOrder.id)}
                      className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>Confirm Package Receipt (Release Escrow)</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Delivery Confirmed · Escrow Released</span>
                    </div>
                  )}

                  {!refundRequested[selectedOrder.id] ? (
                    <button
                      onClick={() => handleRequestRefund(selectedOrder.id)}
                      className="py-2 px-3 bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-400 rounded-lg text-xs font-medium border border-stone-700"
                    >
                      Request Return / Refund
                    </button>
                  ) : (
                    <span className="text-xs text-amber-400 font-medium">
                      Refund dispute ticket submitted to Admin Centre.
                    </span>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* TAB 2: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistedProducts.length === 0 ? (
              <div className="col-span-full text-center py-16 text-stone-400">
                <Heart className="w-10 h-10 text-stone-600 mx-auto mb-3" />
                <h3 className="font-semibold text-white">Your wishlist is empty</h3>
              </div>
            ) : (
              wishlistedProducts.map(p => (
                <div key={p.id} className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden p-4 flex gap-4">
                  <img src={p.images[0]} alt="" className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <h4 className="font-semibold text-white line-clamp-1">{p.title}</h4>
                      <p className="text-stone-400">{p.storeName}</p>
                      <span className="font-mono text-emerald-400 font-bold mt-1 block">
                        {formatCurrency(p.priceKes, currency)}
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(p, 1)}
                      className="py-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold self-start mt-2"
                    >
                      Move to Bag
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: FOLLOWED STORES */}
        {activeTab === 'stores' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {followedStores.map(st => (
              <div
                key={st.id}
                onClick={() => onOpenStore(st.slug)}
                className="bg-stone-900 border border-stone-800 rounded-xl p-5 cursor-pointer hover:border-emerald-600 transition-colors flex items-center gap-4"
              >
                <img src={st.logo} alt="" className="w-14 h-14 rounded-full object-cover border border-stone-700" />
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-sm truncate">{st.name}</h4>
                  <p className="text-xs text-stone-400">{st.location}, {st.county}</p>
                  <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
                    {st.followerCount.toLocaleString()} followers
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: SUPPORT */}
        {activeTab === 'support' && (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 max-w-2xl space-y-6 text-xs text-stone-300">
            <div>
              <h3 className="font-display text-lg font-bold text-white mb-2">KenyaOne Buyer Guarantee</h3>
              <p className="leading-relaxed text-stone-400">
                Every transaction on KenyaOne is held in automated escrow. Sellers are settled only after delivery receipt is confirmed or after the 5-day inspection period has elapsed.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSupportSubmitted(true);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-stone-300 block mb-1">Issue Topic</label>
                <select className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white">
                  <option>Order Delivery Delay</option>
                  <option>Counterfeit or Mismatched Item</option>
                  <option>M-Pesa STK Push Payment Reconciliation</option>
                  <option>Auction Bid Dispute</option>
                </select>
              </div>

              <div>
                <label className="text-stone-300 block mb-1">Message Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide your order number and issue details..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                />
              </div>

              {supportSubmitted && (
                <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-lg">
                  Ticket received! An agent from our Nairobi customer care desk will contact you within 2 hours.
                </div>
              )}

              <button
                type="submit"
                className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow"
              >
                Submit Support Request
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
