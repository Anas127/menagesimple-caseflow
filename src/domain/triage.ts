import type { Category, CustomerCase, Triage } from './types';
import { recommendations } from './recommendations';
export const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
// Prototype priority: damage > contractual timing > replacement > quality.
const rules = [
  {
    category: 'Dommage matériel',
    pattern: /\b(casse|brise|endommage|rayure|raye|degat|dommage|fissure|abime)\w*\b/,
  },
  {
    category: 'Annulation / modification',
    pattern: /\b(annul|decal|report|modifi|deplac|changer la date)\w*/,
  },
  {
    category: 'Remplacement',
    pattern: /\b(remplac|pas venu|pas venue)\w*|\b(intervenante?|aide|personne)\b.{0,30}\babsen\w*/,
  },
  {
    category: 'Qualité du ménage',
    pattern:
      /\b(sale|poussiere|mal nettoye|mal fait|pas nettoye|non nettoye|insatisfaisant|bacle|traces|qualite|oublie)\w*\b/,
  },
] as const;
export function triage(
  c: Pick<CustomerCase, 'message' | 'bookingRef' | 'serviceAt' | 'createdAt'>,
): Triage {
  const text = normalize(c.message);
  const matched = rules.filter((r) => r.pattern.test(text));
  const detected = matched.map((r) => r.category);
  const category: Category = detected.length ? detected[0] : 'À vérifier';
  const secondaryCategories = detected.slice(1);
  const damage = detected.includes('Dommage matériel');
  const cancellation = detected.includes('Annulation / modification');
  const missing: string[] = [];
  if (!c.bookingRef.trim()) missing.push('Référence de réservation');
  if (!c.serviceAt || !Number.isFinite(Date.parse(c.serviceAt)))
    missing.push('Date et heure de la prestation');
  if (damage) {
    missing.push('Photos du dommage à recueillir');
    if (
      !/\b(vases?|vitres?|parquets?|tables?|lampes?|miroirs?|objets?|sols?|meubles?)\b/.test(text)
    )
      missing.push('Description de l’objet endommagé');
  }
  if (
    detected.includes('Qualité du ménage') &&
    !/\b(cuisine|salle de bain|sols?|vitres?|four|chambre|salon)\b/.test(text)
  )
    missing.push('Pièces et points à reprendre');
  if (detected.includes('Remplacement')) missing.push('Disponibilités souhaitées à confirmer');
  if (category === 'À vérifier') missing.push('Nature et résultat attendu de la demande');
  const signals: string[] = [];
  const reviewReasons: string[] = [];
  if (damage) reviewReasons.push('Dommage signalé : évaluation humaine obligatoire');
  if (category === 'À vérifier')
    reviewReasons.push('Demande ambiguë : clarification humaine requise');
  if (cancellation) {
    reviewReasons.push('Conditions d’annulation ou de modification à valider par un humain');
    const hours = (Date.parse(c.serviceAt) - Date.parse(c.createdAt)) / 3_600_000;
    signals.push(
      Number.isFinite(hours) && hours >= 0
        ? `Préavis indicatif : ${Math.floor(hours)} h à la réception${hours < 48 ? ' — inférieur à 48 h' : ' — au moins 48 h'}. Conditions à vérifier.`
        : 'Préavis non déterminable : vérifier les dates et les conditions publiques (48 h).',
    );
  }
  if (/\b(demain|aujourd'hui|urgent)\b/.test(text))
    signals.push('Échéance proche mentionnée par le client ; à confirmer');
  if (/\b(rembours|indemnis|compens|assurance)\w*/.test(text))
    reviewReasons.push('Décision financière ou de couverture réservée à l’équipe');
  const criticalMissing = missing.filter((s) => s !== 'Disponibilités souhaitées à confirmer');
  const escalation = reviewReasons.length > 0 || criticalMissing.length > 0;
  const actions = (detected.length ? detected : [category]).map((issue) => ({
    category: issue,
    text: recommendations[issue],
  }));
  return {
    category,
    secondaryCategories,
    actions,
    criticalMissing,
    reviewReasons,
    explanation: matched.length
      ? `${matched.map((r) => `${r.category} : signal « ${text.match(r.pattern)?.[0]} »`).join(' ; ')}.${matched.length > 1 ? ' Priorité du prototype : dommage, annulation / modification, remplacement, puis qualité. Chaque sujet reste à traiter séparément.' : ''} Une confirmation humaine reste nécessaire.`
      : 'Aucun signal suffisamment explicite dans les règles du prototype. La catégorie reste incertaine.',
    signals: [...signals, ...reviewReasons],
    missing,
    escalation,
    urgency:
      damage || signals.some((s) => s.includes('inférieur') || s.includes('Échéance proche'))
        ? 'Prioritaire'
        : escalation
          ? 'À examiner'
          : 'Normale',
    nextStep: actions.map((a) => `${a.category} : ${a.text}`).join('\n\n'),
    references: cancellation ? ['terms', 'faq'] : ['faq'],
  };
}
