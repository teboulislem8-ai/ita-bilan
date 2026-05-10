import { get, set, del, keys } from 'idb-keyval';

const PROFILE_KEY = 'fdps_profile';
const CARD_CONFIG_KEY = 'fdps_cardConfig';
const ENTRIES_PREFIX = 'fdps_entry_';
const ENTRIES_INDEX_KEY = 'fdps_entryIds';

export async function getProfile() {
  return get(PROFILE_KEY);
}

export async function saveProfile(profile) {
  await set(PROFILE_KEY, profile);
}

export async function deleteProfile() {
  await del(PROFILE_KEY);
}

export async function getCardConfig() {
  return get(CARD_CONFIG_KEY);
}

export async function saveCardConfig(config) {
  await set(CARD_CONFIG_KEY, config);
}

export async function deleteCardConfig() {
  await del(CARD_CONFIG_KEY);
}

export async function getEntryIds() {
  return (await get(ENTRIES_INDEX_KEY)) || [];
}

export async function getEntry(id) {
  return get(ENTRIES_PREFIX + id);
}

export async function saveEntry(entry) {
  await set(ENTRIES_PREFIX + entry.id, entry);
  const ids = await getEntryIds();
  if (!ids.includes(entry.id)) {
    ids.push(entry.id);
    await set(ENTRIES_INDEX_KEY, ids);
  }
}

export async function getAllEntries() {
  const ids = await getEntryIds();
  const entries = await Promise.all(ids.map(id => getEntry(id)));
  return entries.filter(Boolean);
}

export async function deleteEntry(id) {
  await del(ENTRIES_PREFIX + id);
  const ids = await getEntryIds();
  await set(ENTRIES_INDEX_KEY, ids.filter(x => x !== id));
}

export async function clearAllData() {
  await Promise.all([
    deleteProfile(),
    deleteCardConfig(),
    del(ENTRIES_INDEX_KEY),
    ...(await keys()).filter(k => k.startsWith(ENTRIES_PREFIX)).map(k => del(k)),
  ]);
}
