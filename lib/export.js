import * as XLSX from 'xlsx';
import { MINISTRY_COLUMNS_FIXED } from './predefinedCards';

function findCardByColumn(cards, columnName) {
  return cards.find(c => c.ministryColumn === columnName);
}

export function exportEntriesToExcel(entries, profile, cardConfig, predefinedCards) {
  const activeCardIds = cardConfig?.activeCards || [];
  const activeCards = activeCardIds
    .map(id => predefinedCards.find(c => c.id === id))
    .filter(Boolean);
  const hasCustom = cardConfig?.customCard != null;

  const rows = entries.map(entry => {
    const row = {};

    // MINISTRY_COLUMNS — REPLACE WITH CONFIRMED TEMPLATE BEFORE DELIVERY
    // The ministry Excel template column structure is NOT YET CONFIRMED.
    // Currently using MINISTRY_COLUMNS_FIXED from predefinedCards.js.
    // Once the client provides the actual template, update the column names
    // and order in predefinedCards.js MINISTRY_COLUMNS_FIXED array.
    // Do NOT add custom card columns inside this block — they go AFTER.
    MINISTRY_COLUMNS_FIXED.forEach(col => {
      const card = findCardByColumn(activeCards, col);
      if (card) {
        row[col] = entry.fields?.[card.id] ?? '';
      } else {
        row[col] = '';
      }
    });

    // Custom card column — always appended AFTER all ministry columns
    // This ensures the ministry validator is never broken by extra columns mid-table
    if (hasCustom) {
      const customLabel = cardConfig.customCard.label;
      row[customLabel] = entry.customField ?? '';
    }

    // Agent profile columns — appended after ministry + custom columns
    row['Agent'] = profile?.name || '';
    row['Unité'] = profile?.unit || '';
    row['Saison'] = profile?.season || '';
    return row;
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'FDPS');

  const colWidths = MINISTRY_COLUMNS_FIXED.map(h => ({ wch: Math.max(h.length, 12) }));
  if (hasCustom) colWidths.push({ wch: Math.max(cardConfig.customCard.label.length, 12) });
  colWidths.push({ wch: 15 }, { wch: 15 }, { wch: 15 });
  ws['!cols'] = colWidths;

  // Filename format: FDPS_{season}_{name}_{date}.xlsx — locked, do not change
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const safeName = (profile?.name || 'agent').replace(/[^a-zA-Z0-9]/g, '_');
  const season = (profile?.season || 'nosaison').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `FDPS_${season}_${safeName}_${today}.xlsx`;

  XLSX.writeFile(wb, filename);
  return filename;
}

export function exportSingleEntry(entry, profile, cardConfig, predefinedCards) {
  return exportEntriesToExcel([entry], profile, cardConfig, predefinedCards);
}
