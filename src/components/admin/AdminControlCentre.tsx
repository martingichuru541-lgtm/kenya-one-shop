import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Package, 
  Radio, 
  Gavel, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Sliders, 
  FileText, 
  Eye,
  Percent,
  Search,
  Filter
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { formatCurrency } from '../../utils/formatters';
import { VerificationStatus } from '../../types';

export const AdminControlCentre: React.FC = () => {
  const { 
    sellerProfiles, 
    updateSellerStatus, 
    products, 
    livestreams, 
    auctions, 
    orders, 
    settlements, 
    auditLogs, 
    currency,
    releaseSettlement 
  } = useCommerce();

  const [activeTab, setActiveTab] = useState<'overview' | 'sellers' | 'auctions' | 'financials' | 'audit'>('overview');
  const [commissionRate, setCommissionRate] = useState<number>(8.0);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Stats calculation
  const totalSellers = sellerProfiles.length;
  const verifiedSellers = sellerProfiles.filter(s => s.status === 'verified').length;
  const pendingSellers = sellerProfiles.filter(s => s.status === 'under_review' || s.status === 'pending').length;
  const totalProducts = products.length;
  const activeLivestreams = livestreams.filter(l => l.status === 'live').length;
  const activeAuctions = auctions.filter(a => a.status === 'active').length;
  const totalOrders = orders.length;

  const grossMerchandiseValueKes = orders.reduce((sum, o) => sum + o.totalKes, 0) + 750000; // base historical
  const platformCommissionsKes = Math.round(grossMerchandiseValueKes * (commissionRate / 100));

  const handleApproveSeller = (sellerId: string) => {
    updateSellerStatus(sellerId, 'verified', 'Approved by KenyaOne Compliance Administrator.');
    setActionNotice(`Seller ${sellerId} approved and verified.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleSuspendSeller = (sellerId: string) => {
    updateSellerStatus(sellerId, 'suspended', 'Suspended by Administrator pending document review.');
    setActionNotice(`Seller ${sellerId} suspended.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const filteredSellerProfiles = sellerProfiles.filter(s => {
    if (filterStatus === 'all') return true;
    return s.status === filterStatus;
  });

  return (
    <div className="py-8 bg-stone-950 text-stone-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                KenyaOne Commerce Governance
              </span>
              <span className="text-[10px] bg-amber-950 border border-amber-800 text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                Superuser Console
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Commerce Admin Control Centre
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Seller onboarding audits · Live auction integrity watchdog · Payout settlements & audit logs
            </p>
          </div>

          {actionNotice && (
            <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{actionNotice}</span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-800 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Marketplace KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('sellers')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'sellers'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Seller Audits ({pendingSellers} Pending)</span>
          </button>

          <button
            onClick={() => setActiveTab('auctions')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'auctions'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Gavel className="w-4 h-4" />
            <span>Auctions & Live Moderation</span>
          </button>

          <button
            onClick={() => setActiveTab('financials')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'financials'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Commission & Payouts</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Audit Trail ({auditLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW KPIS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
                <span className="text-stone-400 text-xs font-semibold block uppercase">Gross Merchandise Value</span>
                <span className="font-mono text-2xl font-bold text-emerald-400 mt-1 block">
                  {formatCurrency(grossMerchandiseValueKes, currency)}
                </span>
                <span className="text-[11px] text-stone-500 mt-1 block">Across all 47 counties</span>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
                <span className="text-stone-400 text-xs font-semibold block uppercase">Marketplace Commissions</span>
                <span className="font-mono text-2xl font-bold text-amber-400 mt-1 block">
                  {formatCurrency(platformCommissionsKes, currency)}
                </span>
                <span className="text-[11px] text-stone-500 mt-1 block">At {commissionRate}% platform rate</span>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
                <span className="text-stone-400 text-xs font-semibold block uppercase">Verified Merchants</span>
                <span className="font-mono text-2xl font-bold text-white mt-1 block">
                  {verifiedSellers} / {totalSellers}
                </span>
                <span className="text-[11px] text-emerald-400 mt-1 block">{pendingSellers} applications pending</span>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
                <span className="text-stone-400 text-xs font-semibold block uppercase">Active Streams & Auctions</span>
                <span className="font-mono text-2xl font-bold text-rose-400 mt-1 block">
                  {activeLivestreams} Live · {activeAuctions} Bidding
                </span>
                <span className="text-[11px] text-stone-400 mt-1 block">Real-time anti-sniping active</span>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
                <h3 className="font-display font-bold text-white text-base mb-4">
                  Merchant Verification Status Breakdown
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-stone-800">
                    <span className="text-emerald-400 font-semibold">Verified Active Merchants</span>
                    <span className="font-mono font-bold text-white">{verifiedSellers}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-stone-800">
                    <span className="text-amber-400 font-semibold">Under Document Review</span>
                    <span className="font-mono font-bold text-white">{pendingSellers}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-stone-800">
                    <span className="text-stone-400 font-semibold">Total Catalogue Products</span>
                    <span className="font-mono font-bold text-white">{totalProducts}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-stone-400 font-semibold">Recorded Customer Orders</span>
                    <span className="font-mono font-bold text-white">{totalOrders}</span>
                  </div>
                </div>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
                <h3 className="font-display font-bold text-white text-base mb-4">
                  Trust & Anti-Fraud Metrics
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-stone-800">
                    <span className="text-stone-300">Escrow Protected Ratio</span>
                    <span className="font-mono font-bold text-emerald-400">100.0%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-stone-800">
                    <span className="text-stone-300">M-Pesa Daraja STK Verification</span>
                    <span className="font-mono font-bold text-emerald-400">Automated 2.0</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-stone-800">
                    <span className="text-stone-300">Anti-Sniping Trigger Count</span>
                    <span className="font-mono font-bold text-amber-400">3 events today</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-stone-300">Open Customer Disputes</span>
                    <span className="font-mono font-bold text-stone-400">0 critical</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SELLER APPLICATION AUDITS */}
        {activeTab === 'sellers' && (
          <div className="space-y-6">
            {/* Filter Pill Tabs */}
            <div className="flex items-center gap-2">
              {['all', 'under_review', 'pending', 'verified', 'suspended'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize ${
                    filterStatus === st
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-900 text-stone-400 hover:text-white'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Sellers Table */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="py-3.5 px-4">Merchant / Store</th>
                    <th className="py-3.5 px-4">County</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">KRA PIN & ID</th>
                    <th className="py-3.5 px-4">Settlement Info</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  {filteredSellerProfiles.map(s => (
                    <tr key={s.id} className="hover:bg-stone-800/40">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{s.businessName}</div>
                        <div className="text-[11px] text-stone-400">{s.sellerName} · {s.phone}</div>
                      </td>
                      <td className="py-3.5 px-4">{s.county} County</td>
                      <td className="py-3.5 px-4 text-stone-400">{s.category}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div>PIN: {s.kraPin || 'N/A'}</div>
                        <div className="text-stone-500">ID: {s.nationalIdNumber || 'N/A'}</div>
                      </td>
                      <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                        {s.settlementAccount || 'Pending'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          s.status === 'verified'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : s.status === 'under_review' || s.status === 'pending'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {s.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {s.status !== 'verified' && (
                          <button
                            onClick={() => handleApproveSeller(s.id)}
                            className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold"
                          >
                            Approve
                          </button>
                        )}
                        {s.status !== 'suspended' && (
                          <button
                            onClick={() => handleSuspendSeller(s.id)}
                            className="py-1 px-2 bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-400 rounded text-xs"
                          >
                            Suspend
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: AUCTIONS & LIVESTREAM MODERATION */}
        {activeTab === 'auctions' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Live Auction Integrity Console
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {auctions.map(auc => (
                <div key={auc.id} className="bg-stone-900 border border-stone-800 rounded-xl p-5 flex gap-4">
                  <img src={auc.productImage} alt="" className="w-20 h-20 rounded-lg object-cover bg-stone-950" />
                  <div className="flex-1 text-xs space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">{auc.status}</span>
                    <h4 className="font-semibold text-white text-sm">{auc.productTitle}</h4>
                    <p className="text-stone-400">{auc.storeName}</p>
                    <div className="font-mono text-emerald-400 font-bold">
                      Current Bid: {formatCurrency(auc.currentBidKes, currency)} ({auc.bidCount} bids)
                    </div>
                    {auc.highestBidder && (
                      <div className="text-stone-400 text-[11px]">
                        Leading Bidder: {auc.highestBidder.userName} ({auc.highestBidder.county})
                      </div>
                    )}
                    <div className="text-stone-500 text-[10px] pt-1">
                      Anti-snipe extensions triggered: {auc.antiSnipeExtensionCount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: COMMISSION & FINANCIAL SETTLEMENTS */}
        {activeTab === 'financials' && (
          <div className="space-y-8">
            {/* Commission Config Slider */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 max-w-xl">
              <h3 className="font-display font-bold text-white text-base mb-2">
                Configure Marketplace Commission Rate
              </h3>
              <p className="text-xs text-stone-400 mb-6">
                Applies to all live stream drops, auction wins, and direct store transactions.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-300">Standard Platform Take:</span>
                  <span className="font-mono text-xl font-bold text-amber-400">{commissionRate}%</span>
                </div>

                <input
                  type="range"
                  min="3.0"
                  max="15.0"
                  step="0.5"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-stone-500 font-mono">
                  <span>3.0% (Artisan subsidy)</span>
                  <span>8.0% (Current Standard)</span>
                  <span>15.0% (Max)</span>
                </div>
              </div>
            </div>

            {/* Pending Settlements Release Queue */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow">
              <div className="p-4 border-b border-stone-800 flex justify-between items-center">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                  M-Pesa B2C Merchant Settlement Disbursements
                </h4>
                <span className="text-xs text-stone-400">Escrow Clearing Station</span>
              </div>

              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="py-3 px-4">Store Name</th>
                    <th className="py-3 px-4">Gross Sales</th>
                    <th className="py-3 px-4">Commission</th>
                    <th className="py-3 px-4">Net Payout</th>
                    <th className="py-3 px-4">M-Pesa Destination</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  {settlements.map(set => (
                    <tr key={set.id}>
                      <td className="py-3.5 px-4 font-bold text-white">{set.storeName}</td>
                      <td className="py-3.5 px-4 font-mono">{formatCurrency(set.grossSalesKes, currency)}</td>
                      <td className="py-3.5 px-4 font-mono text-amber-400">-{formatCurrency(set.commissionKes, currency)}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{formatCurrency(set.netPayoutKes, currency)}</td>
                      <td className="py-3.5 px-4">{set.settlementAccount}</td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          set.status === 'settled' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                        }`}>
                          {set.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {set.status !== 'settled' ? (
                          <button
                            onClick={() => releaseSettlement(set.id)}
                            className="py-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold shadow"
                          >
                            Release M-Pesa B2C
                          </button>
                        ) : (
                          <span className="text-[11px] text-stone-500 font-mono">Disbursed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow">
            <div className="p-4 border-b border-stone-800 flex justify-between items-center">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                Full Immutable Audit Trail
              </h4>
              <span className="text-xs text-stone-400">Section 10 Compliance</span>
            </div>

            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                <tr>
                  <th className="py-3 px-4">Timestamp (UTC)</th>
                  <th className="py-3 px-4">Actor & Role</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Audit Details</th>
                  <th className="py-3 px-4">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80 font-mono text-[11px]">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-stone-800/30">
                    <td className="py-2.5 px-4 text-stone-400">{log.timestamp}</td>
                    <td className="py-2.5 px-4 text-white font-sans font-medium">
                      {log.actor} ({log.role})
                    </td>
                    <td className="py-2.5 px-4 text-amber-400">{log.action}</td>
                    <td className="py-2.5 px-4 text-stone-300">{log.targetId}</td>
                    <td className="py-2.5 px-4 font-sans text-stone-300 max-w-xs truncate">{log.details}</td>
                    <td className="py-2.5 px-4">
                      <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                        log.severity === 'critical' 
                          ? 'bg-rose-950 text-rose-400' 
                          : log.severity === 'warning'
                          ? 'bg-amber-950 text-amber-400'
                          : 'bg-stone-800 text-stone-400'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
