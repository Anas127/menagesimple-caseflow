# Vidéo livrée et contrôles exécutés

**[Lire / télécharger la démonstration](./docs/media/caseflow-demo-fr.mp4)** · [Sous-titres SRT](./docs/media/caseflow-demo-fr.srt) · [Minutage des scènes](./docs/media/caseflow-demo-fr.scenes.json)

Version révisée le 13 novembre 2026 : présentation destinée directement à Luca, centrée sur le parcours produit et les preuves techniques. Fin à **2 min 15** après les résultats de vérification. Sous-titres français intégrés, sans piste audio.

## Contenu et méthode

La démonstration montre la version locale du build de production : inbox, résumé d’appel, triage multi-sujets, actions, informations manquantes, édition du brouillon, revue, approbation, statut et indicateurs, incertitude et garde-fou de clôture. Les actions ont été exécutées dans le navigateur sur une origine locale distincte (`127.0.0.1:4173`).

Les captures ont été recadrées et assemblées avec des pauses de lecture. Acquisition à deux images par seconde, encodage à 24 images par seconde. La dernière carte présente les résultats réellement exécutés : 78 tests réussis dans 5 fichiers, vérification TypeScript et build de production. Le journal des tests fournit les deux lignes de résultats affichées.

## Vérification du fichier révisé

| Contrôle                 | Résultat                                                                 |
| ------------------------ | ------------------------------------------------------------------------ |
| Durée mesurée            | **135,0 secondes — 2 min 15**                                            |
| Image                    | **1280 × 816**, H.264, pixels YUV 4:2:0                                  |
| Encodage                 | 24 i/s, 3 240 images décodables                                          |
| Audio                    | Aucune piste audio                                                       |
| Taille                   | 1,758,487 octets                                                         |
| Décodage intégral FFmpeg | Retour 0, aucun message d’erreur                                         |
| Contrôle visuel          | Échantillons à 5, 16, 23, 33, 44, 55, 65, 77, 89, 101, 113, 126 secondes |

Validation structurée : [caseflow-demo-fr.validation.json](./docs/media/caseflow-demo-fr.validation.json). Empreinte SHA-256 :

```text
fe313e2910ec3baf1edaff8c53784c2be5ac864f89fde94d691da24951a54e97
```

Aucune dépendance de l’application n’a été ajoutée pour produire le fichier. Les captures brutes et outils de travail restent dans le répertoire local ignoré.
