import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCheck,
  ChevronDown,
  ExternalLink,
  FileText,
  History,
  Info,
  ShieldCheck,
} from 'lucide-react';
import type { Category, CustomerCase, Status } from '../domain/types';
import { categories, statuses } from '../domain/types';
import { triage } from '../domain/triage';
import {
  addActivity,
  approveDraft,
  changeStatus,
  humanReviewReasons,
  overrideCategory,
  saveDraft,
} from '../domain/cases';
import { createDraft, recommendations } from '../domain/recommendations';
import { publicReferences } from '../data/publicReferences';
import { StatusBadge, UrgencyBadge } from './Badge';
export const dateLabel = (date: string) =>
  new Intl.DateTimeFormat('fr-CH', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Zurich',
  }).format(new Date(date));
export function CaseDetail({
  c,
  update,
  back,
}: {
  c: CustomerCase;
  update: (c: CustomerCase) => void;
  back: () => void;
}) {
  const t = triage(c);
  const [error, setError] = useState('');
  const [override, setOverride] = useState<Category>(c.override ?? t.category);
  const [reason, setReason] = useState('');
  const [correcting, setCorrecting] = useState(false);
  const [regeneratePending, setRegeneratePending] = useState(false);
  const run = (f: () => CustomerCase) => {
    try {
      update(f());
      setError('');
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const category = c.override ?? t.category;
  return (
    <>
      <button className="back-link" onClick={back}>
        <ArrowLeft size={16} /> Boîte de réception <span>/</span> {c.id}
      </button>
      <header className="detail-heading">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="eyebrow">DOSSIER SYNTHÉTIQUE</span>
            <StatusBadge status={c.status} />
          </div>
          <h1>{c.title}</h1>
          <p className="muted mt-3">
            {c.name} <span className="separator">·</span> {c.city}{' '}
            <span className="separator">·</span> Reçu le {dateLabel(c.createdAt)} (Suisse)
          </p>
        </div>
        <UrgencyBadge urgency={t.urgency} />
      </header>
      {error && (
        <p role="alert" className="alert error">
          {error}
        </p>
      )}
      <div className="detail-grid">
        <div className="detail-main">
          <section className="panel">
            <div className="section-title">
              <span>
                <FileText size={18} /> Message original
              </span>
              <span className="tag">{c.channel}</span>
            </div>
            <blockquote>{c.message}</blockquote>
            <div className="metadata">
              <div>
                <span>RÉSERVATION FICTIVE</span>
                <strong>{c.bookingRef || 'Non communiquée'}</strong>
              </div>
              <div>
                <span>PRESTATION · HEURE SUISSE</span>
                <strong>{c.serviceAt ? dateLabel(c.serviceAt) : 'À préciser'}</strong>
              </div>
            </div>
          </section>
          <section className="panel">
            <div className="section-title">
              <span>
                <ShieldCheck size={18} /> Aide au triage
              </span>
              <span className="tag">Règles déterministes</span>
            </div>
            <div className="triage-result">
              <span className="small muted">Catégorie principale suggérée</span>
              <h2>{t.category}</h2>
              {t.secondaryCategories.length > 0 && (
                <div className="mt-3">
                  <span className="small muted">Sujets secondaires détectés</span>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {t.secondaryCategories.map((issue) => (
                      <li className="tag" key={issue}>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p>{t.explanation}</p>
            </div>
            {c.override && (
              <p className="alert">
                Correction opérateur : <strong>{c.override}</strong>
                <br />
                {c.overrideReason}
              </p>
            )}
            <button
              className="text-button mt-3"
              disabled={c.status === 'Résolu'}
              onClick={() => setCorrecting(!correcting)}
            >
              Corriger la catégorie <ChevronDown size={14} />
            </button>
            {correcting && (
              <div className="correction">
                <label className="field-label" htmlFor="override">
                  Catégorie retenue
                </label>
                <select
                  id="override"
                  value={override}
                  onChange={(e) => setOverride(e.target.value as Category)}
                >
                  {categories.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
                <label className="field-label mt-3" htmlFor="reason">
                  Motif de la correction
                </label>
                <input
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Expliquez votre lecture du message"
                />
                <button
                  className="button secondary mt-3"
                  onClick={() => {
                    if (!reason.trim()) return setError('Précisez le motif de la correction.');
                    run(() => overrideCategory(c, override, reason));
                    setCorrecting(false);
                  }}
                >
                  Enregistrer la correction
                </button>
              </div>
            )}
            <div className="rule-divider" />
            <h3>Indicateurs à examiner</h3>
            {t.signals.length ? (
              <ul className="signal-list">
                {t.signals.map((s) => (
                  <li key={s}>
                    <Info size={16} />
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted small mt-2">
                Aucun signal d’urgence détecté par les règles. À confirmer à la lecture.
              </p>
            )}
            <div className="action-note">
              <span className="eyebrow">ACTIONS PROPOSÉES PAR SUJET</span>
              {t.actions.map((action) => (
                <p key={action.category}>
                  <strong>{action.category} :</strong> {action.text}
                </p>
              ))}
              {c.override && c.override !== t.category && (
                <p>
                  <strong>Lecture opérateur :</strong> {recommendations[c.override]} Les précautions
                  du triage initial restent applicables.
                </p>
              )}
              <span className="small">
                <ShieldCheck size={14} />{' '}
                {c.reviewedAt
                  ? 'Revue humaine confirmée'
                  : humanReviewReasons(c).length > 0
                    ? 'Revue spécifique requise'
                    : 'Validation opérateur requise avant résolution'}
              </span>
            </div>
            <h3 className="mt-5">
              Informations à compléter{' '}
              <span className="count">
                {t.missing.filter((s) => !c.completedInfo.includes(s)).length}
              </span>
            </h3>
            <p className="small muted mt-2">
              Cochez uniquement les éléments vérifiés. Les justificatifs ne sont pas stockés dans ce
              prototype.
            </p>
            {t.missing.length ? (
              <div className="checklist">
                {t.missing.map((s) => (
                  <label key={s}>
                    <input
                      type="checkbox"
                      checked={c.completedInfo.includes(s)}
                      disabled={c.status === 'Résolu'}
                      onChange={(e) =>
                        update(
                          addActivity(
                            {
                              ...c,
                              reviewedAt: undefined,
                              approvedAt: undefined,
                              completedInfo: e.target.checked
                                ? [...c.completedInfo, s]
                                : c.completedInfo.filter((v) => v !== s),
                            },
                            `Information ${e.target.checked ? 'vérifiée' : 'à compléter'} : ${s}.`,
                          ),
                        )
                      }
                    />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="small success mt-3">
                <Check size={15} /> Les informations structurées attendues sont présentes.
              </p>
            )}
          </section>
          <section className="panel">
            <div className="section-title">
              <span>
                <FileText size={18} /> Réponse proposée
              </span>
              <span className="tag">Brouillon local</span>
            </div>
            <p className="small muted mb-4">
              Relisez et adaptez la réponse. L’approbation enregistre votre décision ; aucun message
              n’est envoyé.
            </p>
            <label className="sr-only" htmlFor="draft">
              Brouillon de réponse
            </label>
            <textarea
              id="draft"
              rows={12}
              value={c.draft}
              disabled={c.status === 'Résolu'}
              onChange={(e) => update(saveDraft(c, e.target.value))}
            />
            <div className="draft-actions">
              <button
                className="text-button"
                disabled={c.status === 'Résolu'}
                onClick={() => setRegeneratePending(true)}
              >
                Régénérer depuis les règles
              </button>
              <button
                className="button primary"
                disabled={!!c.approvedAt || c.status === 'Résolu'}
                onClick={() => run(() => approveDraft(c))}
              >
                <CheckCheck size={16} />
                {c.approvedAt ? 'Brouillon approuvé' : 'Approuver le brouillon'}
              </button>
            </div>
            {regeneratePending && (
              <div className="alert mt-4">
                <p>Remplacer le texte actuel par une proposition issue des règles ?</p>
                <div className="flex gap-3 mt-3 flex-wrap">
                  <button className="button secondary" onClick={() => setRegeneratePending(false)}>
                    Conserver le texte
                  </button>
                  <button
                    className="button primary"
                    onClick={() => {
                      update(
                        saveDraft(
                          c,
                          createDraft(
                            c,
                            category,
                            t.missing.filter((s) => !c.completedInfo.includes(s)),
                            [
                              ...t.secondaryCategories,
                              ...(c.override && c.override !== t.category ? [t.category] : []),
                            ],
                          ),
                        ),
                      );
                      setRegeneratePending(false);
                    }}
                  >
                    Remplacer le brouillon
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
        <aside className="detail-aside">
          <section className="panel">
            <div className="section-title">
              <span>Suivi du dossier</span>
              <span className="live-dot" />
            </div>
            <label className="field-label" htmlFor="case-status">
              Statut
            </label>
            <select
              id="case-status"
              value={c.status}
              onChange={(e) => run(() => changeStatus(c, e.target.value as Status))}
            >
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            {humanReviewReasons(c).length > 0 && (
              <div className="mt-4">
                <h3>Motifs de revue spécifique</h3>
                <ul className="signal-list">
                  {humanReviewReasons(c).map((reason) => (
                    <li key={reason}>
                      <Info size={14} />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <label className="review-check">
              <input
                type="checkbox"
                checked={!!c.reviewedAt}
                disabled={c.status === 'Résolu'}
                onChange={(e) =>
                  update(
                    addActivity(
                      {
                        ...c,
                        reviewedAt: e.target.checked ? new Date().toISOString() : undefined,
                        approvedAt: undefined,
                      },
                      e.target.checked
                        ? 'Revue humaine confirmée : message, informations manquantes et références examinés.'
                        : 'Revue humaine à renouveler.',
                    ),
                  )
                }
              />
              <span>
                J’ai examiné le message, les informations manquantes et les références publiques.
              </span>
            </label>
            <p className="small muted">
              Une revue confirmée et un brouillon approuvé sont nécessaires pour résoudre le
              dossier. Les éléments manquants restent au jugement de l’opérateur.
            </p>
            {c.approvedAt && (
              <p className="approval">
                <Check size={15} /> Approuvé le {dateLabel(c.approvedAt)}
              </p>
            )}
          </section>
          <section className="panel references">
            <div className="section-title">
              <span>Références publiques</span>
              <ExternalLink size={16} />
            </div>
            {publicReferences
              .filter((r) => t.references.includes(r.id))
              .map((r) => (
                <div key={r.id}>
                  <a href={r.url} target="_blank" rel="noreferrer">
                    {r.title} <ExternalLink size={13} />
                  </a>
                  <p>{r.note}</p>
                </div>
              ))}
            <p className="reference-footnote">
              Repères publics consultés le 12.11.2026, à revérifier. Ils ne remplacent ni le contrat
              ni les procédures internes.
            </p>
          </section>
          <section className="panel">
            <div className="section-title">
              <span>
                <History size={17} /> Historique
              </span>
              <span className="count">{c.activity.length}</span>
            </div>
            <ol className="timeline">
              {c.activity
                .slice()
                .reverse()
                .map((a) => (
                  <li key={a.id}>
                    <span>{a.text}</span>
                    <time>{dateLabel(a.at)}</time>
                  </li>
                ))}
            </ol>
          </section>
        </aside>
      </div>
    </>
  );
}
