'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore, useCardConfigStore, useLangStore } from '@/lib/stores';
import { PREDEFINED_CARDS } from '@/lib/predefinedCards';
import { getAllEntries, clearAllData } from '@/lib/db';
import { exportEntriesToExcel } from '@/lib/export';
import { t } from '@/src/i18n/strings';

export default function SettingsPage() {
  const router = useRouter();
  const { profile, clearProfile } = useProfileStore();
  const { cardConfig, clearCardConfig } = useCardConfigStore();
  const { lang, loadLang, setLang: setAppLang } = useLangStore();
  const [entryCount, setEntryCount] = useState(0);

  useEffect(() => { loadLang(); }, [loadLang]);

  useEffect(() => {
    getAllEntries().then(all => setEntryCount(all.filter(e => e.status === 'saved').length));
  }, []);

  const handleExportAll = async () => {
    const entries = await getAllEntries();
    const saved = entries.filter(e => e.status === 'saved');
    if (saved.length === 0) {
      alert(t('noSavedExport', lang));
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
    if (!window.confirm(t('deleteConfirm', lang))) return;
    await clearAllData();
    router.push('/profile');
  };

  const handleLangChange = async (newLang) => {
    await setAppLang(newLang);
  };

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-primary/60" dir="auto">{t('noProfileFound', lang)}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary" dir="auto">{t('settingsTitle', lang)}</h1>
        <button type="button" onClick={() => router.push('/')} className="min-h-[44px] min-w-[44px] text-sm font-medium text-primary hover:underline" dir="auto">
          {t('home', lang)}
        </button>
      </div>

      <div className="mb-6 rounded-xl border border-primary/10 bg-white p-4">
        <p className="text-sm text-primary-dark" dir="auto">
          <span className="font-semibold">{profile.name}</span> — {profile.unit}
        </p>
        <p className="text-xs text-primary/40" dir="auto">{t('season', lang)}: {profile.season}</p>
        <p className="text-xs text-primary/40" dir="auto">{t('entries', lang)}: {entryCount}</p>
      </div>

      <div className="mb-6 rounded-xl border border-primary/10 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-primary-dark" dir="auto">{t('language', lang)}</h2>
        <div className="flex gap-2">
          {['en', 'fr', 'ar'].map(code => (
            <button
              key={code}
              type="button"
              onClick={() => handleLangChange(code)}
              className={`min-h-[44px] min-w-[44px] flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                lang === code ? 'bg-primary text-white' : 'bg-surface-alt text-primary border border-primary/20'
              }`}
            >
              {code === 'en' ? 'EN' : code === 'fr' ? 'FR' : 'AR'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleExportAll}
          className="min-h-[44px] w-full rounded-xl bg-primary py-4 text-base font-semibold text-white shadow-md active:scale-95"
          dir="auto"
        >
          {t('exportAllExcel', lang)}
        </button>

        <button
          type="button"
          onClick={handleResetCards}
          className="min-h-[44px] w-full rounded-xl border border-primary/20 bg-white py-4 text-base font-semibold text-primary shadow-sm active:scale-95"
          dir="auto"
        >
          {t('resetCardLayout', lang)}
        </button>

        <button
          type="button"
          onClick={handleResetProfile}
          className="min-h-[44px] w-full rounded-xl border border-primary/20 bg-white py-4 text-base font-semibold text-primary shadow-sm active:scale-95"
          dir="auto"
        >
          {t('resetProfile', lang)}
        </button>

        <button
          type="button"
          onClick={handleClearAll}
          className="min-h-[44px] w-full rounded-xl border border-red-200 bg-white py-4 text-base font-semibold text-red-500 shadow-sm active:scale-95"
          dir="auto"
        >
          {t('deleteAllData', lang)}
        </button>
      </div>
    </div>
  );
}
