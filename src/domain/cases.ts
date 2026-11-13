import { categories, statuses } from './types';
import type { Category, CustomerCase, Status } from './types';
import { normalize, triage } from './triage';
import { createDraft } from './recommendations';
import { generateTitle } from './titles';
export const STORAGE_KEY = 'caseflow.demo.v1';
export function newCase(
  message: string,
  now = new Date().toISOString(),
  id = `CF-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
): CustomerCase {
  const c: CustomerCase = {
    id,
    name: 'Client de démonstration',
    city: 'À préciser',
    title: '',
    message: message.trim(),
    channel: 'Simulation MarIA',
    bookingRef: '',
    serviceAt: '',
    createdAt: now,
    status: 'Nouveau',
    draft: '',
    completedInfo: [],
    activity: [
      { id: `${id}-created`, at: now, text: 'Dossier créé depuis une simulation MarIA-style.' },
    ],
  };
  const t = triage(c);
  return {
    ...c,
    title: generateTitle(c.message, t),
    draft: createDraft(c, t.category, t.missing, t.secondaryCategories),
  };
}
export function isDuplicate(cases: CustomerCase[], message: string): boolean {
  return cases.some((c) => normalize(c.message) === normalize(message));
}
export function addActivity(
  c: CustomerCase,
  text: string,
  at = new Date().toISOString(),
): CustomerCase {
  return { ...c, activity: [...c.activity, { id: crypto.randomUUID(), at, text }] };
}
export function changeStatus(
  c: CustomerCase,
  status: Status,
  at = new Date().toISOString(),
): CustomerCase {
  if (!statuses.includes(status)) throw new Error('Statut inconnu.');
  if (c.status === status) return c;
  if (status === 'Résolu' && (!c.approvedAt || !c.reviewedAt))
    throw new Error('Confirmez la revue et approuvez le brouillon avant de résoudre le dossier.');
  return addActivity(
    {
      ...c,
      status,
      ...(c.status === 'Résolu' ? { reviewedAt: undefined, approvedAt: undefined } : {}),
    },
    `Statut : ${c.status} → ${status}.`,
    at,
  );
}
export function saveDraft(c: CustomerCase, draft: string): CustomerCase {
  if (draft === c.draft) return c;
  const next = { ...c, draft, approvedAt: undefined };
  const text = 'Brouillon modifié ; approbation à renouveler.';
  return c.activity.at(-1)?.text === text ? next : addActivity(next, text);
}
export function approveDraft(c: CustomerCase, at = new Date().toISOString()): CustomerCase {
  if (!c.draft.trim()) throw new Error('Le brouillon ne peut pas être vide.');
  if (!c.reviewedAt) throw new Error('Confirmez d’abord la revue humaine.');
  return addActivity(
    { ...c, approvedAt: at },
    'Brouillon approuvé localement. Aucun message envoyé.',
    at,
  );
}
export function overrideCategory(
  c: CustomerCase,
  category: Category,
  reason: string,
): CustomerCase {
  if (!reason.trim()) throw new Error('Précisez le motif de la correction.');
  return addActivity(
    {
      ...c,
      override: category,
      overrideReason: reason.trim(),
      approvedAt: undefined,
      reviewedAt: undefined,
    },
    `Catégorie corrigée : ${category}. Motif : ${reason.trim()}`,
  );
}
export function humanReviewReasons(c: CustomerCase): string[] {
  if (c.status === 'Résolu' || c.reviewedAt) return [];
  const t = triage(c);
  return [
    ...t.reviewReasons,
    ...t.criticalMissing
      .filter((s) => !c.completedInfo.includes(s))
      .map((s) => `Information critique manquante : ${s}`),
    ...(c.override === 'À vérifier' && t.category !== 'À vérifier'
      ? ['Catégorie opérateur à vérifier']
      : []),
  ];
}
export function requiresHumanReview(c: CustomerCase): boolean {
  return humanReviewReasons(c).length > 0;
}
export function caseCategories(c: CustomerCase): Category[] {
  const t = triage(c);
  return [...new Set([c.override ?? t.category, t.category, ...t.secondaryCategories])];
}
export function metrics(cases: CustomerCase[]) {
  return {
    total: cases.length,
    review: cases.filter(requiresHumanReview).length,
    waiting: cases.filter((c) => c.status === 'En attente client').length,
    resolved: cases.filter((c) => c.status === 'Résolu').length,
  };
}
export function decodeCases(raw: string | null): CustomerCase[] | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return null;
    const channels = ['E-mail', 'Téléphone', 'Formulaire', 'Simulation MarIA'];
    const valid = data.every(
      (c) =>
        c &&
        typeof c === 'object' &&
        [
          'id',
          'name',
          'city',
          'title',
          'message',
          'bookingRef',
          'serviceAt',
          'createdAt',
          'draft',
        ].every((k) => typeof c[k] === 'string') &&
        statuses.includes(c.status) &&
        channels.includes(c.channel) &&
        Number.isFinite(Date.parse(c.createdAt)) &&
        (!c.serviceAt || Number.isFinite(Date.parse(c.serviceAt))) &&
        ['approvedAt', 'reviewedAt'].every(
          (k) =>
            c[k] === undefined || (typeof c[k] === 'string' && Number.isFinite(Date.parse(c[k]))),
        ) &&
        (c.override === undefined || categories.includes(c.override)) &&
        (c.overrideReason === undefined || typeof c.overrideReason === 'string') &&
        Array.isArray(c.completedInfo) &&
        c.completedInfo.every((s: unknown) => typeof s === 'string') &&
        Array.isArray(c.activity) &&
        c.activity.every(
          (a: Record<string, unknown>) =>
            a &&
            typeof a.id === 'string' &&
            typeof a.text === 'string' &&
            typeof a.at === 'string' &&
            Number.isFinite(Date.parse(a.at)),
        ),
    );
    return valid && new Set(data.map((c) => c.id)).size === data.length ? data : null;
  } catch {
    return null;
  }
}
