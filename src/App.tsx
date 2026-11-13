import { useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  AudioLines,
  CheckCheck,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Inbox,
  LayoutGrid,
  ListFilter,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useCases } from './hooks/useCases';
import { categories, statuses } from './domain/types';
import type { Category, CustomerCase, Status } from './domain/types';
import { metrics } from './domain/cases';
import { filterCases } from './domain/inbox';
import { triage } from './domain/triage';
import { seedCases } from './data/syntheticCases';
import { StatusBadge, UrgencyBadge } from './components/Badge';
import { CaseDetail } from './components/CaseDetail';
import { Intake } from './components/Intake';
export default function App() {
  const { cases, setCases, update, warning } = useCases();
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | ''>('');
  const [category, setCategory] = useState<Category | ''>('');
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'all' | 'review' | 'waiting' | 'resolved'>('all');
  const [intake, setIntake] = useState(false);
  const [help, setHelp] = useState(false);
  const [resetPending, setResetPending] = useState(false);
  const [notice, setNotice] = useState('');
  const intakeButton = useRef<HTMLButtonElement>(null);
  const m = metrics(cases);
  const current = cases.find((c) => c.id === selected);
  const filtered = filterCases(cases, { query, status, category, view });
  const navigate = (v: typeof view) => {
    setView(v);
    setSelected(null);
    setStatus('');
    setCategory('');
    setQuery('');
  };
  const closeIntake = () => {
    setIntake(false);
    intakeButton.current?.focus();
  };
  const create = (c: CustomerCase) => {
    setCases((all) => [c, ...all]);
    closeIntake();
    setSelected(c.id);
    setNotice('Dossier créé et analysé. Aucun appel réel ni connexion à MarIA.');
  };
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          href="#"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            navigate('all');
          }}
        >
          <span className="brand-mark">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span>
            CaseFlow<small>POUR MÉNAGESIMPLE</small>
          </span>
        </a>
        <div className="workspace">
          <span className="workspace-avatar">MS</span>
          <span>
            Espace opérations<small>Environnement de démonstration</small>
          </span>
        </div>
        <p className="nav-label">ESPACE DE TRAVAIL</p>
        <nav aria-label="Navigation principale">
          <button
            className={view === 'all' && !current ? 'nav-item active' : 'nav-item'}
            onClick={() => navigate('all')}
          >
            <Inbox size={18} /> Boîte de réception <span>{m.total}</span>
          </button>
          <button
            className={view === 'review' && !current ? 'nav-item active' : 'nav-item'}
            onClick={() => navigate('review')}
          >
            <ClipboardCheck size={18} /> Revue spécifique <span>{m.review}</span>
          </button>
          <button
            className={view === 'resolved' && !current ? 'nav-item active' : 'nav-item'}
            onClick={() => navigate('resolved')}
          >
            <CheckCheck size={18} /> Dossiers résolus <span>{m.resolved}</span>
          </button>
        </nav>
        <div className="sidebar-card">
          <ShieldCheck size={21} />
          <h3>L’humain garde la main.</h3>
          <p>
            Des suggestions explicables.
            <br />
            Chaque décision est la vôtre.
          </p>
          <button onClick={() => setHelp(!help)}>
            À propos du prototype <ArrowRight size={14} />
          </button>
        </div>
        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => setResetPending(true)}>
            <RotateCcw size={16} /> Réinitialiser la démo
          </button>
          <div className="operator">
            <span>OP</span>
            <div>
              Opérateur de démonstration<small>Session locale · sans compte</small>
            </div>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div>
            <LayoutGrid size={16} />
            <span>Opérations</span>
            <ChevronRight size={14} />
            <strong>{current ? 'Détail du dossier' : 'Suivi des demandes'}</strong>
          </div>
          <span className="demo-label">
            <span />
            Démo locale
          </span>
        </header>
        <main id="main-content">
          <div className="prototype-notice">
            <ShieldCheck size={14} />
            <span>
              Prototype indépendant — Données synthétiques — Aucune connexion aux systèmes
              MénageSimple.
            </span>
          </div>
          {resetPending && (
            <section className="alert" aria-label="Confirmation de réinitialisation">
              <p>
                Remplacer vos modifications locales par les huit dossiers de démonstration initiaux
                ?
              </p>
              <div className="flex gap-3 mt-3">
                <button className="button secondary" onClick={() => setResetPending(false)}>
                  Conserver mes modifications
                </button>
                <button
                  className="button primary"
                  onClick={() => {
                    setCases(seedCases());
                    navigate('all');
                    setResetPending(false);
                    setNotice('Les huit dossiers synthétiques ont été restaurés.');
                  }}
                >
                  Confirmer la réinitialisation
                </button>
              </div>
            </section>
          )}
          {warning && (
            <p role="alert" className="alert error">
              {warning}
            </p>
          )}
          {notice && (
            <div role="status" className="alert flex justify-between items-center">
              {notice}
              <button
                className="icon-button"
                aria-label="Masquer la notification"
                onClick={() => setNotice('')}
              >
                <X size={16} />
              </button>
            </div>
          )}
          {help && (
            <section className="help-panel">
              <button
                className="icon-button float-right"
                aria-label="Fermer les informations"
                onClick={() => setHelp(false)}
              >
                <X size={18} />
              </button>
              <h2>Une demande, une prochaine étape claire.</h2>
              <p>
                Hypothèse : un suivi structuré pourrait aider l’équipe à traiter les résumés
                entrants. CaseFlow ne présume rien des outils internes existants. Il classe par
                règles locales, souligne les lacunes et prépare une réponse à relire.
              </p>
              <p>
                Aucun modèle de langage à l’exécution, aucun message envoyé, aucune décision de
                remboursement, d’assurance ou d’éligibilité automatisée. Les dates de prestation et
                délais sont affichés en heure suisse.
              </p>
            </section>
          )}
          {current ? (
            <CaseDetail
              key={current.id}
              c={current}
              update={update}
              back={() => setSelected(null)}
            />
          ) : (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow">LE SUIVI CLIENT, EN TOUTE CLARTÉ</p>
                  <h1>
                    Boîte de réception<span className="title-dot">.</span>
                  </h1>
                  <p className="muted">
                    De la demande à la résolution, avec une décision humaine à chaque étape.
                  </p>
                </div>
                <button
                  ref={intakeButton}
                  className="button primary"
                  onClick={() => setIntake(true)}
                >
                  <Plus size={17} /> Simuler un appel
                </button>
              </div>
              <section
                className="metrics-grid"
                aria-label="Indicateurs calculés sur les données de démonstration"
              >
                {[
                  {
                    label: 'Dossiers au total',
                    value: m.total,
                    icon: Inbox,
                    key: 'all',
                    note: 'Dans cet espace de démonstration',
                  },
                  {
                    label: 'Revue spécifique requise',
                    value: m.review,
                    icon: ClipboardCheck,
                    key: 'review',
                    note: 'Escalade ou information critique manquante',
                  },
                  {
                    label: 'En attente client',
                    value: m.waiting,
                    icon: CircleHelp,
                    key: 'waiting',
                    note: 'Informations complémentaires attendues',
                  },
                  {
                    label: 'Dossiers résolus',
                    value: m.resolved,
                    icon: CheckCheck,
                    key: 'resolved',
                    note: 'Clôturés après validation opérateur',
                  },
                ].map((item) => (
                  <button
                    key={item.key}
                    className={`metric-card ${view === item.key ? 'metric-selected' : ''}`}
                    onClick={() => navigate(item.key as typeof view)}
                  >
                    <div>
                      <span>{item.label}</span>
                      <item.icon size={18} />
                    </div>
                    <strong>{String(item.value).padStart(2, '0')}</strong>
                    <p>{item.note}</p>
                  </button>
                ))}
              </section>
              <section className="inbox-panel">
                <div className="inbox-heading">
                  <div className="flex items-center gap-3">
                    <h2>
                      {view === 'review'
                        ? 'Revue spécifique requise'
                        : view === 'waiting'
                          ? 'En attente client'
                          : view === 'resolved'
                            ? 'Dossiers résolus'
                            : 'Toutes les demandes'}
                    </h2>
                    <span className="count">{filtered.length}</span>
                  </div>
                  <span className="small muted flex items-center gap-2">
                    <ArrowDown size={13} /> Ordre de démonstration
                  </span>
                </div>
                <div className="filters">
                  <div className="search-field">
                    <Search size={17} />
                    <input
                      aria-label="Rechercher un dossier"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Rechercher un nom, une référence…"
                    />
                  </div>
                  <div className="select-wrap">
                    <ListFilter size={16} />
                    <select
                      aria-label="Filtrer par statut"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as Status | '')}
                    >
                      <option value="">Tous les statuts</option>
                      {statuses.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="select-wrap">
                    <SlidersHorizontal size={15} />
                    <select
                      aria-label="Filtrer par catégorie"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category | '')}
                    >
                      <option value="">Toutes les catégories</option>
                      {categories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>DOSSIER / CLIENT</th>
                        <th>DEMANDE</th>
                        <th>STATUT</th>
                        <th>URGENCE</th>
                        <th>
                          <span className="sr-only">Ouvrir</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((c) => {
                        const t = triage(c);
                        return (
                          <tr key={c.id} onClick={() => setSelected(c.id)}>
                            <td>
                              <div className="client-cell">
                                <span className="client-avatar">
                                  {c.name
                                    .split(' ')
                                    .map((s) => s[0])
                                    .join('')
                                    .slice(0, 2)}
                                </span>
                                <div>
                                  <strong>{c.name}</strong>
                                  <small>
                                    {c.id} <span>·</span> {c.city}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <button className="case-link" onClick={() => setSelected(c.id)}>
                                {c.title}
                              </button>
                              <div className="case-subline">
                                <span
                                  className={`category-mark ${t.category === 'À vérifier' ? 'uncertain' : ''}`}
                                />
                                {c.override ?? t.category}
                                {t.secondaryCategories.length > 0 && (
                                  <span title={t.secondaryCategories.join(' · ')}>
                                    + {t.secondaryCategories.length} sujet
                                    {t.secondaryCategories.length > 1 ? 's' : ''}
                                  </span>
                                )}
                                <span>·</span>
                                {c.channel}
                              </div>
                            </td>
                            <td>
                              <StatusBadge status={c.status} />
                            </td>
                            <td>
                              <UrgencyBadge urgency={t.urgency} />
                            </td>
                            <td>
                              <ChevronRight size={16} className="row-arrow" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {!filtered.length && (
                  <div className="empty-state">
                    <Search size={27} />
                    <h3>Aucun dossier ne correspond</h3>
                    <p>Essayez un autre terme ou ajustez les filtres.</p>
                    <button className="button secondary" onClick={() => navigate('all')}>
                      Afficher tous les dossiers
                    </button>
                  </div>
                )}
                <div className="table-footer">
                  <span>
                    {filtered.length} dossier{filtered.length > 1 ? 's' : ''} affiché
                    {filtered.length > 1 ? 's' : ''} sur {m.total}
                  </span>
                  <span>
                    Données fictives <span>·</span> Sauvegarde locale
                  </span>
                </div>
              </section>
              <section className="intake-banner">
                <span className="icon-tile">
                  <AudioLines size={23} />
                </span>
                <div>
                  <h3>Un appel reçu après les heures d’ouverture ?</h3>
                  <p>Testez le triage d’un résumé fictif avec la MarIA-style simulation.</p>
                </div>
                <button className="text-button" onClick={() => setIntake(true)}>
                  Essayer la simulation <ArrowRight size={16} />
                </button>
              </section>
              <div className="bottom-note">
                <ShieldCheck size={15} />
                <span>
                  Des règles explicites, des suggestions à vérifier. Aucune réponse ni compensation
                  automatique.
                </span>
              </div>
            </>
          )}
        </main>
        <footer className="app-footer">
          <span>
            CaseFlow <span> / </span> Prototype de suivi opérationnel
          </span>
          <span>
            Conçu pour l’examen humain{' '}
            <button aria-label="Informations sur le prototype" onClick={() => setHelp(!help)}>
              <CircleHelp size={15} />
            </button>
          </span>
        </footer>
      </div>
      {intake && <Intake cases={cases} onCreate={create} onClose={closeIntake} />}
    </div>
  );
}
