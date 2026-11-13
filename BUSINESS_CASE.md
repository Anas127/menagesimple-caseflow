# CaseFlow — hypothèse de valeur opérationnelle

**Une demande peut contenir plusieurs problèmes. L’opérateur doit pouvoir décider de la prochaine étape sans perdre un sujet ni promettre une solution prématurément.** CaseFlow explore ce besoin sur des données fictives ; ce n’est pas le diagnostic d’un défaut confirmé chez MénageSimple.

## Contexte public vérifié

Références officielles consultées le **13 novembre 2026** :

| Source                                                                              | Fait utile au cadrage                                                                                                                                      |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Stonks Holding AG](https://stonks.ag/)                                             | MénageSimple figure dans le portefeuille présenté publiquement.                                                                                            |
| [FAQ MénageSimple](https://menagesimple.com/questions-frequentes-menage/)           | Des processus de retour qualité, de signalement de dommages et de modification de prestation sont décrits.                                                 |
| [Présentation de MarIA](https://menagesimple.com/assistante-telephonique-ia-maria/) | La page datée du 5 novembre 2026 décrit une assistante téléphonique hors horaires : réponses simples, recueil des demandes complexes et résumé à l’équipe. |
| [Conditions générales](https://menagesimple.com/conditions-generales/)              | La rubrique 10c mentionne le préavis de 48 h pour annuler ou modifier ; l’application renvoie au texte sans décider de frais.                              |

La page MarIA et le portefeuille Stonks ont été lus dans le navigateur après échec de leur récupération par l’outil de recherche. Nous ne connaissons ni le logiciel interne de suivi ni le format des résumés MarIA. Aucune API ou intégration officielle n’est revendiquée. Les avis publics de clients ne sont pas utilisés comme preuve d’un problème généralisé.

## Opportunité à tester

Un résumé peut évoquer des vitres sales, un objet cassé et une demande de compensation. Le risque à examiner est la perte d’un sujet ou d’une information au cours des échanges. CaseFlow propose une vue structurée : catégories distinctes, priorité expliquée, informations à demander, actions séparées, brouillon relu et historique des décisions.

Le complément envisagé à MarIA se situe **après la réception**, dans le traitement humain des exceptions. Le prototype simule cette entrée par un collage manuel fictif. La réservation et l’affectation d’intervenants restent hors périmètre. Dommage, assurance, compensation et conditions contractuelles restent des décisions humaines.

## Petit protocole de validation proposé

1. **Confirmer le besoin.** Avec deux ou trois opérateurs et un responsable, observer le suivi actuel. Si leurs outils couvrent déjà le besoin, adapter ou abandonner l’hypothèse.
2. **Définir le référentiel.** Faire annoter 20 à 30 cas fictifs représentatifs : sujets, pièces critiques, prochaine étape et besoin d’escalade. Un échantillon réel anonymisé ne viendrait qu’avec accord et règles de confidentialité adaptés.
3. **Comparer à périmètre égal.** Répartir des cas de difficulté comparable entre méthode actuelle et prototype, en alternant les opérateurs et l’ordre. Le chronométrage et les annotations peuvent se faire dans une feuille de mesure externe ; aucune instrumentation de production n’est construite ici.
4. **Mesurer et examiner les désaccords.** Séparer la qualité du triage de sa vitesse ; un dommage non escaladé ou une promesse injustifiée exige une analyse avant poursuite.

| Mesure proposée                            | Définition avant le test                                                                                                                           |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Temps médian réception → triage initial    | Entre mise à disposition du dossier et première catégorie / prochaine étape enregistrée.                                                           |
| Reclassification                           | Cas dont la catégorie initiale est corrigée par le responsable / cas examinés ; conserver le motif.                                                |
| Informations critiques absentes à l’entrée | Cas avec au moins un élément critique absent selon le référentiel / cas examinés. Comparer également les oublis et faux positifs du prototype.     |
| Temps médian avant première action humaine | Entre mise à disposition et première décision ou demande d’information effectivement préparée par l’opérateur.                                     |
| Résolution sans relance inutile            | Cas clos sans échange jugé évitable par le responsable / cas clos. Une relance nécessaire pour recueillir une preuve ne compte pas comme un échec. |

Les critères d’acceptation sont à convenir **avant** la comparaison. Ce petit échantillon renseignerait les usages et erreurs ; il ne suffirait pas à prouver un effet durable. **Aucune baseline, amélioration, économie ou rentabilité n’a été mesurée ni inventée.**
