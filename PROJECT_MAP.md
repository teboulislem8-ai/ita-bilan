# FDPS Field Form — PROJECT MAP

## [TECH_STACK]
- **Runtime:** Next.js 16.2.6 (static export) + React 19
- **Styling:** Tailwind CSS v4
- **State:** Zustand 5.x (3 stores: profile, cardConfig, form)
- **Storage:** IndexedDB via idb-keyval 6.x
- **Export:** SheetJS (xlsx) 0.18.x
- **Drag:** @dnd-kit/core 6.x + @dnd-kit/sortable 10.x
- **Build output:** `out/` (fully static, zero server)
- **PWA:** Custom manifest.json + sw.js (cache-first)

## [SYSTEM_FLOW]
```
[App Launch]
  ↓
IndexedDB → profile exists?
  ├── No → /profile (name, unit, season) → save → /card-setup
  └── Yes → cardConfig exists?
            ├── No → /card-setup (toggle + drag reorder + custom card) → save → /
            └── Yes → Home (/)
                       ├── New Entry → /form (dynamic cards + auto-save draft) → Save → /
                       ├── History → /history (list) → click → /history?id=X (detail + export)
                       └── Settings → /settings (reset profile/cards, bulk export, clear all)
```

## [ARCHITECTURE]
```
fdps-field-form/
├── app/                    # Next.js App Router pages
│   ├── layout.js           # Root layout (Cairo font, viewport, manifest)
│   ├── page.js             # Home screen
│   ├── globals.css         # Tailwind + custom theme (#3d5c3a)
│   ├── profile/page.js     # Agent profile setup
│   ├── card-setup/page.js  # Card toggle + DnD reorder + custom card builder
│   ├── form/page.js        # Dynamic form renderer + auto-save + save entry
│   ├── history/
│   │   ├── page.js         # Suspense wrapper
│   │   └── HistoryContent.js  # Entry list + detail view (query param driven)
│   └── settings/page.js    # Reset/export actions
├── components/
│   ├── InputTypes.js       # text, number, date, stepper, chips
│   ├── CardRenderer.js     # Dynamic card → input component mapper
│   └── NavBar.js           # Top navigation bar
├── lib/
│   ├── db.js               # idb-keyval typed wrapper (profile, cardConfig, entries)
│   ├── stores.js           # Zustand stores (profile, cardConfig, form, navigation)
│   ├── predefinedCards.js  # 17 predefined cards + default active set + ministry columns
│   └── export.js           # SheetJS Excel export (single + bulk)
├── hooks/
│   └── useAutoSave.js      # Debounced 500ms auto-save to IndexedDB
├── public/
│   ├── manifest.json       # PWA manifest (standalone, #3d5c3a)
│   ├── sw.js               # Service worker (cache-first)
│   ├── icon-192.svg        # PWA icon
│   └── icon-512.svg        # PWA icon
└── PROJECT_MAP.md
```

## [ORPHANS & PENDING]
- [ ] Self-host Cairo font (currently using system font fallback)
- [ ] Real device Android test (2GB RAM Chrome)
- [ ] Ministry Excel template column-by-column validation (requires template)
- [ ] PWA install prompt custom UI
- [ ] RTL language support (Arabic) — layout currently LTR only
- [ ] French locale labels — hardcoded FR for predefined cards, AR/EN missing
- [ ] Empty/draft/saved state visual polish
- [ ] Touch target audit (≥44px)
