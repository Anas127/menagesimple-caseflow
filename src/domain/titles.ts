import type { Triage } from './types';
import { normalize } from './triage';

export function generateTitle(
  message: string,
  t: Pick<Triage, 'category' | 'secondaryCategories'>,
): string {
  if (t.category === 'À vérifier') return 'Question client à clarifier';
  const text = normalize(message);
  // Name an object only when the text explicitly relates it to damage.
  const object = text.match(
    /\b(vase|lampe|miroir|parquet|meuble) (?:a ete |est |a ete retrouve )?(?:casse|brise|endommage|raye|abime)\w*\b/,
  )?.[1];
  const damageTitle = object
    ? `${object[0].toUpperCase()}${object.slice(1)} ${object === 'lampe' ? 'endommagée' : 'endommagé'}`
    : 'Signalement de dommage matériel';
  const titles = {
    'Dommage matériel': damageTitle,
    'Qualité du ménage': 'Réclamation sur la qualité du ménage',
    'Annulation / modification': /\bannul\w*/.test(text)
      ? 'Demande d’annulation de réservation'
      : 'Demande de modification de réservation',
    Remplacement: 'Demande de remplacement',
  };
  const suffixes = {
    'Qualité du ménage': 'ménage insatisfaisant',
    'Annulation / modification': 'changement de réservation',
    Remplacement: 'demande de remplacement',
    'Dommage matériel': 'dommage matériel',
    'À vérifier': 'question à clarifier',
  };
  const [secondary, ...others] = t.secondaryCategories;
  const title = secondary
    ? `${t.category === 'Dommage matériel' && !object ? 'Dommage matériel' : titles[t.category]} et ${suffixes[secondary]}`
    : titles[t.category];
  return `${title}${others.length ? ` (+${others.length} sujet${others.length > 1 ? 's' : ''})` : ''}`;
}
