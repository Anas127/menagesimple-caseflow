import { describe, expect, it } from 'vitest';
import { triage } from './triage';
import {
  caseCategories,
  decodeCases,
  humanReviewReasons,
  metrics,
  newCase,
  overrideCategory,
  requiresHumanReview,
  changeStatus,
  approveDraft,
} from './cases';
import { seedCases } from '../data/syntheticCases';
const mixed =
  'Le ménage était mal fait, les vitres sont sales et un vase a été cassé. Je souhaite un nouveau passage et une compensation.';
describe('régressions QA multi-sujets', () => {
  it('conserve qualité, dommage, preuves et actions dans le cas exact du brief', () => {
    const c = newCase(mixed);
    const t = triage(c);
    expect(t.category).toBe('Dommage matériel');
    expect(t.secondaryCategories).toEqual(['Qualité du ménage']);
    expect(t.urgency).toBe('Prioritaire');
    expect(t.escalation).toBe(true);
    expect(t.actions.map((a) => a.category)).toEqual(['Dommage matériel', 'Qualité du ménage']);
    expect(t.nextStep).toContain('photos');
    expect(t.nextStep).toContain('passage correctif');
    expect(t.explanation).toContain('mal fait');
    expect(t.explanation).toContain('casse');
    expect(t.missing).toContain('Photos du dommage à recueillir');
    expect(c.draft).toContain('responsable');
    expect(c.draft).toContain('passage correctif');
    expect(t.reviewReasons).toContain('Décision financière ou de couverture réservée à l’équipe');
    expect(c.draft).not.toMatch(
      /compensation (approuvée|garantie)|couverture (approuvée|garantie)|vous serez rembours|prise? en charge/i,
    );
  });
  it('conserve les quatre sujets dans un ordre indépendant de leur position dans le texte', () => {
    const message =
      'Le ménage est mal fait. Je veux un remplacement et modifier le prochain passage. Un vase est cassé.';
    const c = newCase(message);
    const t = triage(c);
    expect([t.category, ...t.secondaryCategories]).toEqual([
      'Dommage matériel',
      'Annulation / modification',
      'Remplacement',
      'Qualité du ménage',
    ]);
    expect(
      triage({ ...c, message: message.split('. ').reverse().join('. ') }).secondaryCategories,
    ).toEqual(t.secondaryCategories);
    expect(t.actions).toHaveLength(4);
    expect(t.references).toContain('terms');
    expect(t.signals.join()).toContain('48 h');
    expect(t.missing).toContain('Pièces et points à reprendre');
    expect(t.missing).toContain('Disponibilités souhaitées à confirmer');
    expect(caseCategories(c)).toContain('Qualité du ménage');
  });
  it('un sujet unique ne génère ni secondaire ni action dupliquée', () => {
    const t = triage(newCase('Les vitres sont sales et le ménage était mal fait.'));
    expect(t.category).toBe('Qualité du ménage');
    expect(t.secondaryCategories).toEqual([]);
    expect(t.actions).toHaveLength(1);
  });
  it.each([
    [mixed, 'Vase endommagé et ménage insatisfaisant'],
    ['Je souhaite annuler la réservation.', 'Demande d’annulation de réservation'],
    ['Merci de modifier mon prochain passage.', 'Demande de modification de réservation'],
    ['Le ménage était mal fait.', 'Réclamation sur la qualité du ménage'],
    ['Pouvez-vous me rappeler ?', 'Question client à clarifier'],
    ['La lampe est cassée.', 'Lampe endommagée'],
    [
      'Un dommage est signalé dans le salon avec un vase à proximité.',
      'Signalement de dommage matériel',
    ],
  ])('produit un titre descriptif et conserve le message : %s', (message, title) => {
    const c = newCase(message);
    expect(c.title).toBe(title);
    expect(c.message).toBe(message);
    expect(c.title.length).toBeLessThan(100);
  });
  it('la catégorie corrigée ne supprime pas le dommage détecté du filtre', () => {
    expect(
      caseCategories(
        overrideCategory(newCase(mixed), 'Qualité du ménage', 'Lecture complémentaire'),
      ),
    ).toContain('Dommage matériel');
  });
});
describe('revue spécifique calculée', () => {
  it('exclut les dossiers courants et inclut dommage, ambiguïté, contrat et remboursement', () => {
    const cases = seedCases();
    expect(cases.filter(requiresHumanReview).map((c) => c.id)).toEqual([
      'CF-1002',
      'CF-1003',
      'CF-1005',
      'CF-1006',
      'CF-1007',
    ]);
    expect(requiresHumanReview(cases[0])).toBe(false);
    expect(requiresHumanReview(cases[3])).toBe(false);
  });
  it('les informations critiques vérifiées cessent de compter sans masquer un dommage', () => {
    const c = newCase('Le sol de la cuisine est sale.');
    expect(metrics([c]).review).toBe(1);
    const complete = { ...c, completedInfo: triage(c).missing };
    expect(metrics([complete]).review).toBe(0);
    const damage = newCase(mixed);
    expect(requiresHumanReview({ ...damage, completedInfo: triage(damage).missing })).toBe(true);
  });
  it('une revue confirmée diminue le compteur et sa révocation le rétablit', () => {
    const c = newCase(mixed);
    expect(metrics([c]).review).toBe(1);
    const reviewed = { ...c, reviewedAt: c.createdAt };
    expect(metrics([reviewed]).review).toBe(0);
    expect(metrics([{ ...reviewed, reviewedAt: undefined }]).review).toBe(1);
    expect(
      metrics([
        changeStatus(
          approveDraft(reviewed),
          'Résolu',
          undefined,
          'Demande retirée après clarification du client.',
        ),
      ]).review,
    ).toBe(0);
  });
  it('changer seulement le statut ouvert ne constitue pas une revue', () => {
    const c = newCase(mixed);
    expect(metrics([changeStatus(c, 'En attente client')]).review).toBe(1);
  });
  it('une correction vers À vérifier crée une raison explicite de revue', () => {
    const c = overrideCategory(seedCases()[0], 'À vérifier', 'Demande à clarifier');
    expect(requiresHumanReview(c)).toBe(true);
    expect(humanReviewReasons(c)).toContain('Catégorie opérateur à vérifier');
  });
  it('les corrections réouvrent la revue des demandes escaladées', () => {
    const c = newCase(mixed);
    expect(
      requiresHumanReview(
        overrideCategory({ ...c, reviewedAt: c.createdAt }, 'Qualité du ménage', 'À confirmer'),
      ),
    ).toBe(true);
  });
});
describe('compatibilité du stockage existant', () => {
  it('recharge les huit anciens dossiers sans nouveau champ et sans modifier leurs données', () => {
    const legacy = seedCases();
    const loaded = decodeCases(JSON.stringify(legacy));
    expect(loaded).toEqual(legacy);
    expect(loaded).toHaveLength(8);
    expect(metrics(loaded!)).toEqual({ total: 8, review: 5, waiting: 2, resolved: 1 });
  });
  it('recalcule les nouveaux sujets sur un ancien message sans écraser titre, brouillon ou historique', () => {
    const legacy = {
      ...seedCases()[0],
      message: mixed,
      title: 'Titre conservé',
      draft: 'Texte validé par un opérateur',
    };
    const loaded = decodeCases(JSON.stringify([legacy]))![0];
    expect(loaded).toEqual(legacy);
    expect(triage(loaded).secondaryCategories).toContain('Qualité du ménage');
  });
  it('persiste un nouveau titre, les contrôles humains et le message via le même schéma JSON', () => {
    const c = newCase(mixed);
    const approved = approveDraft({ ...c, reviewedAt: c.createdAt });
    const loaded = decodeCases(JSON.stringify([approved]))![0];
    expect(loaded).toEqual(approved);
    expect(loaded.title).toBe('Vase endommagé et ménage insatisfaisant');
    expect(triage(loaded).actions).toHaveLength(2);
  });
});
