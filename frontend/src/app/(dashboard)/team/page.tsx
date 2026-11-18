'use client';

import * as React from 'react';
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Shield,
  Trash2,
  X,
  Building2,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { TeamMember, TeamMemberStatus } from '../../../types';
import { teamService } from '../../../services/workspace.service';
import { useAuthStore } from '../../../store/authStore';
import { useToast } from '../../../components/ui/toast';
import { Skeleton } from '../../../components/ui/skeleton';

const AVATAR_COLORS = ['#7C3AED', '#2563EB', '#059669', '#D97706', '#DB2777', '#0891B2'];
const ROLES = [
  'Administrator',
  'Project Manager',
  'Lead Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'QA Engineer',
];
const DEPARTMENTS = ['Engineering', 'Design', 'Product', 'Operations', 'QA'];

export default function TeamPage() {
  const { user } = useAuthStore();
  const toast = useToast();

  const [members, setMembers] = React.useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('Full Stack Developer');
  const [department, setDepartment] = React.useState('Engineering');
  const [status, setStatus] = React.useState<TeamMemberStatus>('ACTIVE');
  const [isSaving, setIsSaving] = React.useState(false);

  const loadMembers = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await teamService.getMembers();
      setMembers(data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load team directory');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSaving(true);
    try {
      const avatarColor = AVATAR_COLORS[members.length % AVATAR_COLORS.length];
      await teamService.addMember({
        name: name.trim(),
        email: email.trim(),
        role,
        department,
        status,
        avatarColor,
      });
      toast.success(`${name.trim()} added to your workspace team`);
      setIsModalOpen(false);
      setName('');
      setEmail('');
      await loadMembers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to invite member');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (member: TeamMember, nextStatus: TeamMemberStatus) => {
    try {
      await teamService.updateMember(member._id, { status: nextStatus });
      toast.success('Member status updated');
      await loadMembers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleRemove = async (member: TeamMember) => {
    if (!confirm(`Remove ${member.name} from your workspace team?`)) return;
    try {
      await teamService.removeMember(member._id);
      toast.success(`${member.name} removed`);
      await loadMembers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove member');
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      !search.trim() ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Team Directory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Manage workspace collaborators, engineering roles, and availability status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-500/25 transition-all active:scale-95 self-start sm:self-auto"
        >
          <UserPlus className="h-4 w-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Workspace Owner Card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#12121A] to-[#241B4B] p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#7C3AED] flex items-center justify-center font-extrabold text-sm ring-2 ring-purple-400/40">
            {(user?.name || 'AR').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold">{user?.name || 'Workspace Owner'}</h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/30 text-[10px] font-bold text-purple-200">
                Owner
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
            <CheckCircle2 className="h-4 w-4" />
            <span>{user?.role || 'Administrator'}</span>
          </div>
          <span className="h-4 w-px bg-white/15" />
          <span className="text-slate-300 font-semibold">
            {members.length + 1} total seat{members.length === 0 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team by name, email, role, or department..."
            className="h-9 w-full pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15"
          />
        </div>
      </div>

      {/* Team Members Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-2xl border border-dashed border-slate-200 text-center">
          <div className="h-14 w-14 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-3">
            <Users className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {members.length === 0 ? 'Build your workspace team' : 'No matching team members'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Invite engineers, designers, and product managers to organize roles and departments in
            your workspace directory.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-500/20"
          >
            <UserPlus className="h-4 w-4" />
            <span>Invite First Member</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member._id}
              className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-11 w-11 shrink-0 rounded-2xl text-white flex items-center justify-center font-extrabold text-xs shadow-sm"
                    style={{ backgroundColor: member.avatarColor || '#7C3AED' }}
                  >
                    {member.name
                      .split(' ')
                      .map((p) => p[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-slate-900 truncate">
                      {member.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                      <Mail className="h-3 w-3 shrink-0" /> {member.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(member)}
                  title="Remove member"
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-[#7C3AED]">
                  <Shield className="h-3 w-3" /> {member.role}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                  <Building2 className="h-3 w-3" /> {member.department}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  <Clock className="h-3 w-3" /> Status
                </span>
                <select
                  value={member.status}
                  onChange={(e) =>
                    handleStatusChange(member, e.target.value as TeamMemberStatus)
                  }
                  className={`h-7 px-2.5 rounded-lg text-[11px] font-bold border focus:outline-none cursor-pointer ${
                    member.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : member.status === 'AWAY'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INVITED">Invited</option>
                  <option value="AWAY">Away</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-50 w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-900">Invite Team Member</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Sarah Khan"
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Work Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@company.com"
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:border-[#7C3AED] focus:outline-none"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:border-[#7C3AED] focus:outline-none"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Initial Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TeamMemberStatus)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:border-[#7C3AED] focus:outline-none"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INVITED">Invited</option>
                  <option value="AWAY">Away</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-xs font-bold text-white shadow-md shadow-purple-500/25 disabled:opacity-60"
                >
                  {isSaving ? 'Adding...' : 'Add to Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
