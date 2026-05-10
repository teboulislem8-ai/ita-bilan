'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProfileStore, useCardConfigStore } from '@/lib/stores';
import { PREDEFINED_CARDS } from '@/lib/predefinedCards';
import { getAllEntries, getEntry, deleteEntry } from '@/lib/db';
import { exportSingleEntry } from '@/lib/export';

export default function HistoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { profile } = useProfileStore();
  const { cardConfig } = useCardConfigStore();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailEntry, setDetailEntry] = useState(null);

  const selectedId = searchParams.get('id');

  useEffect(() => {
    if (profile) {
      getAllEntries().then(all => {
        setEntries(all.filter(e => e.status === 'saved').reverse());
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    if (selectedId) {
      getEntry(selectedId).then(setDetailEntry);
    } else {
      setDetailEntry(null);
    }
  }, [selectedId]);

  const handleBack = useCallback(() => {
    router.push('/history');
  }, [router]);

  const handleDelete = async (id) => {
    await deleteEntry(id);
    if (detailEntry && detailEntry.id === id) {
      setDetailEntry(null);
      router.push('/history');
    }
    getAllEntries().then(all => setEntries(all.filter(e => e.status === 'saved').reverse()));
  };

  const handleExport = () => {
    if (!detailEntry || !profile || !cardConfig) return;
    exportSingleEntry(detailEntry, profile, cardConfig, PREDEFINED_CARDS);
  };

  if (!profile) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-primary/60">Please set up your profile first.</p></div>;
  }

  if (detailEntry) {
    const activeCardIds = cardConfig?.activeCards || [];
    const activeCards = activeCardIds
      .map(id => PREDEFINED_CARDS.find(c => c.id === id))
      .filter(Boolean);

    return (
      <div className="mx-auto min-h-screen max-w-lg px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Entry Detail</h1>
          <button type="button" onClick={handleBack} className="text-sm font-medium text-primary hover:underline">Back</button>
        </div>

        <div className="mb-4 text-xs text-primary/40">
          Created: {new Date(detailEntry.createdAt).toLocaleString()}
        </div>

        <div className="flex flex-col gap-3">
          {activeCards.map(card => (
            <div key={card.id} className="rounded-xl border border-primary/10 bg-white p-4">
              <span className="text-xs font-semibold text-primary/60">{card.label}</span>
              <p className="mt-1 text-base text-primary-dark">
                {detailEntry.fields?.[card.id] != null
                  ? (Array.isArray(detailEntry.fields[card.id]) ? detailEntry.fields[card.id].join(', ') : String(detailEntry.fields[card.id]))
                  : '—'}
              </p>
            </div>
          ))}

          {cardConfig?.customCard && detailEntry.customField != null && (
            <div className="rounded-xl border border-primary/10 bg-white p-4">
              <span className="text-xs font-semibold text-primary/60">{cardConfig.customCard.label}</span>
              <p className="mt-1 text-base text-primary-dark">
                {Array.isArray(detailEntry.customField) ? detailEntry.customField.join(', ') : String(detailEntry.customField)}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-3">
          <button type="button" onClick={handleExport}
            className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-md active:scale-95">
            Export to Excel
          </button>
          <button type="button" onClick={() => handleDelete(detailEntry.id)}
            className="rounded-xl border border-red-300 bg-white px-6 py-3 text-sm font-semibold text-red-500 active:scale-95">
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">History</h1>
        <Link href="/" className="text-sm font-medium text-primary hover:underline">Home</Link>
      </div>

      {loading && <p className="text-center text-primary/60">Loading...</p>}

      {!loading && entries.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-primary/60">No saved entries yet.</p>
          <Link href="/form" className="mt-4 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white">
            Create First Entry
          </Link>
        </div>
      )}

      {!loading && entries.length > 0 && (
        <div className="flex flex-col gap-3">
          {entries.map(entry => (
            <button
              key={entry.id}
              type="button"
              onClick={() => router.push(`/history?id=${entry.id}`)}
              className="flex items-center justify-between rounded-xl border border-primary/10 bg-white p-4 text-left shadow-sm active:scale-[0.98]"
            >
              <div>
                <p className="text-sm font-medium text-primary-dark">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-primary/40">
                  {Object.keys(entry.fields).length} fields
                </p>
              </div>
              <span className="text-primary/40">{'→'}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
