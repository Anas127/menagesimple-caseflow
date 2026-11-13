# Preuves de vérification — 13 novembre 2026

Ce document sépare les tests exécutables des parcours de navigateur pilotés par Codex. Ces derniers ne constituent pas une revue humaine indépendante. Le journal [VERIFICATION.md](./VERIFICATION.md) conserve les contrôles antérieurs ; ses anciens nombres de tests décrivent leurs versions respectives.

## Commandes réellement exécutées

Dans `C:\Users\PC\Desktop\telos`, sous Windows, Node 24.15.0 et npm 11.12.1 :

| Commande               | Résultat observé                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| `npm test`             | **78 tests réussis, 5 fichiers**, aucun échec. La découverte est limitée à `src/**/*.test.{ts,tsx}`. |
| `npm run typecheck`    | **Réussi**, `tsc --noEmit`, aucune erreur TypeScript.                                                |
| `npm run build`        | **Réussi**, TypeScript puis Vite. JS 267,22 kB / 83,57 kB gzip ; CSS 25,22 kB / 6,54 kB gzip.        |
| `npm run format:check` | **Réussi**, tous les fichiers contrôlés respectent le format Prettier.                               |

Les commandes Vitest / Vite ont été exécutées avec les autorisations nécessaires après les restrictions esbuild du sandbox Windows observées lors des premières sessions. Ce comportement de l’environnement ne nécessite aucun changement du projet sur une installation normale.

### Reproduction par installation propre

Une copie séparée a été créée sous `.qa-reproduction/`, **sans node_modules**, avec `src`, `package.json`, `package-lock.json`, `index.html`, `tsconfig.json`, `vite.config.ts` et `.gitignore`. Ce répertoire de contrôle est ignoré par Git et Prettier, et n’est pas un livrable produit.

Commandes réellement exécutées dans cette copie :

```sh
npm ci --cache ../.npm-cache
npm test
npm run typecheck
npm run build
```

Résultats : installation verrouillée réussie, audit npm signalant zéro vulnérabilité à cet instant, **78 tests / 5 fichiers réussis**, TypeScript et build réussis. L’audit npm n’est pas un audit de sécurité complet.

La première copie n’avait pas `.gitignore` et la détection automatique Tailwind produisait davantage de CSS. La détection a été rendue explicite dans `src/index.css` (`source(none)` puis `@source './'`) pour ne scanner que les sources du produit, indépendamment des documents et répertoires de contrôle. Après reconstruction des deux copies, les fichiers `index-re4f-q2i.js` et `index-Dd4CC2gO.css` ont des **SHA-256 identiques** entre installation courante et installation propre, vérifiés avec `Get-FileHash`. Cette observation porte sur ces deux builds sur la même machine ; ce n’est pas une promesse d’identité binaire sur toutes les plateformes.

