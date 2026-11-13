# MénageSimple CaseFlow

Une console de suivi client en français : comprendre une demande, repérer les informations manquantes, relire une réponse, puis décider de la suite. Prototype indépendant sur huit dossiers entièrement fictifs. Aucun compte, aucune clé API, aucun système de production connecté.

## Démarrer en une minute

Prérequis : Node.js **22.12 ou plus récent** et npm. Vérifié dans cet environnement avec Node 24.15.0 et npm 11.12.1.

```sh
npm ci
npm run dev
```

Ouvrir l’URL locale indiquée par Vite (habituellement http://127.0.0.1:5173). Puis :

```sh
npm test
npm run build
npm run preview
```

Le fichier `package-lock.json` fixe les versions installées. Aucun téléchargement à l’exécution : polices système, icônes embarquées, règles locales. Les liens documentaires s’ouvrent uniquement à la demande de l’opérateur. `dist/` contient le résultat statique du build. Démonstration hébergée fournie dans le brief QA : https://menagesimple-caseflow.vercel.app/. Le scénario multi-sujets, le compteur corrigé et la persistance après rechargement ont également été vérifiés sur cette URL après le push des correctifs ; détails dans le relevé de vérification.

## Pourquoi ce prototype ?

L’hypothèse est qu’un dossier structuré pourrait faciliter le traitement humain des demandes après réception d’un message ou d’un résumé d’appel. CaseFlow met en évidence la prochaine étape et les éléments à demander, puis conserve les décisions locales. Il ne reconstruit ni la réservation ni la mise en relation avec les intervenants.

Nous ne connaissons pas les systèmes internes de MénageSimple et ne prétendons pas qu’un outil de gestion des réclamations lui manque. La valeur proposée reste une hypothèse à confronter à l’équipe. Aucun gain de temps, chiffre d’affaires ou indicateur opérationnel réel n’est annoncé.

## Parcours utilisable

1. Ouvrir l’un des huit dossiers ; filtrer par statut ou catégorie, ou rechercher un nom ou une référence.
2. Comparer le message original au triage : catégorie suggérée, signal détecté, urgence, informations manquantes et recommandation.
3. Consulter les références publiques. Une catégorie peut être corrigée avec un motif enregistré. Les précautions initiales restent visibles.
4. Cocher uniquement les informations réellement vérifiées. Adapter le brouillon ; une modification invalide l’approbation antérieure.
5. Confirmer la revue humaine, approuver le brouillon localement, puis passer le dossier à « Résolu ». Aucun message n’est envoyé.
6. Revenir à la boîte de réception : les compteurs sont recalculés. Les données persistent après rechargement.
7. « Simuler un appel » crée un dossier depuis un résumé fictif, sans inventer de référence de réservation. Les doublons textuels normalisés sont refusés.

Les quatre statuts sont Nouveau, En cours, En attente client et Résolu. Tous les changements entre statuts ouverts sont permis ; une résolution exige une revue et une approbation. Réouvrir un dossier annule ces validations pour permettre une nouvelle revue. C’est un choix du prototype, **pas une procédure interne MénageSimple**.

Les informations manquantes n’empêchent pas automatiquement une clôture : un opérateur peut conclure que la demande n’exige pas toutes ces pièces, après revue. Aucun remboursement, rendez-vous, remplacement, couverture d’assurance ou droit contractuel n’est accordé par le programme. Un opérateur peut écrire une promesse dans le champ libre ; la responsabilité de sa validation reste humaine.

## Logique explicable

`src/domain/triage.ts` applique des règles lexicales françaises normalisées (accents, casse, espaces). Aucun modèle de langage ne tourne dans l’application.

| Signal                          | Suite suggérée                                                                | Garde-fou                                                 |
| ------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------- |
| Qualité du ménage               | Préciser les points à reprendre, examiner un passage correctif                | Aucune visite promise                                     |
| Dommage matériel                | Évaluation par un responsable, photos à recueillir                            | Escalade obligatoire même en présence d’autres intentions |
| Annulation / modification       | Vérifier le préavis indicatif à réception et les conditions publiques de 48 h | Aucuns frais ni droit calculés                            |
| Remplacement                    | Confirmer la prestation et les disponibilités                                 | Aucune affectation ni réservation                         |
| Message sans intention reconnue | « À vérifier », clarification                                                 | Clarification humaine avant décision                      |

Le préavis compare l’horodatage de réception à celui de la prestation, et non à l’horloge actuelle : le jeu fictif reste reproductible. Les dates sont affichées dans le fuseau `Europe/Zurich`. Une date passée ou absente donne un préavis indéterminable. L’urgence n’est pas un engagement de délai de traitement.

### Plusieurs sujets, une priorité explicite

Toutes les catégories reconnues sont conservées. La priorité déterministe du prototype est **dommage matériel → annulation / modification → remplacement → qualité du ménage** : protection des biens, vérification contractuelle, continuité de prestation, puis qualité. Cet ordre est une hypothèse du prototype, à valider avec l’entreprise. Il choisit la catégorie principale ; les autres apparaissent séparément comme sujets secondaires. Un message sans signal reconnu reste « À vérifier ».

Chaque sujet conserve son action, ses informations attendues, ses indicateurs et ses références. Par exemple, un vase cassé accompagné de vitres sales déclenche l’évaluation du dommage **et** l’examen d’un éventuel passage correctif. Le brouillon initial et sa régénération traitent les deux sujets. Aucune compensation ni couverture n’est accordée. Une correction de catégorie ne supprime pas les précautions liées aux sujets détectés. Les filtres recherchent aussi les catégories secondaires et la catégorie suggérée initiale.

Les nouveaux dossiers reçoivent un titre français déterministe, par exemple « Vase endommagé et ménage insatisfaisant ». Un objet n’est nommé que si une construction reconnue le relie explicitement au dommage ; sinon le titre reste générique. Le titre présente les deux premiers sujets puis le nombre d’autres sujets éventuels. Le message original est conservé séparément.

### Compteur « Revue spécifique requise »

Les compteurs sont calculés à partir de l’état des dossiers. **Revue spécifique requise** inclut uniquement les dossiers non résolus, sans revue confirmée, avec au moins l’un des motifs suivants :

- Dommage, demande ambiguë, annulation / modification, demande de remboursement, compensation ou assurance nécessitant une décision humaine.
- Information critique encore non cochée : référence, date / heure, description du dommage, photos, points qualité à préciser ou nature de la demande.
- Correction opérateur explicite vers « À vérifier ».

Des disponibilités de remplacement à confirmer sont une tâche courante : elles ne suffisent pas à déclencher ce compteur. Un dossier qualité complet, sans demande financière, reste également hors de cette file même s’il est ouvert. **La revue et l’approbation avant résolution restent obligatoires pour tous les dossiers.**

Le compteur et le filtre utilisent la même fonction `requiresHumanReview`. Confirmer une revue retire le dossier de la file ; révoquer la revue ou modifier la checklist / catégorie peut le réintroduire. Compléter les informations critiques suffit pour un dossier courant, mais ne supprime pas une escalade obligatoire liée à un dommage. Le compteur suit les revues restant à effectuer, pas les risques encore ouverts ni les résolutions opérationnelles.

Les autres indicateurs comptent le total et les statuts En attente client et Résolu. L’historique conserve les changements de statut, corrections, revue, approbation et séquences d’édition du brouillon. Ce journal local n’est pas un audit de conformité.

## Architecture et périmètre

```text
src/
  components/     Inbox dans App, détail, badges, formulaire de simulation
  data/           Huit dossiers fictifs et références publiques
  domain/         Types, triage, recommandations, transitions, validation JSON, tests
  hooks/          État React et persistance LocalStorage
  App.tsx         Navigation locale, filtres et indicateurs calculés
  index.css       Tailwind CSS 4 et styles du produit
```

React 19, TypeScript strict, Vite 7, Tailwind CSS 4, Vitest 4. Lucide fournit uniquement les icônes. Pas de routeur, backend, authentification, base de données, analytics, service payant ou intégration externe. Les noms abrégés, messages, villes associées aux personnes et références `DEMO-…` sont inventés ; ils ne représentent aucun client réel.

Persistance sous `caseflow.demo.v1`. Une sauvegarde JSON invalide restaure les huit dossiers avec un avertissement. Un stockage bloqué ou plein laisse l’application utilisable en mémoire et affiche une alerte. « Réinitialiser la démo » demande confirmation avant de remplacer les modifications locales.

**Compatibilité avec les anciennes sauvegardes :** les sujets secondaires, actions et motifs de revue sont recalculés depuis les champs déjà présents. Aucun nouveau champ persistant ni changement de clé n’est requis. Les anciens dossiers conservent leur titre, leur brouillon, leurs validations et leur historique : aucune réinitialisation ni suppression pour cette mise à jour. Les nouveaux titres s’appliquent aux nouvelles créations uniquement. Un ancien brouillon reste inchangé jusqu’à une régénération explicitement confirmée.

## Sources et niveau de vérification

Consultation technique le **12 novembre 2026** :

- [Site MénageSimple](https://menagesimple.com/) : services récurrents, support, remplacement et gestion des réservations déjà proposés.
- [FAQ publique](https://menagesimple.com/questions-frequentes-menage/) : retours qualité, signalement de dommages et photos. Utilisée comme repère documentaire, pas comme autorisation individuelle.
- [Conditions générales](https://menagesimple.com/conditions-generales/), version affichée du 15 juillet 2026 : rubrique 10c pour le préavis de 48 h. Le dossier individuel et le contrat restent à vérifier.
- [Page MarIA fournie dans le brief](https://menagesimple.com/assistante-telephonique-ia-maria/) : non récupérable avec l’outil de recherche lors de cette session. L’annonce du 5 novembre 2026 est donc une information fournie par le brief, **non revérifiée indépendamment ici**. Le format réel et l’existence d’une API ne sont pas connus. L’écran indique « MarIA-style simulation ».
- [Stonks](https://stonks.ag/) : contexte de recrutement et rattachement fournis par le brief ; site non récupérable pendant cette session.
- [Avis Trustpilot](https://fr.trustpilot.com/review/menagesimple.com) : piste qualitative fournie dans le brief, non exploitée comme donnée ni preuve de dysfonctionnement global. Aucun avis client réel n’a été copié dans les dossiers.

Les règles de ce prototype doivent être approuvées par l’entreprise avant un usage réel. Les textes publics peuvent changer.

## Usage de l’IA et vérification humaine

Codex a assisté à la rédaction du code, des scénarios synthétiques, des règles, des tests, de l’interface et de cette documentation, ainsi qu’à l’exécution des vérifications techniques. Le produit ne fait aucun appel à une IA à l’exécution.

**Décisions humaines attestées par le brief** : périmètre de suivi des demandes, stack React/TypeScript/Vite/Tailwind/Vitest/LocalStorage, huit scénarios fictifs, absence de connexions de production et maintien d’une décision humaine. Le propriétaire a explicitement demandé un projet local de code sans Sites. La priorité de sécurité pour les dommages, le détail des règles et la garde de résolution ont été implémentés par Codex et restent à valider par le propriétaire.

La consultation des sources et les vérifications de navigateur effectuées par l’agent ne sont pas une revue humaine indépendante. **Aucune relecture par le propriétaire ou validation par MénageSimple n’est attestée.** Avant soumission, le propriétaire doit relire le français, les règles métier, les références et effectuer le parcours ci-dessous. Ne pas présenter cette étape comme déjà accomplie.

Résultats et vérifications réellement exécutés : voir [VERIFICATION.md](./VERIFICATION.md).

## Hypothèses et limites

- Le triage lexical peut se tromper sur une négation (« rien n’est cassé »), un récit complexe, une faute de frappe ou une formulation inconnue. Il ne fournit pas de score de confiance artificiel. La correction motivée est disponible.
- Les dates et références sont structurées dans les exemples initiaux ; une simulation ne les extrait pas du texte. Les lacunes peuvent être confirmées avec la checklist, sans téléversement de pièces. Le contenu d’un justificatif n’est jamais vérifié automatiquement.
- Le stockage est propre au navigateur et à l’origine locale. Pas de partage entre opérateurs, synchronisation multi-onglets, sauvegarde distante, protection d’accès ou conservation garantie. Démonstration sur données fictives uniquement.
- La validation JSON protège des sauvegardes malformées, pas d’une personne qui altère volontairement son propre stockage. Les brouillons libres ne sont pas un filtre de conformité.
- L’application n’exécute aucune résolution opérationnelle : un dossier « Résolu » signifie une clôture locale de démonstration, sans modification chez MénageSimple.
- Responsive prévu, avec tableau défilant horizontalement sur petit écran. Pas de certification WCAG ni audit complet des lecteurs d’écran. Les badges portent un texte en plus de leur couleur.
- L’exercice est conçu pour une revue humaine d’environ quatre heures : cadrage 30 min, implémentation 120 min, tests et parcours 60 min, documentation et répétition 30 min. Il ne s’agit pas d’un relevé d’heures humaines réellement passées.

## Plan de validation avec l’entreprise

1. Présenter l’hypothèse à deux ou trois opérateurs et un responsable : cartographier le suivi actuel et vérifier si le problème existe déjà ou est couvert par leurs outils.
2. Faire valider catégories, pièces attendues, exceptions et références par un responsable. Construire un petit jeu de dossiers fictifs annotés, puis, uniquement avec autorisation et précautions appropriées, un échantillon anonymisé.
3. Comparer le traitement actuel et le prototype sur des dossiers de difficulté comparable, en alternant l’ordre pour limiter l’effet d’apprentissage.
4. Mesurer **temps de triage**, **précision des informations manquantes détectées** (dont faux positifs et oublis), **taux et motifs de corrections humaines**, et **complétion des dossiers**. Relever séparément tout défaut d’escalade d’un dommage et toute proposition de promesse injustifiée.
5. Examiner les désaccords avec les opérateurs et décider ensemble de poursuivre, modifier ou abandonner. Définir des critères d’acceptation avant la comparaison ; ne pas annoncer de pourcentage d’amélioration sans observations.

Aucun pilote, résultat client ou gain mesuré n’est revendiqué.

## Démonstration — 2 min 45 maximum

| Temps     | Action et message                                                                                                                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0:00–0:20 | Montrer le bandeau fictif et l’inbox. « Après une demande entrante, l’opérateur doit choisir une prochaine étape et garder la trace de sa décision. Voici une hypothèse de complément aux outils existants. » |
| 0:20–0:55 | Ouvrir Camille. Comparer message, signal « sale », proposition de passage correctif et FAQ. Montrer que le programme suggère sans promettre.                                                                  |
| 0:55–1:30 | Adapter la réponse, confirmer la revue, approuver et résoudre. Revenir à l’inbox : les compteurs changent. Recharger : l’état persiste.                                                                       |
| 1:30–1:55 | Ouvrir Alex. Montrer le dommage, l’escalade humaine et la demande de photos, sans accord d’assurance ou indemnisation.                                                                                        |
| 1:55–2:20 | Simuler : « La cliente demande à être rappelée au sujet de son dernier passage. » Montrer « À vérifier », référence/date manquantes et clarification. Aucun appel réel.                                       |
| 2:20–2:45 | Montrer le résultat des tests et la commande de build. Conclure par les quatre mesures du plan de validation, sans annoncer de gain.                                                                          |

Les indicateurs du jeu initial sont désormais **8 dossiers, 5 en revue spécifique, 2 en attente client, 1 résolu**. Utiliser un profil de démonstration séparé pour présenter ce jeu initial ; ne pas effacer des dossiers existants pour mettre à jour l’application.
