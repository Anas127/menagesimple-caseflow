import type { CustomerCase, Triage } from './types';
import { recommendations } from './recommendations';
export const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
const rules = [
  {
    category: 'Dommage matériel',
    pattern:
      /\b(cass[eé]|cassee|casse|brise|endommage|rayure|raye|degat|dommage|fissure|abime)\w*\b/,
  },
  {
    category: 'Qualité du ménage',
    pattern:
      /\b(sale|sales|poussiere|mal nettoye|pas nettoye|non nettoye|insatisfaisant|bacle|traces|qualite|oublie)\w*\b/,
  },
  {
    category: 'Annulation / modification',
    pattern: /\b(annul|decal|report|modifi|deplac|changer la date)\w*/,
  },
  {
    category: 'Remplacement',
    pattern: /\b(remplac|pas venu|pas venue)\w*|\b(intervenante?|aide|personne)\b.{0,30}\babsen\w*/,
  },
] as const;
export function triage(
  c: Pick<CustomerCase, 'message' | 'bookingRef' | 'serviceAt' | 'createdAt'>,
): Triage {
  const text = normalize(c.message);
  const matched = rules.filter((r) => r.pattern.test(text));
  // Safety precedence: a damage signal always reaches a responsible human, even in a mixed request.
  const damage = matched.find((r) => r.category === 'Dommage matériel');
  const category = damage
    ? damage.category
    : matched.length === 1
      ? matched[0].category
      : 'À vérifier';
  const missing: string[] = [];
  if (!c.bookingRef.trim()) missing.push('Référence de réservation');
  if (!c.serviceAt || !Number.isFinite(Date.parse(c.serviceAt)))
    missing.push('Date et heure de la prestation');
  if (category === 'Dommage matériel') {
    missing.push('Photos du dommage à recueillir');
    if (!/\b(vase|vitre|parquet|table|lampe|miroir|objet|sol|meuble)\b/.test(text))
      missing.push('Description de l’objet endommagé');
  }
  if (
    category === 'Qualité du ménage' &&
    !/\b(cuisine|salle de bain|sol|vitre|four|chambre|salon)\b/.test(text)
  )
    missing.push('Pièces et points à reprendre');
  if (category === 'Remplacement') missing.push('Disponibilités souhaitées à confirmer');
  if (category === 'À vérifier') missing.push('Nature et résultat attendu de la demande');
  const signals: string[] = [];
  if (damage) signals.push('Dommage signalé : évaluation humaine obligatoire');
  if (category === 'Annulation / modification') {
    const hours = (Date.parse(c.serviceAt) - Date.parse(c.createdAt)) / 3_600_000;
    signals.push(
      Number.isFinite(hours) && hours >= 0
        ? `Préavis indicatif : ${Math.floor(hours)} h à la réception${hours < 48 ? ' — inférieur à 48 h' : ' — au moins 48 h'}. Conditions à vérifier.`
        : 'Préavis non déterminable : vérifier les dates et les conditions publiques (48 h).',
    );
  }
  if (/\b(demain|aujourd'hui|urgent)\b/.test(text))
    signals.push('Échéance proche mentionnée par le client ; à confirmer');
  if (/\b(rembours|indemnis|assurance)\w*/.test(text))
    signals.push('Décision financière ou de couverture réservée à l’équipe');
  const escalation =
    !!damage ||
    category === 'À vérifier' ||
    category === 'Annulation / modification' ||
    missing.length > 0 ||
    /\b(rembours|indemnis|assurance)\w*/.test(text);
  return {
    category,
    explanation:
      category === 'À vérifier'
        ? matched.length > 1
          ? 'Plusieurs intentions sont présentes. Une lecture humaine doit départager la demande.'
          : 'Aucun signal suffisamment explicite dans les règles du prototype. La catégorie reste incertaine.'
        : `Suggestion fondée sur le signal « ${text.match((damage || matched[0]).pattern)?.[0]} » dans le message.${matched.length > 1 ? ' Plusieurs intentions sont présentes ; le dommage est prioritaire par précaution.' : ''} Une confirmation humaine reste nécessaire.`,
    signals,
    missing,
    escalation,
    urgency:
      damage || signals.some((s) => s.includes('inférieur') || s.includes('Échéance proche'))
        ? 'Prioritaire'
        : escalation
          ? 'À examiner'
          : 'Normale',
    nextStep: recommendations[category],
    references: category === 'Annulation / modification' ? ['terms', 'faq'] : ['faq'],
  };
}
