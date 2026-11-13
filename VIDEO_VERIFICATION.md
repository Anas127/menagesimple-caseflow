# Vidéo livrée et contrôles exécutés

**[Lire / télécharger la démonstration](./docs/media/caseflow-demo-fr.mp4)** · [Sous-titres SRT](./docs/media/caseflow-demo-fr.srt) · [Minutage des scènes](./docs/media/caseflow-demo-fr.scenes.json)

Créée le 13 novembre 2026 à la demande du propriétaire, qui a choisi une **vidéo silencieuse avec sous-titres français**.

## Ce qui est effectivement capturé

Le film montre la version locale du build de production : inbox, simulation d’appel, triage multi-sujets, informations manquantes, édition du brouillon, revue, approbation, statut et indicateurs, incertitude et garde-fou de clôture. Les actions ont été exécutées dans le navigateur. Le scénario de test n’a envoyé aucun message client et n’a accordé aucune compensation.

Une origine locale distincte (`127.0.0.1:4173`) a permis de commencer sur huit dossiers sans réinitialiser les données des autres sessions. Les dernières scènes sont des cartes de présentation séparées, contenant le journal réel du test et le protocole de validation proposé.

**Méthode :** clips de captures réelles à deux images par seconde, montés avec pauses de lecture et sous-titres intégrés. Le MP4 est encodé à 24 images par seconde pour compatibilité ; ce n’est pas une revendication de capture continue à 24 i/s. Une interruption du premier outil de capture a été reprise à partir des images valides sauvegardées. Les coupes et pauses sont un montage éditorial, pas une mesure du temps de traitement d’un dossier.

## Résultats réellement observés

| Contrôle                              | Résultat                                                                                                    |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Durée mesurée                         | **160,0 secondes — 2 min 40**, sous la limite de trois minutes                                              |
| Image                                 | **1280 × 816**, H.264, pixels YUV 4:2:0                                                                     |
| Encodage                              | 24 i/s, 3 840 images décodables                                                                             |
| Audio                                 | **Aucune piste audio**                                                                                      |
| Taille                                | **2 764 498 octets**, environ 2,8 Mo                                                                        |
| Décodage intégral FFmpeg              | Retour 0, aucun message d’erreur                                                                            |
| Contrôle visuel par l’agent           | Échantillons à 5, 32, 54, 66, 86, 101, 114, 126 et 150 secondes : contenu et sous-titres inspectés          |
| Lecture dans le navigateur            | Chargement du H.264, durée 160, image 1280 × 816, démarrage de lecture et aucune erreur du lecteur observés |
| Tests repris pour les preuves du film | **78 tests réussis / 5 fichiers**, `npm test` ; `npm run typecheck` réussi                                  |

Le contrôle du navigateur ne prétend pas qu’une personne a regardé le film entier. Le décodage intégral et l’échantillonnage sont des vérifications techniques distinctes.

Validation structurée : [caseflow-demo-fr.validation.json](./docs/media/caseflow-demo-fr.validation.json). Empreinte SHA-256 du MP4 :

```text
8d4c41582b3cf442013682bb6a53847244901d0b38cbf304180297f3a7216dff
```

L’encodeur a été installé dans un répertoire de travail ignoré ; **aucune dépendance de l’application n’a été ajoutée**. Les images brutes et fichiers temporaires ne font pas partie de la soumission.

## Ce qui reste humain ou dépend d’une identité manquante

- Le propriétaire doit visionner le fichier final et approuver le français, les règles et la présentation : [fiche de relecture](./HUMAN_SIGNOFF.md).
- Une revue humaine indépendante ne peut pas être attestée par l’agent qui a produit le travail.
- L’accès au dépôt privé exige le compte GitHub exact de Luca. Son identité ne sera pas devinée et aucun accès ne sera ajouté à un compte non confirmé.
- Aucun envoi de candidature, message au recruteur ou invitation GitHub n’est revendiqué.
