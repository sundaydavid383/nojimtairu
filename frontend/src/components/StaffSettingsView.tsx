import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  ShieldCheck, 
  UserCheck, 
  Plus, 
  Edit3, 
  Check, 
  X, 
  Lock, 
  ShieldAlert, 
  Mail, 
  Phone,
  HelpCircle,
  KeyRound
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { User, UserRole } from '../types';

export const StaffSettingsView: React.FC = () => {
  const { staffMembers, updateStaffMember, addToast, openSectionGuide, isLoading, error, retryLoad } = useProperty();
  const { currentUser, switchRole, hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading staff directory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-center max-w-md">
          <p className="text-sm text-red-800 dark:text-red-300 font-medium">Failed to load staff records</p>
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

  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);

  // New staff form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTitle, setNewTitle] = useState('Junior Legal Associate');
  const [newRole, setNewRole] = useState<UserRole>('staff');
  const [newPhone, setNewPhone] = useState('+234 80');

  const isAdmin = currentUser.role === 'admin';

  const handleRoleChange = async (userId: string, role: UserRole) => {
    const defaultPermissions = {
      admin: {
        canAddProperty: true,
        canEditProperty: true,
        canDeleteProperty: true,
        canRecordPayment: true,
        canManageStaff: true,
        canExportFinancials: true,
        canViewAuditLogs: true,
      },
      staff: {
        canAddProperty: true,
        canEditProperty: true,
        canDeleteProperty: false,
        canRecordPayment: true,
        canManageStaff: false,
        canExportFinancials: true,
        canViewAuditLogs: true,
      },
      viewer: {
        canAddProperty: false,
        canEditProperty: false,
        canDeleteProperty: false,
        canRecordPayment: false,
        canManageStaff: false,
        canExportFinancials: false,
        canViewAuditLogs: true,
      }
    };

    await updateStaffMember(userId, {
      role,
      permissions: defaultPermissions[role]
    });
  };

  const handleTogglePermission = async (user: User, permKey: keyof User['permissions']) => {
    const updatedPermissions = {
      ...user.permissions,
      [permKey]: !user.permissions[permKey]
    };
    await updateStaffMember(user.id, {
      permissions: updatedPermissions
    });
  };

  const handleInviteStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      addToast('warning', 'Missing Fields', 'Please enter Name and Email address.');
      return;
    }

    // Default permissions according to role
    const perms = {
      canAddProperty: newRole !== 'viewer',
      canEditProperty: newRole !== 'viewer',
      canDeleteProperty: newRole === 'admin',
      canRecordPayment: newRole !== 'viewer',
      canManageStaff: newRole === 'admin',
      canExportFinancials: newRole !== 'viewer',
      canViewAuditLogs: true,
    };

    const newStaffUser: User = {
      id: `user-${Date.now()}`,
      name: newName,
      email: newEmail,
      title: newTitle,
      role: newRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: newPhone,
      lastActive: 'Just invited',
      permissions: perms
    };

    // Update in list
    await updateStaffMember(newStaffUser.id, newStaffUser);
    setIsInviteModalOpen(false);
    setNewName('');
    setNewEmail('');
    addToast('success', 'Staff Member Added', `Invited ${newName} as ${newRole.toUpperCase()}`);
  };

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-[#0C101C] border border-amber-500/30 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold font-legal-heading text-slate-100">
          Admin-Restricted Chambers Management
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          You are currently logged in as a <strong>{currentUser.role.toUpperCase()}</strong> ({currentUser.title}). Staff roster &amp; security permission matrices are restricted to Partners and Admins.
        </p>
        <div className="pt-2">
          <button
            id="btn-switch-admin-from-restricted"
            onClick={() => switchRole('admin')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-950/40 transition-all cursor-pointer"
          >
            Switch to Partner / Admin Role (Demo Mode)
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      id="staff-settings-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-bold font-legal-heading text-slate-100">
              Staff &amp; Role Permission Matrix
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure access control, conveyancing privileges, and payment ledger rights for legal staff.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="btn-staff-section-guide"
            onClick={() => openSectionGuide('staff')}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="How staff permissions work (?)"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Section Guide</span>
          </button>

          <button
            id="btn-add-staff-member"
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-950/40 transition-all flex items-center gap-1.5 cursor-pointer w-fit"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Staff / Associate</span>
          </button>
        </div>
      </div>

      {/* Role Summary Banner */}
      <div id="staff-role-tiers-card" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0C101C] border border-amber-500/20 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin / Partner</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Full governance: Create, edit &amp; delete property files, issue certified receipts, and configure staff permissions.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0C101C] border border-blue-500/20 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>Legal Staff / Associate</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Operational access: View properties, record payments, upload documents, and update conveyancing stages. No record deletion.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0C101C] border border-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>Viewer / External Auditor</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Read-only ledger access: Inspect property registers and payment history for audit compliance. Cannot modify or add data.
          </p>
        </div>
      </div>

      {/* Staff Members Table */}
      <div id="staff-members-table-card" className="rounded-2xl bg-[#0C101C] border border-slate-800/90 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 bg-[#090D18] flex items-center justify-between">
          <h2 className="text-sm font-bold font-legal-heading uppercase tracking-wider text-slate-200">
            Active Chambers Staff Members ({staffMembers.length})
          </h2>
          <span className="text-xs text-slate-500">Live Access Management</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0A0E1A] text-slate-400 text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Role Tier</th>
                <th className="py-3.5 px-4 text-center">Add/Edit Props</th>
                <th className="py-3.5 px-4 text-center">Record Payments</th>
                <th className="py-3.5 px-4 text-center">Delete Archives</th>
                <th className="py-3.5 px-4 text-center">Manage Staff</th>
                <th className="py-3.5 px-4 text-right">Quick Role Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {staffMembers.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Avatar & Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-100">{staff.name}</div>
                        <div className="text-[11px] text-slate-400">{staff.title}</div>
                        <div className="text-[10px] text-slate-500">{staff.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Role Badge */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      staff.role === 'admin'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : staff.role === 'staff'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-slate-700/40 text-slate-300 border border-slate-600/40'
                    }`}>
                      {staff.role === 'admin' ? 'Partner / Admin' : staff.role === 'staff' ? 'Staff' : 'Viewer'}
                    </span>
                  </td>

                  {/* Permission Toggle: Add/Edit */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleTogglePermission(staff, 'canAddProperty')}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        staff.permissions?.canAddProperty
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-800 border-slate-700 text-slate-600'
                      }`}
                      title="Toggle Add Property permission"
                    >
                      {staff.permissions?.canAddProperty ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </button>
                  </td>

                  {/* Permission Toggle: Record Payment */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleTogglePermission(staff, 'canRecordPayment')}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        staff.permissions?.canRecordPayment
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-800 border-slate-700 text-slate-600'
                      }`}
                      title="Toggle Record Payment permission"
                    >
                      {staff.permissions?.canRecordPayment ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </button>
                  </td>

                  {/* Permission Toggle: Delete */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleTogglePermission(staff, 'canDeleteProperty')}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        staff.permissions?.canDeleteProperty
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                          : 'bg-slate-800 border-slate-700 text-slate-600'
                      }`}
                      title="Toggle Delete Property permission"
                    >
                      {staff.permissions?.canDeleteProperty ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </button>
                  </td>

                  {/* Permission Toggle: Manage Staff */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleTogglePermission(staff, 'canManageStaff')}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        staff.permissions?.canManageStaff
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                          : 'bg-slate-800 border-slate-700 text-slate-600'
                      }`}
                      title="Toggle Staff Administration permission"
                    >
                      {staff.permissions?.canManageStaff ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </button>
                  </td>

                  {/* Role Selector dropdown per user */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <select
                      value={staff.role}
                      onChange={(e) => handleRoleChange(staff.id, e.target.value as UserRole)}
                      className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:border-amber-500 outline-none cursor-pointer"
                    >
                      <option value="admin">Admin / Partner</option>
                      <option value="staff">Legal Staff</option>
                      <option value="viewer">Viewer (Read-Only)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsInviteModalOpen(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-[#0C101C] border border-slate-700 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold font-legal-heading text-slate-100">
                Add New Staff / Associate
              </h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteStaff} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1" htmlFor="new-staff-name">
                  Full Legal Name &amp; Title *
                </label>
                <input
                  id="new-staff-name"
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Barr. Babatunde Fashola"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1" htmlFor="new-staff-email">
                  Chambers Email Address *
                </label>
                <input
                  id="new-staff-email"
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="babatunde.f@ntlaw.ng"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1" htmlFor="new-staff-title">
                    Chambers Title
                  </label>
                  <input
                    id="new-staff-title"
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Associate Counsel"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1" htmlFor="new-staff-role">
                    Role Tier
                  </label>
                  <select
                    id="new-staff-role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:border-amber-500 outline-none cursor-pointer"
                  >
                    <option value="staff">Legal Staff</option>
                    <option value="admin">Partner / Admin</option>
                    <option value="viewer">Viewer (Read-Only)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Save &amp; Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};
