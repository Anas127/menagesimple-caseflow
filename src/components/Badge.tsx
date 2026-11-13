import type { Status, Triage } from '../domain/types';
export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`badge status-${status === 'Nouveau' ? 'new' : status === 'En cours' ? 'active' : status === 'Résolu' ? 'done' : 'waiting'}`}
    >
      <span className="badge-dot" />
      {status}
    </span>
  );
}
export function UrgencyBadge({ urgency }: { urgency: Triage['urgency'] }) {
  return (
    <span
      className={`urgency urgency-${urgency === 'Prioritaire' ? 'high' : urgency === 'À examiner' ? 'medium' : 'normal'}`}
    >
      <span>●</span> {urgency}
    </span>
  );
}
