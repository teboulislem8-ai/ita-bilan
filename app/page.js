'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProfileStore, useCardConfigStore, useLangStore } from '@/lib/stores';
import { getEntryIds } from '@/lib/db';
import { t } from '@/src/i18n/strings';

export default function Home() {
  const { profile, loading, loadProfile } = useProfileStore();
  const { cardConfig, loadCardConfig } = useCardConfigStore();
  const { lang, loadLang } = useLangStore();
  const [entryCount, setEntryCount] = useState(0);

  useEffect(() => {
    loadProfile();
    loadCardConfig();
    loadLang();
  }, [loadProfile, loadCardConfig, loadLang]);

  useEffect(() => {
    if (profile) {
      getEntryIds().then(ids => setEntryCount(ids.filter(id => id).length));
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-primary/60">{t('loading', lang)}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">{t('appTitle', lang)}</h1>
          <p className="mt-2 text-sm text-primary/60" dir="auto">{t('appSubtitle', lang)}</p>
        </div>
        <Link
          href="/profile"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg active:scale-95"
        >
          {t('getStarted', lang)}
        </Link>
      </div>
    );
  }

  if (!cardConfig) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">{t('welcome', lang)}, {profile.name}</h1>
          <p className="mt-1 text-sm text-primary/60" dir="auto">{profile.unit} — {profile.season}</p>
        </div>
        <p className="text-primary/60" dir="auto">{t('setUpCardsFirst', lang)}</p>
        <Link
          href="/card-setup"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg active:scale-95"
        >
          {t('configureCards', lang)}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 py-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-primary">{t('appTitle', lang)}</h1>
        <p className="mt-1 text-sm text-primary/60" dir="auto">
          {profile.name} — {profile.unit}
        </p>
        <p className="text-xs text-primary/40" dir="auto">
          {t('season', lang)}: {profile.season} | {t('entries', lang)}: {entryCount}
        </p>
      </div>

      {entryCount === 0 && (
        <div className="mb-4 rounded-xl border border-dashed border-primary/20 bg-surface-alt p-4 text-center">
          <p className="text-sm text-primary/60" dir="auto">{t('noEntriesYet', lang)}</p>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4">
        <Link
          href="/form"
          className="flex min-h-[44px] items-center justify-between rounded-xl bg-primary p-5 text-white shadow-md active:scale-[0.98]"
        >
          <span className="text-lg font-semibold" dir="auto">{t('newEntry', lang)}</span>
          <span className="text-2xl">+</span>
        </Link>

        <Link
          href="/history"
          className="flex min-h-[44px] items-center justify-between rounded-xl border border-primary/20 bg-white p-5 text-primary shadow-sm active:scale-[0.98]"
        >
          <span className="text-lg font-semibold" dir="auto">{t('history', lang)}</span>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm">{entryCount}</span>
        </Link>

        <Link
          href="/settings"
          className="flex min-h-[44px] items-center justify-between rounded-xl border border-primary/20 bg-white p-5 text-primary shadow-sm active:scale-[0.98]"
        >
          <span className="text-lg font-semibold" dir="auto">{t('settings', lang)}</span>
          <span className="text-xl">⚙</span>
        </Link>
      </div>
    </div>
  );
}
