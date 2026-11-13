import { useState } from 'react';
import { ArrowRight, AudioLines, X } from 'lucide-react';
import type { CustomerCase } from '../domain/types';
import { isDuplicate, newCase } from '../domain/cases';
export function Intake({
  cases,
  onCreate,
  onClose,
}: {
  cases: CustomerCase[];
  onCreate: (c: CustomerCase) => void;
  onClose: () => void;
}) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="intake-title"
        className="modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
          if (e.key === 'Tab') {
            const items = Array.from(
              e.currentTarget.querySelectorAll<HTMLElement>('button, textarea'),
            );
            const first = items[0],
              last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
            if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <div className="flex justify-between items-start">
          <span className="icon-tile">
            <AudioLines size={24} />
          </span>
          <button className="icon-button" aria-label="Fermer la simulation" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <p className="eyebrow mt-5">NOUVELLE DEMANDE · DONNÉES FICTIVES</p>
        <h2 id="intake-title">Simuler un appel après les heures</h2>
        <p className="muted mt-3">
          MarIA-style simulation : collez un résumé fictif pour créer un dossier et examiner son
          triage. Le format réel de MarIA est inconnu. Aucune intégration officielle.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (message.trim().length < 10)
              return setError('Ajoutez un résumé d’au moins 10 caractères.');
            if (isDuplicate(cases, message))
              return setError('Ce message existe déjà dans la boîte de réception.');
            onCreate(newCase(message));
          }}
        >
          <label className="field-label mt-6" htmlFor="summary">
            Résumé de l’appel fictif
          </label>
          <textarea
            autoFocus
            id="summary"
            rows={6}
            maxLength={5000}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setError('');
            }}
            placeholder="Ex. : La cliente signale que le miroir du salon est cassé après le ménage de ce matin. Elle souhaite être rappelée."
          />
          <p className="small muted mt-2">
            N’utilisez aucune donnée personnelle réelle. {message.length}/5 000
          </p>
          {error && (
            <p role="alert" className="error mt-3">
              {error}
            </p>
          )}
          <div className="modal-footer">
            <button type="button" className="button secondary" onClick={onClose}>
              Annuler
            </button>
            <button className="button primary" type="submit">
              Créer et analyser <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
