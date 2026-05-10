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
    MINISTRY_COLUMNS_FIXED.forEach(col => {
      const card = findCardByColumn(activeCards, col);
      if (card) {
        row[col] = entry.fields?.[card.id] ?? '';
      } else {
        row[col] = '';
      }
    });
    if (hasCustom) {
      const customLabel = cardConfig.customCard.label;
      row[customLabel] = entry.customField ?? '';
    }
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
