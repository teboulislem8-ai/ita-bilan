'use client';

import { create } from 'zustand';
import { getProfile, saveProfile, getCardConfig, saveCardConfig, getLang, setLang } from './db';

export const useProfileStore = create((set) => ({
  profile: null,
  loading: true,
  loadProfile: async () => {
    const p = await getProfile();
    set({ profile: p, loading: false });
  },
  setProfile: async (profile) => {
    await saveProfile(profile);
    set({ profile });
  },
  clearProfile: async () => {
    const { deleteProfile } = await import('./db');
    await deleteProfile();
    set({ profile: null });
  },
}));

export const useCardConfigStore = create((set) => ({
  cardConfig: null,
  loading: true,
  loadCardConfig: async () => {
    const c = await getCardConfig();
    set({ cardConfig: c, loading: false });
  },
  setCardConfig: async (config) => {
    await saveCardConfig(config);
    set({ cardConfig: config });
  },
  clearCardConfig: async () => {
    const { deleteCardConfig } = await import('./db');
    await deleteCardConfig();
    set({ cardConfig: null });
  },
}));

export const useFormStore = create((set) => ({
  fields: {},
  currentEntryId: null,
  draftRestored: false,
  setField: (cardId, value) => set((s) => ({
    fields: { ...s.fields, [cardId]: value },
  })),
  setCustomField: (value) => set((s) => ({
    fields: { ...s.fields, _custom: value },
  })),
  resetForm: () => set({ fields: {}, currentEntryId: null, draftRestored: false }),
  loadDraft: (entry) => set({
    fields: entry?.fields || {},
    currentEntryId: entry?.id || null,
    draftRestored: true,
  }),
}));

export const useLangStore = create((set) => ({
  lang: 'en',
  loaded: false,
  loadLang: async () => {
    const saved = await getLang();
    const lang = saved || 'en';
    set({ lang, loaded: true });
  },
  setLang: async (lang) => {
    await setLang(lang);
    set({ lang });
  },
}));
