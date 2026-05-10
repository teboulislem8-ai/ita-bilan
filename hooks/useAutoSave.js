'use client';

import { useEffect, useRef } from 'react';
import { saveEntry as saveEntryToDb } from '../lib/db';

export default function useAutoSave(fields, customField, profile, currentEntryId) {
  const timerRef = useRef(null);
  const prevRef = useRef('');

  useEffect(() => {
    const serialized = JSON.stringify({ fields, customField });
    if (serialized === prevRef.current) return;
    prevRef.current = serialized;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      if (!profile) return;
      const entry = {
        id: currentEntryId || crypto.randomUUID(),
        agentId: profile.id,
        createdAt: new Date().toISOString(),
        status: 'draft',
        fields,
        customField: customField ?? null,
      };
      await saveEntryToDb(entry);
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [fields, customField, profile, currentEntryId]);
}
