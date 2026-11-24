import React, { useState } from 'react';
import { 
  X, 
  Store, 
  CheckCircle, 
  ShieldCheck, 
  Upload, 
  Building2, 
  CreditCard, 
  FileText,
  Smartphone,
  MapPin,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { KENYA_COUNTIES } from '../../data/initialData';
import { SellerCategory } from '../../types';

interface SellerRegistrationModalProps {
  onClose: () => void;
}

export const SellerRegistrationModal: React.FC<SellerRegistrationModalProps> = ({ onClose }) => {
  const { submitSellerApplication } = useCommerce();
  const [step, setStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Form State
  const [sellerName, setSellerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+254 ');
  const [location, setLocation] = useState('');
  const [county, setCounty] = useState('Nairobi');
  const [category, setCategory] = useState<SellerCategory>('Artisanal & Crafts');
  const [nationalIdNumber, setNationalIdNumber] = useState('');
  const [kraPin, setKraPin] = useState('');
  const [businessRegNumber, setBusinessRegNumber] = useState('');
  const [settlementMethod, setSettlementMethod] = useState<'mpesa_till' | 'mpesa_paybill' | 'bank_account'>('mpesa_till');
  const [settlementAccount, setSettlementAccount] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;

    submitSellerApplication({
      sellerName,
      businessName,
      email,
      phone,
      location,
      county,
      category,
      nationalIdNumber,
      kraPin,
      businessRegNumber,
      settlementMethod,
      settlementAccount,
      notes: 'Self-registered applicant awaiting administrative document audit.'
    });

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              Application Under Review
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed mb-6">
              Thank you, {sellerName}. Your merchant application for <strong>{businessName}</strong> has been submitted. Our compliance team will audit your KRA PIN and National ID credentials within 24-48 hours.
            </p>
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-400 max-w-md mx-auto mb-6 text-left">
              <div className="font-semibold text-white mb-1">Assigned Status: Under Review</div>
              <div>Settlement Destination: {settlementMethod.replace('_', ' ').toUpperCase()} ({settlementAccount})</div>
              <div>County: {county} County</div>
            </div>
            <button
              onClick={onClose}
              className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow"
            >
              Back to Marketplace
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                KenyaOne Merchant Onboarding
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                Register as a Verified KenyaOne Seller
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Step {step} of 3 · Open an online shop, host livestreams & run auctions
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-stone-800 h-1.5 rounded-full mt-4 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* STEP 1: Basic Identity & Store Details */}
              {step === 1 && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-stone-300 block mb-1 font-medium">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                        placeholder="e.g. Grace Wambui"
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-stone-300 block mb-1 font-medium">Store / Business Name *</label>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Wambui Designs Nairobi"
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-stone-300 block mb-1 font-medium">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="orders@yourbusiness.co.ke"
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-stone-300 block mb-1 font-medium">Phone / WhatsApp Number *</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+254 712 345 678"
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-stone-300 block mb-1 font-medium">Kenyan County *</label>
                      <select
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                      >
                        {KENYA_COUNTIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-stone-300 block mb-1 font-medium">Physical Location / Town *</label>
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Westlands Mall, Nairobi"
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-stone-300 block mb-1 font-medium">Primary Seller Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as SellerCategory)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Artisanal & Crafts">Artisanal & Traditional Crafts (Beadwork, Soapstone)</option>
                      <option value="Specialty Coffee & Tea">Specialty Coffee & Export Tea</option>
                      <option value="Fashion & Kitenge">Fashion & Kitenge Apparel</option>
                      <option value="Kenyan Leatherworks">Kenyan Leatherworks & Footwear</option>
                      <option value="Agri & Fresh Farm">Agri & Fresh Farm Produce</option>
                      <option value="Tech & Hardware">Tech & Solar Hardware</option>
                    </select>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1.5"
                    >
                      <span>Continue to Verification</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Identification & Regulatory Compliance */}
              {step === 2 && (
                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-stone-300 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">
                      To safeguard buyers and preserve Kenyan export integrity, all sellers must furnish valid government identification.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-stone-300 block mb-1 font-medium">National ID or Passport Number *</label>
                      <input
                        type="text"
                        required
                        value={nationalIdNumber}
                        onChange={(e) => setNationalIdNumber(e.target.value)}
                        placeholder="e.g. 29812743"
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-stone-300 block mb-1 font-medium">KRA Tax PIN *</label>
                      <input
                        type="text"
                        required
                        value={kraPin}
                        onChange={(e) => setKraPin(e.target.value.toUpperCase())}
                        placeholder="e.g. A009182745B"
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-stone-300 block mb-1 font-medium">
                      Business Registration / BN Number (Optional for individual artisans)
                    </label>
                    <input
                      type="text"
                      value={businessRegNumber}
                      onChange={(e) => setBusinessRegNumber(e.target.value)}
                      placeholder="e.g. CPR/2022/44129"
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div className="border border-dashed border-stone-700 rounded-xl p-4 text-center bg-stone-950/40">
                    <Upload className="w-6 h-6 text-stone-400 mx-auto mb-1.5" />
                    <span className="font-semibold text-white block">ID & KRA PIN Upload Simulated</span>
                    <span className="text-[11px] text-stone-400">PDF, JPG, PNG accepted (auto-verified upon submission)</span>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium rounded-lg flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1.5"
                    >
                      <span>Continue to Settlement</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Payment Settlement & Submission */}
              {step === 3 && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-stone-300 block mb-2 font-medium">Settlement Method for Earnings *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setSettlementMethod('mpesa_till')}
                        className={`p-3 rounded-lg border text-left flex flex-col justify-between ${
                          settlementMethod === 'mpesa_till'
                            ? 'bg-emerald-950/60 border-emerald-600 text-white'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        <Smartphone className="w-4 h-4 text-emerald-400 mb-1" />
                        <span className="font-bold">M-Pesa Buy Goods Till</span>
                        <span className="text-[10px] text-stone-400">Direct till settlement</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSettlementMethod('mpesa_paybill')}
                        className={`p-3 rounded-lg border text-left flex flex-col justify-between ${
                          settlementMethod === 'mpesa_paybill'
                            ? 'bg-emerald-950/60 border-emerald-600 text-white'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        <Smartphone className="w-4 h-4 text-emerald-400 mb-1" />
                        <span className="font-bold">M-Pesa Paybill</span>
                        <span className="text-[10px] text-stone-400">Business paybill acc</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSettlementMethod('bank_account')}
                        className={`p-3 rounded-lg border text-left flex flex-col justify-between ${
                          settlementMethod === 'bank_account'
                            ? 'bg-emerald-950/60 border-emerald-600 text-white'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-emerald-400 mb-1" />
                        <span className="font-bold">Kenyan Bank</span>
                        <span className="text-[10px] text-stone-400">Equity, KCB, Co-op</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-stone-300 block mb-1 font-medium">
                      {settlementMethod === 'mpesa_till' && 'M-Pesa Till Number (e.g. 882910) *'}
                      {settlementMethod === 'mpesa_paybill' && 'Paybill Number & Account (e.g. 400200 · Acc: 0112938491) *'}
                      {settlementMethod === 'bank_account' && 'Bank Name, Branch & Account Number *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={settlementAccount}
                      onChange={(e) => setSettlementAccount(e.target.value)}
                      placeholder={settlementMethod === 'mpesa_till' ? 'Till: 882910' : 'Bank details / Paybill'}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-stone-300">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-0.5 rounded bg-stone-950 border-stone-700 text-emerald-600 focus:ring-0"
                      />
                      <span className="text-[11px] leading-relaxed">
                        I confirm that all goods listed will comply with Kenyan consumer protection laws, genuine artisan attribution, and KEBS/KEPHIS safety standards. I accept KenyaOne standard commission (5-8%).
                      </span>
                    </label>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium rounded-lg flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={!termsAccepted}
                      className="py-2.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-md flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Submit Application</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
