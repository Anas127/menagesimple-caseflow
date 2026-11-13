import type { Category, CustomerCase, Status } from './types';
import { caseCategories, requiresHumanReview } from './cases';
import { normalize } from './triage';

export interface InboxFilters {
  query: string;
  status: Status | '';
  category: Category | '';
  view: 'all' | 'review' | 'waiting' | 'resolved';
}

export function filterCases(cases: CustomerCase[], filters: InboxFilters): CustomerCase[] {
  const query = normalize(filters.query);
  return cases.filter(
    (c) =>
      (!filters.status || c.status === filters.status) &&
      (!filters.category || caseCategories(c).includes(filters.category)) &&
      (!query ||
        normalize(`${c.id} ${c.name} ${c.title} ${c.message} ${c.bookingRef}`).includes(query)) &&
      (filters.view === 'all' ||
        (filters.view === 'review' && requiresHumanReview(c)) ||
        (filters.view === 'waiting' && c.status === 'En attente client') ||
        (filters.view === 'resolved' && c.status === 'Résolu')),
  );
}
