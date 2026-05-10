'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore, useCardConfigStore, useFormStore } from '@/lib/stores';
import { PREDEFINED_CARDS } from '@/lib/predefinedCards';
import { saveEntry, getEntry } from '@/lib/db';
import CardRenderer from '@/components/CardRenderer';
import useAutoSave from '@/hooks/useAutoSave';

export default function FormPage() {
  const router = useRouter();
  const { profile } = useProfileStore();
  const { cardConfig } = useCardConfigStore();
  const { fields, currentEntryId, setField, setCustomField, resetForm, loadDraft } = useFormStore();
  const [customValue, setCustomValue] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!profile) router.push('/profile');
    else if (!cardConfig) router.push('/card-setup');
  }, [profile, cardConfig, router]);

  useEffect(() => {
    if (cardConfig && currentEntryId) {
      getEntry(currentEntryId).then(entry => {
        if (entry) setCustomValue(entry.customField ?? null);
      });
    }
  }, [cardConfig, currentEntryId]);

  useAutoSave(fields, customValue, profile, currentEntryId);

  const activeCardIds = cardConfig?.activeCards || [];
  const activeCards = activeCardIds
    .map(id => PREDEFINED_CARDS.find(c => c.id === id))
    .filter(Boolean);
  const hasCustom = cardConfig?.customCard != null;

  const handleFieldChange = (cardId, value) => {
    setField(cardId, value);
  };

  const handleCustomChange = (value) => {
    setCustomValue(value);
    setCustomField(value);
  };

  const handleSave = async () => {
    if (!profile) return;
    const entry = {
      id: currentEntryId || crypto.randomUUID(),
      agentId: profile.id,
      createdAt: new Date().toISOString(),
      status: 'saved',
      fields: { ...fields },
      customField: hasCustom ? customValue : null,
    };
    await saveEntry(entry);
    resetForm();
    setCustomValue(null);
    setSaved(true);
    setTimeout(() => router.push('/'), 1500);
  };

  if (saved) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl text-white">
            ✓
          </div>
          <p className="text-lg font-semibold text-primary">Entry Saved!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-primary">New Entry</h1>

      <div className="flex flex-col gap-4">
        {activeCards.map(card => (
          <CardRenderer
            key={card.id}
            card={card}
            value={fields[card.id]}
            onChange={(val) => handleFieldChange(card.id, val)}
          />
        ))}

        {hasCustom && cardConfig.customCard && (
          <CardRenderer
            card={{
              id: '_custom',
              label: cardConfig.customCard.label,
              fieldType: cardConfig.customCard.fieldType,
              choices: cardConfig.customCard.choices,
            }}
            value={customValue}
            onChange={handleCustomChange}
          />
        )}
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="mt-8 w-full rounded-xl bg-accent py-4 text-lg font-bold text-white shadow-lg active:scale-95"
      >
        Save Entry
      </button>
    </div>
  );
}
