import { describe, expect, it } from 'vitest';
import {
  approveDraft,
  changeStatus,
  decodeCases,
  isDuplicate,
  metrics,
  newCase,
  overrideCategory,
  saveDraft,
} from './cases';
import { seedCases } from '../data/syntheticCases';
describe('cycle de vie et sauvegarde de démonstration', () => {
  it('initialise exactement huit dossiers distincts et leurs indicateurs', () => {
    const cases = seedCases();
    expect(cases).toHaveLength(8);
    expect(new Set(cases.map((c) => c.id)).size).toBe(8);
    expect(metrics(cases)).toEqual({ total: 8, review: 5, waiting: 2, resolved: 1 });
  });
  it('permet les statuts ouverts sans approuver implicitement une réponse', () => {
    const c = changeStatus(seedCases()[0], 'En cours');
    expect(c.status).toBe('En cours');
    expect(c.approvedAt).toBeUndefined();
    expect(c.activity.at(-1)?.text).toContain('Nouveau → En cours');
    expect(changeStatus(c, 'En cours')).toBe(c);
    expect(changeStatus(c, 'En attente client').status).toBe('En attente client');
  });
  it('exige revue et approbation avant résolution puis actualise les indicateurs', () => {
    const cases = seedCases();
    const c = cases[0];
    expect(() => changeStatus(c, 'Résolu')).toThrow();
    expect(() => approveDraft(c)).toThrow();
    const reviewed = { ...c, reviewedAt: '2026-11-12T11:00:00Z' };
    expect(() => changeStatus(reviewed, 'Résolu')).toThrow();
    const resolved = changeStatus(approveDraft(reviewed), 'Résolu');
    expect(resolved.status).toBe('Résolu');
    expect(metrics([resolved, ...cases.slice(1)])).toEqual({
      total: 8,
      review: 5,
      waiting: 2,
      resolved: 2,
    });
  });
  it('invalide l’approbation après édition du brouillon', () => {
    const c = approveDraft({ ...seedCases()[0], reviewedAt: '2026-11-12T11:00:00Z' });
    const edited = saveDraft(c, 'Nouveau texte à relire');
    expect(edited.approvedAt).toBeUndefined();
    expect(() => changeStatus(edited, 'Résolu')).toThrow();
  });
  it('refuse un brouillon vide', () => {
    expect(() =>
      approveDraft({ ...seedCases()[0], draft: ' ', reviewedAt: '2026-11-12T11:00:00Z' }),
    ).toThrow('vide');
  });
  it('demande une nouvelle revue après réouverture d’un dossier résolu', () => {
    const c = changeStatus(seedCases()[7], 'En cours');
    expect(c.reviewedAt).toBeUndefined();
    expect(c.approvedAt).toBeUndefined();
    expect(() => changeStatus(c, 'Résolu')).toThrow();
  });
  it('regroupe une séquence d’édition dans l’historique', () => {
    const c = seedCases()[0];
    const edited = saveDraft(saveDraft(c, 'Bon'), 'Bonjour');
    expect(edited.activity.length).toBe(c.activity.length + 1);
    expect(edited.draft).toBe('Bonjour');
  });
  it('une correction est motivée, traçable et nécessite une nouvelle revue', () => {
    const c = seedCases()[0];
    expect(() => overrideCategory(c, 'Remplacement', ' ')).toThrow();
    const next = overrideCategory(
      { ...c, reviewedAt: c.createdAt },
      'Remplacement',
      'Clarification reçue du client',
    );
    expect(next.override).toBe('Remplacement');
    expect(next.reviewedAt).toBeUndefined();
    expect(next.activity.at(-1)?.text).toContain('Clarification');
  });
  it('conserve les brouillons et l’historique lors d’un aller-retour JSON', () => {
    const data = seedCases();
    expect(decodeCases(JSON.stringify(data))).toEqual(data);
  });
  it.each([null, '{bad', '{}', '[null]', '[{}]'])('ignore une sauvegarde corrompue : %s', (raw) => {
    expect(decodeCases(raw)).toBeNull();
  });
  it('refuse un statut, une date ou un identifiant dupliqué corrompus', () => {
    const c = seedCases()[0];
    expect(decodeCases(JSON.stringify([{ ...c, status: 'Terminé' }]))).toBeNull();
    expect(decodeCases(JSON.stringify([{ ...c, createdAt: 'oops' }]))).toBeNull();
    expect(decodeCases(JSON.stringify([c, c]))).toBeNull();
  });
  it('crée un dossier de simulation sans déduire de fausse référence', () => {
    const c = newCase('Le miroir est cassé après le ménage.');
    expect(c.channel).toBe('Simulation MarIA');
    expect(c.bookingRef).toBe('');
    expect(c.draft).toContain('évaluation');
    expect(c.status).toBe('Nouveau');
    expect(c.approvedAt).toBeUndefined();
  });
  it('détecte les doublons malgré casse, accents et espaces', () => {
    const c = newCase('Le miroir est cassé.');
    expect(isDuplicate([c], '  LE miroir est CASSE.  ')).toBe(true);
    expect(isDuplicate([c], 'Le sol est sale.')).toBe(false);
  });
});
