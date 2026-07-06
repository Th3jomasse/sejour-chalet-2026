# 🤖 App IA — Planification de repas entre amis

Vision pour **l'app parfaite de planification de séjour entre amis**, avec des
recommandations de repas générées par IA selon **l'envie du moment** de chacun.

---

## 🎯 Le concept

Une app où un groupe d'amis crée un **séjour** (chalet, voyage, weekend), indique
**qui vient, combien de jours, et l'envie de chacun** — puis l'IA propose un **plan de
repas complet** et des **listes d'achats par magasin** (Boucherie / SAQ / Épicerie),
avec les quantités ajustées au nombre de personnes. Les amis **votent**, l'IA ajuste,
et à la fin les dépenses se **partagent automatiquement** (intégration SplitMoney).

> **Le cœur du produit :** « Dis-moi juste ce dont tu as envie, je m'occupe du reste. »

---

## 🧩 Fonctionnalités clés

### 1. Séjour & participants
- Créer un séjour : dates, lieu, **nombre de personnes**, équipements (BBQ, four, glacière).
- Chaque participant a un **profil** : allergies, régime (végé, sans gluten…), aversions.

### 2. « Envie du moment » (le différenciateur)
Avant chaque séjour, chacun choisit son humeur culinaire via des **tags rapides** :
- 🔥 BBQ · 🥗 Santé/léger · 🍝 Réconfortant · 🌶️ Épicé · 🐟 Poisson/mer ·
  🍔 Comfort food · 🌱 Végé · ⏱️ Rapide/facile · 🍷 Apéro/grignotage
- Un curseur **budget** (économique ↔ gastronomie) et **effort** (minimal ↔ on cuisine).

### 3. Recommandations IA
L'IA combine **participants + envies + contraintes + activités** (ex. sortie bateau →
repas transportable) et génère :
- Un **plan repas** jour par jour (déjeuner / dîner / collation / souper).
- Des **alternatives** par repas (2-3 choix) que le groupe peut échanger.
- Les **recettes** avec étapes et temps de préparation.

### 4. Vote & consensus
- Chaque proposition de repas est **votable** (👍/👎/échanger).
- L'IA **régénère** en tenant compte des votes et des envies dominantes.

### 5. Listes d'achats intelligentes
- Regroupées **par magasin** : 🥩 Boucherie · 🍷 SAQ · 🛍️ Épicerie.
- **Quantités auto-calculées** selon le nombre de personnes et le nombre de repas.
- Cases à cocher partagées en temps réel + « qui achète quoi ».

### 6. Partage des dépenses
- Chaque facture (Boucherie/SAQ/Épicerie) alimente le **partage des coûts** entre amis
  — réutilise le moteur de **SplitMoney** (soldes + remboursements suggérés).

---

## 🔄 Parcours utilisateur (MVP)

```
Créer un séjour  →  Inviter les amis  →  Chacun donne son « envie du moment »
     →  L'IA propose un plan repas + listes d'achats  →  Le groupe vote / ajuste
     →  Courses (cases à cocher partagées)  →  Séjour  →  Partage des dépenses
```

---

## 🛠️ Approche technique

- **Client** : app mobile (l'existant est Android/Kotlin + Jetpack Compose ; réutiliser
  la base **SplitMoney** pour groupes, membres, dépenses).
- **Cœur IA** : appel à l'**API Claude** (modèle `claude-opus-4-8` ou `claude-sonnet-5`
  pour un bon ratio coût/latence) avec **sortie structurée (tool use / JSON)** :
  - Entrée : `{ participants, jours, repas, envies[], contraintes, équipements, budget }`
  - Sortie : `{ plan_repas[], recettes[], listes_achats: { boucherie[], saq[], epicerie[] } }`
- **Sync temps réel** : Firebase (le projet **ChaletMylène** existe déjà) pour les votes
  et les listes partagées.
- **Calcul des quantités** : l'IA propose, une couche de règles (portions × personnes)
  valide et arrondit aux formats d'emballage courants.

---

## 🚀 Feuille de route

**MVP (v1)**
- [ ] Séjour + participants + profils (allergies/régimes)
- [ ] Saisie « envie du moment » (tags + budget/effort)
- [ ] Génération IA du plan repas + listes par magasin
- [ ] Cases à cocher partagées

**v2**
- [ ] Vote de groupe + régénération IA
- [ ] Recettes détaillées avec temps de préparation
- [ ] Intégration complète du partage des dépenses (SplitMoney)

**v3**
- [ ] Gestion des restes / inventaire du garde-manger
- [ ] Historique des séjours + « refaire ce menu »
- [ ] Suggestions selon la météo et les activités (ex. bateau, feu de camp)

---

## 💡 Idées bonus
- « Mode surprise » : l'IA choisit tout selon les envies, zéro décision à prendre.
- Détection de conflits (allergie vs proposition) avec substitution auto.
- Estimation du **coût total** et du **coût par personne** avant même de partir.
