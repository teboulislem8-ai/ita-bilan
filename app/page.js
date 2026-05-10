'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProfileStore, useCardConfigStore } from '@/lib/stores';
import { getEntryIds } from '@/lib/db';

export default function Home() {
  const { profile, loading, loadProfile } = useProfileStore();
  const { cardConfig, loadCardConfig } = useCardConfigStore();
  const [entryCount, setEntryCount] = useState(0);

  useEffect(() => {
    loadProfile();
    loadCardConfig();
  }, [loadProfile, loadCardConfig]);

  useEffect(() => {
    if (profile) {
      getEntryIds().then(ids => setEntryCount(ids.length));
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-primary/60">Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">FDPS Field Form</h1>
          <p className="mt-2 text-sm text-primary/60">Ministry Field Data Entry</p>
        </div>
        <Link
          href="/profile"
          className="rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg active:scale-95"
        >
          Get Started
        </Link>
      </div>
    );
  }

  if (!cardConfig) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">Welcome, {profile.name}</h1>
          <p className="mt-1 text-sm text-primary/60">{profile.unit} — {profile.season}</p>
        </div>
        <p className="text-primary/60">Set up your card layout first</p>
        <Link
          href="/card-setup"
          className="rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg active:scale-95"
        >
          Configure Cards
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 py-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-primary">FDPS Field Form</h1>
        <p className="mt-1 text-sm text-primary/60">
          {profile.name} — {profile.unit}
        </p>
        <p className="text-xs text-primary/40">
          Season: {profile.season} | Entries: {entryCount}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <Link
          href="/form"
          className="flex items-center justify-between rounded-xl bg-primary p-5 text-white shadow-md active:scale-[0.98]"
        >
          <span className="text-lg font-semibold">New Entry</span>
          <span className="text-2xl">+</span>
        </Link>

        <Link
          href="/history"
          className="flex items-center justify-between rounded-xl border border-primary/20 bg-white p-5 text-primary shadow-sm active:scale-[0.98]"
        >
          <span className="text-lg font-semibold">History</span>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm">{entryCount}</span>
        </Link>

        <Link
          href="/settings"
          className="flex items-center justify-between rounded-xl border border-primary/20 bg-white p-5 text-primary shadow-sm active:scale-[0.98]"
        >
          <span className="text-lg font-semibold">Settings</span>
          <span className="text-xl">⚙</span>
        </Link>
      </div>
    </div>
  );
}
