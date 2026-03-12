# Guide Git — Gestion des branches `main` et `preprod`

---

## Flux global

```
main ─────────────────────────────────────► (stable, production)
  │                        ▲
  │  merge origin/main     │  merge preprod → main (quand validé)
  ▼                        │
preprod ──────────────────────────────────► (staging, validation)
  │
  │  (développement direct ou via feature/xxx)
  ▼
feature/xxx
```

**Règle simple :**

- On développe sur `preprod` (ou sur une branche `feature/xxx`)
- On merge `main` → `preprod` pour rester synchronisé quand `main` reçoit des correctifs
- On merge `preprod` → `main` uniquement quand `preprod` est stable et testée

---

## 1. Créer la branche `preprod` et la pousser

> **Conseil :** Git pousse toujours la branche sur laquelle tu te trouves.  
> Vérifie toujours avec `git status` avant de pousser.

```bash
# Créer la branche ET basculer dessus en une seule commande
git checkout -b preprod

# Vérifier que tu es bien sur preprod
git status

# Pousser ET lier le tracking distant en une seule fois
git push -u origin preprod
```

> Le `-u` (upstream) lie `preprod` locale à `origin/preprod`.  
> Après ça, un simple `git push` suffit — plus besoin de préciser `origin preprod`.

---

## 2. Cycle de travail au quotidien

```bash
# 1. Vérifier sur quelle branche tu es (réflexe à avoir AVANT toute action)
git status

# 2. Basculer sur la bonne branche
git checkout preprod

# 3. Récupérer les dernières modifs distantes AVANT de commencer à coder
git pull

# 4. Faire tes modifications, puis sauvegarder
git add .
git commit -m "feat: description courte du changement"
git push
```

> **Conseil :** ne jamais commencer à coder sans faire `git pull` d'abord.  
> Si un collègue a poussé entre-temps, tu évites un conflit inutile.

---

## 3. Tenir `preprod` à jour depuis `main`

Situation : un correctif a été mergé dans `main` → tu dois l'intégrer dans `preprod`.

```bash
# 1. Récupérer les modifs distantes sans fusionner
git fetch origin

# 2. Se placer sur preprod
git checkout preprod

# 3. Fusionner les changements de main dans preprod
git merge origin/main

# 4. Pousser le résultat
git push
```

> **Conseil :** utilise `git fetch` plutôt que `git pull` ici — `fetch` récupère sans fusionner,  
> ce qui te permet de voir les divergences avant de décider de merger.

---

## 4. Pousser `preprod` vers `main` (mise en production)

Situation : `preprod` est validée → tu pousses ses changements dans `main`.

```bash
# 1. Basculer sur main
git checkout main

# 2. Récupérer les dernières modifs distantes
git fetch origin

# 3. Fusionner preprod dans main
git merge preprod

# 4. Pousser
git push
```

> **Conseil :** fais toujours ce merge quand `preprod` est **stable et testée**.  
> En cas de doute, reste sur `preprod` et continue de tester.

---

## 5. Conseils pratiques qu'on oublie souvent

### Vérifier sa branche avant CHAQUE action

```bash
git status
# ou plus lisible :
git branch
```

Le réflexe le plus important — évite de committer sur `main` par erreur.

---

### Ne jamais committer sur `main` directement

Si tu réalises que tu as codé sur `main` par erreur :

```bash
# 1. Sauvegarder tes modifs dans un stash
git stash

# 2. Basculer sur preprod
git checkout preprod

# 3. Récupérer les modifs stashées
git stash pop

# 4. Committer normalement
git add .
git commit -m "fix: ..."
git push
```

---

### Écrire des messages de commit utiles

```bash
# ❌ Mauvais
git commit -m "fix"
git commit -m "modif"
git commit -m "test"

# ✅ Bon (convention conventionalcommits.org)
git commit -m "feat: ajout route PATCH /api/users/:id/purchase"
git commit -m "fix: correction erreur de connexion MongoDB"
git commit -m "style: mise en page Navigation.js"
git commit -m "docs: mise à jour README endpoints"
```

> Préfixes courants : `feat` (nouvelle fonctionnalité), `fix` (correction), `style` (CSS/SCSS), `docs` (documentation), `refactor` (restructuration sans changement de comportement).

---

### Voir l'historique des commits proprement

```bash
git log --oneline --graph --all
```

Affiche un historique condensé avec le graphe des branches — bien plus lisible que `git log` seul.

---

### Annuler le dernier commit (sans perdre le code)

```bash
# Annule le commit mais garde les modifications dans les fichiers
git reset --soft HEAD~1
```

> Utile quand tu as commité trop tôt ou avec le mauvais message.  
> `--soft` conserve tes fichiers modifiés, `--hard` les supprime — fais attention.

---

### Voir ce qui a changé avant de committer

```bash
# Voir les fichiers modifiés
git status

# Voir les lignes modifiées
git diff

# Voir ce qui est déjà en staging (après git add)
git diff --staged
```

---

## 6. Cas d'erreur fréquents

### Branche distante existante sans tracking local

**Situation :** une branche `<branch>` existe sur le remote (poussée par un collègue ou créée sur GitHub). Tu la crées manuellement en local avec `git checkout -b <branch>`, mais ta branche locale n'est pas liée à `origin/<branch>`. Du coup `git pull` échoue ou ne récupère pas les bons commits.

**Symptôme :** `git branch -vv` montre ta branche sans `[origin/<branch>]` à côté.

```bash
# Vérifier le tracking
git branch -vv
# Si pas de [origin/<branch>], la branche n'est pas liée
```

**Correction :**

```bash
# Lier la branche locale à la distante, puis récupérer les commits
git branch --set-upstream-to=origin/<branch> <branch>
git pull
```

**La bonne pratique — ne pas créer la branche manuellement :**

```bash
# Récupérer les infos distantes
git fetch origin

# Créer la branche locale ET lier automatiquement le tracking
git checkout -b nom-branche origin/nom-branche

# OU plus court : si le nom correspond, git fait le lien tout seul
git checkout nom-branche
```

> **Règle :** si la branche existe déjà sur le remote, utilise `git checkout <branch>` — git crée la branche locale et lie le tracking automatiquement. Ne jamais utiliser `git checkout -b <branch>` dans ce cas.

---

## 7. Commandes utiles au quotidien

| Action                              | Commande                       |
| ----------------------------------- | ------------------------------ |
| Voir toutes les branches            | `git branch -a`                |
| Voir l'état du tracking             | `git branch -vv`               |
| Récupérer sans fusionner            | `git fetch origin`             |
| Voir les divergences                | `git log preprod..origin/main` |
| Annuler modifications non commitées | `git restore .`                |
| Mettre des modifs de côté           | `git stash`                    |
| Récupérer le stash                  | `git stash pop`                |
| Supprimer une branche locale        | `git branch -d nom-branche`    |
| Supprimer une branche distante      | `git push origin --delete nom` |
