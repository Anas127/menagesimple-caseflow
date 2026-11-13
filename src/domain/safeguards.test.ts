import { describe, expect, it } from 'vitest';
import {
  approveDraft,
  changeStatus,
  decodeCases,
  newCase,
  outstandingCriticalInfo,
  saveDraft,
} from './cases';
import { triage } from './triage';
import { seedCases } from '../data/syntheticCases';
const ready = () => {
  const c = newCase('Le vase est cassé après le ménage.');
  return approveDraft({ ...c, reviewedAt: c.createdAt });
};
describe('clôture motivée avec informations critiques manquantes', () => {
  it('refuse une clôture silencieuse même après revue et approbation', () => {
    expect(() => changeStatus(ready(), 'Résolu')).toThrow('informations critiques');
    expect(() => changeStatus(ready(), 'Résolu', undefined, 'court')).toThrow('10 caractères');
  });
  it('enregistre le motif et les informations restantes dans l’historique', () => {
    const c = ready();
    const note = 'Le client retire sa demande après clarification.';
    const resolved = changeStatus(c, 'Résolu', undefined, note);
    expect(resolved.resolutionNote).toBe(note);
    expect(resolved.status).toBe('Résolu');
    expect(resolved.activity.at(-1)?.text).toContain(note);
    expect(resolved.activity.at(-1)?.text).toContain('Photos du dommage');
    expect(resolved.approvedAt).toBe(c.approvedAt);
    expect(resolved.draft).toBe(c.draft);
    expect(decodeCases(JSON.stringify([resolved]))).toEqual([resolved]);
  });
  it('n’autorise pas le motif à contourner revue ou approbation', () => {
    expect(() =>
      changeStatus(
        newCase('Un vase est cassé.'),
        'Résolu',
        undefined,
        'Demande retirée par le client.',
      ),
    ).toThrow('Confirmez la revue');
  });
  it('permet de compléter les éléments critiques sans imposer de motif', () => {
    const c = ready();
    const complete = { ...c, completedInfo: outstandingCriticalInfo(c) };
    expect(changeStatus(complete, 'Résolu').resolutionNote).toBeUndefined();
  });
  it('conserve les anciens dossiers résolus sans nouveau champ', () => {
    expect(decodeCases(JSON.stringify(seedCases()))).toEqual(seedCases());
  });
  it('une réouverture remet la revue à faire mais conserve le motif dans l’historique', () => {
    const c = changeStatus(ready(), 'Résolu', undefined, 'Demande retirée après clarification.');
    const reopened = changeStatus(c, 'En cours');
    expect(reopened.resolutionNote).toBeUndefined();
    expect(reopened.reviewedAt).toBeUndefined();
    expect(reopened.activity.some((a) => a.text.includes('Demande retirée'))).toBe(true);
  });
  it('l’édition après approbation exige une nouvelle approbation, conservée après sauvegarde', () => {
    const c = ready();
    const edited = saveDraft(c, 'Réponse adaptée à relire.');
    expect(edited.approvedAt).toBeUndefined();
    expect(() =>
      changeStatus(edited, 'Résolu', undefined, 'Demande retirée après clarification.'),
    ).toThrow('approuvez');
    const approved = approveDraft(edited);
    expect(decodeCases(JSON.stringify([approved]))![0].approvedAt).toBe(approved.approvedAt);
    expect(approved.activity.filter((a) => a.text.includes('Brouillon approuvé'))).toHaveLength(2);
  });
  it('refuse un motif stocké d’un type inattendu sans modifier les données valides', () => {
    expect(decodeCases(JSON.stringify([{ ...seedCases()[0], resolutionNote: 12 }]))).toBeNull();
  });
});
describe('repli prudent sur formulations négatives ou contradictoires', () => {
  it.each([
    'Le vase est cassé. Le vase n’est pas cassé.',
    'Aucun dommage n’est signalé.',
    'Je ne souhaite pas annuler le ménage.',
    'Le sol n’est pas sale.',
  ])('demande clarification plutôt que conclure : %s', (message) => {
    const c = newCase(message);
    const t = triage(c);
    expect(t.category).toBe('À vérifier');
    expect(t.escalation).toBe(true);
    expect(c.title).toBe('Question client à clarifier');
    expect(t.explanation).toContain('clarifier');
  });
  it('conserve un signal de dommage contradictoire pour examen humain prudent', () => {
    const t = triage(newCase('Le vase est cassé. Le vase n’est pas cassé.'));
    expect(t.secondaryCategories).toContain('Dommage matériel');
    expect(t.actions.some((a) => a.category === 'Dommage matériel')).toBe(true);
  });
  it('ne confond pas une tâche non effectuée avec une négation de plainte', () => {
    expect(triage(newCase('Le sol de la cuisine n’a pas été nettoyé.')).category).toBe(
      'Qualité du ménage',
    );
    expect(triage(newCase('Le sol de la cuisine est pas nettoyé.')).category).toBe(
      'Qualité du ménage',
    );
  });
});
