import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Tv, 
  Gavel, 
  Store as StoreIcon, 
  User, 
  ShieldCheck, 
  Search,
  Globe,
  Radio,
  Menu,
  X,
  Sparkles,
  Bell,
  CheckCircle,
  Truck,
  Tag,
  ArrowRight,
  LogOut,
  ChevronDown,
  Layers,
  MapPin,
  Clock,
  Compass
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { Currency, Product, Livestream, Auction, Store } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openCart: () => void;
  openSellerRegistration: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'live' | 'auction' | 'gift';
  targetTab?: string;
  targetId?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  openCart,
  openSellerRegistration
}) => {
  const { 
    user, 
    setUser, 
    cart, 
    wishlist, 
    currency, 
    setCurrency, 
    livestreams, 
    auctions,
    products,
    stores,
    openLivestream,
    setActiveStoreSlug,
    setActiveProductId,
    setIsCreatorStudioOpen
  } = useCommerce();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Notification Feed State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      title: 'Order Confirmed · Lipa na M-Pesa',
      message: 'Payment received for Order #K1-ORD-89241. Escrow protected.',
      time: '10m ago',
      read: false,
      type: 'order',
      targetTab: 'buyer-dashboard'
    },
    {
      id: 'notif_2',
      title: '🔴 Wambui Designs is Live',
      message: 'New Kitenge Runway show is broadcasting in 1080p FHD now!',
      time: '25m ago',
      read: false,
      type: 'live',
      targetTab: 'live',
      targetId: 'live_1'
    },
    {
      id: 'notif_3',
      title: 'Rapid Auction Bid Update',
      message: 'You have been outbid on Maasai Collar Lot #4 by KES 200.',
      time: '1h ago',
      read: true,
      type: 'auction',
      targetTab: 'auctions'
    },
    {
      id: 'notif_4',
      title: 'Zawadi Gift Received',
      message: 'Dennis Mutua sent "Chai Moto" (+KES 50) to your live stream!',
      time: '2h ago',
      read: true,
      type: 'gift',
      targetTab: 'seller-portal'
    }
  ]);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifsCount = notifications.filter(n => !n.read).length;
  const activeStreamsCount = livestreams.filter(l => l.status === 'live').length;
  const activeAuctionsCount = auctions.filter(a => a.status === 'active').length;

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (tab: string) => {
    setActiveStoreSlug(null);
    setActiveProductId(null);
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  // Search Results Querying
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const searchResults = trimmedQuery ? {
    products: products.filter(p => 
      p.title.toLowerCase().includes(trimmedQuery) || 
      p.category.toLowerCase().includes(trimmedQuery) ||
      p.countyOrigin.toLowerCase().includes(trimmedQuery)
    ).slice(0, 4),
    streams: livestreams.filter(s => 
      s.title.toLowerCase().includes(trimmedQuery) || 
      s.storeName.toLowerCase().includes(trimmedQuery)
    ).slice(0, 2),
    auctions: auctions.filter(a => 
      a.productTitle.toLowerCase().includes(trimmedQuery)
    ).slice(0, 2),
    stores: stores.filter(st => 
      st.name.toLowerCase().includes(trimmedQuery) || 
      st.county.toLowerCase().includes(trimmedQuery)
    ).slice(0, 2)
  } : null;

  const totalResultsCount = searchResults 
    ? searchResults.products.length + searchResults.streams.length + searchResults.auctions.length + searchResults.stores.length 
    : 0;

  const handleMarkAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    setNotificationsOpen(false);

    if (notif.targetTab === 'live' && notif.targetId) {
      openLivestream(notif.targetId);
    } else if (notif.targetTab) {
      handleNav(notif.targetTab);
    }
  };

  return (
    <header className="sticky top-0 z-40 liquid-glass-nav text-stone-100 shadow-xl transition-all">
      {/* Top Banner Notice: Liquid Glass Accent */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-stone-950/90 to-amber-950/80 px-4 py-1.5 text-xs text-stone-300 flex items-center justify-between border-b border-white/[0.08]">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>KENYAONE SHOP</span>
          </div>
          <span className="text-stone-400 hidden sm:inline">· Buy. Sell. Connect.</span>
          <span className="hidden lg:inline text-stone-400">· Lipa na M-Pesa Express & Escrow Protection in all 47 Counties</span>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4 text-xs">
          {/* Currency Switcher */}
          <div className="flex items-center gap-1.5 liquid-glass-pill px-2 py-0.5 rounded-full">
            <Globe className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-transparent text-stone-200 text-xs focus:outline-none cursor-pointer font-medium"
              aria-label="Select Currency"
            >
              <option value="KES" className="bg-stone-900">KES (KSh)</option>
              <option value="USD" className="bg-stone-900">USD ($)</option>
              <option value="GBP" className="bg-stone-900">GBP (£)</option>
              <option value="EUR" className="bg-stone-900">EUR (€)</option>
            </select>
          </div>

          {/* User Persona Quick Switcher */}
          <div className="hidden sm:flex items-center gap-1.5 liquid-glass-pill px-2.5 py-0.5 rounded-full">
            <span className="text-[11px] text-stone-400">Role:</span>
            <select
              value={user.role}
              onChange={(e) => setUser(prev => ({ ...prev, role: e.target.value as any }))}
              className="bg-transparent text-[11px] font-bold text-emerald-400 focus:outline-none cursor-pointer"
              aria-label="Switch User Role"
            >
              <option value="buyer" className="bg-stone-900 text-stone-200">Buyer (Martin Gichuru)</option>
              <option value="seller" className="bg-stone-900 text-stone-200">Seller (Wambui Studio)</option>
              <option value="admin" className="bg-stone-900 text-stone-200">Admin Centre</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 lg:gap-4">
          
          {/* BRAND LOGO & TAGLINE */}
          <button 
            onClick={() => handleNav('shop')}
            className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
            title="Return to KenyaOne Shop Homepage"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all relative overflow-hidden border border-white/20">
              <span className="font-display font-extrabold text-white text-lg tracking-tighter drop-shadow-md">K1</span>
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  KENYAONE
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.5 rounded-full">
                  SHOP
                </span>
              </div>
              <p className="text-[10px] text-stone-400 hidden sm:block tracking-wide">
                Live Video · Rapid Auctions · Verified Stores
              </p>
            </div>
          </button>

          {/* GLOBAL FUNCTIONAL SEARCH BAR WITH LIVE RESULTS DROPDOWN */}
          <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search coffee, beadwork, auctions, live drops, counties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full bg-white/[0.06] hover:bg-white/[0.09] focus:bg-white/[0.12] border border-white/[0.14] focus:border-emerald-500/80 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-stone-400 focus:outline-none transition-all shadow-inner backdrop-blur-md"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-stone-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Autocomplete Results Modal */}
            {searchFocused && trimmedQuery && (
              <div className="absolute top-11 inset-x-0 z-50 liquid-glass-modal rounded-xl p-3 shadow-2xl border border-white/20 space-y-3 animate-slide-up text-xs max-h-96 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between text-[11px] text-stone-400 border-b border-white/10 pb-1.5">
                  <span>Results for "{searchQuery}" ({totalResultsCount} found)</span>
                  <button onClick={() => setSearchFocused(false)} className="hover:text-white">Close</button>
                </div>

                {totalResultsCount === 0 ? (
                  <div className="p-4 text-center text-stone-400">
                    No items matching "{searchQuery}". Try "coffee", "kitenge", "auctions", or "Narok".
                  </div>
                ) : (
                  <>
                    {/* Products */}
                    {searchResults && searchResults.products.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider block mb-1">
                          Products
                        </span>
                        <div className="space-y-1">
                          {searchResults.products.map(p => (
                            <div
                              key={p.id}
                              onClick={() => {
                                setActiveProductId(p.id);
                                setSearchFocused(false);
                              }}
                              className="p-2 rounded-lg hover:bg-white/[0.08] flex items-center justify-between cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <img src={p.images[0]} alt="" className="w-8 h-8 rounded object-cover" />
                                <div className="min-w-0">
                                  <span className="font-semibold text-white truncate block">{p.title}</span>
                                  <span className="text-[10px] text-stone-400">{p.countyOrigin} · {p.category}</span>
                                </div>
                              </div>
                              <span className="font-mono text-emerald-400 font-bold shrink-0">
                                {formatCurrency(p.priceKes, currency)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Live Streams */}
                    {searchResults && searchResults.streams.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold uppercase text-rose-400 tracking-wider block mb-1">
                          Live Shows
                        </span>
                        <div className="space-y-1">
                          {searchResults.streams.map(s => (
                            <div
                              key={s.id}
                              onClick={() => {
                                openLivestream(s.id);
                                setSearchFocused(false);
                              }}
                              className="p-2 rounded-lg hover:bg-white/[0.08] flex items-center justify-between cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Radio className="w-4 h-4 text-rose-500 animate-pulse shrink-0" />
                                <span className="font-semibold text-white truncate">{s.title}</span>
                              </div>
                              <span className="text-[10px] bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded">
                                LIVE
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Auctions */}
                    {searchResults && searchResults.auctions.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider block mb-1">
                          Live Auctions
                        </span>
                        <div className="space-y-1">
                          {searchResults.auctions.map(a => (
                            <div
                              key={a.id}
                              onClick={() => {
                                handleNav('auctions');
                                setSearchFocused(false);
                              }}
                              className="p-2 rounded-lg hover:bg-white/[0.08] flex items-center justify-between cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Gavel className="w-4 h-4 text-amber-400 shrink-0" />
                                <span className="font-semibold text-white truncate">{a.productTitle}</span>
                              </div>
                              <span className="font-mono text-amber-400 font-bold">
                                Bid: {formatCurrency(a.currentBidKes, currency)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* PRIMARY NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold">
            <button
              onClick={() => handleNav('shop')}
              className={`px-3 py-2 rounded-xl transition-all ${
                currentTab === 'shop' 
                  ? 'liquid-glass-btn text-emerald-300 font-bold border-emerald-500/40' 
                  : 'text-stone-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              Marketplace
            </button>

            <button
              onClick={() => handleNav('live')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                currentTab === 'live' 
                  ? 'liquid-glass-btn text-rose-300 font-bold border-rose-500/40' 
                  : 'text-stone-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>Live Shows</span>
              {activeStreamsCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {activeStreamsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNav('auctions')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                currentTab === 'auctions' 
                  ? 'liquid-glass-btn text-amber-300 font-bold border-amber-500/40' 
                  : 'text-stone-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Gavel className="w-3.5 h-3.5 text-amber-400" />
              <span>Auctions</span>
              {activeAuctionsCount > 0 && (
                <span className="bg-amber-500 text-stone-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {activeAuctionsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNav('stores')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                currentTab === 'stores' 
                  ? 'liquid-glass-btn text-emerald-300 font-bold border-emerald-500/40' 
                  : 'text-stone-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <StoreIcon className="w-3.5 h-3.5 text-stone-400" />
              <span>Stores</span>
            </button>

            {/* Seller Portal Tab (if seller role) */}
            {user.role === 'seller' && (
              <button
                onClick={() => handleNav('seller-portal')}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  currentTab === 'seller-portal' 
                    ? 'liquid-glass-btn text-emerald-300 font-bold border-emerald-500/40' 
                    : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Seller Studio</span>
              </button>
            )}

            {/* Admin Centre Tab (if admin role) */}
            {user.role === 'admin' && (
              <button
                onClick={() => handleNav('admin')}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  currentTab === 'admin' 
                    ? 'liquid-glass-btn text-amber-300 font-bold border-amber-500/40' 
                    : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/40'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Centre</span>
              </button>
            )}
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* GO LIVE STUDIO CTA (LIQUID GLASS GLOW) */}
            <button
              onClick={() => setIsCreatorStudioOpen(true)}
              className="liquid-glass-btn bg-gradient-to-r from-rose-600/90 to-red-600/90 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg flex items-center gap-1.5 transition-all active:scale-95 border-rose-500/40"
              title="Open Creator Broadcast Studio (Webcam, Mic, Filters, Zawadi Cashout)"
            >
              <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
              <span className="hidden sm:inline">Go Live</span>
            </button>

            {/* SELL ON KENYAONE CTA */}
            <button
              onClick={openSellerRegistration}
              className="hidden xl:flex items-center gap-1.5 text-xs font-bold liquid-glass-btn bg-gradient-to-r from-emerald-600/80 to-teal-600/80 hover:from-emerald-500 hover:to-teal-500 text-white px-3 py-2 rounded-xl shadow-sm transition-all"
            >
              <StoreIcon className="w-3.5 h-3.5" />
              <span>Sell Drop</span>
            </button>

            {/* FUNCTIONAL NOTIFICATIONS BELL WITH INTERACTIVE PANEL */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute 1 top-1.5 right-1.5 bg-rose-500 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer Popover */}
              {notificationsOpen && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 liquid-glass-modal rounded-2xl p-4 shadow-2xl border border-white/20 text-xs animate-slide-up z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-bold text-white text-sm">Notifications</h4>
                      {unreadNotifsCount > 0 && (
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                          {unreadNotifsCount} new
                        </span>
                      )}
                    </div>
                    {unreadNotifsCount > 0 && (
                      <button
                        onClick={handleMarkAllNotifsRead}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                          n.read
                            ? 'bg-white/[0.02] border-white/[0.06] text-stone-400'
                            : 'bg-emerald-950/40 border-emerald-500/40 text-stone-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-bold text-xs ${n.read ? 'text-stone-300' : 'text-white'}`}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-stone-500">{n.time}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CART TRIGGER WITH ANIMATED BADGE */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-white/[0.08] transition-colors"
              aria-label={`Shopping Cart with ${totalCartCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-emerald-500 text-stone-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* USER ACCOUNT & PROFILE DROPDOWN MENU */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className={`p-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                  profileMenuOpen
                    ? 'border-emerald-500 bg-white/[0.1]'
                    : 'border-white/10 hover:border-white/20 bg-white/[0.04]'
                }`}
                title="Account Settings & Profile"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-600 to-amber-600 text-white font-bold text-xs flex items-center justify-center">
                  {user.name.charAt(0)}
                </div>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {/* Profile Menu Popover */}
              {profileMenuOpen && (
                <div className="absolute right-0 top-12 w-64 liquid-glass-modal rounded-2xl p-4 shadow-2xl border border-white/20 text-xs animate-slide-up z-50 space-y-3">
                  {/* User Info Header */}
                  <div className="pb-3 border-b border-white/10">
                    <div className="font-bold text-white text-sm truncate">{user.name}</div>
                    <div className="text-stone-400 text-[11px] truncate">{user.email}</div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{user.county} County · Verified Profile</span>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-1">
                    <button
                      onClick={() => handleNav('buyer-dashboard')}
                      className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-white/[0.08] text-stone-200 hover:text-white flex items-center justify-between"
                    >
                      <span>My Orders & Escrow</span>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                    </button>

                    <button
                      onClick={() => handleNav('seller-portal')}
                      className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-white/[0.08] text-stone-200 hover:text-white flex items-center justify-between"
                    >
                      <span>Seller Portal & Inventory</span>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                    </button>

                    <button
                      onClick={() => handleNav('admin')}
                      className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-white/[0.08] text-stone-200 hover:text-white flex items-center justify-between"
                    >
                      <span>Admin Control Centre</span>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                    </button>

                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setIsCreatorStudioOpen(true);
                      }}
                      className="w-full text-left py-2 px-2.5 rounded-lg hover:bg-white/[0.08] text-rose-300 hover:text-rose-200 flex items-center justify-between font-bold"
                    >
                      <span>Go Live Studio Suite</span>
                      <Radio className="w-3.5 h-3.5 text-rose-500" />
                    </button>
                  </div>

                  {/* Quick Role Toggle */}
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">
                      Switch Active Persona
                    </span>
                    <div className="grid grid-cols-3 gap-1 text-[10px]">
                      {(['buyer', 'seller', 'admin'] as const).map(r => (
                        <button
                          key={r}
                          onClick={() => {
                            setUser(prev => ({ ...prev, role: r }));
                            setProfileMenuOpen(false);
                          }}
                          className={`py-1 rounded font-bold capitalize ${
                            user.role === r
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white/[0.06] text-stone-300 hover:bg-white/[0.1]'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-300 hover:text-white focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE HAMBURGER MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="lg:hidden liquid-glass border-b border-white/10 px-4 py-4 space-y-3 animate-slide-up">
          {/* Mobile Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products, auctions, live shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.08] border border-white/14 rounded-xl pl-9 pr-4 py-2 text-xs text-white"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleNav('shop')}
              className="p-2.5 rounded-xl bg-white/[0.06] text-left font-bold text-white"
            >
              Marketplace
            </button>
            <button
              onClick={() => handleNav('live')}
              className="p-2.5 rounded-xl bg-white/[0.06] text-left font-bold text-rose-300 flex items-center justify-between"
            >
              <span>Live Shows</span>
              <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full">{activeStreamsCount}</span>
            </button>
            <button
              onClick={() => handleNav('auctions')}
              className="p-2.5 rounded-xl bg-white/[0.06] text-left font-bold text-amber-300 flex items-center justify-between"
            >
              <span>Auctions</span>
              <span className="bg-amber-600 text-stone-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">{activeAuctionsCount}</span>
            </button>
            <button
              onClick={() => handleNav('stores')}
              className="p-2.5 rounded-xl bg-white/[0.06] text-left font-bold text-white"
            >
              Verified Stores
            </button>
            <button
              onClick={() => handleNav('buyer-dashboard')}
              className="p-2.5 rounded-xl bg-white/[0.06] text-left font-bold text-stone-300"
            >
              My Orders
            </button>
            <button
              onClick={() => handleNav('seller-portal')}
              className="p-2.5 rounded-xl bg-white/[0.06] text-left font-bold text-emerald-400"
            >
              Seller Studio
            </button>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCreatorStudioOpen(true);
              }}
              className="flex-1 py-2.5 px-3 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Go Live Studio</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openSellerRegistration();
              }}
              className="flex-1 py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-xs"
            >
              Sell on KenyaOne
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
