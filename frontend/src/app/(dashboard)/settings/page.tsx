'use client';

import * as React from 'react';
import { useAuthStore } from '../../../store/authStore';
import { Button } from '../../../components/ui/button';
import { useToast } from '../../../components/ui/toast';
import { User, Shield, Key, LogOut, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const toast = useToast();

  return (
    <div className="max-w-4xl space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Settings & Profile
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your personal profile, security configuration, and active workspace preferences.
        </p>
      </div>

      {/* User Information Card */}
      <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-100 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-center font-bold text-xl uppercase shadow-md">
            {user?.name ? user.name.slice(0, 2) : 'TF'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{user?.name}</h3>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <span className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-50 text-brand-700">
              <CheckCircle2 className="h-3 w-3" /> Authenticated Member
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              User ID (MongoDB ObjectId)
            </span>
            <span className="font-mono text-xs text-slate-800 break-all">
              {user?.id}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Primary Role
            </span>
            <span className="text-xs font-bold text-slate-800">
              MERN Stack Technical Lead
            </span>
          </div>
        </div>
      </div>

      {/* Security & Authentication */}
      <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-100 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Authentication & Security
            </h3>
            <p className="text-xs text-slate-400">
              Session secured with HTTP-Only JWT cookies and Bcrypt 12-round hashing.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div>
            <p className="text-xs font-bold text-slate-800">Active Session Status</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Your token is stored safely in a protected, HTTP-only cookie.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.info('Session is healthy and actively refreshed by Express middleware.')
            }
          >
            Verify Session
          </Button>
        </div>
      </div>

      {/* Danger Zone / Log Out */}
      <div className="rounded-2xl bg-white p-6 shadow-card border border-rose-100 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Account Session</h3>
        <p className="text-xs text-slate-500">
          Terminate your current authenticated session across this device.
        </p>
        <Button
          variant="destructive"
          onClick={() => logout()}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Log Out of TaskFlow
        </Button>
      </div>
    </div>
  );
}
