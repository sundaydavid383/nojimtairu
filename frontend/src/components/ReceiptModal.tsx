import React from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Printer, 
  Scale, 
  Copy,
  FileCheck2,
  Image as ImageIcon
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { formatNaira } from '../services/api';

// Number to words converter for authentic Nigerian legal receipt
function numberToWords(num: number): string {
  if (num === 0) return 'Zero Naira Only';
  
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + inWords(n % 100) : '');
    if (n < 1000000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 1000000000) return inWords(Math.floor(n / 1000000)) + ' Million' + (n % 1000000 !== 0 ? ' ' + inWords(n % 1000000) : '');
    return inWords(Math.floor(n / 1000000000)) + ' Billion' + (n % 1000000000 !== 0 ? ' ' + inWords(n % 1000000000) : '');
  }

  return inWords(num) + ' Naira Only';
}

export const ReceiptModal: React.FC = () => {
  const { isReceiptModalOpen, setIsReceiptModalOpen, activeReceipt, addToast } = useProperty();

  if (!isReceiptModalOpen || !activeReceipt) return null;

  const { payment, property } = activeReceipt;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(payment.receiptNumber);
    addToast('info', 'Copied to Clipboard', `Receipt Ref ${payment.receiptNumber} copied.`);
  };

  return (
    <div
      id="modal-backdrop-receipt"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={() => setIsReceiptModalOpen(false)}
    >
      <motion.div
        id="modal-receipt-container"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh] border border-amber-400/40 relative font-sans"
      >
        {/* Top Control Bar (Screen only, hidden on print) */}
        <div className="no-print bg-[#0E1B2E] text-slate-200 px-6 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <FileCheck2 className="w-4 h-4" />
            <span>Official Legal Payment Acknowledgment</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-copy-receipt-ref"
              onClick={handleCopyRef}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>Copy Ref</span>
            </button>
            <button
              id="btn-print-official-receipt"
              onClick={handlePrint}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Receipt</span>
            </button>
            <button
              id="btn-close-receipt-modal"
              onClick={() => setIsReceiptModalOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL LAW FIRM RECEIPT SHEET */}
        <div className="p-8 sm:p-10 overflow-y-auto space-y-6 bg-[#FFFFFF] text-slate-900 select-text">
          {/* Official Law Firm Letterhead Header */}
          <div className="border-b-2 border-amber-600/60 pb-5 text-center relative">
            {/* Firm Logo & Scales */}
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-[#0E1B2E] flex items-center justify-center text-amber-400">
                <Scale className="w-5 h-5" />
              </div>
              <h1 className="font-serif font-black text-2xl tracking-widest text-slate-900 uppercase">
                NOJIM TAIRU &amp; CO.
              </h1>
            </div>

            <p className="text-[11px] font-bold tracking-[0.2em] text-amber-800 uppercase">
              BARRISTERS, SOLICITORS &amp; LEGAL CONSULTANTS
            </p>
            <p className="text-[10px] text-slate-600 mt-1 max-w-lg mx-auto leading-tight">
              Chambers: Plot 1284 Bishop Oluwole Street, Victoria Island, Lagos | Abuja Branch: Plot 712 Aguiyi Ironsi Way, Maitama, Abuja FCT
              <br />
              Email: chambers@ntlaw.ng &bull; Tel: +234 (1) 461-8920, +234 803 555 0192
            </p>

            <div className="mt-3 inline-block px-4 py-1 rounded bg-[#0E1B2E] text-amber-400 font-bold text-xs tracking-widest uppercase">
              OFFICIAL PROPERTY TRANSACTION RECEIPT
            </div>
          </div>

          {/* Receipt Meta Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-semibold">Receipt Number</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{payment.receiptNumber}</span>
              {payment.isPayPalDemo && (
                <span className="text-[9px] block text-blue-700 font-bold">PayPal Demo Mode</span>
              )}
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-semibold">Transaction Date</span>
              <span className="font-semibold text-slate-800">{payment.date}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-500 text-[10px] block uppercase font-semibold">Property Docket No.</span>
              <span className="font-mono font-bold text-amber-800">{property.fileNumber}</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Received From (Payer):</span>
              <span className="col-span-2 font-bold text-slate-900">{payment.payerName}</span>
            </div>

            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Client / Retainer:</span>
              <span className="col-span-2 text-slate-800 font-semibold">{property.clientName}</span>
            </div>

            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Property Subject:</span>
              <span className="col-span-2 text-slate-800">
                <strong>{property.name}</strong>
                <br />
                <span className="text-[11px] text-slate-500">{property.address}, {property.cityState}</span>
              </span>
            </div>

            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Payment Mode &amp; Bank:</span>
              <span className="col-span-2 text-slate-800">
                {payment.paymentMode} &bull; {payment.issuingBank || 'Commercial Bank'}
              </span>
            </div>

            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Bank Reference No.:</span>
              <span className="col-span-2 font-mono font-bold text-slate-800">{payment.bankReference}</span>
            </div>

            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Description / Remarks:</span>
              <span className="col-span-2 text-slate-700 italic">{payment.notes}</span>
            </div>
          </div>

          {/* Attached Bank Slip Thumbnail if available */}
          {payment.receiptThumbnailUrl && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={payment.receiptThumbnailUrl}
                  alt="Bank deposit teller"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 object-cover rounded border border-slate-300 shadow-xs"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Bank Deposit Slip / Proof Attached</span>
                  <span className="text-[10px] text-slate-500">Verified by Chambers Trust Accounts Office</span>
                </div>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                ✓ Document Audited
              </span>
            </div>
          )}

          {/* Big Amount Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-amber-900 font-bold block">
                  Amount Received in Words:
                </span>
                <p className="text-xs font-semibold text-slate-900 italic mt-0.5">
                  {numberToWords(payment.amount)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-amber-900 font-bold block">
                  Amount in Figures:
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                  {formatNaira(payment.amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Account Balance Summary */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 block">Total Agreed</span>
              <span className="font-mono font-bold text-slate-800">{formatNaira(property.totalAmount)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Cumulative Paid</span>
              <span className="font-mono font-bold text-emerald-700">{formatNaira(property.paidAmount)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Remaining Balance</span>
              <span className="font-mono font-bold text-amber-700">{formatNaira(payment.balanceAfter)}</span>
            </div>
          </div>

          {/* Official Law Firm Seal & Signature Block */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 items-end">
            {/* Official Law Firm Seal Stamp */}
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-full border-4 border-red-700/80 p-1 flex flex-col items-center justify-center text-center text-red-800 rotate-[-8deg] shadow-sm select-none">
                <div className="text-[7px] font-black uppercase tracking-tight">NOJIM TAIRU &amp; CO.</div>
                <Scale className="w-4 h-4 my-0.5" />
                <div className="text-[6px] font-bold uppercase">OFFICIAL SEAL</div>
                <div className="text-[6px] font-bold">LAGOS &bull; ABUJA</div>
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                Verified Conveyancing Seal
                <br />
                <span className="text-emerald-700 font-bold">&bull; Verified &amp; Stamped</span>
              </div>
            </div>

            {/* Signature Area */}
            <div className="text-right space-y-1">
              <div className="font-serif italic font-bold text-sm text-slate-800 tracking-wider">
                Chief Nojim Tairu, SAN
              </div>
              <div className="w-36 h-px bg-slate-400 ml-auto" />
              <div className="text-[10px] text-slate-600 font-semibold">
                Authorized Signatory &bull; Managing Partner
              </div>
              <div className="text-[9px] text-slate-400">
                Receiver: {payment.receivedBy}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
