# FDPS Field Form — PROJECT MAP

## [TECH_STACK]
- **Runtime:** Next.js 16.2.6 (static export) + React 19
- **Styling:** Tailwind CSS v4
- **State:** Zustand 5.x (4 stores: profile, cardConfig, form, lang)
- **Storage:** IndexedDB via idb-keyval 6.x
- **Export:** SheetJS (xlsx) 0.18.x
- **Drag:** @dnd-kit/core 6.x + @dnd-kit/sortable 10.x
- **Font:** Cairo (self-hosted woff2: Latin, LatinExt, Arabic subsets)
- **i18n:** Custom strings file (EN/FR/AR), persisted in IndexedDB
- **Build output:** `out/` (fully static, zero server)
- **PWA:** Custom manifest.json + sw.js (cache-first, includes fonts)

## [SYSTEM_FLOW]
```
[App Launch]
  ↓
IndexedDB → load lang → profile exists?
  ├── No → /profile (name, unit, season) → save → /card-setup
  └── Yes → cardConfig exists?
            ├── No → /card-setup (toggle + drag reorder + custom card) → save → /
            └── Yes → Home (/)
                       ├── New Entry → /form (dynamic cards + auto-save draft + "Draft restored" notice) → Save → /
                       ├── History → /history (list) → click → /history?id=X (detail + export)
                       └── Settings → /settings (lang toggle, reset profile/cards, bulk export, clear all)
```

## [ARCHITECTURE]
```
fdps-field-form/
├── app/                    # Next.js App Router pages
│   ├── layout.js           # Root layout (client component: lang/dir from store, Cairo font)
│   ├── page.js             # Home screen (empty state, trilingual)
│   ├── globals.css         # Tailwind + @font-face Cairo (3 subsets) + #3d5c3a theme + RTL selectors
│   ├── profile/page.js     # Agent profile setup (trilingual)
│   ├── card-setup/page.js  # Card toggle + DnD reorder + custom card builder (trilingual)
│   ├── form/page.js        # Dynamic form + auto-save + draft restore notice + saved state (trilingual)
│   ├── history/
│   │   ├── page.js         # Suspense wrapper
│   │   └── HistoryContent.js  # Entry list + detail view (query param) + empty state (trilingual)
│   └── settings/page.js    # Lang toggle (EN/FR/AR), reset/export/clear (trilingual)
├── components/
│   ├── InputTypes.js       # text, number, date, stepper, chips — all min 44x44px touch targets
│   ├── CardRenderer.js     # Dynamic card → input component mapper (dir="auto" labels)
│   └── NavBar.js           # Top navigation bar (unused, kept for reference)
├── lib/
│   ├── db.js               # idb-keyval wrapper (profile, cardConfig, lang, entries CRUD)
│   ├── stores.js           # Zustand stores (profile, cardConfig, form with draftRestored, lang)
│   ├── predefinedCards.js  # 17 predefined cards + default active set + ministry columns
│   └── export.js           # SheetJS export + MINISTRY_COLUMNS comment block + custom card last
├── src/i18n/
│   └── strings.js          # All UI strings in EN/FR/AR + t() helper
├── hooks/
│   └── useAutoSave.js      # Debounced 500ms auto-save to IndexedDB
├── public/
│   ├── manifest.json       # PWA manifest (standalone, #3d5c3a)
│   ├── sw.js               # Service worker (cache-first, caches pages + fonts + icons)
│   ├── fonts/
│   │   ├── Cairo-Latin.woff2
│   │   ├── Cairo-LatinExt.woff2
│   │   └── Cairo-Arabic.woff2
│   ├── icon-192.svg        # PWA icon
│   └── icon-512.svg        # PWA icon
└── PROJECT_MAP.md
```

## [ORPHANS & PENDING]
- [ ] Ministry Excel template column-by-column validation (requires actual template file from client)
- [ ] Real device Android test (2GB RAM Chrome) — verify no jank, touch targets, RTL rendering
- [ ] PWA install prompt custom UI (browser default works but custom UI is planned)

## PHASE 2 COMPLETION STATUS
| Task | Status | Notes |
|------|--------|-------|
| TASK 1 — Cairo font self-hosted | ✅ | 3 woff2 subsets (Latin, LatinExt, Arabic), zero network, @font-face in globals.css |
| TASK 2 — RTL layout | ✅ | dir="auto" on text containers, [dir="rtl"] CSS selectors for flex/text/margin flips |
| TASK 3 — i18n strings | ✅ | strings.js with EN/FR/AR, lang toggle in Settings, persisted in IndexedDB key "fdps_lang" |
| TASK 4 — Touch audit | ✅ | All interactive elements min 44x44px (buttons, inputs, chips, drag handles, toggles) |
| TASK 5 — Empty/draft/saved states | ✅ | Home empty state, Form draft-restored notice (2s auto-dismiss), History empty state |
| TASK 6 — Export comment block | ✅ | MINISTRY_COLUMNS marker + warning in export.js; custom card always last column |
| TASK 7 — PWA offline cache | ✅ | sw.js caches all pages + fonts/Cairo-*.woff2 + manifest + icons |

## DECISIONS MADE (not explicit in prompt)
1. **Font subset strategy**: Downloaded 3 separate subset woff2 files (Latin, LatinExt, Arabic) rather than a single variable font, because Google Fonts API serves subsetted files by unicode range. This is actually better for PWA — smaller individual files.
2. **Language load timing**: Layout reads language from IndexedDB in useEffect, meaning there's a brief flash of default LTR/EN before the persisted language takes effect. This is acceptable for a PWA; the alternative (blocking render on IndexedDB read) would delay first paint.
3. **NavBar component**: Created in Phase 1 but never imported into any page. Left untouched per "do not touch working logic" rule.
4. **Draft detection strategy**: On form load, iterates saved entries in reverse to find the latest draft for this agent. This avoids requiring a separate "current draft" index.

## BLOCKERS REQUIRING CLIENT INPUT
- **Ministry Excel template**: The column structure in `MINISTRY_COLUMNS_FIXED` (predefinedCards.js:44) is a best-guess based on typical ministry form fields. The client must supply the actual .xlsx template before delivery for column-by-column validation.