Pour reproduire depuis le dépôt sur une autre machine :

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run dev
```

## Couverture des 18 attentes du brief

| Attente                                         | Preuve automatisée principale                                                                                  |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Qualité et dommage classés correctement         | `triage.test.ts`, `qa.test.ts`                                                                                 |
| Multi-sujets, priorité et secondaires conservés | `qa.test.ts` : exemple exact du brief, quatre sujets et ordre du texte inversé                                 |
| Informations manquantes                         | `triage.test.ts`, `qa.test.ts`                                                                                 |
| Ambiguïté, entrée vide ou inconnue              | `triage.test.ts`                                                                                               |
| Escalade humaine et décisions financières       | `triage.test.ts`, `qa.test.ts` : dommage obligatoire et modèles sans promesse financière                       |
| Métrique de revue et confirmation               | `qa.test.ts` : dossiers attendus, complétude, confirmation / révocation, correction et statuts                 |
| Transitions de statut                           | `cases.test.ts`, `safeguards.test.ts`                                                                          |
| Édition invalidant l’approbation                | `cases.test.ts`, `safeguards.test.ts`                                                                          |
| Approbation persistée                           | `qa.test.ts`, `safeguards.test.ts` : aller-retour JSON                                                         |
| Titres français                                 | `qa.test.ts` : cas simple, multiple, objet explicitement relié et repli neutre                                 |
| Recherche et filtres remis à zéro               | `inbox.test.ts` : recherche vide / espaces, Tous les statuts, Toutes les catégories et combinaison             |
| Totaux indépendants des filtres                 | `inbox.test.ts` : jeu complet et absence de mutation                                                           |
| Compatibilité LocalStorage                      | `cases.test.ts`, `qa.test.ts` : ancien schéma accepté, anciens textes / historique intacts                     |
| Clôture malgré lacunes critiques                | `safeguards.test.ts` : motif obligatoire, trop court refusé, revue non contournable, historique et persistance |
| Formulations négatives ou contradictoires       | `safeguards.test.ts` : À vérifier, dommage conservé par prudence ; tâche non nettoyée reconnue                 |

Les 57 scénarios antérieurs sont conservés ; une attente de clôture sur dossier incomplet a été adaptée pour fournir le nouveau motif. **21 tests supplémentaires** portent sur les filtres et garde-fous. La correspondance ci-dessus couvre les 18 attentes, certaines étant regroupées dans une même ligne. Aucun pourcentage de couverture instrumentée n’est revendiqué.

## Parcours navigateur : attendu et observé

Exécutés sur le serveur Vite local, via remplissage des champs, sélections natives, clics et clavier. Les données déjà sauvegardées n’ont pas été effacées. Au début du contrôle, neuf dossiers étaient présents, dont un créé lors de la précédente QA.

| Étape reproductible                                                 | Attendu                                                     | Observé                                                                                                            |
| ------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Rechercher Camille puis vider le champ                              | Retour au jeu complet, sous réserve des autres filtres      | 9 → 1 → 9 lignes                                                                                                   |
| Statut Nouveau puis Tous les statuts                                | Suppression de la contrainte                                | 4 → 9 lignes                                                                                                       |
| Dommage matériel puis Toutes les catégories                         | Suppression de la contrainte                                | 2 → 9 lignes                                                                                                       |
| Recherche sans résultat puis Afficher tous les dossiers             | État vide exact, retour à la liste                          | 0 → 9 lignes ; totaux globaux inchangés                                                                            |
| Approuver Camille, modifier le brouillon, approuver à nouveau       | Ancienne approbation invalide puis nouvelle approbation     | Bouton approuvé désactivé → Approuver actif → approuvé désactivé ; deux événements d’approbation dans l’historique |
| Alex : revue + approbation, puis Résolu avec photos non cochées     | Clôture non immédiate et demande de motif                   | Statut reste Nouveau ; panneau des éléments critiques et champ de motif affichés                                   |
| Confirmer sans motif                                                | Erreur utile, aucun changement de statut                    | Refus explicite : motif d’au moins 10 caractères                                                                   |
| Motif de scénario QA, confirmation, rechargement                    | Statut / motif / approbation / texte / historique conservés | Résolu, motif visible et événement de clôture contenant la photo manquante ; brouillon approuvé inchangé           |
| Ouvrir la simulation, Tab puis Échap                                | Focus lisible et retour au déclencheur                      | Focus initial sur résumé, Tab sur Annuler ; contours 2 px ; Échap ferme et rend le focus à Simuler un appel        |
| Créer un message français de 967 caractères avec dommage et qualité | Message lisible, titre court, deux sujets                   | « Lampe endommagée et ménage insatisfaisant » ; les deux sujets restent affichés                                   |
| Vérifier à 390 × 844 et 1024 × 768                                  | Pas de débordement horizontal global                        | Largeurs document observées 375 et 1009 px, inférieures aux viewports ; passage mobile vérifié visuellement        |

Un premier essai de redimensionnement s’appliquait à un autre onglet actif ; il n’a pas été retenu comme preuve responsive. Les dimensions ont ensuite été **mesurées sur le bon onglet** avant capture. Le viewport temporaire a été réinitialisé.

Textes de table, quatre statuts, trois urgences, sous-texte de carte et bandeau : contrastes échantillonnés à partir des couleurs calculées du navigateur entre **5,07:1 et 5,92:1** après correction de teintes trop pâles. Cela ne certifie pas tous les états, contenus et contrôles WCAG. Aucun avertissement ni erreur dans les journaux de console inspectés.

Captures : [inbox finale](./docs/final-inbox.jpg), [clôture motivée](./docs/final-closure.jpg), [message long sur mobile](./docs/final-mobile.jpg). Les compteurs de ces captures reflètent les actions de QA, pas le jeu initial ni des données réelles.

## Vérifications des sources et des données du dépôt

FAQ et conditions publiques consultées le 13 novembre ; pages officielles MarIA et Stonks lues directement dans le navigateur. Les faits utiles sont liés dans [BUSINESS_CASE.md](./BUSINESS_CASE.md). Les anciennes mentions de source non récupérable dans VERIFICATION.md sont historiques et ne décrivent plus le résultat de cette session.

Une recherche bornée des motifs de clés usuelles (OpenAI, GitHub, AWS, clés privées PEM), hors dépendances, Git, builds et copie de reproduction, n’a trouvé **aucun motif correspondant**. Aucun fichier `.env*` à la racine. Inspection des scénarios : noms abrégés et messages fictifs, références DEMO ; aucune donnée client réelle ajoutée. Ce contrôle ne garantit pas l’absence de toute forme possible de secret ou de donnée personnelle.

## Limites et actions humaines restantes

- Pas de suite E2E navigateur installée dans le dépôt : les tests des fonctions utilisées par l’interface sont rejouables ; les parcours UI ci-dessus restent à refaire manuellement. Aucun framework supplémentaire ajouté.
- Pas de matrice Chrome / Firefox / Safari complète, lecteur d’écran ou certification d’accessibilité. Quota LocalStorage plein, mode privé et modifications simultanées entre onglets ne sont pas réexécutés dans cette passe.
- Persistance vérifiée par JSON et navigateur ; pas de backend, d’identification d’opérateur ou de journal infalsifiable. Un utilisateur peut altérer son propre stockage.
- Les négations non reconnues, fautes et phrases complexes peuvent encore tromper les règles. Les pièces cochées ne sont pas vérifiées techniquement.
- Revue humaine du français, des règles et du scénario métier à faire ; aucun responsable MénageSimple n’a validé le prototype. Aucun pilote ni impact réel mesuré.
- Script d’environ **environ 290 mots**, prévu pour 2 min 40 avec gestes en parallèle. **Vidéo non enregistrée, durée réelle non mesurée.**
- Le contrôle hébergé ci-dessous est ciblé ; les autres parcours de cette passe restent des contrôles locaux. Le succès d’un build seul ne prouve pas un déploiement.

## Déploiement vérifié après publication

Après le push du commit de code **`eb7d7f4`**, le navigateur a chargé https://menagesimple-caseflow.vercel.app/ et observé le script **`/assets/index-re4f-q2i.js`**, correspondant au build contrôlé. Le déploiement de ce code est donc observé, pas déduit du push.

Sur un dossier multi-sujets déjà conservé dans le LocalStorage de cette origine, la revue et l’approbation ont été confirmées. Sélectionner Résolu a affiché le **nouveau panneau de clôture motivée**, avec référence, date et photos encore manquantes ; le statut est resté Nouveau. « Continuer le suivi » a fermé le panneau sans clôturer. Le dossier a ensuite été placé En attente client ; après rechargement, son message, ses deux sujets, son brouillon approuvé et son historique sont toujours présents. Aucun stockage existant n’a été réinitialisé, aucun message client envoyé et aucune clôture financière exécutée.

[Capture du garde-fou sur la version hébergée](./docs/final-live-guard.jpg). L’enregistrement de cette preuve et les dernières corrections documentaires ne changent pas le code de l’application vérifié ci-dessus.
