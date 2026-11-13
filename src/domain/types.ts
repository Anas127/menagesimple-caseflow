export const statuses = ['Nouveau', 'En cours', 'En attente client', 'Résolu'] as const;
export type Status = (typeof statuses)[number];
export const categories = [
  'Qualité du ménage',
  'Dommage matériel',
  'Annulation / modification',
  'Remplacement',
  'À vérifier',
] as const;
export type Category = (typeof categories)[number];
export type Channel = 'E-mail' | 'Téléphone' | 'Formulaire' | 'Simulation MarIA';
export interface Activity {
  id: string;
  at: string;
  text: string;
}
export interface CustomerCase {
  id: string;
  name: string;
  city: string;
  title: string;
  message: string;
  channel: Channel;
  bookingRef: string;
  serviceAt: string;
  createdAt: string;
  status: Status;
  draft: string;
  approvedAt?: string;
  reviewedAt?: string;
  override?: Category;
  overrideReason?: string;
  completedInfo: string[];
  activity: Activity[];
}
export interface Triage {
  category: Category;
  secondaryCategories: Category[];
  actions: { category: Category; text: string }[];
  reviewReasons: string[];
  criticalMissing: string[];
  explanation: string;
  signals: string[];
  urgency: 'Prioritaire' | 'À examiner' | 'Normale';
  missing: string[];
  nextStep: string;
  escalation: boolean;
  references: string[];
}
