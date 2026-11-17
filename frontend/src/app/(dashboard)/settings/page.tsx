'use client';

import * as React from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useToast } from '../../../components/ui/toast';
import { Camera, Check, Shield, Bell, Moon, User, Lock, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateProfile, logout } = useAuthStore();
  const toast = useToast();

  const [activeTab, setActiveTab] = React.useState<
    'profile' | 'account' | 'preferences' | 'notifications' | 'appearance'
  >('profile');

  const [name, setName] = React.useState(user?.name || 'Abdul Razzaque');
  const [role, setRole] = React.useState(user?.role || 'Administrator');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setName(user.name);
      if (user.role) setRole(user.role);
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile({ name, role });
      toast.success('Profile updated successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (user) {
      setName(user.name);
      setRole(user.role || 'Administrator');
    }
  };

  return (
    <div className="max-w-4xl space-y-6 pb-16">
      {/* Settings Header matching Screen 9 */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">
          Manage your account, preferences and workspace settings.
        </p>
      </div>

      {/* Tabs Navigation matching Screen 9 */}
      <div className="flex items-center gap-8 border-b border-slate-200 px-1 text-xs font-bold text-slate-500 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 relative transition-colors whitespace-nowrap ${
            activeTab === 'profile' ? 'text-[#7C3AED]' : 'hover:text-slate-800'
          }`}
        >
          Profile
          {activeTab === 'profile' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`pb-3 relative transition-colors whitespace-nowrap ${
            activeTab === 'account' ? 'text-[#7C3AED]' : 'hover:text-slate-800'
          }`}
        >
          Account
          {activeTab === 'account' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`pb-3 relative transition-colors whitespace-nowrap ${
            activeTab === 'preferences' ? 'text-[#7C3AED]' : 'hover:text-slate-800'
          }`}
        >
          Preferences
          {activeTab === 'preferences' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 relative transition-colors whitespace-nowrap ${
            activeTab === 'notifications' ? 'text-[#7C3AED]' : 'hover:text-slate-800'
          }`}
        >
          Notifications
          {activeTab === 'notifications' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`pb-3 relative transition-colors whitespace-nowrap ${
            activeTab === 'appearance' ? 'text-[#7C3AED]' : 'hover:text-slate-800'
          }`}
        >
          Appearance
          {activeTab === 'appearance' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" />
          )}
        </button>
      </div>

      {/* Tab: Profile matching Screen 9 */}
      {activeTab === 'profile' && (
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xs border border-slate-100 space-y-8">
          {/* Avatar with Camera upload trigger matching Screen 9 */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="h-20 w-20 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-2xl uppercase ring-4 ring-purple-100 shadow-md overflow-hidden">
                {name ? name.slice(0, 2).toUpperCase() : 'AR'}
              </div>
              <button
                type="button"
                onClick={() => toast.info('Profile photo upload dialog ready.')}
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 hover:bg-slate-50 transition-colors"
                title="Change Avatar"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{name}</h3>
              <p className="text-xs text-slate-400 font-medium">{user?.email}</p>
              <span className="mt-1.5 inline-block text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/60">
                {role}
              </span>
            </div>
          </div>

          {/* Form matching Screen 9 */}
          <form onSubmit={handleSaveProfile} className="space-y-5 max-w-xl">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Abdul Razzaque"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-900 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'abdul@example.com'}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* Role Dropdown matching Screen 9 */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-800 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 cursor-pointer"
              >
                <option value="Administrator">Administrator</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Product Designer">Product Designer</option>
                <option value="Software Engineer">Software Engineer</option>
              </select>
            </div>

            {/* Action Buttons matching Screen 9 */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-6 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : 'Update Profile'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="h-10 px-6 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors shadow-2xs"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Other Tabs */}
      {activeTab === 'account' && (
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xs border border-slate-100 space-y-6">
          <h3 className="text-base font-extrabold text-slate-900">Account Security</h3>
          <p className="text-xs text-slate-500">
            Your workspace session is secured via protected HTTP-only JWT cookies and bcryptjs hashing.
          </p>
          <div className="pt-2">
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              Sign Out from All Devices
            </button>
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xs border border-slate-100 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Workspace Preferences</h3>
          <p className="text-xs text-slate-500">Configure notifications, default project views, and timezone.</p>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xs border border-slate-100 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Notification Alerts</h3>
          <p className="text-xs text-slate-500">Receive alerts for upcoming deadlines, overdue tasks, and project mentions.</p>
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xs border border-slate-100 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Theme Appearance</h3>
          <p className="text-xs text-slate-500">TaskFlow Pro Enterprise Dark Navy & Violet palette.</p>
        </div>
      )}
    </div>
  );
}
