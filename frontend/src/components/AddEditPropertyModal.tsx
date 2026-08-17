import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Building2, 
  User, 
  Coins, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  CreditCard,
  FileCheck,
  Shield
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { Property, PropertyType, PaymentMode, ConveyancingStatus, DocumentAttachment } from '../types';
import { formatNaira } from '../services/api';

export const AddEditPropertyModal: React.FC = () => {
  const { 
    isAddModalOpen, 
    setIsAddModalOpen, 
    editingProperty, 
    createProperty, 
    updateProperty, 
    addToast 
  } = useProperty();

  const isEdit = !!editingProperty;

  // Form states
  const [activeTab, setActiveTab] = useState<'property' | 'client' | 'financial' | 'payment'>('property');

  // Property Details
  const [name, setName] = useState('');
  const [titleRef, setTitleRef] = useState('');
  const [address, setAddress] = useState('');
  const [cityState, setCityState] = useState('Lagos State');
  const [propertyType, setPropertyType] = useState<PropertyType>('Commercial');
  const [conveyancingStatus, setConveyancingStatus] = useState<ConveyancingStatus>('Drafting Contract');
  const [notes, setNotes] = useState('');

  // Client Details
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientNIN_ID, setClientNIN_ID] = useState('');

  // Financials
  const [agreedPrice, setAgreedPrice] = useState<number>(150000000);
  const [legalFeePercent, setLegalFeePercent] = useState<number>(5);
  const [legalFee, setLegalFee] = useState<number>(7500000);
  const [primaryPaymentMode, setPrimaryPaymentMode] = useState<PaymentMode>('Bank Transfer');

  // Initial Payment (for new properties)
  const [hasInitialPayment, setHasInitialPayment] = useState<boolean>(false);
  const [initialPaymentAmount, setInitialPaymentAmount] = useState<number>(50000000);
  const [initialBankRef, setInitialBankRef] = useState<string>('');
  const [initialIssuingBank, setInitialIssuingBank] = useState<string>('Zenith Bank Plc');
  const [initialReceiptNotes, setInitialReceiptNotes] = useState<string>('Initial deposit paid upon signing contract of sale.');
  const [mockReceiptName, setMockReceiptName] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when editing
  useEffect(() => {
    if (editingProperty) {
      setName(editingProperty.name);
      setTitleRef(editingProperty.titleRef);
      setAddress(editingProperty.address);
      setCityState(editingProperty.cityState);
      setPropertyType(editingProperty.propertyType);
      setConveyancingStatus(editingProperty.conveyancingStatus);
      setNotes(editingProperty.notes || '');

      setClientName(editingProperty.clientName);
      setClientEmail(editingProperty.clientEmail);
      setClientPhone(editingProperty.clientPhone);
      setClientAddress(editingProperty.clientAddress || '');
      setClientNIN_ID(editingProperty.clientNIN_ID || '');

      setAgreedPrice(editingProperty.agreedPrice);
      setLegalFee(editingProperty.legalFee);
      setPrimaryPaymentMode(editingProperty.primaryPaymentMode);
      setHasInitialPayment(false);
    } else {
      // Default new form
      setName('');
      setTitleRef('Certificate of Occupancy #LA-' + Math.floor(10000 + Math.random() * 90000));
      setAddress('');
      setCityState('Ikoyi, Lagos State');
      setPropertyType('Commercial');
      setConveyancingStatus('Drafting Contract');
      setNotes('Legal title search conducted. No adverse caveats identified at land registry.');

      setClientName('');
      setClientEmail('');
      setClientPhone('+234 80');
      setClientAddress('');
      setClientNIN_ID('NIN-' + Math.floor(10000000000 + Math.random() * 90000000000));

      setAgreedPrice(250000000);
      setLegalFee(12500000);
      setPrimaryPaymentMode('Bank Transfer');
      setHasInitialPayment(true);
      setInitialPaymentAmount(100000000);
      setInitialBankRef(`GTB-NIP-${Math.floor(10000000 + Math.random() * 90000000)}`);
      setInitialIssuingBank('Guaranty Trust Bank (GTBank)');
      setMockReceiptName('');
    }
  }, [editingProperty, isAddModalOpen]);

  // Recalculate legal fee when agreed price changes
  const handlePriceChange = (val: number) => {
    setAgreedPrice(val);
    setLegalFee(Math.round(val * (legalFeePercent / 100)));
  };

  const handlePercentChange = (pct: number) => {
    setLegalFeePercent(pct);
    setLegalFee(Math.round(agreedPrice * (pct / 100)));
  };

  const computedTotal = agreedPrice + legalFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !clientName.trim()) {
      addToast('warning', 'Incomplete Form', 'Please provide Property Name and Client Name.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEdit && editingProperty) {
        await updateProperty(editingProperty.id, {
          name,
          titleRef,
          address,
          cityState,
          propertyType,
          conveyancingStatus,
          notes,
          clientName,
          clientEmail,
          clientPhone,
          clientAddress,
          clientNIN_ID,
          agreedPrice,
          legalFee,
          primaryPaymentMode,
        });
      } else {
        const initialDocs: DocumentAttachment[] = [];
        if (mockReceiptName) {
          initialDocs.push({
            id: `doc-${Date.now()}`,
            title: `Bank Settlement Proof (${mockReceiptName})`,
            fileName: mockReceiptName,
            fileType: 'pdf',
            fileSize: '2.4 MB',
            uploadDate: new Date().toISOString().split('T')[0],
            uploadedBy: 'Firm Conveyancing Officer',
            category: 'Receipt'
          });
        }

        await createProperty({
          name,
          titleRef,
          address,
          cityState,
          propertyType,
          conveyancingStatus,
          notes,
          clientName,
          clientEmail,
          clientPhone,
          clientAddress,
          clientNIN_ID,
          agreedPrice,
          legalFee,
          totalAmount: computedTotal,
          paymentStatus: 'pending',
          primaryPaymentMode,
          createdBy: '',
          initialPayment: hasInitialPayment && initialPaymentAmount > 0 ? {
            amount: initialPaymentAmount,
            paymentMode: primaryPaymentMode,
            bankReference: initialBankRef || `REF-${Date.now()}`,
            issuingBank: initialIssuingBank,
            receiptNotes: initialReceiptNotes
          } : undefined,
          initialDocuments: initialDocs
        });
      }
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMockFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMockReceiptName(e.target.files[0].name);
      addToast('info', 'Receipt Attached', `Attached: ${e.target.files[0].name}`);
    }
  };

  if (!isAddModalOpen) return null;

  return (
    <div 
      id="modal-backdrop-add-property"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={() => setIsAddModalOpen(false)}
    >
      <motion.div
        id="modal-add-property-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-2xl bg-white dark:bg-[#0C101C] border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh] text-slate-900 dark:text-slate-100"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-gradient-to-r dark:from-[#111728] dark:to-[#0A0D15] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-legal-heading text-slate-900 dark:text-slate-100">
                {isEdit ? `Edit Conveyancing Record: ${editingProperty?.fileNumber}` : 'Open New Property Conveyancing File'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Chambers of Nojim Tairu &amp; Co. &bull; Official Property Registration
              </p>
            </div>
          </div>
          <button
            id="btn-close-add-modal"
            onClick={() => setIsAddModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#090D18] flex gap-2 overflow-x-auto">
          {[
            { id: 'property', label: '1. Property Asset Details', icon: Building2 },
            { id: 'client', label: '2. Client & Contact', icon: User },
            { id: 'financial', label: '3. Valuation & Retainer', icon: Coins },
            ...(!isEdit ? [{ id: 'payment', label: '4. Initial Deposit & Receipt', icon: CreditCard }] : []),
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 border-b-2 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'border-amber-600 dark:border-amber-400 text-amber-700 dark:text-amber-300'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: PROPERTY DETAILS */}
          {activeTab === 'property' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="prop-name">
                  Property Asset Title / Description *
                </label>
                <input
                  id="prop-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ikoyi Waterfront Luxury Terraces (Block 2)"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="prop-type">
                    Property Category
                  </label>
                  <select
                    id="prop-type"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 outline-none cursor-pointer"
                  >
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Agricultural">Agricultural</option>
                    <option value="Mixed Use">Mixed Use</option>
                    <option value="Probate & Estate">Probate &amp; Estate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="prop-conveyancing">
                    Conveyancing Stage
                  </label>
                  <select
                    id="prop-conveyancing"
                    value={conveyancingStatus}
                    onChange={(e) => setConveyancingStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 outline-none cursor-pointer"
                  >
                    <option value="Drafting Contract">Drafting Contract</option>
                    <option value="Deed Executed">Deed Executed</option>
                    <option value="Governor's Consent Pending">Governor's Consent Pending</option>
                    <option value="Stamp Duty Cleared">Stamp Duty Cleared</option>
                    <option value="Registered & Perfected">Registered &amp; Perfected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="prop-title-ref">
                  Title &amp; Land Registry Reference (C of O, Deed, Excision)
                </label>
                <input
                  id="prop-title-ref"
                  type="text"
                  value={titleRef}
                  onChange={(e) => setTitleRef(e.target.value)}
                  placeholder="e.g. C of O No. 44/44/2021 (Lagos State Lands Registry)"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="prop-address">
                    Physical Address / Plot Reference *
                  </label>
                  <input
                    id="prop-address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Plot 18A Alexander Road, Ikoyi"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="prop-city-state">
                    City &amp; State Jurisdiction
                  </label>
                  <input
                    id="prop-city-state"
                    type="text"
                    value={cityState}
                    onChange={(e) => setCityState(e.target.value)}
                    placeholder="Lagos State / Abuja FCT"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="prop-notes">
                  Legal Notes &amp; Encumbrance Search Remarks
                </label>
                <textarea
                  id="prop-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes on search report, title perfection status, covenants..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CLIENT DETAILS */}
          {activeTab === 'client' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="client-name">
                  Client / Retainer Name (Individual or Corporate Entity) *
                </label>
                <input
                  id="client-name"
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Apex Global Energy Services Ltd / Chief Adeleke"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="client-phone">
                    Client Phone Contact *
                  </label>
                  <input
                    id="client-phone"
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+234 803 000 0000"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="client-email">
                    Client Email Address *
                  </label>
                  <input
                    id="client-email"
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="client@domain.com"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="client-nin">
                    NIN / RC Number / Tax Identification (TIN)
                  </label>
                  <input
                    id="client-nin"
                    type="text"
                    value={clientNIN_ID}
                    onChange={(e) => setClientNIN_ID(e.target.value)}
                    placeholder="RC-1294812 or NIN-9918274619"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="client-address">
                    Client Residential / Office Address
                  </label>
                  <input
                    id="client-address"
                    type="text"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="12 Ozumba Mbadiwe, VI, Lagos"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FINANCIALS & LEGAL FEES */}
          {activeTab === 'financial' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="agreed-price">
                    Agreed Property Price (NGN) *
                  </label>
                  <input
                    id="agreed-price"
                    type="number"
                    min="0"
                    step="500000"
                    required
                    value={agreedPrice}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 outline-none font-mono font-bold"
                  />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                    Formatted: {formatNaira(agreedPrice)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="legal-fee-pct">
                    Firm Legal Retainer &amp; Conveyancing Fee
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="legal-fee-pct"
                      value={legalFeePercent}
                      onChange={(e) => handlePercentChange(Number(e.target.value))}
                      className="w-28 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 outline-none"
                    >
                      <option value={5}>5% Standard</option>
                      <option value={7.5}>7.5% Scale</option>
                      <option value={10}>10% Complex</option>
                      <option value={0}>0% Pro Bono</option>
                    </select>
                    <input
                      type="number"
                      value={legalFee}
                      onChange={(e) => setLegalFee(Number(e.target.value))}
                      className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-amber-600 dark:text-amber-400 font-mono focus:border-amber-500 outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                    Fee: {formatNaira(legalFee)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="payment-channel">
                  Designated Settlement Payment Channel
                </label>
                <select
                  id="payment-channel"
                  value={primaryPaymentMode}
                  onChange={(e) => setPrimaryPaymentMode(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 outline-none cursor-pointer"
                >
                  <option value="Bank Transfer">Bank Transfer (NIP / RTGS)</option>
                  <option value="Certified Cheque">Certified Bank Cheque / Draft</option>
                  <option value="Escrow Account">Firm Escrow Client Trust Account</option>
                  <option value="Direct Deposit">Direct Branch Cash / Deposit</option>
                  <option value="USD Wire Transfer">USD Wire Transfer</option>
                </select>
              </div>

              {/* Total Summary Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Agreed Consideration:</span>
                  <span className="font-mono-num">{formatNaira(agreedPrice)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Legal Drafting Retainer ({legalFeePercent}%):</span>
                  <span className="font-mono-num text-amber-600 dark:text-amber-400">{formatNaira(legalFee)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-sm font-bold text-slate-900 dark:text-slate-100">
                  <span>Total Financial Obligation:</span>
                  <span className="font-mono-num text-amber-700 dark:text-amber-300">{formatNaira(computedTotal)}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INITIAL PAYMENT (Only for new records) */}
          {activeTab === 'payment' && !isEdit && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Log Initial Deposit Now?</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Record earnest payment and generate receipt upon creation</div>
                </div>
                <input
                  id="chk-has-initial-payment"
                  type="checkbox"
                  checked={hasInitialPayment}
                  onChange={(e) => setHasInitialPayment(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {hasInitialPayment && (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="init-amount">
                        Deposit Amount (NGN)
                      </label>
                      <input
                        id="init-amount"
                        type="number"
                        min="1"
                        max={computedTotal}
                        value={initialPaymentAmount}
                        onChange={(e) => setInitialPaymentAmount(Number(e.target.value))}
                        className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold focus:border-amber-500 outline-none"
                      />
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                        {formatNaira(initialPaymentAmount)}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="init-bank">
                        Issuing Bank
                      </label>
                      <input
                        id="init-bank"
                        type="text"
                        value={initialIssuingBank}
                        onChange={(e) => setInitialIssuingBank(e.target.value)}
                        placeholder="Zenith Bank / GTBank / Access"
                        className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="init-ref">
                      Bank Transaction Reference / Cheque No.
                    </label>
                    <input
                      id="init-ref"
                      type="text"
                      value={initialBankRef}
                      onChange={(e) => setInitialBankRef(e.target.value)}
                      placeholder="ZENITH-NIP-99018274"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-mono focus:border-amber-500 outline-none"
                    />
                  </div>

                  {/* Mock File Attachment Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Attach Digital Payment Slip / Proof of Remittance
                    </label>
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-amber-500/60 rounded-xl p-4 text-center bg-slate-50/50 dark:bg-slate-900/40 relative cursor-pointer">
                      <input
                        type="file"
                        id="mock-file-input"
                        onChange={handleMockFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        accept=".pdf,.png,.jpg,.jpeg"
                      />
                      <UploadCloud className="w-6 h-6 text-amber-500 dark:text-amber-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {mockReceiptName ? `Selected: ${mockReceiptName}` : 'Click or Drag & Drop Bank Receipt Slip (.PDF, .PNG)'}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                        Simulated document vault upload (Max 25MB)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Total Obligation: <span className="font-bold text-amber-700 dark:text-amber-400 font-mono">{formatNaira(computedTotal)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-submit-property-form"
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-950/40 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : isEdit ? 'Save Record Changes' : 'Create Conveyancing File'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
