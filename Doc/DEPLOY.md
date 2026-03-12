# Guide de déploiement — CRM-Autumn

Déploiement du client React sur **Netlify** et du serveur Node.js/Express sur **Render**.

> Netlify héberge uniquement des fichiers statiques — il ne peut pas faire tourner le serveur Express.  
> Il faut donc déployer les deux séparément.

---

## Table des matières

- [Prérequis](#prérequis)
- [1. Préparer le code](#1-préparer-le-code)
- [2. Déployer le serveur sur Render](#2-déployer-le-serveur-sur-render)
- [3. Déployer le client sur Netlify](#3-déployer-le-client-sur-netlify)
- [Mise à jour du déploiement](#mise-à-jour-du-déploiement)

---

## Prérequis

- Le code final est mergé dans `main` (Netlify et Render déploient depuis `main` par défaut)
- Ton repo GitHub est à jour (`git push`)
- Tu as un compte sur [render.com](https://render.com) et [netlify.com](https://netlify.com)

---

## 1. Préparer le code

Avant de déployer, remplace `http://localhost:8000` par une variable d'environnement dans tous tes appels axios.

**Créer le fichier `client/.env`** :

```env
REACT_APP_API_URL=https://crm-autumn.onrender.com
```

> Remplace `https://crm-autumn.onrender.com` par l'URL que Render te donnera à l'étape suivante.

**Modifier les appels axios dans le client** :

```js
// ❌ Avant
axios.get(`http://localhost:8000/api/users`);

// ✅ Après
axios.get(`${process.env.REACT_APP_API_URL}/api/users`);
```

**Ajouter `.env` au `.gitignore`** (ne jamais pousser les variables d'environnement) :

```
# client/.gitignore
.env
```

---

## 2. Déployer le serveur sur Render

1. Va sur [render.com](https://render.com) → **New** → **Web Service**
2. Connecte ton repo GitHub et sélectionne le repo `CRM-Autumn`
3. Configure le service :

| Paramètre      | Valeur           |
| -------------- | ---------------- |
| Root directory | `server`         |
| Environment    | `Node`           |
| Build command  | _(laisser vide)_ |
| Start command  | `node server.js` |

4. Dans **Environment Variables**, ajoute tes variables :

| Clé           | Valeur                |
| ------------- | --------------------- |
| `MONGODB_URI` | ton URI MongoDB Atlas |
| `PORT`        | `8000`                |

5. Clique sur **Create Web Service**
6. Render te donne une URL du type `https://crm-autumn.onrender.com` — **copie-la** pour l'étape suivante

> Le plan gratuit de Render met le serveur en veille après 15 min d'inactivité. Le premier appel peut prendre ~30 secondes.

---

## 3. Déployer le client sur Netlify

1. Va sur [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project**
2. Connecte ton repo GitHub et sélectionne le repo `CRM-Autumn`
3. Configure le build :

| Paramètre         | Valeur          |
| ----------------- | --------------- |
| Base directory    | `client`        |
| Build command     | `npm run build` |
| Publish directory | `client/build`  |

4. Dans **Environment variables**, ajoute :

| Clé                 | Valeur                                             |
| ------------------- | -------------------------------------------------- |
| `REACT_APP_API_URL` | `https://crm-autumn.onrender.com` _(l'URL Render)_ |

5. Clique sur **Deploy site**
6. Netlify te donne une URL publique du type `https://crm-autumn.netlify.app`

---

## Mise à jour du déploiement

Une fois configuré, chaque `git push` sur `main` redéclenche automatiquement le build sur Netlify et Render.

```bash
# Workflow standard pour mettre à jour le déploiement
git checkout main
git merge preprod        # ou ta branche de travail
git push                 # déclenche le redéploiement automatique
```
