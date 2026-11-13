import { describe, expect, it } from 'vitest';
import { triage } from './triage';
import { createDraft } from './recommendations';
import { categories } from './types';
const input = (message: string) => ({
  message,
  bookingRef: 'DEMO-123',
  serviceAt: '2026-11-13T09:00:00+01:00',
  createdAt: '2026-11-12T09:00:00+01:00',
});
describe('triage explicable et prudent', () => {
  it('classe une plainte qualité avec explication et examen du passage correctif', () => {
    const t = triage(input('Le sol de la cuisine est sale après le ménage.'));
    expect(t.category).toBe('Qualité du ménage');
    expect(t.explanation).toContain('sale');
    expect(t.nextStep).toContain('possibilité');
    expect(t.missing).toEqual([]);
  });
  it('escalade un dommage, y compris avec une intention d’annulation', () => {
    const t = triage(input('Le vase est cassé et je souhaite annuler le prochain passage.'));
    expect(t.category).toBe('Dommage matériel');
    expect(t.escalation).toBe(true);
    expect(t.urgency).toBe('Prioritaire');
    expect(t.nextStep).toContain('responsable');
    expect(t.missing).toContain('Photos du dommage à recueillir');
  });
  it('détecte la référence et la date absentes', () => {
    const t = triage({ ...input('Le ménage est insatisfaisant.'), bookingRef: '', serviceAt: '' });
    expect(t.missing).toEqual([
      'Référence de réservation',
      'Date et heure de la prestation',
      'Pièces et points à reprendre',
    ]);
    expect(t.escalation).toBe(true);
  });
  it('ne force pas la classification d’un message ambigu', () => {
    const t = triage(input('Ce n’est pas ce que nous avions convenu.'));
    expect(t.category).toBe('À vérifier');
    expect(t.escalation).toBe(true);
    expect(t.explanation).toContain('incertaine');
  });
  it('laisse les intentions multiples à la vérification humaine', () => {
    expect(triage(input('Le sol est sale et je souhaite annuler.')).category).toBe('À vérifier');
  });
  it('signale le préavis sous 48 h sans décider de frais', () => {
    const t = triage(input('Je dois annuler le passage.'));
    expect(t.category).toBe('Annulation / modification');
    expect(t.signals.join()).toContain('24 h');
    expect(t.signals.join()).toContain('inférieur à 48 h');
    expect(t.escalation).toBe(true);
    expect(t.references).toContain('terms');
    expect(t.nextStep).toContain('opérateur');
  });
  it('traite exactement 48 h comme un repère à vérifier', () => {
    const t = triage({
      ...input('Je souhaite modifier mon passage.'),
      serviceAt: '2026-11-14T09:00:00+01:00',
    });
    expect(t.signals[0]).toContain('au moins 48 h');
    expect(t.escalation).toBe(true);
  });
  it('ne calcule pas de frais sur une prestation passée ou sans date', () => {
    const t = triage({ ...input('Annuler le ménage.'), serviceAt: '2026-11-10T09:00:00+01:00' });
    expect(t.signals[0]).toContain('non déterminable');
  });
  it.each(['', '🧹 ???', 'Je cherche une facture', 'Bonjour bonsoir 123'])(
    'gère une saisie inconnue : %s',
    (message) => {
      const t = triage(input(message));
      expect(t.category).toBe('À vérifier');
      expect(t.missing.length).toBeGreaterThan(0);
    },
  );
  it('classe un remplacement avec les disponibilités à confirmer', () => {
    const t = triage(input('Mon intervenante est absente, je souhaite un remplacement.'));
    expect(t.category).toBe('Remplacement');
    expect(t.missing).toContain('Disponibilités souhaitées à confirmer');
  });
  it('ne confond pas l’absence du client et un besoin de remplacement', () => {
    expect(triage(input('Je dois annuler car je serai absente.')).category).toBe(
      'Annulation / modification',
    );
  });
  it('escalade une demande de remboursement sans l’approuver', () => {
    const t = triage(input('Le sol est sale, je veux un remboursement.'));
    expect(t.escalation).toBe(true);
    expect(t.signals.join()).toContain('réservée à l’équipe');
  });
  it.each(categories)('ne promet aucun résultat contractuel ou financier : %s', (category) => {
    const draft = createDraft({ name: 'Camille D.' }, category, []);
    expect(draft).not.toMatch(
      /remboursement (approuvé|garanti)|vous serez rembours|pris en charge|couverture garantie|gratuit|CHF|confirmons (votre|le) remplacement/i,
    );
  });
});
