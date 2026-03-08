# Guide Git - Gestion de la branche `preprod`

---

## 1. Créer et pousser la branche sur le repo distant

> **Important :** tu dois toujours être **sur la branche que tu veux pousser**.  
> Git pousse la branche sur laquelle tu te trouves — depuis `main`, tu pousses `main`, pas `preprod`.

```bash
# Créer la branche en local ET basculer dessus
git checkout -b preprod

# Vérifier que tu es bien sur preprod avant de pousser
git status

# Pousser la branche sur le repo distant et lier le tracking
git push -u origin preprod
```

> Le `-u` (upstream) lie ta branche locale à `origin/preprod` — après ça, un simple `git push` suffira.

---

## 2. Travailler sur la branche

```bash
# Vérifier sur quelle branche tu es
git status

# Basculer sur preprod
git checkout preprod

# Faire tes modifications, puis :
git add .
git commit -m "feat: description du changement"
git push
```

---

## 3. Tenir `preprod` à jour depuis `main`

La logique : `main` avance → tu intègres ses changements dans `preprod`.

```bash
# 1. Récupérer les dernières modifications du repo distant
git fetch origin

# 2. Se placer sur preprod
git checkout preprod

# 3. Fusionner les changements de main dans preprod
git merge origin/main

# 4. Pousser le résultat
git push
```

---

## 4. Logique globale recommandée (flux)

```
main ──────────────────────────────────────► (production stable)
  │                        ▲
  │  git merge origin/main │ (mise à jour preprod)
  ▼                        │
preprod ──────────────────────────────────► (validation / staging)
  │
  │  git merge preprod → main (quand validé)
  ▼
feature/xxx (tes branches de travail)
```

**Règle simple :**

- Tu développes sur `feature/xxx` ou directement sur `preprod`
- Quand `main` reçoit des correctifs, tu fais `git merge origin/main` depuis `preprod` pour rester synchronisé
- Quand `preprod` est validée, tu merges `preprod` → `main`

---

## 5. Commandes utiles au quotidien

| Action                   | Commande                       |
| ------------------------ | ------------------------------ |
| Voir toutes les branches | `git branch -a`                |
| Voir l'état du tracking  | `git branch -vv`               |
| Récupérer sans fusionner | `git fetch origin`             |
| Voir les divergences     | `git log preprod..origin/main` |
