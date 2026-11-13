# Vérifications exécutées

## Mise à jour QA finale — 13 novembre 2026

Les résultats historiques du 12 novembre ci-dessous sont conservés comme trace de la première version. La définition du compteur a changé : le jeu initial compte désormais **8 dossiers, 5 revues spécifiques, 2 en attente client et 1 résolu**. Les anciennes captures à sept revues décrivent uniquement la version initiale.

Contrôles exécutés après les correctifs :

- `npm test` : **57 tests réussis dans 3 fichiers**, comprenant les scénarios antérieurs et 20 tests QA supplémentaires. Les attentes des deux tests de compteur et du test multi-intentions ont été adaptées au comportement demandé ; aucun scénario antérieur n’a été supprimé.
- `npm run build` : **réussi**, avec validation TypeScript stricte puis production Vite. Bundle observé : environ 265 kB de JavaScript / 83 kB gzip et 25 kB de CSS / 6 kB gzip.
- Le premier passage de QA a révélé une erreur de type sur le repli « À vérifier » et une attente de test portant sur le second signal qualité au lieu du premier signal réellement expliqué. Ces deux problèmes ont été corrigés avant la réussite complète.

Parcours de navigateur exécutés sur le serveur local :

1. Vérification du compteur initial **5**, distinct des sept dossiers non résolus ; le dossier qualité courant et la demande de remplacement complète sont exclus.
2. Création du message exact du brief : vase cassé, vitres sales et compensation. Titre « Vase endommagé et ménage insatisfaisant », dommage principal, qualité secondaire, deux recommandations distinctes, photos attendues et décision financière humaine. Les compteurs passent à neuf dossiers et six revues spécifiques.
3. Rechargement sans réinitialisation : le nouveau dossier et son titre restent présents. Filtre Qualité du ménage : le dossier apparaît grâce au sujet secondaire.
4. Tentative de résolution sans revue / approbation : refus explicite. Édition du brouillon puis confirmation de revue : le compteur passe de six à cinq.
5. Approbation locale et statut En attente client, puis rechargement : titre, message original, texte édité, approbation, revue, statut et historique conservés. Passage à Résolu : neuf dossiers, cinq revues spécifiques, deux en attente client et deux résolus.
6. Ouverture de la file Revue spécifique : cinq lignes correspondant aux cinq dossiers attendus, calculées par la même fonction que la carte.
7. Inspection visuelle du détail multi-sujets sur ordinateur et à 390 × 844. Pas de débordement horizontal constaté sur le détail (document 375 px pour viewport 390 px avec barre de défilement). Le viewport temporaire a été réinitialisé. Aucun avertissement ni erreur dans la console inspectée.

Les sauvegardes anciennes sans nouveaux champs sont couvertes par trois tests de compatibilité : huit dossiers rechargés à l’identique ; anciens titre, brouillon et historique conservés ; nouveau dossier validé conservé après aller-retour JSON. Les informations de triage ajoutées sont calculées à la lecture ; aucune migration destructrice ni modification de clé LocalStorage. Le test de navigateur a ajouté un dossier synthétique et l’a conservé ; aucune réinitialisation n’a été effectuée pour cette mise à jour.

Captures QA : [dossier multi-sujets](./docs/qa-multi-issue.jpg), [file de revue spécifique et compteurs](./docs/qa-review.jpg).

### Contrôle de la démonstration hébergée après push

Après publication du commit de code `f46a2f7` sur `main`, le navigateur a chargé https://menagesimple-caseflow.vercel.app/ : le libellé « Revue spécifique requise » et les cinq dossiers initiaux à revoir étaient présents. Le message multi-sujets exact du brief a ensuite été créé sur cette origine. Le titre descriptif, le dommage principal, la qualité secondaire, les deux recommandations et le brouillon prudent ont été observés. Les compteurs sont passés à neuf dossiers et six revues spécifiques. Après rechargement, le même dossier, son titre, son message et ses deux sujets sont toujours présents. Aucune réinitialisation du stockage de cette origine n’a été effectuée. [Capture du contrôle en ligne](./docs/qa-live.jpg).

Ces parcours restent des vérifications pilotées par l’agent, pas une revue humaine indépendante ni une suite E2E rejouable. Les autres étapes de revue, édition, approbation et résolution ont été vérifiées localement ; elles n’ont pas toutes été rejouées sur Vercel. Avant soumission, le propriétaire doit relire les règles, les négations, les cas inhabituels et les politiques métier, puis effectuer le parcours complet dans son navigateur habituel. Aucune intégration officielle MarIA n’existe dans ce prototype ; aucun gain opérationnel n’a été mesuré.

## Première version — 12 novembre 2026

Vérifications réalisées par Codex le **12 novembre 2026** dans le projet local. Elles ne constituent pas une validation par le propriétaire ou par MénageSimple.

## Contrôles automatisés

| Commande        | Résultat réellement observé                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| `npm install`   | Installation effectuée, fichier de verrouillage généré ; audit npm : 0 vulnérabilité signalée à cette date |
| `npm test`      | **37 tests réussis**, 2 fichiers de test, aucun échec                                                      |
| `npm run build` | **Réussi** : TypeScript strict puis build Vite de production                                               |

