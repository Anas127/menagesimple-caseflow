# Relecture de la soumission selon la grille de Luca

Relecture du 13 novembre 2026. Il s’agit d’une **auto-évaluation critique de l’agent après une seconde lecture**, pas d’un avis indépendant de Luca ni d’un score acquis. Les plafonds et la cible viennent du brief fourni par le propriétaire.

## Checklist initiale de l’audit

| Critère                          | Constat avant les changements de cette passe                                                                      | Travail retenu                                                                                             |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Valeur métier                    | Hypothèse présente dans le README ; business case dédié absent ; MarIA non revérifiée dans les premières sessions | Vérifier les sources officielles et proposer une comparaison mesurable sans ROI inventé                    |
| Exécution                        | Cœur fonctionnel ; deux anomalies UI seulement suspectées                                                         | Reproduire filtres / approbation avant toute modification ; préserver les parcours                         |
| Jugement et périmètre            | Clôture possible après revue / approbation malgré des pièces critiques non cochées                                | Exiger un motif humain enregistré, sans interdire les clôtures légitimes ; conserver les données anciennes |
| Usage IA et vérification humaine | Rôle de Codex décrit, preuve humaine indépendante absente                                                         | Séparer décisions du brief, travail de l’agent et validation restant à faire                               |
| Tests et reproductibilité        | 57 tests, aucune régression dédiée aux filtres, installation propre non démontrée                                 | Tester les fonctions réellement utilisées par l’inbox, les garde-fous et npm ci dans une copie propre      |
| Communication                    | README long, documents dédiés et script vidéo autonome absents                                                    | Réorganiser le README, fournir preuves, business case et script de 2 min 40                                |

## Corrections et choix vérifiables

Les deux anomalies UI soupçonnées **n’ont pas été reproduites** : vider la recherche / les selects restaure la liste ; éditer un brouillon approuvé permet de l’approuver à nouveau. Pas de correction artificielle. La fonction de filtrage existante a été isolée pour la tester sans changer ses règles.

Les corrections significatives sont la clôture motivée, un repli prudent sur des négations explicites, le contraste des textes et une détection Tailwind bornée aux sources pour reproduire les assets. Aucun nouveau produit, backend, compte, intégration ou modèle de langage à l’exécution.

## Estimation stricte

| Critère                         | Maximum | Preuves observées                                                                                                                                                                                         | Score estimé |
| ------------------------------- | ------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -----------: |
| Business value                  |      20 | [Sources officielles et protocole](./BUSINESS_CASE.md), scénario de demande multi-sujets, métriques définies. Besoin et bénéfices encore non validés avec les opérateurs.                                 |           17 |
| Execution                       |      25 | Workflow fonctionnel, classification / actions multi-sujets, revue et approbation, clôture motivée, persistance et responsive contrôlés. Validation multi-navigateurs / accessibilité partielle.          |           23 |
| Judgment and scope              |      15 | Petit périmètre conservé ; dommages, contrats et finance humains ; compatibilité des données ; aucun gain ou intégration inventé. Règles métier à faire approuver.                                        |           14 |
| AI usage and human verification |      15 | [Rôles et limites précis](./AI_AND_VERIFICATION.md), tests et erreurs corrigées, sources relues. Contrôles réalisés par l’agent ; relecture humaine indépendante non attestée.                            |           12 |
| Tests and reproducibility       |      15 | [78 tests / 5 fichiers](./QA_EVIDENCE.md), TypeScript et build réussis, installation propre npm ci ; assets JS / CSS identiques sur cette machine. Pas de runner E2E ni validation sur une autre machine. |           14 |
| Communication                   |      10 | README structuré, business case, preuves, limites et [script de 2 min 40](./DEMO_SCRIPT.md). Vidéo silencieuse de 160,0 s créée, sous-titrée et contrôlée ; visionnage humain final non attesté.          |            9 |
| **Total indicatif**             | **100** | **Estimation subjective, sans résultat d’évaluation du recruteur.**                                                                                                                                       |       **89** |

La cible 90+ est une ambition. Les preuves actuelles ne justifient pas de l’attribuer automatiquement. Le prototype se défend par son exécution et sa transparence ; les points manquants concernent surtout des preuves externes et la présentation finale.

La production effective du film a fait évoluer uniquement l’estimation Communication de 8 à 9 ; aucun point de revue humaine ou de pilote réel n’a été ajouté artificiellement.

## À terminer par le propriétaire avant envoi

1. Refaire le parcours complet et relire le français / les garde-fous ; consigner qui l’a fait et ce qui a réellement été vérifié. Ne pas cocher cette étape avant son exécution.
2. Visionner la vidéo livrée en entier et valider le contenu. Sa durée de 160,0 secondes et son décodage ont été vérifiés par l’agent ; aucun visionnage humain complet n’est attesté.
3. Vérifier que Luca peut accéder au dépôt privé et à la vidéo. Aucun partage ni message au recruteur n’est envoyé par l’agent.
4. Vérifier la dernière version servie après publication, puis le lien depuis une session de démonstration séparée, sans effacer des dossiers existants.
5. Soumettre avant le **15 novembre 2026 à 23:59, heure de Zurich**, échéance indiquée dans le brief. Le dépôt ne prouve ni soumission ni réception.

Ces étapes peuvent renforcer la candidature ; elles ne garantissent aucun score. Un pilote avec l’entreprise reste une proposition future, pas un prérequis à simuler pour embellir la soumission.
