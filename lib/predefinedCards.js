export const PREDEFINED_CARDS = [
  { id: 'card_id', label: 'ID', fieldType: 'text', ministryColumn: 'ID' },
  { id: 'card_nom', label: 'Nom', fieldType: 'text', ministryColumn: 'Nom' },
  { id: 'card_prenom', label: 'Prénom', fieldType: 'text', ministryColumn: 'Prénom' },
  { id: 'card_date_naiss', label: 'Date de naissance', fieldType: 'date', ministryColumn: 'Date_Naissance' },
  { id: 'card_lieu_naiss', label: 'Lieu de naissance', fieldType: 'text', ministryColumn: 'Lieu_Naissance' },
  { id: 'card_sexe', label: 'Sexe', fieldType: 'chips', ministryColumn: 'Sexe', choices: ['M', 'F'] },
  { id: 'card_nationalite', label: 'Nationalité', fieldType: 'text', ministryColumn: 'Nationalité' },
  { id: 'card_profession', label: 'Profession', fieldType: 'text', ministryColumn: 'Profession' },
  { id: 'card_adresse', label: 'Adresse', fieldType: 'text', ministryColumn: 'Adresse' },
  { id: 'card_telephone', label: 'Téléphone', fieldType: 'number', ministryColumn: 'Téléphone' },
  { id: 'card_email', label: 'Email', fieldType: 'text', ministryColumn: 'Email' },
  { id: 'card_note', label: 'Note', fieldType: 'text', ministryColumn: 'Note' },
  { id: 'card_quantite', label: 'Quantité', fieldType: 'number', ministryColumn: 'Quantité' },
  { id: 'card_prix', label: 'Prix', fieldType: 'number', ministryColumn: 'Prix' },
  { id: 'card_date', label: 'Date', fieldType: 'date', ministryColumn: 'Date' },
  { id: 'card_statut', label: 'Statut', fieldType: 'chips', ministryColumn: 'Statut', choices: ['En cours', 'Validé', 'Rejeté', 'En attente'] },
  { id: 'card_observations', label: 'Observations', fieldType: 'text', ministryColumn: 'Observations' },
];

export const DEFAULT_ACTIVE_CARDS = [
  'card_id', 'card_nom', 'card_prenom', 'card_date_naiss',
  'card_lieu_naiss', 'card_sexe', 'card_nationalite',
  'card_adresse', 'card_telephone', 'card_date', 'card_statut',
];

export const MINISTRY_COLUMNS_FIXED = [
  'ID', 'Nom', 'Prénom', 'Date_Naissance', 'Lieu_Naissance',
  'Sexe', 'Nationalité', 'Profession', 'Adresse', 'Téléphone',
  'Email', 'Note', 'Quantité', 'Prix', 'Date', 'Statut', 'Observations',
];
