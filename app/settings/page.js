'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore, useCardConfigStore } from '@/lib/stores';
import { PREDEFINED_CARDS } from '@/lib/predefinedCards';
import { getAllEntries, clearAllData } from '@/lib/db';
import { exportEntriesToExcel } from '@/lib/export';

export default function SettingsPage() {
  const router = useRouter();
  const { profile, clearProfile } = useProfileStore();
  const { cardConfig, clearCardConfig } = useCardConfigStore();
  const [entryCount, setEntryCount] = useState(0);

  useEffect(() => {
    getAllEntries().then(all => setEntryCount(all.filter(e => e.status === 'saved').length));
  }, []);

  const handleExportAll = async () => {
    const entries = await getAllEntries();
    const saved = entries.filter(e => e.status === 'saved');
    if (saved.length === 0) {
      alert('No saved entries to export.');
      return;
    }
    exportEntriesToExcel(saved, profile, cardConfig, PREDEFINED_CARDS);
  };

  const handleResetCards = async () => {
    await clearCardConfig();
    router.push('/card-setup');
  };

  const handleResetProfile = async () => {
    await clearProfile();
    await clearCardConfig();
    router.push('/profile');
  };

  const handleClearAll = async () => {
    if (!window.confirm('Delete ALL data (profile, cards, entries)? This cannot be undone.')) return;
    await clearAllData();
    router.push('/profile');
  };

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-primary/60">No profile found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Settings</h1>
        <button type="button" onClick={() => router.push('/')} className="text-sm font-medium text-primary hover:underline">
          Home
        </button>
      </div>

      <div className="mb-6 rounded-xl border border-primary/10 bg-white p-4">
        <p className="text-sm text-primary-dark">
          <span className="font-semibold">{profile.name}</span> — {profile.unit}
        </p>
        <p className="text-xs text-primary/40">Season: {profile.season}</p>
        <p className="text-xs text-primary/40">Saved entries: {entryCount}</p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleExportAll}
          className="w-full rounded-xl bg-primary py-4 text-base font-semibold text-white shadow-md active:scale-95"
        >
          Export All Entries (Excel)
        </button>

        <button
          type="button"
          onClick={handleResetCards}
          className="w-full rounded-xl border border-primary/20 bg-white py-4 text-base font-semibold text-primary shadow-sm active:scale-95"
        >
          Reset Card Layout
        </button>

        <button
          type="button"
          onClick={handleResetProfile}
          className="w-full rounded-xl border border-primary/20 bg-white py-4 text-base font-semibold text-primary shadow-sm active:scale-95"
        >
          Reset Profile
        </button>

        <button
          type="button"
          onClick={handleClearAll}
          className="w-full rounded-xl border border-red-200 bg-white py-4 text-base font-semibold text-red-500 shadow-sm active:scale-95"
        >
          Delete All Data
        </button>
      </div>
    </div>
  );
}
