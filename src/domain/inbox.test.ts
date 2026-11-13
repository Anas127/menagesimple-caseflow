import { describe, expect, it } from 'vitest';
import { filterCases } from './inbox';
import type { InboxFilters } from './inbox';
import { seedCases } from '../data/syntheticCases';
import { metrics, newCase } from './cases';
const all: InboxFilters = { query: '', status: '', category: '', view: 'all' };
describe('recherche et réinitialisation des filtres', () => {
  it('restaure la liste complète quand la recherche est effacée ou ne contient que des espaces', () => {
    const cases = seedCases();
    expect(filterCases(cases, { ...all, query: 'Camille' })).toHaveLength(1);
    expect(filterCases(cases, all)).toEqual(cases);
    expect(filterCases(cases, { ...all, query: '   ' })).toEqual(cases);
  });
  it('Tous les statuts retire uniquement la contrainte de statut', () => {
    const cases = seedCases();
    expect(filterCases(cases, { ...all, status: 'Nouveau' })).toHaveLength(4);
    expect(filterCases(cases, { ...all, status: '' })).toHaveLength(8);
    expect(filterCases(cases, { ...all, query: 'Alex', status: '' })).toHaveLength(1);
  });
  it('Toutes les catégories retire uniquement la contrainte de catégorie', () => {
    const cases = seedCases();
    expect(filterCases(cases, { ...all, category: 'Dommage matériel' })).toHaveLength(1);
    expect(filterCases(cases, { ...all, category: '' })).toHaveLength(8);
    expect(filterCases(cases, { ...all, status: 'Nouveau', category: '' })).toHaveLength(4);
  });
  it('combine recherche, statut et catégorie avec intersection', () => {
    const cases = seedCases();
    expect(
      filterCases(cases, {
        ...all,
        query: 'alex',
        status: 'Nouveau',
        category: 'Dommage matériel',
      }).map((c) => c.id),
    ).toEqual(['CF-1002']);
    expect(filterCases(cases, { ...all, query: 'Alex', status: 'Résolu' })).toEqual([]);
  });
  it('ne modifie ni les compteurs globaux ni les dossiers quand un filtre est appliqué', () => {
    const cases = seedCases();
    const before = JSON.stringify(cases);
    const initial = metrics(cases);
    filterCases(cases, { ...all, query: 'introuvable' });
    expect(metrics(cases)).toEqual(initial);
    expect(JSON.stringify(cases)).toBe(before);
  });
  it('normalise les accents et permet la recherche de référence', () => {
    expect(filterCases(seedCases(), { ...all, query: 'LEA' }).map((c) => c.id)).toEqual([
      'CF-1005',
    ]);
    expect(filterCases(seedCases(), { ...all, query: 'DEMO-2042' }).map((c) => c.id)).toEqual([
      'CF-1002',
    ]);
  });
  it('la réinitialisation restaure aussi la vue complète et les sujets secondaires restent filtrables', () => {
    const cases = [...seedCases(), newCase('Le vase est cassé et les vitres sont sales.')];
    expect(filterCases(cases, { ...all, category: 'Qualité du ménage' })).toHaveLength(4);
    expect(filterCases(cases, { ...all, view: 'review' })).toHaveLength(6);
    expect(filterCases(cases, all)).toHaveLength(9);
  });
});
