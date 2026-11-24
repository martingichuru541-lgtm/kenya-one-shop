import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Smartphone, 
  Award, 
  Globe, 
  ExternalLink,
  CheckCircle,
  X,
  FileText,
  Lock,
  Gavel
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

interface FooterProps {
  onNavigateTab?: (tab: string) => void;
  openSellerRegistration?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateTab,
  openSellerRegistration
}) => {
  const { setIsCreatorStudioOpen, setActiveStoreSlug, setActiveProductId } = useCommerce();
  const [activeLegalModal, setActiveLegalModal] = useState<'auction_rules' | 'escrow_policy' | null>(null);

  const handleNav = (tab: string) => {
    setActiveStoreSlug(null);
    setActiveProductId(null);
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="liquid-glass-nav border-t border-white/10 text-stone-400 text-sm mt-auto">
      {/* Trust & Guarantees Strip */}
      <div className="border-b border-white/[0.08] py-8 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3 p-3 rounded-2xl liquid-glass-card">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shrink-0 text-emerald-400 shadow">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">KenyaOne Buyer Escrow</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Payments are locked in escrow and only released to sellers after confirmed delivery in all 47 counties.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl liquid-glass-card">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shrink-0 text-emerald-400 shadow">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">Lipa na M-Pesa Express</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Instant Safaricom STK push, Paybill 882910, Buy Goods Till 542890, & automated B2C seller settlements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl liquid-glass-card">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shrink-0 text-emerald-400 shadow">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">Tracked Courier Dispatch</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Integrated with Fargo Courier, G4S Kenya, Sendy Express, and DHL Worldwide door-to-door.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl liquid-glass-card">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shrink-0 text-emerald-400 shadow">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">Verified Kenyan Origins</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Authentic artisan beadwork, soapstone, Kitenge, & KEPHIS-certified single-origin coffees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-600 flex items-center justify-center text-white font-extrabold text-sm shadow">
                K1
              </div>
              <span className="font-display font-black text-white tracking-tight text-base">KENYAONE SHOP</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Where Kenya connects, creates and commerce happens. The native live commerce and rapid auction marketplace empowering creators, artisans and farmers.
            </p>
            <div className="text-xs text-stone-500 font-mono">
              Nairobi · Mombasa · Kisumu · Eldoret · Nakuru · Diaspora
            </div>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Shop Marketplace</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('shop')} className="text-stone-400 hover:text-emerald-400 text-left transition-colors">
                  All Marketplace Products
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('live')} className="text-stone-400 hover:text-rose-400 text-left transition-colors">
                  Live Video Shopping Streams
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('auctions')} className="text-stone-400 hover:text-amber-400 text-left transition-colors">
                  Rapid Live Auctions Arena
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('stores')} className="text-stone-400 hover:text-emerald-400 text-left transition-colors">
                  Verified Seller Stores Showcase
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('buyer-dashboard')} className="text-stone-400 hover:text-white text-left transition-colors">
                  Buyer Escrow Order Tracking
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">For Sellers & Creators</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => openSellerRegistration ? openSellerRegistration() : handleNav('seller-portal')}
                  className="text-stone-400 hover:text-emerald-400 text-left transition-colors"
                >
                  Apply to Sell on KenyaOne
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsCreatorStudioOpen(true)}
                  className="text-stone-400 hover:text-rose-400 text-left transition-colors"
                >
                  Open HD Broadcast Studio
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('seller-portal')} className="text-stone-400 hover:text-white text-left transition-colors">
                  Seller Studio & Inventory Manager
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('seller-portal')} className="text-stone-400 hover:text-white text-left transition-colors">
                  M-Pesa B2C Automated Settlements
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('seller-portal')} className="text-stone-400 hover:text-white text-left transition-colors">
                  Courier Dispatch & Waybill Assignment
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Trust, Safety & Law</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="https://cak.go.ke" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Kenyan Consumer Protection (CAK)</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.odpc.go.ke" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Data Protection Act 2019 (ODPC)</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.aca.go.ke" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Anti-Counterfeiting Authority (ACA)</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <button 
                  onClick={() => setActiveLegalModal('auction_rules')}
                  className="text-stone-400 hover:text-amber-400 text-left transition-colors"
                >
                  Auction Integrity & Anti-Sniping Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveLegalModal('escrow_policy')}
                  className="text-stone-400 hover:text-emerald-400 text-left transition-colors"
                >
                  Buyer Escrow & Return Guarantee
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 KenyaOne Commerce Inc. All rights reserved. Registered in Kenya.</p>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="text-emerald-400 font-semibold">Lipa na M-Pesa</span>
            <span>·</span>
            <span>Daraja API 2.0</span>
            <span>·</span>
            <span>Paybill 882910</span>
            <span>·</span>
            <span>CBK Regulated Rails</span>
          </div>
        </div>
      </div>

      {/* AUCTION INTEGRITY RULES MODAL */}
      {activeLegalModal === 'auction_rules' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="liquid-glass-modal rounded-3xl max-w-lg w-full p-6 text-xs text-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-amber-400" />
                <h4 className="font-display font-bold text-white text-base">Auction Integrity & Rules</h4>
              </div>
              <button onClick={() => setActiveLegalModal(null)} className="text-stone-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 leading-relaxed">
              <p><strong>1. Binding Bids:</strong> Every bid submitted on KenyaOne Rapid Auctions is a legally binding commitment to purchase the lot under Kenyan commercial law.</p>
              <p><strong>2. Anti-Sniping Protection:</strong> If a bid is submitted in the final 15 seconds of an auction countdown, the auction timer automatically extends by +15 seconds to ensure fairness over mobile networks.</p>
              <p><strong>3. Reserve Pricing:</strong> If an auction finishes below the seller's confidential reserve price, the seller reserves the right to accept the high bid or retain the item.</p>
              <p><strong>4. Escrow Checkout:</strong> Winning bidders have 24 hours to complete checkout via Lipa na M-Pesa or bank transfer into KenyaOne Escrow.</p>
            </div>
            <button
              onClick={() => setActiveLegalModal(null)}
              className="w-full py-2.5 bg-amber-500 text-stone-950 font-bold rounded-xl"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* ESCROW POLICY MODAL */}
      {activeLegalModal === 'escrow_policy' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="liquid-glass-modal rounded-3xl max-w-lg w-full p-6 text-xs text-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="font-display font-bold text-white text-base">Buyer Escrow & Return Guarantee</h4>
              </div>
              <button onClick={() => setActiveLegalModal(null)} className="text-stone-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 leading-relaxed">
              <p><strong>1. 100% Escrow Protection:</strong> When you pay via M-Pesa or Bank transfer, your funds are securely held in KenyaOne Escrow and are not released to the seller until your package is marked delivered by the courier.</p>
              <p><strong>2. 48-Hour Inspection Window:</strong> Buyers have 48 hours upon receipt to inspect items. If an item is damaged or not as described on stream, KenyaOne issues an instant refund or replacement.</p>
              <p><strong>3. Verified Sellers:</strong> All merchants must submit national identity, KRA PIN, and business registration before live streaming or selling on KenyaOne.</p>
            </div>
            <button
              onClick={() => setActiveLegalModal(null)}
              className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl"
            >
              Close Guarantee
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
