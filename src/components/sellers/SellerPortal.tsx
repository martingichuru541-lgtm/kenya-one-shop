import React, { useState } from 'react';
import { 
  Store, 
  Plus, 
  Package, 
  Radio, 
  DollarSign, 
  Truck, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Camera, 
  Calendar,
  AlertCircle,
  FileText,
  Smartphone
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { formatCurrency } from '../../utils/formatters';
import { Product, SellerCategory } from '../../types';
import { KENYA_COURIERS } from '../../data/initialData';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

export const SellerPortal: React.FC = () => {
  const { 
    products, 
    orders, 
    settlements, 
    currency, 
    addProduct, 
    updateProductStock, 
    updateOrderStatus,
    createLivestream,
    user 
  } = useCommerce();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'financials' | 'live-studio'>('inventory');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);

  // Add Product Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SellerCategory>('Artisanal & Crafts');
  const [priceKes, setPriceKes] = useState('2500');
  const [stock, setStock] = useState('15');
  const [countyOrigin, setCountyOrigin] = useState('Nairobi');
  const [isExportReady, setIsExportReady] = useState(true);
  const [isAuctionEligible, setIsAuctionEligible] = useState(false);

  // Live Studio Form State
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDesc, setStreamDesc] = useState('');
  const [streamCategory, setStreamCategory] = useState<SellerCategory>('Fashion & Kitenge');

  // Tracking Dispatch Form State
  const [dispatchTrackingCode, setDispatchTrackingCode] = useState<{ [orderId: string]: string }>({});

  // Earnings Overview Chart State & Dataset (Recharts)
  const [earningsTimeframe, setEarningsTimeframe] = useState<'7d' | '14d'>('7d');
  const [earningsChartType, setEarningsChartType] = useState<'area' | 'bar'>('area');

  const EARNINGS_DATA_7D = [
    { date: '03 Nov', day: 'Mon', mpesaVolumeKes: 48500, salesPayoutKes: 44620, transactions: 14 },
    { date: '04 Nov', day: 'Tue', mpesaVolumeKes: 62200, salesPayoutKes: 57224, transactions: 22 },
    { date: '05 Nov', day: 'Wed', mpesaVolumeKes: 54000, salesPayoutKes: 49680, transactions: 18 },
    { date: '06 Nov', day: 'Thu', mpesaVolumeKes: 78900, salesPayoutKes: 72588, transactions: 29 },
    { date: '07 Nov', day: 'Fri', mpesaVolumeKes: 95400, salesPayoutKes: 87768, transactions: 36 },
    { date: '08 Nov', day: 'Sat', mpesaVolumeKes: 82100, salesPayoutKes: 75532, transactions: 28 },
    { date: '09 Nov', day: 'Today', mpesaVolumeKes: 69300, salesPayoutKes: 63756, transactions: 25 },
  ];

  const EARNINGS_DATA_14D = [
    { date: '27 Oct', day: 'Mon', mpesaVolumeKes: 39000, salesPayoutKes: 35880, transactions: 12 },
    { date: '28 Oct', day: 'Tue', mpesaVolumeKes: 44500, salesPayoutKes: 40940, transactions: 15 },
    { date: '29 Oct', day: 'Wed', mpesaVolumeKes: 51200, salesPayoutKes: 47104, transactions: 19 },
    { date: '30 Oct', day: 'Thu', mpesaVolumeKes: 58000, salesPayoutKes: 53360, transactions: 21 },
    { date: '31 Oct', day: 'Fri', mpesaVolumeKes: 72000, salesPayoutKes: 66240, transactions: 26 },
    { date: '01 Nov', day: 'Sat', mpesaVolumeKes: 65000, salesPayoutKes: 59800, transactions: 23 },
    { date: '02 Nov', day: 'Sun', mpesaVolumeKes: 52000, salesPayoutKes: 47840, transactions: 17 },
    ...EARNINGS_DATA_7D
  ];

  const activeEarningsData = earningsTimeframe === '7d' ? EARNINGS_DATA_7D : EARNINGS_DATA_14D;
  const totalPeriodMpesaVolume = activeEarningsData.reduce((acc, curr) => acc + curr.mpesaVolumeKes, 0);
  const totalPeriodPayout = activeEarningsData.reduce((acc, curr) => acc + curr.salesPayoutKes, 0);
  const totalTransactions = activeEarningsData.reduce((acc, curr) => acc + curr.transactions, 0);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      storeId: 'store_2',
      storeName: 'Wambui Designs Nairobi',
      storeSlug: 'wambui-designs',
      storeVerified: true,
      title,
      description,
      category,
      priceKes: parseInt(priceKes, 10) || 1000,
      stock: parseInt(stock, 10) || 5,
      images: ['/src/assets/images/livestream_studio_host_1794002336736.jpg'],
      isAuctionEligible,
      countyOrigin,
      isExportReady,
      tags: ['Kenyan Made', category],
      specifications: {
        'Origin': countyOrigin,
        'Crafted By': 'Verified Collective'
      }
    });

    setShowAddProductModal(false);
    setTitle('');
    setDescription('');
  };

  const handleStartLive = (e: React.FormEvent) => {
    e.preventDefault();
    createLivestream({
      storeId: 'store_2',
      storeName: 'Wambui Designs Nairobi',
      storeSlug: 'wambui-designs',
      sellerAvatar: '/src/assets/images/livestream_studio_host_1794002336736.jpg',
      title: streamTitle || 'Live Flash Drop Showcase',
      description: streamDesc || 'Showing real-time inventory from our workshop.',
      category: streamCategory,
      status: 'live',
      scheduledFor: new Date().toISOString(),
      streamPoster: '/src/assets/images/livestream_studio_host_1794002336736.jpg',
      featuredProductIds: products.slice(0, 3).map(p => p.id)
    });

    setShowGoLiveModal(false);
    setActiveTab('live-studio');
  };

  const handleDispatchOrder = (orderId: string) => {
    const code = dispatchTrackingCode[orderId] || `FGO-${Math.floor(100000 + Math.random() * 900000)}`;
    updateOrderStatus(orderId, 'dispatched', code);
  };

  return (
    <div className="py-8 bg-stone-950 text-stone-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Portal Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Merchant Operations Console
              </span>
              <span className="text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                Verified Store
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Seller Studio & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Store: Wambui Designs Nairobi · Paybill / Till settlement linked
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowGoLiveModal(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-2 transition-all active:scale-95"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Go Live Broadcast</span>
            </button>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-stone-800 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Incoming Orders & Dispatch ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('financials')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'financials'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Financials & Settlements</span>
          </button>

          <button
            onClick={() => setActiveTab('live-studio')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'live-studio'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Live Stream Studio</span>
          </button>
        </div>

        {/* TAB 1: PRODUCT INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="py-3.5 px-4">Product Details</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">In Stock</th>
                      <th className="py-3.5 px-4">Auction Status</th>
                      <th className="py-3.5 px-4">Export Ready</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/80">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-stone-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                            <div>
                              <div className="font-semibold text-white truncate max-w-xs">{p.title}</div>
                              <div className="text-[11px] text-stone-500">{p.countyOrigin} County</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-stone-400">{p.category}</td>
                        <td className="py-3 px-4 font-mono font-bold text-white">
                          {formatCurrency(p.priceKes, currency)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={p.stock}
                              onChange={(e) => updateProductStock(p.id, parseInt(e.target.value, 10) || 0)}
                              className="w-16 bg-stone-950 border border-stone-700 rounded px-2 py-1 text-white font-mono text-xs"
                            />
                            {p.stock <= 5 && (
                              <span className="text-[10px] text-amber-400 font-semibold">Low</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {p.isAuctionEligible ? (
                            <span className="text-[10px] bg-amber-950/80 border border-amber-800 text-amber-300 px-2 py-0.5 rounded font-semibold">
                              Eligible
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-500">Direct Buy Only</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {p.isExportReady ? (
                            <span className="text-[10px] text-teal-400 font-medium">KEPHIS Certified</span>
                          ) : (
                            <span className="text-[10px] text-stone-500">Local Only</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => updateProductStock(p.id, p.stock + 10)}
                            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium"
                          >
                            +10 Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INCOMING ORDERS & DISPATCH */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow flex flex-col md:flex-row justify-between gap-5"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">{order.orderNumber}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        order.status === 'delivered' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                          : order.status === 'in_transit' || order.status === 'dispatched'
                          ? 'bg-blue-950 text-blue-400 border border-blue-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">
                        Payment Ref: {order.paymentRef} ({order.paymentMethod})
                      </span>
                    </div>

                    <div className="text-xs text-stone-300">
                      <strong>Customer:</strong> {order.buyerName} ({order.buyerPhone}) · {order.deliveryAddress.addressLine}, {order.deliveryAddress.county} County
                    </div>

                    <div className="space-y-1 pt-2">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-stone-300">
                          <img src={it.image} alt="" className="w-6 h-6 rounded object-cover" />
                          <span>{it.quantity}x {it.title}</span>
                          <span className="font-mono font-semibold text-emerald-400">
                            {formatCurrency(it.priceKes * it.quantity, currency)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-stone-400 pt-1">
                      Courier: <strong>{order.courier}</strong> · Waybill Code: <span className="font-mono text-white">{order.trackingCode}</span>
                    </div>
                  </div>

                  {/* Dispatch Controls */}
                  <div className="md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-stone-800 md:pl-5 pt-3 md:pt-0">
                    <div>
                      <span className="text-[11px] text-stone-400 block mb-1">Dispatch Waybill Assignment:</span>
                      {order.status === 'confirmed' ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Enter Waybill Tracking #"
                            value={dispatchTrackingCode[order.id] || ''}
                            onChange={(e) => setDispatchTrackingCode(prev => ({ ...prev, [order.id]: e.target.value }))}
                            className="w-full bg-stone-950 border border-stone-700 rounded px-2.5 py-1.5 text-xs text-white"
                          />
                          <button
                            onClick={() => handleDispatchOrder(order.id)}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow"
                          >
                            Mark Dispatched via Courier
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 bg-stone-950 rounded-lg border border-stone-800 text-xs text-emerald-400 font-semibold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Dispatched to Courier</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 text-right">
                      <span className="text-xs text-stone-400 block">Total Settlement Due:</span>
                      <span className="font-mono text-base font-bold text-white">
                        {formatCurrency(order.totalKes, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FINANCIALS & SETTLEMENTS */}
        {activeTab === 'financials' && (
          <div className="space-y-8">
            {/* EARNINGS OVERVIEW RECHARTS VISUALIZATION */}
            <div className="liquid-glass-card rounded-2xl p-6 border border-white/14 shadow-2xl space-y-6">
              {/* Header with Metrics & Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                      M-Pesa Daraja Analytics
                    </span>
                    <span className="text-xs text-stone-400 font-mono">Real-time Settlement Feed</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span>Earnings Overview</span>
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Visualizing daily M-Pesa transaction volume vs successful sales payouts into your seller wallet
                  </p>
                </div>

                {/* Controls: Timeframe & Chart Type */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Chart Style Switcher */}
                  <div className="flex bg-stone-950/80 rounded-xl p-1 border border-white/10 text-xs font-semibold">
                    <button
                      onClick={() => setEarningsChartType('area')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        earningsChartType === 'area'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      Area Trend
                    </button>
                    <button
                      onClick={() => setEarningsChartType('bar')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        earningsChartType === 'bar'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      Bar Comparison
                    </button>
                  </div>

                  {/* Timeframe Switcher */}
                  <div className="flex bg-stone-950/80 rounded-xl p-1 border border-white/10 text-xs font-semibold">
                    <button
                      onClick={() => setEarningsTimeframe('7d')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        earningsTimeframe === '7d'
                          ? 'bg-amber-500 text-stone-950 font-bold shadow'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      Last 7 Days
                    </button>
                    <button
                      onClick={() => setEarningsTimeframe('14d')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        earningsTimeframe === '14d'
                          ? 'bg-amber-500 text-stone-950 font-bold shadow'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      Last 14 Days
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Summary Pill Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-stone-950/70 rounded-xl border border-white/10">
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">Total M-Pesa Volume</span>
                  <span className="font-mono text-base sm:text-lg font-black text-emerald-400 mt-0.5 block">
                    {formatCurrency(totalPeriodMpesaVolume, currency)}
                  </span>
                </div>
                <div className="p-3 bg-stone-950/70 rounded-xl border border-white/10">
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">Net Sales Payout</span>
                  <span className="font-mono text-base sm:text-lg font-black text-amber-400 mt-0.5 block">
                    {formatCurrency(totalPeriodPayout, currency)}
                  </span>
                </div>
                <div className="p-3 bg-stone-950/70 rounded-xl border border-white/10">
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">Total Transactions</span>
                  <span className="font-mono text-base sm:text-lg font-black text-white mt-0.5 block">
                    {totalTransactions} Paid Orders
                  </span>
                </div>
                <div className="p-3 bg-stone-950/70 rounded-xl border border-white/10">
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">M-Pesa Settlement Rate</span>
                  <span className="font-mono text-base sm:text-lg font-black text-teal-400 mt-0.5 block">
                    99.4% Daraja STK
                  </span>
                </div>
              </div>

              {/* Recharts Container */}
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  {earningsChartType === 'area' ? (
                    <AreaChart data={activeEarningsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="mpesaVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="payoutGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#78716c"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                      />
                      <YAxis
                        stroke="#78716c"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        tickFormatter={(v) => `KSh ${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-stone-950/95 backdrop-blur-xl border border-white/20 p-3.5 rounded-xl shadow-2xl text-xs space-y-2 min-w-[210px]">
                                <div className="flex items-center justify-between border-b border-white/10 pb-1.5 font-bold text-white">
                                  <span>{label} ({data.day})</span>
                                  <span className="text-[10px] text-stone-400 font-mono">{data.transactions} orders</span>
                                </div>
                                <div className="flex items-center justify-between text-emerald-400 font-mono">
                                  <span className="flex items-center gap-1.5 text-stone-300 font-sans">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    <span>M-Pesa Volume:</span>
                                  </span>
                                  <span className="font-bold">{formatCurrency(data.mpesaVolumeKes, currency)}</span>
                                </div>
                                <div className="flex items-center justify-between text-amber-400 font-mono">
                                  <span className="flex items-center gap-1.5 text-stone-300 font-sans">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                    <span>Sales Payout:</span>
                                  </span>
                                  <span className="font-bold">{formatCurrency(data.salesPayoutKes, currency)}</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-white/10">
                                  <span>Marketplace Fee (8%):</span>
                                  <span className="font-mono text-stone-300">
                                    {formatCurrency(data.mpesaVolumeKes - data.salesPayoutKes, currency)}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend
                        verticalAlign="top"
                        align="right"
                        iconType="circle"
                        wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="mpesaVolumeKes"
                        name="Daily M-Pesa Volume"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#mpesaVolumeGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="salesPayoutKes"
                        name="Successful Sales Payout"
                        stroke="#f59e0b"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#payoutGrad)"
                      />
                    </AreaChart>
                  ) : (
                    <BarChart data={activeEarningsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#78716c"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                      />
                      <YAxis
                        stroke="#78716c"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        tickFormatter={(v) => `KSh ${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-stone-950/95 backdrop-blur-xl border border-white/20 p-3.5 rounded-xl shadow-2xl text-xs space-y-2 min-w-[210px]">
                                <div className="flex items-center justify-between border-b border-white/10 pb-1.5 font-bold text-white">
                                  <span>{label} ({data.day})</span>
                                  <span className="text-[10px] text-stone-400 font-mono">{data.transactions} orders</span>
                                </div>
                                <div className="flex items-center justify-between text-emerald-400 font-mono">
                                  <span className="flex items-center gap-1.5 text-stone-300 font-sans">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    <span>M-Pesa Volume:</span>
                                  </span>
                                  <span className="font-bold">{formatCurrency(data.mpesaVolumeKes, currency)}</span>
                                </div>
                                <div className="flex items-center justify-between text-amber-400 font-mono">
                                  <span className="flex items-center gap-1.5 text-stone-300 font-sans">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                    <span>Sales Payout:</span>
                                  </span>
                                  <span className="font-bold">{formatCurrency(data.salesPayoutKes, currency)}</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend
                        verticalAlign="top"
                        align="right"
                        iconType="circle"
                        wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
                      />
                      <Bar
                        dataKey="mpesaVolumeKes"
                        name="Daily M-Pesa Volume"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="salesPayoutKes"
                        name="Successful Sales Payout"
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
                <span className="text-stone-400 text-xs font-semibold block uppercase">Gross Merchandise Value</span>
                <span className="font-mono text-2xl font-bold text-white mt-1 block">
                  {formatCurrency(413000, currency)}
                </span>
                <span className="text-[11px] text-emerald-400 mt-1 block">+18% this month</span>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
                <span className="text-stone-400 text-xs font-semibold block uppercase">Platform Commission (8%)</span>
                <span className="font-mono text-2xl font-bold text-amber-400 mt-1 block">
                  {formatCurrency(33040, currency)}
                </span>
                <span className="text-[11px] text-stone-500 mt-1 block">Standard verified seller rate</span>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
                <span className="text-stone-400 text-xs font-semibold block uppercase">Net Seller Earnings</span>
                <span className="font-mono text-2xl font-bold text-emerald-400 mt-1 block">
                  {formatCurrency(356860, currency)}
                </span>
                <span className="text-[11px] text-stone-400 mt-1 block">Held in safe escrow</span>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
                <span className="text-stone-400 text-xs font-semibold block uppercase">Pending Payout</span>
                <span className="font-mono text-2xl font-bold text-teal-400 mt-1 block">
                  {formatCurrency(142900, currency)}
                </span>
                <span className="text-[11px] text-stone-400 mt-1 block">Settling to M-Pesa Till 882910</span>
              </div>
            </div>

            {/* Settlements History Table */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow">
              <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
                <h3 className="font-display font-bold text-white text-sm">
                  Settlement & Payout Records
                </h3>
                <span className="text-xs text-stone-400">Automated Daraja B2C Disbursements</span>
              </div>

              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4">Gross Sales</th>
                    <th className="py-3 px-4">Commission</th>
                    <th className="py-3 px-4">Net Payout</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  {settlements.map(s => (
                    <tr key={s.id} className="hover:bg-stone-800/40">
                      <td className="py-3 px-4 font-semibold text-white">{s.period}</td>
                      <td className="py-3 px-4 font-mono">{formatCurrency(s.grossSalesKes, currency)}</td>
                      <td className="py-3 px-4 font-mono text-amber-400">-{formatCurrency(s.commissionKes, currency)}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">{formatCurrency(s.netPayoutKes, currency)}</td>
                      <td className="py-3 px-4 text-stone-400">{s.settlementMethod} ({s.settlementAccount})</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          s.status === 'settled'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-stone-400">{s.reference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: LIVE STREAM STUDIO */}
        {activeTab === 'live-studio' && (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
              <div>
                <h3 className="font-display text-xl font-bold text-white">Broadcaster Control Suite</h3>
                <p className="text-xs text-stone-400 mt-1">
                  Connect your camera, pin products, run flash drops and interact with buyers in real-time.
                </p>
              </div>

              <button
                onClick={() => setShowGoLiveModal(true)}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-2"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Launch New Live Show</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-300">
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                <span className="font-bold text-white block mb-1">Broadcaster Requirements</span>
                <ul className="space-y-1.5 text-stone-400">
                  <li>· HTML5 High Definition Stream</li>
                  <li>· Built-in WebCam & Mic support enabled</li>
                  <li>· Minimum 5 products prepared for pinning</li>
                  <li>· Active Lipa na M-Pesa account for instant sales</li>
                </ul>
              </div>

              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                <span className="font-bold text-white block mb-1">Live Drop Commission</span>
                <p className="text-stone-400 leading-relaxed">
                  Live stream sales carry an 8.0% marketplace commission, covering stream delivery, instant M-Pesa STK push processing, and fraud protection.
                </p>
              </div>

              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                <span className="font-bold text-white block mb-1">Anti-Sniping In-Stream</span>
                <p className="text-stone-400 leading-relaxed">
                  When you launch an auction during your stream, any bid within 15s automatically adds +15s to keep auctions fair for mobile bidders across Kenyan networks.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-white mb-4">Add Product to Store</h3>
            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-stone-300 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Maasai Handcrafted Bead Choker"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-stone-300 block mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Authentic materials, artisanal story, and measurements..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 block mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SellerCategory)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Artisanal & Crafts">Artisanal & Crafts</option>
                    <option value="Specialty Coffee & Tea">Specialty Coffee & Tea</option>
                    <option value="Fashion & Kitenge">Fashion & Kitenge</option>
                    <option value="Kenyan Leatherworks">Kenyan Leatherworks</option>
                    <option value="Agri & Fresh Farm">Agri & Fresh Farm</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-300 block mb-1">County Origin</label>
                  <input
                    type="text"
                    value={countyOrigin}
                    onChange={(e) => setCountyOrigin(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 block mb-1">Price (KES) *</label>
                  <input
                    type="number"
                    required
                    value={priceKes}
                    onChange={(e) => setPriceKes(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-stone-300 block mb-1">Initial Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAuctionEligible}
                    onChange={(e) => setIsAuctionEligible(e.target.checked)}
                    className="rounded bg-stone-950"
                  />
                  <span className="text-stone-300">Auction Eligible</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isExportReady}
                    onChange={(e) => setIsExportReady(e.target.checked)}
                    className="rounded bg-stone-950"
                  />
                  <span className="text-stone-300">Export Certified</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Go Live Modal */}
      {showGoLiveModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-white mb-2">Start Live Broadcast Show</h3>
            <p className="text-xs text-stone-400 mb-4">
              Your followers will receive push notifications that you are live.
            </p>
            <form onSubmit={handleStartLive} className="space-y-4 text-xs">
              <div>
                <label className="text-stone-300 block mb-1">Broadcast Title *</label>
                <input
                  type="text"
                  required
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="e.g. 🔥 LIVE: Kitenge Runway & Flash Drops!"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-stone-300 block mb-1">Show Overview *</label>
                <textarea
                  rows={3}
                  value={streamDesc}
                  onChange={(e) => setStreamDesc(e.target.value)}
                  placeholder="Tell viewers what you will demonstrate live..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGoLiveModal(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow flex items-center gap-2"
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>Go Live Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
