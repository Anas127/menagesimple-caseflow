import { useEffect, useState } from 'react';
import { decodeCases, STORAGE_KEY } from '../domain/cases';
import { seedCases } from '../data/syntheticCases';
import type { CustomerCase } from '../domain/types';
function initial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const cases = decodeCases(raw);
    return {
      cases: cases ?? seedCases(),
      warning:
        raw && !cases
          ? 'Sauvegarde invalide : les huit dossiers de démonstration ont été restaurés.'
          : '',
    };
  } catch {
    return {
      cases: seedCases(),
      warning:
        'Stockage local indisponible. Les changements restent en mémoire pour cette session.',
    };
  }
}
export function useCases() {
  const [loaded] = useState(initial);
  const [cases, setCases] = useState<CustomerCase[]>(loaded.cases);
  const [warning, setWarning] = useState(loaded.warning);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    } catch {
      setWarning(
        'Sauvegarde locale impossible. Les changements restent en mémoire pour cette session.',
      );
    }
  }, [cases]);
  const update = (next: CustomerCase) =>
    setCases((all) => all.map((c) => (c.id === next.id ? next : c)));
  return { cases, setCases, update, warning };
}
