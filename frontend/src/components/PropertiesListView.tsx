import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Search, 
  Plus, 
  CreditCard, 
  Eye, 
  Edit3, 
  Trash2, 
  LayoutList, 
  LayoutGrid, 
  Download, 
  AlertCircle, 
  ArrowUpDown,
  Phone,
  Receipt,
  FileCheck2,
  MapPin,
  Camera,
  HelpCircle
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { formatNaira } from '../services/api';
import { PaymentStatus, PropertyType, Property } from '../types';

export const PropertiesListView: React.FC = () => {
  const {
    filteredProperties,
    properties,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    selectProperty,
    openPaymentModal,
    setIsAddModalOpen,
    setEditingProperty,
    deleteProperty,
    addToast,
    openSectionGuide,
    isLoading,
    error,
    retryLoad
  } = useProperty();

  const { hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading property records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-center max-w-md">
          <p className="text-sm text-red-800 dark:text-red-300 font-medium">Failed to load properties</p>
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

  const statusOptions: { id: PaymentStatus | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All Matters', count: properties.length },
    { id: 'paid', label: 'Fully Paid', count: properties.filter(p => p.paymentStatus === 'paid').length },
    { id: 'partial', label: 'Partial Tranches', count: properties.filter(p => p.paymentStatus === 'partial').length },
    { id: 'pending', label: 'Pending Deposit', count: properties.filter(p => p.paymentStatus === 'pending').length },
  ];

  const typeOptions: (PropertyType | 'all')[] = [
    'all',
    'Commercial',
    'Residential',
    'Industrial',
    'Agricultural',
    'Mixed Use',
    'Probate & Estate'
  ];

  const isEmpty = filteredProperties.length === 0 && !searchQuery && statusFilter === 'all' && typeFilter === 'all';
  const noResults = filteredProperties.length === 0 && (searchQuery || statusFilter !== 'all' || typeFilter !== 'all');

  const handleEdit = (prop: Property, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProperty(prop);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (prop: Property, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to permanently delete record ${prop.fileNumber} (${prop.name})?`)) {
      await deleteProperty(prop.id);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'File Number',
      'Property Name',
      'Location Address',
      'City/State',
      'Category',
      'Client Name',
      'Client Email',
      'Client Phone',
      'Total Amount (NGN)',
      'Paid Amount (NGN)',
      'Balance (NGN)',
      'Status',
      'Last Payment Date'
    ];

    const rows = filteredProperties.map(p => [
      `"${p.fileNumber}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.address.replace(/"/g, '""')}"`,
      `"${p.cityState}"`,
      `"${p.propertyType}"`,
      `"${p.clientName}"`,
      `"${p.clientEmail}"`,
      `"${p.clientPhone}"`,
      p.totalAmount,
      p.paidAmount,
      p.balanceAmount,
      p.paymentStatus,
      p.lastPaymentDate || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nojim_Tairu_Properties_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'CSV Exported', `Generated ledger report for ${filteredProperties.length} records.`);
  };

  return (
    <motion.div
      id="properties-list-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5 max-w-7xl mx-auto text-slate-900 dark:text-slate-100"
    >
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
              Property &amp; Conveyancing Registers
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracking {properties.length} property files and client custody records under active legal representation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="btn-properties-section-guide"
            onClick={() => openSectionGuide('properties')}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="How to manage properties (?)"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Section Guide</span>
          </button>

          <button
            id="btn-export-properties-csv"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Export Ledger CSV</span>
          </button>

          {hasPermission('canAddProperty') && (
            <button
              id="btn-add-property-top"
              onClick={() => {
                setEditingProperty(null);
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#0E1B2E] hover:bg-[#162a47] dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Property File</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {statusOptions.map((tab) => {
              const isSelected = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`filter-tab-${tab.id}`}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0E1B2E] text-white dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white dark:bg-amber-400 dark:text-slate-950 font-bold' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode & Sort Dropdown */}
          <div className="flex items-center gap-2">
            {/* Sort Select */}
            <div className="relative">
              <select
                id="sort-properties-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-3 pr-8 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:border-amber-600 outline-none appearance-none cursor-pointer"
              >
                <option value="latest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="amount_high">Sort: Valuation (High to Low)</option>
                <option value="amount_low">Sort: Valuation (Low to High)</option>
                <option value="name">Sort: Property Name (A-Z)</option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                id="btn-view-mode-grid"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Photo Cards Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                id="btn-view-mode-table"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table view"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="filter-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by file number, property name, C of O, address, or client name..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-amber-600 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              id="filter-category-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-amber-600 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">All Asset Categories</option>
              {typeOptions.filter(t => t !== 'all').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content View: Table or Grid */}
      {filteredProperties.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500/60 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No Property Records Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No records matched your search query "{searchQuery}" or selected status filter.
          </p>
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
            >
              Reset Filters
            </button>
            {hasPermission('canAddProperty') && (
              <button
                onClick={() => {
                  setEditingProperty(null);
                  setIsAddModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 text-xs text-white font-bold hover:bg-amber-700 transition-colors"
              >
                + Add New Record
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                  <th className="py-3.5 px-4">File No / Title Ref</th>
                  <th className="py-3.5 px-4">Property &amp; Location</th>
                  <th className="py-3.5 px-4">Client / Owner</th>
                  <th className="py-3.5 px-4">Payment Status</th>
                  <th className="py-3.5 px-4 text-right">Total Consideration</th>
                  <th className="py-3.5 px-4 text-right">Paid / Balance</th>
                  <th className="py-3.5 px-4">Last Payment</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProperties.map((prop) => {
                  const paidPct = prop.totalAmount > 0 ? (prop.paidAmount / prop.totalAmount) * 100 : 0;

                  return (
                    <tr
                      key={prop.id}
                      id={`property-row-${prop.id}`}
                      onClick={() => selectProperty(prop.id)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      {/* File Number & Title */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono-num font-bold text-amber-800 dark:text-amber-400 text-xs">
                          {prop.fileNumber}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[150px]" title={prop.titleRef}>
                          {prop.titleRef}
                        </div>
                      </td>

                      {/* Property Name & Address with Mini Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {prop.coverImage && (
                            <img
                              src={prop.coverImage}
                              alt={prop.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                          )}
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors line-clamp-1 max-w-xs">
                              {prop.name}
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                              {prop.address}, {prop.cityState}
                            </div>
                            <div className="inline-block mt-0.5 text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                              {prop.propertyType}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Client / Owner */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900 dark:text-slate-200 truncate max-w-[160px]">
                          {prop.clientName}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono-num">
                          <Phone className="w-2.5 h-2.5 text-amber-700 dark:text-amber-400/80" />
                          <span>{prop.clientPhone}</span>
                        </div>
                      </td>

                      {/* Payment Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          prop.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : prop.paymentStatus === 'partial'
                            ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            prop.paymentStatus === 'paid' ? 'bg-emerald-500' : prop.paymentStatus === 'partial' ? 'bg-amber-500' : 'bg-rose-500'
                          }`} />
                          {prop.paymentStatus}
                        </span>
                      </td>

                      {/* Total Consideration */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono-num font-bold text-slate-900 dark:text-slate-100">
                        {formatNaira(prop.totalAmount)}
                      </td>

                      {/* Paid / Balance Progress */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono-num">
                        <div className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          {formatNaira(prop.paidAmount)}
                        </div>
                        <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                          Bal: {formatNaira(prop.balanceAmount)}
                        </div>
                        <div className="w-20 ml-auto h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-amber-600" style={{ width: `${paidPct}%` }} />
                        </div>
                      </td>

                      {/* Last Payment Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                        {prop.lastPaymentDate ? (
                          <div className="flex items-center gap-1 font-mono-num">
                            <Receipt className="w-3 h-3 text-slate-400" />
                            <span>{prop.lastPaymentDate}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No payments yet</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {hasPermission('canRecordPayment') && prop.balanceAmount > 0 && (
                            <button
                              id={`btn-table-pay-${prop.id}`}
                              onClick={() => openPaymentModal(prop)}
                              className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
                              title="Record payment"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            id={`btn-table-view-${prop.id}`}
                            onClick={() => selectProperty(prop.id)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                            title="View property dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {hasPermission('canEditProperty') && (
                            <button
                              id={`btn-table-edit-${prop.id}`}
                              onClick={(e) => handleEdit(prop, e)}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                              title="Edit file details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {hasPermission('canDeleteProperty') && (
                            <button
                              id={`btn-table-delete-${prop.id}`}
                              onClick={(e) => handleDelete(prop, e)}
                              className="p-1.5 rounded-lg bg-red-50 dark:bg-rose-950/30 hover:bg-red-100 text-red-600 dark:text-rose-400 border border-red-200 dark:border-rose-800/40 transition-colors"
                              title="Delete record archive (Admin only)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID CARDS VIEW WITH PHOTOS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProperties.map((prop) => {
            const paidPct = prop.totalAmount > 0 ? (prop.paidAmount / prop.totalAmount) * 100 : 0;

            return (
              <div
                key={prop.id}
                id={`property-card-${prop.id}`}
                onClick={() => selectProperty(prop.id)}
                className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden cursor-pointer group shadow-xs"
              >
                {/* Property Cover Image Header */}
                <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {prop.coverImage ? (
                    <img
                      src={prop.coverImage}
                      alt={prop.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <Building2 className="w-10 h-10" />
                      <span className="text-xs mt-1">No property photo</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[11px] font-mono-num font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 shadow-sm">
                      {prop.fileNumber}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg backdrop-blur-md ${
                      prop.paymentStatus === 'paid'
                        ? 'bg-emerald-500/90 text-white shadow-sm'
                        : prop.paymentStatus === 'partial'
                        ? 'bg-amber-500/90 text-slate-950 font-bold shadow-sm'
                        : 'bg-rose-600/90 text-white shadow-sm'
                    }`}>
                      {prop.paymentStatus}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Info */}
                  <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                    <div className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">
                      {prop.propertyType}
                    </div>
                    <h3 className="text-base font-bold text-white leading-snug line-clamp-1">
                      {prop.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span className="truncate">{prop.address}, {prop.cityState}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Client:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">{prop.clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Phone:</span>
                        <span className="text-slate-700 dark:text-slate-300 font-mono-num">{prop.clientPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Title Ref:</span>
                        <span className="text-slate-700 dark:text-slate-300 font-mono-num truncate max-w-[160px]">{prop.titleRef}</span>
                      </div>
                    </div>

                    {/* Financial Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-medium">Consideration:</span>
                        <span className="font-bold font-mono-num text-slate-900 dark:text-white">{formatNaira(prop.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Paid: {formatNaira(prop.paidAmount, true)}</span>
                        <span className="text-amber-700 dark:text-amber-400 font-bold">Bal: {formatNaira(prop.balanceAmount, true)}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-600 to-emerald-600 rounded-full" style={{ width: `${paidPct}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {prop.payments.length} Payments registered
                    </span>

                    <div className="flex items-center gap-1.5">
                      {hasPermission('canRecordPayment') && prop.balanceAmount > 0 && (
                        <button
                          onClick={() => openPaymentModal(prop)}
                          className="px-3 py-1.5 rounded-lg bg-[#0E1B2E] hover:bg-[#162a47] dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-xs transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay</span>
                        </button>
                      )}
                      <button
                        onClick={() => selectProperty(prop.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors border border-slate-200 dark:border-slate-700"
                      >
                        Inspect Dossier
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {noResults && (
        <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-center">
          <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">No matching records found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {isEmpty && (
        <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-center">
          <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">No property files yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Open a new property file to begin tracking conveyancing records and payments.</p>
          {hasPermission('canAddProperty') && (
            <button
              onClick={() => {
                setEditingProperty(null);
                setIsAddModalOpen(true);
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#0E1B2E] dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-bold hover:bg-[#162a47] dark:hover:bg-amber-400 transition cursor-pointer"
            >
              Open First Property File
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};
