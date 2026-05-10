'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore, useLangStore } from '@/lib/stores';
import { t } from '@/src/i18n/strings';

export default function ProfilePage() {
  const router = useRouter();
  const { setProfile } = useProfileStore();
  const { lang, loadLang } = useLangStore();
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [season, setSeason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { loadLang(); }, [loadLang]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !unit.trim() || !season.trim()) {
      setError(t('allFieldsRequired', lang));
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
        <h1 className="text-2xl font-bold text-primary" dir="auto">{t('agentProfile', lang)}</h1>
        <p className="mt-1 text-sm text-primary/60" dir="auto">{t('setUpProfile', lang)}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-primary-dark" dir="auto">{t('name', lang)}</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full min-h-[44px] rounded-xl border border-primary/20 bg-white px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder={t('namePlaceholder', lang)}
            dir="auto"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-primary-dark" dir="auto">{t('unit', lang)}</label>
          <input
            type="text"
            value={unit}
            onChange={e => setUnit(e.target.value)}
            className="w-full min-h-[44px] rounded-xl border border-primary/20 bg-white px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder={t('unitPlaceholder', lang)}
            dir="auto"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-primary-dark" dir="auto">{t('season', lang)}</label>
          <input
            type="text"
            value={season}
            onChange={e => setSeason(e.target.value)}
            className="w-full min-h-[44px] rounded-xl border border-primary/20 bg-white px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder={t('seasonPlaceholder', lang)}
            dir="auto"
          />
        </div>

        {error && <p className="text-sm text-red-500" dir="auto">{error}</p>}

        <button
          type="submit"
          className="min-h-[44px] rounded-xl bg-primary py-4 text-lg font-semibold text-white shadow-lg active:scale-95"
        >
          {t('saveAndContinue', lang)}
        </button>
      </form>
    </div>
  );
}
