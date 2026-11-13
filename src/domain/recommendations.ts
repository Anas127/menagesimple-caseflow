import type { Category, CustomerCase } from './types';
export const recommendations: Record<Category, string> = {
  'Qualité du ménage':
    'Préciser les points à reprendre, puis faire examiner la possibilité d’un passage correctif par l’équipe.',
  'Dommage matériel':
    'Transmettre le signalement à un responsable pour évaluation humaine. Recueillir les faits et les photos, sans conclure sur la responsabilité ou la couverture.',
  'Annulation / modification':
    'Vérifier la date du service et celle de la demande au regard du préavis public de 48 h. Faire valider les conditions applicables par un opérateur.',
  Remplacement:
    'Confirmer la prestation concernée et les disponibilités souhaitées, puis transmettre la demande à l’équipe. Aucun remplacement n’est réservé ici.',
  'À vérifier':
    'Relire le message et demander une clarification avant de choisir une catégorie ou une solution.',
};
export function createDraft(
  c: Pick<CustomerCase, 'name'>,
  category: Category,
  missing: string[],
): string {
  const intro =
    c.name === 'Client de démonstration' ? 'Bonjour,' : `Bonjour ${c.name.split(' ')[0]},`;
  const body: Record<Category, string> = {
    'Qualité du ménage':
      'Merci pour votre retour. Nous souhaitons préciser les points du ménage qui ne vous ont pas satisfait afin que l’équipe puisse examiner la possibilité d’un passage correctif.',
    'Dommage matériel':
      'Merci de nous avoir signalé ce dommage. Votre demande nécessite une évaluation par un responsable. La responsabilité, une éventuelle couverture et toute indemnisation restent à examiner.',
    'Annulation / modification':
      'Merci pour votre demande de changement. L’équipe doit vérifier les horaires et les conditions applicables, notamment le préavis de 48 h mentionné dans les conditions publiques, avant de confirmer une suite.',
    Remplacement:
      'Merci pour votre demande de remplacement. L’équipe doit vérifier les disponibilités avant de pouvoir vous confirmer une proposition.',
    'À vérifier':
      'Merci pour votre message. Pourriez-vous préciser ce qui s’est passé et ce que vous souhaitez concernant votre prestation ?',
  };
  return `${intro}\n\n${body[category]}${missing.length ? `\n\nPour compléter le dossier, pourriez-vous nous transmettre : ${missing.map((s) => s.toLocaleLowerCase('fr')).join(' ; ')} ?` : ''}\n\nMerci pour votre aide,\nL’équipe de suivi`;
}
