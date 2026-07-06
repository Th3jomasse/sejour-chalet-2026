# 🏕️ Séjour au chalet 2026

Planification du séjour au chalet **ChaletMylène** — repas, collations et listes d'achats.

**Groupe (4) :** Mathilde · Miguel · Mylène · Jonathan
**Dates :** arrivée vendredi 10 h → départ dimanche 15 h

## 🤖 L'app — deux versions

### Version Firebase (recommandée) — `public/index.html`
App complète connectée au projet Firebase **ChaletMylène** :
- **Hébergement** gratuit sur une URL publique (`https://chaletmylene.web.app`)
- **Clé API cachée** côté serveur (Cloud Function `generatePlan`) — les amis n'entrent aucune clé
- **Listes partagées en temps réel** (Firestore) — cases à cocher synchronisées entre les téléphones
- **Vote de groupe** 👍/👎 sur chaque repas + bouton « Régénérer selon les votes »

Structure : `firebase.json`, `.firebaserc`, `firestore.rules`, `functions/` (Cloud Function),
`public/` (l'app). Avant de déployer, remplace `firebaseConfig` dans `public/index.html`
par la config de ton app web Firebase, et enregistre la clé Claude comme secret :
`firebase functions:secrets:set ANTHROPIC_API_KEY`. Puis `firebase deploy`.

### Version standalone — `index.html`
Même app, mais chaque personne entre **sa propre clé API Claude** (stockée localement).
Fonctionne sans backend — ouvre le fichier dans un navigateur, ou héberge via GitHub Pages.

## Contenu

- [`plan-chalet.md`](plan-chalet.md) — plan des repas (vendredi → dimanche), collations
  et listes d'achats organisées par magasin : 🥩 Boucherie · 🍷 SAQ · 🛍️ Épicerie
  (**quantités pour 4 personnes**).
- [`docs/app-ia-planification.md`](docs/app-ia-planification.md) — 🤖 vision de l'app IA
  de planification de repas entre amis, avec recommandations selon l'envie du moment.

## Partage des dépenses

Une fois sur place, entrez les factures (Boucherie / SAQ / Épicerie) dans l'app
**SplitMoney** pour répartir les coûts entre les 4 automatiquement.
