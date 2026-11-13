# MénageSimple CaseFlow

**[Ouvrir la démonstration](https://menagesimple-caseflow.vercel.app/)** · [Démonstration en 2 min 40](./DEMO_SCRIPT.md) · [Preuves QA](./QA_EVIDENCE.md) · [Auto-évaluation](./SUBMISSION_AUDIT.md)

CaseFlow est une console française de suivi des demandes clients : comprendre les sujets, identifier les informations manquantes et choisir une prochaine étape. Un opérateur adapte et approuve une réponse, puis suit le dossier avec un historique local. C’est un prototype indépendant sur données synthétiques, sans connexion aux systèmes MénageSimple.

## Opportunité métier

La [présentation officielle de MarIA](https://menagesimple.com/assistante-telephonique-ia-maria/) décrit une assistante qui recueille les demandes hors horaires et transmet un résumé à l’équipe. CaseFlow explore le traitement humain qui pourrait suivre : plusieurs sujets dans un même message, informations incomplètes et décisions à vérifier. Nous ne connaissons pas les outils internes de MénageSimple et n’affirmons pas qu’une fonction de suivi lui manque.

Le [business case](./BUSINESS_CASE.md) contient les références officielles revérifiées le 13 novembre 2026 et un protocole de validation. Aucun gain de temps, résultat client ou ROI mesuré n’est revendiqué.

## Ce que démontre le prototype

- Huit dossiers fictifs initiaux ; recherche et filtres combinables par statut et sujet principal ou secondaire.
- Simulation de résumé d’appel, prévention des doublons et titre français descriptif.
- Triage déterministe : **dommage → annulation / modification → remplacement → qualité**. Chaque sujet conserve son explication, ses informations et son action. Une demande non reconnue ou une négation explicite reconnue reste « À vérifier ».
- Consultation du message original et des références publiques ; correction motivée de la catégorie ; checklist des informations attendues.
- Brouillon éditable et approbation locale. Une édition invalide l’approbation ; tous les dossiers nécessitent une revue et un brouillon approuvé avant résolution.
- Clôture avec informations critiques encore manquantes uniquement avec un **motif explicite**, enregistré avec les lacunes dans l’historique. Aucun accord financier ni message envoyé.
- Statuts Nouveau, En cours, En attente client, Résolu ; indicateurs calculés et persistance après rechargement.

**Revue spécifique requise** compte les dossiers ouverts sans revue confirmée, avec un motif d’escalade (dommage, ambiguïté, contrat, décision financière) ou une information critique non cochée. Une correction vers À vérifier peut également déclencher cette revue. Une disponibilité de remplacement à confirmer ne suffit pas : les tâches courantes restent distinctes. Le compteur et sa file utilisent la même fonction ; confirmer une revue retire le dossier de la file, sans prétendre résoudre le problème opérationnel.

Le jeu initial donne **8 dossiers / 5 revues spécifiques / 2 en attente client / 1 résolu**. Les actions modifient ces valeurs ; les filtres de vue ne modifient pas les totaux. Ne pas réinitialiser un stockage existant pour retrouver ces chiffres ; utiliser un profil de démonstration séparé.

## Architecture

React 19, TypeScript strict, Vite 7, Tailwind CSS 4, Vitest 4 et LocalStorage. Lucide fournit les icônes ; Prettier formate les sources. Aucun routeur, backend, compte, clé API, service payant ou nouveau framework.

```text
Résumé fictif / message → triage.ts → sujets, signaux, lacunes, recommandations
                        → titles.ts + recommendations.ts → titre et brouillon
Actions opérateur       → cases.ts → validations, transitions, historique, métriques
Interface React         → useCases.ts → JSON LocalStorage (caseflow.demo.v1)
Recherche / filtres     → inbox.ts → sous-liste ; les métriques gardent le jeu complet
```

Les règles sont séparées des composants. La priorité est une hypothèse de conception, pas une procédure interne approuvée. Le préavis compare réception et prestation, avec affichage en heure suisse, sans calcul de frais. Les liens vers la [FAQ](https://menagesimple.com/questions-frequentes-menage/) et les [conditions](https://menagesimple.com/conditions-generales/) restent des repères à vérifier dans le dossier individuel.

## Reproduction

Prérequis : **Node.js ≥ 22.12**, npm. Environnement vérifié : Node 24.15.0, npm 11.12.1. Le verrouillage des dépendances est inclus.

```sh
npm ci
npm run dev
```

Ouvrir l’URL locale imprimée par Vite, habituellement http://127.0.0.1:5173/. Puis :

```sh
npm test
npm run typecheck
npm run build
npm run preview
npm run format:check
```

Le build produit `dist/`. Aucun fichier .env n’est nécessaire. L’installation propre avec `npm ci`, les tests, TypeScript et le build ont aussi été exécutés dans une copie séparée des sources, sans réutiliser node_modules ; procédure et résultats dans [QA_EVIDENCE.md](./QA_EVIDENCE.md).

## Vérification

**78 tests réussis dans 5 fichiers**, TypeScript et build de production réussis. Les tests couvrent classification, multi-sujets, escalade, modèles sans promesse automatique, métriques, filtres et réinitialisation, transitions, invalidation d’approbation, motif de clôture, titres et données sauvegardées anciennes.

Les parcours du navigateur sont consignés séparément : filtres remis à zéro, édition et réapprobation, clôture motivée, historique, rechargement et responsive. [QA_EVIDENCE.md](./QA_EVIDENCE.md) fournit les commandes, résultats attendus / observés et limites ; [VERIFICATION.md](./VERIFICATION.md) conserve les vérifications historiques. Ce sont des contrôles de l’agent, pas une validation humaine indépendante ou un pilote avec l’entreprise.

## Développement assisté par IA

Codex a aidé à coder, tester, rechercher les sources et documenter. **Aucun LLM n’est utilisé à l’exécution.** Le périmètre et la stack viennent des briefs humains ; les détails des règles et garde-fous restent à approuver par le propriétaire et un responsable métier. [AI_AND_VERIFICATION.md](./AI_AND_VERIFICATION.md) distingue précisément assistance IA, résultats exécutés et revue humaine restante.

## Hypothèses et limites

- Données entièrement fictives ; aucun accès aux systèmes internes et **aucune intégration officielle MarIA**. Le format réel des résumés est inconnu.
- Aucune communication client, réservation, compensation ou couverture d’assurance exécutée. Un opérateur peut écrire librement une réponse ; son approbation reste sous sa responsabilité.
- Règles lexicales françaises : faux positifs, fautes, implicites et négations non reconnues restent possibles. Le repli prudent n’est pas une compréhension générale du langage. Les objets ne sont nommés dans un nouveau titre que si une construction reconnue les relie au dommage.
- LocalStorage par navigateur et origine, sans vrai backend multi-utilisateur, synchronisation ou protection d’accès de production. Le journal local est modifiable et ne constitue pas une piste d’audit réglementaire.
- Les anciens dossiers sont conservés : sujets et motifs de revue sont recalculés depuis leurs champs existants ; aucun reset pour migration. Anciens titres et brouillons ne sont pas écrasés. Le nouveau champ optionnel de motif de clôture n’est exigé qu’à une nouvelle clôture avec lacunes critiques.
- Les photos ne sont pas chargées ni vérifiées. La checklist atteste une action de l’opérateur, pas la présence technique d’un justificatif.
- Écran ordinateur et mobile contrôlés, tableau défilant sur petit écran. Pas de certification WCAG, d’audit complet des lecteurs d’écran ou de comparaison exhaustive des navigateurs.
- Exercice volontairement limité. Aucun temps humain réel total ni score de recrutement n’est attesté. **La vidéo reste à enregistrer et chronométrer.**

## Validation future

Confirmer d’abord que le besoin existe avec les opérateurs, puis comparer un petit lot de dossiers équivalents avec et sans prototype. Mesurer temps de triage, reclassification, informations critiques manquantes, première action humaine et relances évitables. Examiner les erreurs avant d’annoncer un effet : [protocole proposé](./BUSINESS_CASE.md).

Avant soumission, relire règles et textes, refaire le parcours, vérifier l’accès du recruteur au dépôt privé et enregistrer la vidéo selon [DEMO_SCRIPT.md](./DEMO_SCRIPT.md). Aucune invitation ni soumission n’est effectuée automatiquement.