Le build final observé produit notamment un bundle JavaScript d’environ **262 kB / 82 kB gzip** et une feuille CSS d’environ **25 kB / 6 kB gzip**. Ces tailles décrivent le prototype, pas une mesure de performance utilisateur.

Les premiers essais d’installation, de tests et de build ont été bloqués par le sandbox Windows (accès réseau ou lecture par esbuild). Les commandes ont ensuite été réellement exécutées avec les autorisations accordées. Aucun correctif de contournement du sandbox n’a été ajouté au projet.

Les tests couvrent :

- Classification d’une plainte qualité avec explication et recommandation prudente.
- Escalade d’un dommage même lorsque le message contient aussi une annulation.
- Référence, date, précisions et justificatifs manquants.
- Demandes inconnues, vides, ambiguës ou à intentions multiples.
- Annulation sous 48 h, exactement 48 h, dates passées et décision humaine requise.
- Distinction entre l’absence du client et un besoin de remplacement.
- Absence de promesse financière ou de couverture dans les modèles générés.
- Transitions de statut ; résolution bloquée sans revue et approbation ; réouverture invalidant la validation.
- Invalidation d’une approbation après édition, refus d’un brouillon vide, regroupement des séquences d’édition.
- Correction motivée et traçable des catégories.
- Huit dossiers initiaux, compteurs calculés et mise à jour après résolution.
- Aller-retour JSON, données corrompues ou identifiants dupliqués refusés.
- Création d’un dossier de simulation et prévention des doublons textuels normalisés.

## Parcours exécutés dans le navigateur

Sur le serveur Vite local, avec observation du DOM et captures d’écran :

1. Ouverture de la boîte de réception et vérification des indicateurs initiaux 8 / 7 / 2 / 1.
2. Ouverture du dossier Camille ; tentative de résolution avant revue : refus explicite affiché.
3. Modification du brouillon, confirmation de revue, approbation puis résolution. L’historique enregistre les étapes, les compteurs passent à 8 / 6 / 2 / 2.
4. Rechargement : le dossier résolu et les compteurs modifiés sont conservés.
5. Filtres combinés Nouveau + Dommage matériel : seul Alex reste affiché. Recherche sans correspondance : état vide et bouton de retour fonctionnels.
6. Simulation d’un résumé ambigu : création d’un neuvième dossier, catégorie À vérifier, référence et date manquantes. Nouvelle soumission du même message : doublon refusé.
7. Dossier Alex : dommage prioritaire, escalade humaine, demande de photos, absence de décision d’assurance. Checklist et passage En attente client fonctionnels.
8. Dossier Sophie : préavis indicatif de 24 h à réception, repère 48 h et lien vers les conditions publiques. Correction motivée vers À vérifier visible dans le dossier et l’historique.
9. Vue mobile, viewport demandé de 390 × 844 : navigation et cartes adaptées, formulaire de simulation lisible. Un débordement du libellé accessible de la table a été corrigé ; après correction, largeur document 375 px pour viewport 390 px (barre de défilement comprise), tableau défilant dans son conteneur de 341 px. Détail de dossier également consulté au format mobile. Le viewport temporaire a ensuite été réinitialisé.
10. La confirmation native de réinitialisation a bloqué l’outil de navigateur ; elle a été remplacée par une confirmation intégrée à l’interface. Cette nouvelle confirmation et la confirmation de remplacement du brouillon ont été exécutées avec succès. Les huit dossiers initiaux ont été restaurés.
11. Aucun avertissement ni erreur relevé par l’outil de console sur l’onglet final inspecté.

Ces contrôles sont des parcours de navigateur pilotés par l’agent, pas des tests E2E automatisés rejouables. Les tests Vitest restent indépendants de l’interface.

Captures de la version vérifiée :

- [Boîte de réception](./docs/caseflow-inbox.jpg)
- [Dossier et triage](./docs/caseflow-detail.jpg)

## Revue humaine à effectuer avant soumission

- Relire les textes français et le brief de recrutement ; refaire le parcours de démonstration en moins de trois minutes.
- Vérifier les pages publiques à la date de présentation, notamment la page MarIA non récupérable lors de la recherche de cette session.
- Confirmer les règles avec un responsable métier avant tout pilote ; tester négations, fautes de frappe et formulations atypiques.
- Vérifier les navigateurs réellement utilisés par les opérateurs, navigation au clavier, lecteur d’écran et contrastes. Aucune certification d’accessibilité n’est revendiquée.
- Vérifier l’installation avec `npm ci` sur une autre machine et le service des fichiers `dist/` dans l’environnement de revue choisi. L’installation exécutée ici était `npm install`.
- Ne saisir aucune donnée réelle : aucune procédure de sécurité ou de conservation adaptée à la production n’a été mise en place.

Aucun résultat d’exploitation, économie, intégration MarIA ou validation humaine indépendante n’est revendiqué.
