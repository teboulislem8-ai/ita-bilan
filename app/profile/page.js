'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/lib/stores';

export default function ProfilePage() {
  const router = useRouter();
  const { setProfile } = useProfileStore();
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [season, setSeason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !unit.trim() || !season.trim()) {
      setError('All fields are required');
      return;
    }
    const profile = {
      id: crypto.randomUUID(),
      name: name.trim(),
      unit: unit.trim(),
      season: season.trim(),
      createdAt: new Date().toISOString(),
    };
    await setProfile(profile);
    router.push('/card-setup');
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-primary">Agent Profile</h1>
        <p className="mt-1 text-sm text-primary/60">Set up your profile once</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-primary-dark">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full rounded-xl border border-primary/20 bg-white px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Your full name"
            dir="auto"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-primary-dark">Unit</label>
          <input
            type="text"
            value={unit}
            onChange={e => setUnit(e.target.value)}
            className="w-full rounded-xl border border-primary/20 bg-white px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Your unit / department"
            dir="auto"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-primary-dark">Season</label>
          <input
            type="text"
            value={season}
            onChange={e => setSeason(e.target.value)}
            className="w-full rounded-xl border border-primary/20 bg-white px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="e.g. 2025-2026"
            dir="auto"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          className="rounded-xl bg-primary py-4 text-lg font-semibold text-white shadow-lg active:scale-95"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
}
