import type { CustomerCase, Status } from '../domain/types';
import { createDraft } from '../domain/recommendations';
import { triage } from '../domain/triage';
const rows = [
  [
    'CF-1001',
    'Camille D.',
    'Lausanne',
    'Des points à reprendre après le ménage',
    'Bonjour, après le ménage du 11 novembre, le sol de la cuisine est encore sale et il reste de la poussière dans le salon. Pourriez-vous revoir ces points ? Merci.',
    'E-mail',
    'DEMO-2041',
    '2026-11-11T09:00:00+01:00',
    '2026-11-12T08:12:00+01:00',
    'Nouveau',
  ],
  [
    'CF-1002',
    'Alex M.',
    'Genève',
    'Une lampe cassée dans le salon',
    'Je viens de constater que la lampe du salon est cassée après le passage de ce matin. Je souhaite que ce dommage soit examiné et savoir comment fonctionne l’assurance.',
    'Téléphone',
    'DEMO-2042',
    '2026-11-12T08:00:00+01:00',
    '2026-11-12T10:05:00+01:00',
    'Nouveau',
  ],
  [
    'CF-1003',
    'Sophie R.',
    'Nyon',
    'Annuler le passage de demain',
    'Bonjour, je dois annuler mon ménage de demain à 9 h, car je serai absente. Pouvez-vous me confirmer les conditions ?',
    'Formulaire',
    'DEMO-2043',
    '2026-11-13T09:00:00+01:00',
    '2026-11-12T08:45:00+01:00',
    'En cours',
  ],
  [
    'CF-1004',
    'Thomas L.',
    'Morges',
    'Un remplacement pendant une absence',
    'Mon intervenante sera absente la semaine prochaine. Serait-il possible de trouver un remplacement pour le passage du 18 novembre à 10 h ?',
    'E-mail',
    'DEMO-2044',
    '2026-11-18T10:00:00+01:00',
    '2026-11-12T09:10:00+01:00',
    'En attente client',
  ],
  [
    'CF-1005',
    'Léa B.',
    'Vevey',
    'Une question sur mon dernier passage',
    'Bonjour, ce n’est pas ce que nous avions convenu. Pourriez-vous me rappeler pour en parler ? Merci.',
    'Simulation MarIA',
    '',
    '',
    '2026-11-11T20:35:00+01:00',
    'Nouveau',
  ],
  [
    'CF-1006',
    'Nicolas P.',
    'Fribourg',
    'Décaler le prochain ménage',
    'Je souhaiterais modifier la date de mon ménage du 20 novembre à 14 h et le reporter au 23 novembre, si possible.',
    'Formulaire',
    'DEMO-2046',
    '2026-11-20T14:00:00+01:00',
    '2026-11-12T09:30:00+01:00',
    'Nouveau',
  ],
  [
    'CF-1007',
    'Emma V.',
    'Lausanne',
    'Un retour sur la salle de bain',
    'Le nettoyage de la salle de bain n’est pas satisfaisant : il reste des traces sur les vitres. J’aimerais un remboursement.',
    'E-mail',
    'DEMO-2047',
    '2026-11-10T13:00:00+01:00',
    '2026-11-11T17:00:00+01:00',
    'En attente client',
  ],
  [
    'CF-1008',
    'Julien C.',
    'Renens',
    'Suivi du passage correctif',
    'Merci, les traces sur le sol de la cuisine ont été reprises après notre échange. Le résultat me convient maintenant.',
    'E-mail',
    'DEMO-2048',
    '2026-11-10T09:00:00+01:00',
    '2026-11-11T11:00:00+01:00',
    'Résolu',
  ],
] as const;
export function seedCases(): CustomerCase[] {
  return rows.map(
    ([id, name, city, title, message, channel, bookingRef, serviceAt, createdAt, status]) => {
      const c: CustomerCase = {
        id,
        name,
        city,
        title,
        message,
        channel,
        bookingRef,
        serviceAt,
        createdAt,
        status: status as Status,
        draft: '',
        completedInfo: [],
        activity: [
          { id: `${id}-1`, at: createdAt, text: 'Dossier synthétique ajouté à la démonstration.' },
        ],
      };
      const t = triage(c);
      c.draft = createDraft(c, t.category, t.missing);
      if (status === 'Résolu') {
        c.draft =
          'Bonjour Julien, merci pour votre confirmation. Nous clôturons ce dossier de démonstration à la suite de votre retour.';
        c.reviewedAt = createdAt;
        c.approvedAt = createdAt;
        c.activity.push({
          id: `${id}-2`,
          at: createdAt,
          text: 'Scénario initial : revue humaine, brouillon approuvé et dossier résolu.',
        });
      }
      return c;
    },
  );
}
