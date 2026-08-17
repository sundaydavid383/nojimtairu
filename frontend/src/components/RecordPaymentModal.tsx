import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  CreditCard, 
  Receipt, 
  Building2, 
  User, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle,
  Coins,
  Sparkles,
  Image as ImageIcon,
  Check,
  Globe
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { PaymentMode } from '../types';
import { formatNaira } from '../services/api';

const SAMPLE_RECEIPT_PRESETS = [
  {
    name: 'Zenith Bank Stamped Teller',
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'NIP Central Bank Advice',
    url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'International Wire Slip',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
  }
];

export const RecordPaymentModal: React.FC = () => {
  const { 
    isPaymentModalOpen, 
    setIsPaymentModalOpen, 
    paymentTargetProperty, 
    recordPayment, 
    addToast 
  } = useProperty();

  const [amount, setAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Bank Transfer');
  const [bankReference, setBankReference] = useState<string>('');
  const [issuingBank, setIssuingBank] = useState<string>('Zenith Bank Plc');
  const [payerName, setPayerName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPayPalDemoMode, setIsPayPalDemoMode] = useState(false);

  useEffect(() => {
    if (paymentTargetProperty) {
      setAmount(paymentTargetProperty.balanceAmount);
      setPayerName(paymentTargetProperty.clientName);
      setPaymentMode(paymentTargetProperty.primaryPaymentMode || 'Bank Transfer');
      setBankReference(`ZENITH-NIP-${Math.floor(10000000 + Math.random() * 90000000)}`);
      setIssuingBank('Zenith Bank Plc');
      setNotes(`Installment tranche received towards title settlement for ${paymentTargetProperty.fileNumber}.`);
      setReceiptImage(SAMPLE_RECEIPT_PRESETS[0].url);
      setIsPayPalDemoMode(false);
    }
  }, [paymentTargetProperty, isPaymentModalOpen]);

  if (!isPaymentModalOpen || !paymentTargetProperty) return null;

  const prop = paymentTargetProperty;
  const newBalance = Math.max(0, prop.balanceAmount - amount);
  const willBeFullyPaid = newBalance === 0 && amount > 0;

  const handlePresetPercentage = (pct: number) => {
    setAmount(Math.round(prop.balanceAmount * pct));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setReceiptImage(event.target.result as string);
          addToast('info', 'Receipt Image Staged', `Loaded custom screenshot: ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePayPalDemoClick = () => {
    setIsPayPalDemoMode(true);
    setPaymentMode('PayPal');
    setIssuingBank('PayPal San Jose (US Gateway)');
    setBankReference(`PAYPAL-MOCK-TXN-${Math.floor(100000 + Math.random() * 900000)}`);
    setReceiptImage('https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=600&q=80');
    setNotes('Diaspora client instant settlement received via PayPal sandbox gateway (leadership proposal demo).');
    addToast('info', 'PayPal Demo Mode', 'Configured PayPal settlement flow for diaspora clients review.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      addToast('warning', 'Invalid Amount', 'Payment amount must be greater than zero.');
      return;
    }

    setIsSubmitting(true);
    try {
      await recordPayment(prop.id, {
        amount,
        paymentMode,
        bankReference: bankReference || `REF-${Date.now()}`,
        issuingBank,
        payerName: payerName || prop.clientName,
        notes,
        receiptThumbnailUrl: receiptImage || undefined,
        receiptAttachmentUrl: receiptImage || undefined,
        isPayPalDemo: isPayPalDemoMode
      });
      setIsPaymentModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      id="modal-backdrop-record-payment"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={() => setIsPaymentModalOpen(false)}
    >
      <motion.div
        id="modal-record-payment-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh] text-slate-900 dark:text-slate-100"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0E1B2E] text-amber-400 flex items-center justify-center shadow-xs">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-slate-900 dark:text-white">
                Record Payment Transaction
              </h2>
              <p className="text-[11px] text-slate-500">
                Official Law Firm Trust &amp; Conveyancing Receipt Generator
              </p>
            </div>
          </div>
          <button
            id="btn-close-payment-modal"
            onClick={() => setIsPaymentModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Property Brief Box */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono-num font-bold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/50">
              {prop.fileNumber}
            </span>
            <span className="text-slate-500">
              Client: <strong className="text-slate-900 dark:text-slate-200">{prop.clientName}</strong>
            </span>
          </div>

          <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
            {prop.name}
          </div>

          <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-mono-num">
            <span>Total Consideration: <strong>{formatNaira(prop.totalAmount)}</strong></span>
            <span>Current Outstanding: <strong className="text-amber-700 dark:text-amber-400">{formatNaira(prop.balanceAmount)}</strong></span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* DEMO PROPOSAL: PayPal Option Callout */}
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                  Demo Proposal Feature
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Diaspora Client Settlement (PayPal)
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Show leadership how international buyers in the UK/US can remit legal deposits directly.
              </p>
            </div>

            <button
              type="button"
              onClick={handlePayPalDemoClick}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 ${
                isPayPalDemoMode 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] shadow-xs'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isPayPalDemoMode ? '✓ PayPal Mode Selected' : 'Test PayPal Demo Flow'}</span>
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300" htmlFor="payment-amount-input">
                Payment Amount Received (NGN) *
              </label>
              <span className="text-xs font-mono-num font-bold text-emerald-600 dark:text-emerald-400">
                {formatNaira(amount)}
              </span>
            </div>
            <input
              id="payment-amount-input"
              type="number"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base text-emerald-700 dark:text-emerald-400 font-mono font-bold focus:border-amber-600 outline-none"
            />

            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-[11px] text-slate-500 mr-1">Quick Select:</span>
              <button
                type="button"
                onClick={() => handlePresetPercentage(1)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors"
              >
                100% Full Balance
              </button>
              <button
                type="button"
                onClick={() => handlePresetPercentage(0.5)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors"
              >
                50% Deposit
              </button>
              <button
                type="button"
                onClick={() => handlePresetPercentage(0.25)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors"
              >
                25% Tranche
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="pay-channel-select">
                Payment Channel / Mode *
              </label>
              <select
                id="pay-channel-select"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:border-amber-600 outline-none cursor-pointer"
              >
                <option value="Bank Transfer">Bank Transfer (NIP / RTGS)</option>
                <option value="Certified Cheque">Certified Bank Draft / Cheque</option>
                <option value="Escrow Account">Firm Escrow Trust Account</option>
                <option value="Direct Deposit">Direct Branch Cash Deposit</option>
                <option value="USD Wire Transfer">USD Wire Transfer</option>
                <option value="PayPal">PayPal (Demo Sandbox)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="pay-bank-name">
                Issuing / Clearing Bank
              </label>
              <input
                id="pay-bank-name"
                type="text"
                value={issuingBank}
                onChange={(e) => setIssuingBank(e.target.value)}
                placeholder="Zenith / GTBank / FirstBank"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:border-amber-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="pay-bank-ref">
                Transaction Reference / Session ID *
              </label>
              <input
                id="pay-bank-ref"
                type="text"
                required
                value={bankReference}
                onChange={(e) => setBankReference(e.target.value)}
                placeholder="NIP-9901827361"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:border-amber-600 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="pay-payer-name">
                Payer / Originating Account Name
              </label>
              <input
                id="pay-payer-name"
                type="text"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder={prop.clientName}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:border-amber-600 outline-none"
              />
            </div>
          </div>

          {/* Receipt Screenshot / Proof Upload Section */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Receipt Screenshot / Bank Proof Image *
            </label>
            
            {/* Staged Image Preview if any */}
            {receiptImage ? (
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={receiptImage}
                    alt="Receipt preview"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover border border-slate-300 dark:border-slate-700 shadow-xs shrink-0"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 dark:text-slate-100">Receipt Image Staged</div>
                    <div className="text-[10px] text-slate-500">Ready to link to official audit docket</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setReceiptImage('')}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : null}

            {/* Upload or Choose Presets */}
            <div className="border border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-600 rounded-xl p-3.5 text-center bg-slate-50/50 dark:bg-slate-900/40 relative cursor-pointer">
              <input
                type="file"
                id="payment-proof-file"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                accept="image/*,.pdf"
              />
              <UploadCloud className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Upload screenshot or photo of bank teller (.PNG, .JPG)
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Drag &amp; drop or click to browse local files
              </p>
            </div>

            {/* Quick Sample Presets */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
              <span className="text-[10px] text-slate-400 uppercase font-semibold shrink-0">Sample Tellers:</span>
              {SAMPLE_RECEIPT_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setReceiptImage(preset.url);
                    addToast('info', 'Preset Loaded', `Attached ${preset.name}`);
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-lg border transition whitespace-nowrap ${
                    receiptImage === preset.url
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="pay-notes">
              Payment Acknowledgment Notes
            </label>
            <textarea
              id="pay-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Consideration tranche cleared into escrow trust..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:border-amber-600 outline-none"
            />
          </div>

          {/* Real-time Status Preview */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <div className="text-slate-500">Balance after payment:</div>
              <div className="font-bold font-mono-num text-amber-700 dark:text-amber-400">{formatNaira(newBalance)}</div>
            </div>
            <div>
              {willBeFullyPaid ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Will Mark as Fully Paid
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-bold">
                  Partial Balance Remaining
                </span>
              )}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-submit-payment"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#0E1B2E] hover:bg-[#162a47] dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Receipt className="w-4 h-4" />
              <span>{isSubmitting ? 'Logging...' : 'Confirm & Generate Sealed Receipt'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
