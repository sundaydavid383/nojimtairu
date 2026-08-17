import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  CreditCard, 
  Receipt, 
  Edit3, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  Clock, 
  FileCheck2, 
  ShieldCheck, 
  Coins, 
  Download, 
  Plus,
  Image as ImageIcon,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { formatNaira } from '../services/api';
import { PaymentRecord, DocumentAttachment } from '../types';

export const PropertyDetailView: React.FC = () => {
  const { 
    selectedProperty, 
    isLoading,
    error,
    retryLoad,
    setCurrentView, 
    openPaymentModal, 
    viewReceipt, 
    setIsAddModalOpen, 
    setEditingProperty, 
    deleteProperty,
    addToast,
    openSectionGuide
  } = useProperty();

  const { hasPermission } = useAuth();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading property dossier...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-center max-w-md">
          <p className="text-sm text-red-800 dark:text-red-300 font-medium">Failed to load property details</p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
          <button
            onClick={retryLoad}
            className="mt-3 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!selectedProperty) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800">
        <p>No property file selected.</p>
        <button
          onClick={() => setCurrentView('properties')}
          className="mt-3 px-4 py-2 rounded-lg bg-amber-600 text-white font-bold text-xs"
        >
          Return to Properties Ledger
        </button>
      </div>
    );
  }

  const prop = selectedProperty;
  const paidPct = prop.totalAmount > 0 ? (prop.paidAmount / prop.totalAmount) * 100 : 0;
  
  const allPhotos = prop.images && prop.images.length > 0 
    ? prop.images 
    : (prop.coverImage ? [prop.coverImage] : []);

  const handleEdit = () => {
    setEditingProperty(prop);
    setIsAddModalOpen(true);
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete file ${prop.fileNumber}? This will remove all payment history and document archives.`)) {
      await deleteProperty(prop.id);
    }
  };

  const handlePrintDossier = () => {
    window.print();
  };

  const handleMockDocDownload = (doc: DocumentAttachment) => {
    addToast('info', 'Document Downloaded', `Retrieved certified file: ${doc.fileName}`);
  };

  return (
    <motion.div
      id={`property-detail-${prop.id}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto text-slate-900 dark:text-slate-100"
    >
      {/* Top Navigation & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <button
          id="btn-back-to-list"
          onClick={() => setCurrentView('properties')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Properties Ledger</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-detail-section-guide"
            onClick={() => openSectionGuide('detail')}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="How this Property Dossier works (?)"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Section Guide</span>
          </button>

          <button
            id="btn-print-dossier"
            onClick={handlePrintDossier}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Print Dossier</span>
          </button>

          {hasPermission('canEditProperty') && (
            <button
              id="btn-edit-property-detail"
              onClick={handleEdit}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Edit File</span>
            </button>
          )}

          {hasPermission('canRecordPayment') && prop.balanceAmount > 0 && (
            <button
              id="btn-record-payment-detail"
              onClick={() => openPaymentModal(prop)}
              className="px-4 py-1.5 rounded-xl bg-[#0E1B2E] hover:bg-[#162a47] dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Record Payment</span>
            </button>
          )}

          {hasPermission('canDeleteProperty') && (
            <button
              id="btn-delete-property-detail"
              onClick={handleDelete}
              className="p-2 rounded-xl bg-red-50 dark:bg-rose-950/30 border border-red-200 dark:border-rose-800/40 hover:bg-red-100 text-red-600 dark:text-rose-400 text-xs transition-colors cursor-pointer"
              title="Delete property archive (Admin only)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Dossier Header Banner with Cover Photo & Details */}
      <div id="property-detail-header-card" className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Photo Gallery & Showcase Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-slate-100 dark:border-slate-800">
          
          {/* Main Visual Photo Area */}
          <div className="lg:col-span-5 relative bg-slate-900 min-h-[220px] lg:min-h-[280px]">
            {allPhotos.length > 0 ? (
              <>
                <img
                  src={allPhotos[selectedPhotoIndex] || allPhotos[0]}
                  alt={prop.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover max-h-[320px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs pointer-events-none">
                  <span className="font-semibold px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
                    Photo {selectedPhotoIndex + 1} of {allPhotos.length}
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 py-12">
                <Building2 className="w-12 h-12" />
                <span className="text-xs mt-2">No photos uploaded</span>
              </div>
            )}
          </div>

          {/* Key Dossier Facts & Quick Financial Overview */}
          <div className="lg:col-span-7 p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono-num font-bold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900/50">
                  {prop.fileNumber}
                </span>
                <span className={`text-[11px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                  prop.paymentStatus === 'paid'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : prop.paymentStatus === 'partial'
                    ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}>
                  {prop.paymentStatus}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40 font-medium">
                  {prop.conveyancingStatus}
                </span>
                <span className="text-xs text-slate-500">
                  &bull; Category: <strong className="text-slate-800 dark:text-slate-200">{prop.propertyType}</strong>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
                {prop.name}
              </h1>

              <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{prop.address}, {prop.cityState}</span>
              </div>

              <div className="text-xs text-slate-500">
                Land Registry Title / C of O Ref: <span className="text-slate-800 dark:text-slate-200 font-mono-num font-semibold">{prop.titleRef}</span>
              </div>
            </div>

            {/* Financial Progress Bar */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Agreed Consideration Value</span>
                <span className="text-base font-bold font-mono-num text-slate-900 dark:text-white">{formatNaira(prop.totalAmount)}</span>
              </div>

              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${paidPct}%` }}
                />
              </div>

              <div className="flex justify-between text-xs font-mono-num pt-0.5">
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Collected: {formatNaira(prop.paidAmount)} ({paidPct.toFixed(1)}%)</span>
                <span className="text-amber-700 dark:text-amber-400 font-bold">Outstanding: {formatNaira(prop.balanceAmount)}</span>
              </div>
            </div>

            {/* Photo Thumbnail Selector (if multiple photos exist) */}
            {allPhotos.length > 1 && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400 font-medium mr-1">Views:</span>
                {allPhotos.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPhotoIndex(i)}
                    className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition ${
                      selectedPhotoIndex === i ? 'border-amber-600 scale-105' : 'border-slate-300 dark:border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Client Information & Legal Valuation Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client / Owner Information */}
        <div id="property-client-card" className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Client &amp; Retainer Details
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Client / Purchaser:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{prop.clientName}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Phone Contact:</span>
              <a href={`tel:${prop.clientPhone}`} className="text-amber-700 dark:text-amber-400 font-mono-num hover:underline flex items-center gap-1 font-semibold">
                <Phone className="w-3 h-3" />
                <span>{prop.clientPhone}</span>
              </a>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Email Address:</span>
              <a href={`mailto:${prop.clientEmail}`} className="text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 font-medium">
                <Mail className="w-3 h-3" />
                <span className="truncate max-w-[200px]">{prop.clientEmail}</span>
              </a>
            </div>

            {prop.clientAddress && (
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Mailing Address:</span>
                <span className="text-slate-800 dark:text-slate-300 text-right max-w-[220px]">{prop.clientAddress}</span>
              </div>
            )}

            {prop.clientNIN_ID && (
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">National ID / TIN:</span>
                <span className="font-mono-num text-slate-800 dark:text-slate-300 font-medium">{prop.clientNIN_ID}</span>
              </div>
            )}

            <div className="flex justify-between py-1">
              <span className="text-slate-500">Primary Payment Channel:</span>
              <span className="font-semibold text-slate-800 dark:text-amber-300">{prop.primaryPaymentMode}</span>
            </div>
          </div>
        </div>

        {/* Legal Valuation & Fee Structure */}
        <div id="property-valuation-card" className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Coins className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Valuation &amp; Consideration Breakdown
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Agreed Property Price:</span>
              <span className="font-mono-num font-semibold text-slate-900 dark:text-slate-100">{formatNaira(prop.agreedPrice)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Firm Legal Retainer &amp; Drafting (5%):</span>
              <span className="font-mono-num text-amber-700 dark:text-amber-400 font-semibold">{formatNaira(prop.legalFee)}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-2 rounded-lg">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Total Legal Obligation:</span>
              <span className="font-mono-num font-bold text-slate-900 dark:text-slate-100">{formatNaira(prop.totalAmount)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Cumulative Remittances:</span>
              <span className="font-mono-num font-semibold text-emerald-700 dark:text-emerald-400">{formatNaira(prop.paidAmount)}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500">Remaining Balance:</span>
              <span className="font-mono-num font-bold text-amber-700 dark:text-amber-400">{formatNaira(prop.balanceAmount)}</span>
            </div>

            {prop.nextDueDate && prop.balanceAmount > 0 && (
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs text-amber-900 dark:text-amber-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  Next Installment Due:
                </span>
                <span className="font-mono-num font-bold">{prop.nextDueDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment History Ledger Table with Receipt Thumbnails */}
      <div id="property-ledger-table-card" className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Payment Transactions &amp; Receipts Ledger ({prop.payments.length})
            </h2>
          </div>

          {hasPermission('canRecordPayment') && prop.balanceAmount > 0 && (
            <button
              id="btn-ledger-record-payment"
              onClick={() => openPaymentModal(prop)}
              className="px-3.5 py-1.5 rounded-xl bg-[#0E1B2E] hover:bg-[#162a47] dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer w-fit shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log New Payment</span>
            </button>
          )}
        </div>

        {prop.payments.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 space-y-2">
            <p>No payments recorded for this property file yet.</p>
            {hasPermission('canRecordPayment') && (
              <button
                onClick={() => openPaymentModal(prop)}
                className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs"
              >
                Log Initial Deposit
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                  <th className="py-3 px-3">Receipt Ref</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Payment Channel</th>
                  <th className="py-3 px-3">Bank Reference / Issuer</th>
                  <th className="py-3 px-3">Proof / Receipt</th>
                  <th className="py-3 px-3 text-right">Amount Paid</th>
                  <th className="py-3 px-3 text-right">Balance After</th>
                  <th className="py-3 px-3">Received By</th>
                  <th className="py-3 px-3 text-right">Official Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono-num">
                {prop.payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-amber-800 dark:text-amber-400">{pay.receiptNumber}</span>
                      {pay.isPayPalDemo && (
                        <span className="ml-1.5 text-[9px] font-sans px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                          PayPal Demo
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {pay.date}
                    </td>
                    <td className="py-3 px-3 text-slate-800 dark:text-slate-300 font-sans">
                      {pay.paymentMode}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-sans">
                      <div className="font-mono-num text-xs text-slate-800 dark:text-slate-200">{pay.bankReference}</div>
                      <div className="text-[10px] text-slate-500">{pay.issuingBank || 'Commercial Bank'}</div>
                    </td>
                    
                    {/* Receipt Screenshot / Thumbnail Preview */}
                    <td className="py-3 px-3 font-sans">
                      {pay.receiptThumbnailUrl ? (
                        <div 
                          onClick={() => viewReceipt(pay, prop)}
                          className="flex items-center gap-1.5 cursor-pointer group"
                        >
                          <img
                            src={pay.receiptThumbnailUrl}
                            alt="Receipt thumb"
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded border border-slate-300 dark:border-slate-700 object-cover group-hover:border-amber-500"
                          />
                          <span className="text-[10px] text-amber-700 dark:text-amber-400 underline font-medium">View</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">No image</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                      {formatNaira(pay.amount)}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {formatNaira(pay.balanceAfter)}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-sans whitespace-nowrap">
                      {pay.receivedBy}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap font-sans">
                      <button
                        id={`btn-view-receipt-${pay.id}`}
                        onClick={() => viewReceipt(pay, prop)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-amber-300 text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                        title="View and print official stamped receipt"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                        <span>View Stamped Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grid: Attached Documents & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Legal Documents & Title Deeds Gallery */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Attached Documents &amp; Title Deeds ({prop.documents.length})
              </h2>
            </div>
          </div>

          {prop.documents.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              No digital deeds or survey plans attached yet.
            </div>
          ) : (
            <div className="space-y-2">
              {prop.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-slate-200 truncate">{doc.title}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2">
                        <span>{doc.fileName}</span>
                        <span>&bull;</span>
                        <span>{doc.fileSize}</span>
                        <span>&bull;</span>
                        <span className="text-amber-700 dark:text-amber-400 font-medium">{doc.category}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleMockDocDownload(doc)}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300 hover:text-amber-700 transition-colors shrink-0 border border-slate-200 dark:border-slate-700"
                    title="Download certified copy"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Case Notes & Legal Remarks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Conveyancing Notes &amp; Audit Log
              </h2>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans min-h-[120px]">
            {prop.notes || 'No confidential case remarks recorded for this property matter.'}
          </div>

          <div className="pt-2 text-[11px] text-slate-500 space-y-1 font-mono-num">
            <div>File opened by: <span className="text-slate-800 dark:text-slate-300 font-sans font-medium">{prop.createdBy}</span> on {prop.createdAt}</div>
            <div>Last records modification: {prop.updatedAt}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
