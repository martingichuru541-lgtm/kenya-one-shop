import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  Smartphone, 
  Building2, 
  CreditCard, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  DollarSign, 
  AlertCircle,
  Copy,
  Receipt,
  FileText,
  Printer,
  Sparkles
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { formatCurrency } from '../../utils/formatters';
import { KENYA_COUNTIES, KENYA_COURIERS } from '../../data/initialData';
import { Order } from '../../types';

interface CheckoutModalProps {
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
  directBuyProduct?: any;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  onClose,
  onOrderSuccess,
  directBuyProduct
}) => {
  const { cart, cartSubtotalKes, currency, processCheckout, user } = useCommerce();

  const [step, setStep] = useState<'details' | 'payment' | 'mpesa-prompt' | 'success'>('details');

  // Customer & Shipping Details
  const [buyerName, setBuyerName] = useState(user.name || 'Martin Gichuru');
  const [buyerPhone, setBuyerPhone] = useState(user.phone || '+254 712 900 123');
  const [buyerEmail, setBuyerEmail] = useState(user.email || 'martin@example.com');
  const [county, setCounty] = useState(user.county || 'Nairobi');
  const [city, setCity] = useState('Nairobi');
  const [addressLine, setAddressLine] = useState('Kilimani, Ring Road, Gate 4B');
  const [instructions, setInstructions] = useState('');
  const [selectedCourierId, setSelectedCourierId] = useState('fargo');

  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState<'mpesa_daraja' | 'mpesa_paybill' | 'equity_bank' | 'kcb' | 'card' | 'paypal'>('mpesa_daraja');
  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState('0712900123');
  const [mpesaPinInput, setMpesaPinInput] = useState('');
  const [paybillReceiptInput, setPaybillReceiptInput] = useState('');
  const [isProcessingStk, setIsProcessingStk] = useState(false);
  const [copyNotice, setCopyNotice] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const selectedCourier = KENYA_COURIERS.find(c => c.id === selectedCourierId) || KENYA_COURIERS[0];
  const deliveryFee = selectedCourier.baseRateKes;
  const itemsTotal = directBuyProduct ? directBuyProduct.priceKes : cartSubtotalKes;
  const grandTotal = itemsTotal + deliveryFee;

  // Invoice / Bill identifiers
  const billInvoiceNumber = `BILL-2026-${Math.floor(100000 + (itemsTotal % 900000))}`;
  const paybillAccountRef = `K1-${buyerPhone.replace(/[^0-9]/g, '').slice(-6)}`;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'mpesa_daraja') {
      // Simulate Safaricom Daraja STK Push prompt to user's phone
      setStep('mpesa-prompt');
    } else if (paymentMethod === 'mpesa_paybill') {
      // Manual Paybill / Buy Goods bill verification
      const code = paybillReceiptInput.trim().toUpperCase() || `SD${Math.floor(100000 + Math.random() * 900000)}KE`;
      finalizeOrder(code);
    } else {
      finalizeOrder();
    }
  };

  const handleMpesaPinConfirm = () => {
    if (mpesaPinInput.length < 4) return;
    setIsProcessingStk(true);

    // Daraja STK Push callback simulation
    setTimeout(() => {
      setIsProcessingStk(false);
      finalizeOrder();
    }, 1800);
  };

  const finalizeOrder = (customPaymentRef?: string) => {
    const order = processCheckout({
      buyerName,
      buyerPhone,
      buyerEmail,
      courier: selectedCourier.name,
      deliveryFeeKes: deliveryFee,
      paymentMethod,
      paymentRef: customPaymentRef,
      address: {
        county,
        city,
        addressLine,
        instructions
      }
    });

    setConfirmedOrder(order);
    setStep('success');
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopyNotice(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopyNotice(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in font-sans">
      <div className="liquid-glass-modal rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-6 text-stone-100 border border-white/20">
        
        {step !== 'success' && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STEP 1: DELIVERY & COURIER DETAILS */}
        {step === 'details' && (
          <div>
            <div className="mb-6 pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block mb-1">
                  KenyaOne Checkout · Step 1 of 2
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-black text-white">
                  Delivery Location & Dispatch Courier
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Direct dispatch with tracked waybills across all 47 Kenyan counties
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 liquid-glass-pill px-3 py-1 rounded-full text-xs font-mono text-emerald-300">
                <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                <span>{billInvoiceNumber}</span>
              </div>
            </div>

            <form onSubmit={handleDetailsSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 block mb-1 font-semibold">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/14 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-stone-300 block mb-1 font-semibold">Phone Number (For M-Pesa & Courier SMS) *</label>
                  <input
                    type="text"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/14 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 block mb-1 font-semibold">Destination County (All 47 Counties) *</label>
                  <select
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full bg-stone-900 border border-white/14 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {KENYA_COUNTIES.map(c => (
                      <option key={c} value={c}>{c} County</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-stone-300 block mb-1 font-semibold">Town / City / Area *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/14 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 block mb-1 font-semibold">Street / Estate / Building Name / Gate *</label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="e.g. Ring Road Kilimani, Gate 4B, near Yaya Centre"
                  className="w-full bg-white/[0.05] border border-white/14 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Courier Selection */}
              <div>
                <label className="text-stone-300 block mb-1.5 font-semibold">Select Certified Courier Service *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {KENYA_COURIERS.map(c => (
                    <label
                      key={c.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedCourierId === c.id
                          ? 'bg-emerald-950/60 border-emerald-500 shadow'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="radio"
                          name="courier"
                          value={c.id}
                          checked={selectedCourierId === c.id}
                          onChange={() => setSelectedCourierId(c.id)}
                          className="accent-emerald-500"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-white block truncate text-[11px]">{c.name}</span>
                          <span className="text-[10px] text-stone-400">ETA: {c.eta}</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-emerald-400 text-xs shrink-0">
                        {formatCurrency(c.baseRateKes, currency)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ITEMIZED PAYMENT BILL SUMMARY */}
              <div className="p-4 liquid-glass-card rounded-2xl border border-white/14 text-xs space-y-1.5">
                <div className="flex justify-between items-center pb-2 border-b border-white/10 font-bold text-white">
                  <span className="flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-emerald-400" />
                    <span>Payment Bill Breakdown</span>
                  </span>
                  <span className="font-mono text-stone-400 text-[11px]">{billInvoiceNumber}</span>
                </div>

                <div className="flex justify-between text-stone-300 pt-1">
                  <span>Goods Subtotal ({directBuyProduct ? '1 item' : `${cart.length} items`}):</span>
                  <span className="font-mono text-white">{formatCurrency(itemsTotal, currency)}</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Courier Delivery ({selectedCourier.name}):</span>
                  <span className="font-mono text-white">{formatCurrency(deliveryFee, currency)}</span>
                </div>
                <div className="flex justify-between text-stone-400 text-[11px]">
                  <span>Kenya VAT (16% Included):</span>
                  <span className="font-mono">KES {Math.round(grandTotal * 0.16).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-400 text-[11px]">
                  <span>KenyaOne Escrow Guarantee:</span>
                  <span className="font-bold">FREE (100% Protected)</span>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-white text-sm">
                  <span>Total Payable Bill:</span>
                  <span className="font-mono text-lg font-black text-emerald-400">
                    {formatCurrency(grandTotal, currency)}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="py-3 px-6 liquid-glass-btn bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition-transform active:scale-95"
                >
                  <span>Proceed to Pay Bill</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: PAYMENT BILL OPTIONS & VERIFICATION */}
        {step === 'payment' && (
          <div>
            <div className="mb-6 pb-4 border-b border-white/10">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block mb-1">
                KenyaOne Checkout · Step 2 of 2
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-black text-white">
                Settle Payment Bill
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Bill #{billInvoiceNumber} · Total Payable: <span className="font-mono font-bold text-emerald-400">{formatCurrency(grandTotal, currency)}</span>
              </p>
            </div>

            {copyNotice && (
              <div className="mb-4 p-2.5 bg-emerald-950/80 border border-emerald-500 rounded-xl text-center text-emerald-200 text-xs flex items-center justify-center gap-2 animate-fade-in">
                <CheckCircle className="w-4 h-4" />
                <span>{copyNotice}</span>
              </div>
            )}

            <form onSubmit={handleInitiatePayment} className="space-y-4 text-xs">
              <div className="space-y-2.5">
                
                {/* METHOD 1: M-PESA STK PUSH (ONLINE) */}
                <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'mpesa_daraja'
                    ? 'liquid-glass border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                }`}>
                  <input
                    type="radio"
                    name="payMethod"
                    value="mpesa_daraja"
                    checked={paymentMethod === 'mpesa_daraja'}
                    onChange={() => setPaymentMethod('mpesa_daraja')}
                    className="mt-1 accent-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-white text-sm">Lipa na M-Pesa Express (STK Push to Phone)</span>
                      </div>
                      <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Instant
                      </span>
                    </div>
                    <p className="text-stone-300 text-[11px] leading-relaxed mb-3">
                      Safaricom will send an instant pop-up prompt to your phone asking for your 4-digit M-Pesa PIN.
                    </p>

                    {paymentMethod === 'mpesa_daraja' && (
                      <div className="bg-stone-950/80 p-3 rounded-xl border border-white/10 space-y-2">
                        <label className="text-[11px] text-stone-300 block font-semibold">
                          Confirm Safaricom Phone Number for Prompt:
                        </label>
                        <input
                          type="text"
                          value={mpesaPhoneNumber}
                          onChange={(e) => setMpesaPhoneNumber(e.target.value)}
                          placeholder="e.g. 0712345678"
                          className="w-full bg-white/[0.05] border border-white/20 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    )}
                  </div>
                </label>

                {/* METHOD 2: M-PESA PAYBILL / BUY GOODS TILL (MANUAL BILL PAYMENT) */}
                <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'mpesa_paybill'
                    ? 'liquid-glass border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                }`}>
                  <input
                    type="radio"
                    name="payMethod"
                    value="mpesa_paybill"
                    checked={paymentMethod === 'mpesa_paybill'}
                    onChange={() => setPaymentMethod('mpesa_paybill')}
                    className="mt-1 accent-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-white text-sm">Lipa na M-Pesa Paybill / Buy Goods Till</span>
                      </div>
                      <span className="text-[9px] bg-amber-500 text-stone-950 font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Paybill / Till
                      </span>
                    </div>
                    <p className="text-stone-300 text-[11px] leading-relaxed mb-3">
                      Pay using your M-Pesa App or SIM Toolkit via official KenyaOne settlement numbers.
                    </p>

                    {paymentMethod === 'mpesa_paybill' && (
                      <div className="bg-stone-950/80 p-3.5 rounded-xl border border-white/14 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          {/* Paybill Number Box */}
                          <div className="p-2.5 bg-white/[0.04] rounded-lg border border-white/10 flex items-center justify-between">
                            <div>
                              <span className="text-stone-400 block text-[10px]">M-Pesa Paybill Business No:</span>
                              <span className="font-mono text-base font-bold text-white">882910</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy('882910', 'Paybill 882910')}
                              className="p-1.5 hover:bg-white/10 rounded text-stone-300"
                              title="Copy Paybill"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Account Number Box */}
                          <div className="p-2.5 bg-white/[0.04] rounded-lg border border-white/10 flex items-center justify-between">
                            <div>
                              <span className="text-stone-400 block text-[10px]">Account No (Your Bill Ref):</span>
                              <span className="font-mono text-base font-bold text-emerald-400">{paybillAccountRef}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(paybillAccountRef, 'Account Reference')}
                              className="p-1.5 hover:bg-white/10 rounded text-stone-300"
                              title="Copy Account Ref"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Buy Goods Till Alternative */}
                        <div className="p-2.5 bg-white/[0.04] rounded-lg border border-white/10 flex items-center justify-between text-[11px]">
                          <div>
                            <span className="text-stone-400 text-[10px] block">Or Buy Goods Till Number:</span>
                            <span className="font-mono font-bold text-white">Till: 542890 (KenyaOne Merchant)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy('542890', 'Till 542890')}
                            className="p-1.5 hover:bg-white/10 rounded text-stone-300"
                            title="Copy Till"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* M-Pesa Receipt Code Verification */}
                        <div>
                          <label className="text-stone-300 block mb-1 font-semibold text-[11px]">
                            Enter Safaricom M-Pesa Confirmation SMS Code:
                          </label>
                          <input
                            type="text"
                            value={paybillReceiptInput}
                            onChange={(e) => setPaybillReceiptInput(e.target.value.toUpperCase())}
                            placeholder="e.g. QJD792KXL1"
                            className="w-full bg-white/[0.05] border border-emerald-500/60 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none uppercase font-bold tracking-wider"
                          />
                          <span className="text-[10px] text-stone-500 mt-1 block">
                            Enter the 10-character code received in your Safaricom M-Pesa message.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                {/* METHOD 3: KENYAN BANK / EAZZYPAY */}
                <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'equity_bank'
                    ? 'liquid-glass border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                }`}>
                  <input
                    type="radio"
                    name="payMethod"
                    value="equity_bank"
                    checked={paymentMethod === 'equity_bank'}
                    onChange={() => setPaymentMethod('equity_bank')}
                    className="mt-1 accent-emerald-500"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white text-sm">Equity Bank EazzyPay / KCB Vooma</span>
                    </div>
                    <p className="text-stone-400 text-[11px]">
                      Direct automated clearing via Equity Bank (Paybill 247247) or KCB Bank Vooma.
                    </p>
                  </div>
                </label>

                {/* METHOD 4: VISA / MASTERCARD */}
                <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'liquid-glass border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                }`}>
                  <input
                    type="radio"
                    name="payMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1 accent-emerald-500"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white text-sm">Credit / Debit Card (Visa, Mastercard, Diaspora)</span>
                    </div>
                    <p className="text-stone-400 text-[11px]">
                      Secured 3D-Secure 2.0 processor for local and international diaspora cardholders.
                    </p>
                  </div>
                </label>
              </div>

              {/* PAYMENT BILL BOTTOM BAR */}
              <div className="p-4 liquid-glass-card rounded-2xl border border-white/14 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">
                    Total Payable Bill
                  </span>
                  <span className="font-mono text-2xl font-black text-emerald-400">
                    {formatCurrency(grandTotal, currency)}
                  </span>
                </div>
                <div className="text-right text-[11px] text-stone-400">
                  <span className="block font-semibold text-white">{selectedCourier.name}</span>
                  <span>Escrow Safe Release</span>
                </div>
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="py-2.5 px-4 bg-white/[0.08] hover:bg-white/[0.12] text-stone-300 font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Details</span>
                </button>

                <button
                  type="submit"
                  className="py-3 px-6 liquid-glass-btn bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition-transform active:scale-95"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'mpesa_daraja' ? 'Prompt Phone via STK' :
                     paymentMethod === 'mpesa_paybill' ? 'Verify M-Pesa Bill Payment' :
                     `Settle ${formatCurrency(grandTotal, currency)}`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: M-PESA DARAJA STK SIMULATED PROMPT */}
        {step === 'mpesa-prompt' && (
          <div className="py-4 text-center">
            {/* Phone Screen Mockup */}
            <div className="w-72 mx-auto bg-stone-950 border-2 border-emerald-500/50 rounded-3xl p-5 shadow-2xl mb-6 relative">
              <div className="w-16 h-1 bg-stone-700 rounded-full mx-auto mb-4" />
              
              <div className="bg-emerald-600 text-white rounded-xl p-2.5 mb-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow">
                <Smartphone className="w-4 h-4" />
                <span>SAFARICOM M-PESA</span>
              </div>

              <div className="bg-stone-900 rounded-xl p-3 border border-stone-800 text-left text-xs mb-4 space-y-1">
                <p className="text-stone-200 leading-relaxed">
                  Do you want to pay <strong>KES {grandTotal.toLocaleString()}</strong> to <strong>KENYAONE SHOP</strong> on Paybill <strong>882910</strong>?
                </p>
                <div className="pt-1 text-[10px] text-emerald-400 font-mono">
                  Account: {paybillAccountRef}
                </div>
                <div className="text-[10px] text-stone-500">
                  Target Line: {mpesaPhoneNumber}
                </div>
              </div>

              <div className="text-left mb-4">
                <label className="text-[11px] text-stone-400 block mb-1">Enter 4-Digit M-Pesa PIN:</label>
                <input
                  type="password"
                  maxLength={4}
                  value={mpesaPinInput}
                  onChange={(e) => setMpesaPinInput(e.target.value)}
                  placeholder="••••"
                  autoFocus
                  className="w-full bg-stone-900 border border-emerald-500 rounded-xl p-2.5 text-center text-white font-mono tracking-widest text-lg font-bold"
                />
              </div>

              <button
                onClick={handleMpesaPinConfirm}
                disabled={mpesaPinInput.length < 4 || isProcessingStk}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                {isProcessingStk ? (
                  <span>Verifying with Safaricom Daraja...</span>
                ) : (
                  <span>Submit M-Pesa PIN</span>
                )}
              </button>

              <button
                onClick={() => setStep('payment')}
                className="mt-3 text-[11px] text-stone-400 hover:text-white"
              >
                Cancel STK Prompt
              </button>
            </div>

            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Simulated real Safaricom Daraja STK Push prompt. Type any 4-digit PIN (e.g. 1234) to confirm payment settlement.
            </p>
          </div>
        )}

        {/* STEP 4: ORDER & PAYMENT BILL CONFIRMATION RECEIPT */}
        {step === 'success' && confirmedOrder && (
          <div className="text-center py-6 animate-slide-up">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-xl">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h2 className="font-display text-2xl font-black text-white mb-1">
              Payment Bill Settled & Order Confirmed!
            </h2>
            <p className="text-xs text-stone-400 mb-6">
              Receipt SMS sent to <strong className="text-white">{confirmedOrder.buyerPhone}</strong> & email to <strong className="text-white">{confirmedOrder.buyerEmail}</strong>
            </p>

            {/* Official KenyaOne Waybill & M-Pesa Confirmation Receipt */}
            <div className="liquid-glass-card rounded-2xl border border-white/20 p-5 text-left text-xs space-y-3 max-w-md mx-auto mb-6 shadow-2xl">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-stone-400">Order Number:</span>
                <span className="font-mono font-bold text-white">{confirmedOrder.orderNumber}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-stone-400">M-Pesa Confirmation Code:</span>
                <span className="font-mono font-bold text-emerald-400">{confirmedOrder.paymentRef}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-stone-400">Courier Waybill:</span>
                <span className="font-mono font-bold text-amber-400">{confirmedOrder.trackingCode}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-stone-400">Dispatch Courier:</span>
                <span className="text-white font-medium">{confirmedOrder.courier}</span>
              </div>

              <div className="flex justify-between items-center pt-1 font-bold">
                <span className="text-white">Amount Settled in Escrow:</span>
                <span className="font-mono text-base text-emerald-400">
                  {formatCurrency(confirmedOrder.totalKes, currency)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  onOrderSuccess(confirmedOrder);
                  onClose();
                }}
                className="py-3 px-6 liquid-glass-btn bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
              >
                <span>Track Live Order & Waybill</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
