# IA assistante, décisions vérifiables

Codex a aidé à construire et vérifier ce prototype. **L’application n’appelle aucun modèle de langage à l’exécution.** Les règles, titres, brouillons et indicateurs sont des fonctions TypeScript locales.

## Qui a choisi quoi ?

| Origine attestée                   | Décisions / travail                                                                                                                                                                                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Briefs fournis par le propriétaire | Besoin de suivi des exceptions, interface française, huit cas synthétiques, stack React / TypeScript / Vite / Tailwind / Vitest / LocalStorage, maintien des décisions humaines et absence de systèmes de production. Le propriétaire a explicitement exclu Sites. |
| Briefs de QA du propriétaire       | Signalement des problèmes multi-sujets, compteur de revue et titres ; demande de vérifier filtres, approbation et clôture. Ces retours ont guidé les régressions.                                                                                                  |
| Travail assisté par Codex          | Inspection du dépôt, implémentation, scénarios fictifs, règles de priorité, garde de clôture, tests, opérations Git autorisées, vérifications du navigateur et rédaction des documents.                                                                            |

L’ordre dommage → contrat → remplacement → qualité et les critères de revue sont des **choix du prototype**, pas des procédures internes approuvées par MénageSimple. Une validation métier par un responsable reste nécessaire.

## Pourquoi des règles déterministes ?

Le périmètre est petit, les catégories sont connues et les décisions à risque doivent être explicables. Les règles donnent une entrée, un signal visible et un résultat reproductible. Elles évitent un service payant, des clés, l’envoi des messages à un tiers et l’instabilité d’une génération à l’exécution. Elles ne prétendent pas comprendre toute la langue française.

Principe appliqué : **logiciel déterministe pour les décisions prévisibles et auditables ; assistance IA là où sa valeur de développement peut être évaluée.** Ici, le travail produit et ses corrections sont inspectables ; le gain de temps dû à l’IA n’a pas été mesuré. Aucun pourcentage d’accélération n’est revendiqué.

## Comment le code généré a été contrôlé

- **Inspection technique :** logique séparée de l’interface, TypeScript strict, états et persistance relus, dépendances limitées.
- **Tests exécutés :** scénarios positifs et négatifs, escalade des dommages, multi-sujets, absence de promesses dans les modèles, indicateurs, filtres réinitialisés, transitions, approbation et sauvegardes anciennes. Résultats et commandes : [QA_EVIDENCE.md](./QA_EVIDENCE.md).
- **Contrôle du navigateur par l’agent :** messages originaux comparés aux suggestions, édition / réapprobation, rechargement, statut, historique, vue mobile et contrôles sur la version hébergée lorsqu’ils ont réellement été exécutés.
- **Sources publiques :** FAQ et conditions relues ; page officielle MarIA et portefeuille Stonks consultés dans le navigateur le 13 novembre. Ces pages cadrent le concept sans révéler les systèmes internes.

La démarche a trouvé des erreurs : première classification multi-sujets incomplète, compteur trop large, intitulés peu utiles, puis absence de motif obligatoire pour clôturer avec des éléments critiques manquants. Les changements et leurs tests se trouvent dans le dépôt. Les sorties de l’IA n’ont pas été acceptées comme preuve de leur propre exactitude.

## Où l’humain reste nécessaire

Une revue et une approbation sont nécessaires avant résolution. Une modification du brouillon invalide son approbation. Si des informations critiques restent manquantes, la clôture exige un motif explicite, conservé avec les lacunes dans l’historique. Ce motif n’accorde ni remboursement, ni assurance, ni rendez-vous. La saisie libre reste sous responsabilité de son auteur.

Une négation explicite reconnue ou une contradiction conduit à « À vérifier » ; les signaux de dommage restent visibles par précaution. Les tournures complexes, fautes, implicites et négations non reconnues restent des limites. Un signal lexical n’établit jamais une responsabilité.

## Séparation des niveaux de preuve

Les tests automatisés, lectures de sources et actions du navigateur ont été exécutés par l’agent. Ce ne sont **ni une revue humaine indépendante, ni un pilote métier**. Les briefs mentionnent des QA antérieures ; nous n’inventons ni identité de testeur ni procès-verbal de validation externe.

Avant soumission, le propriétaire doit : relire les règles et textes ; refaire le parcours complet sur son navigateur ; vérifier le partage du dépôt privé avec le destinataire prévu ; enregistrer et chronométrer la démonstration. Aucun accès au dépôt n’est ajouté automatiquement. **La vidéo n’a pas été enregistrée par cette session.**
