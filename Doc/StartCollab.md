# StartCollab — Lancer le projet CRM-Autumn

Guide destiné à tout collaborateur qui clone le projet pour la première fois.

---

## 1. Environnement de développement requis

### Logiciels à installer

| Outil                       | Rôle                                      | Lien                                           |
| --------------------------- | ----------------------------------------- | ---------------------------------------------- |
| **Node.js LTS**             | Exécuter le serveur et le client          | https://nodejs.org                             |
| **MongoDB Community**       | Base de données locale (port 27017)       | https://www.mongodb.com/try/download/community |
| **Git**                     | Versionning et clonage du repo            | https://git-scm.com                            |
| **MongoDB Compass** _(opt)_ | Interface graphique pour visualiser la DB | https://www.mongodb.com/products/compass       |

### Vérifier les installations

```bash
node -v        # doit afficher v18.x ou supérieur
npm -v         # doit afficher 9.x ou supérieur
mongod --version  # doit afficher 6.x ou supérieur
git --version
```

---

## 2. Cloner le projet

```bash
git clone <url-du-repo>
cd CRM-Autumn
```

---

## 3. Variables d'environnement

Créer un fichier `.env` dans le dossier `server/` :

```bash
# server/.env
MONGO_URI=mongodb://127.0.0.1:27017/crm-autumn
PORT=8000
```

> Ce fichier n'est pas versionné (`.gitignore`). Il doit être créé manuellement sur chaque machine.

---

## 4. Packages installés

### Serveur (`server/`)

| Package    | Version | Rôle                                          |
| ---------- | ------- | --------------------------------------------- |
| `express`  | ^5.2.1  | Serveur HTTP et routage REST                  |
| `mongoose` | ^9.2.4  | ODM — modélisation et accès MongoDB           |
| `dotenv`   | ^17.3.1 | Chargement des variables d'environnement      |
| `cors`     | ^2.8.6  | Autoriser les requêtes cross-origin du client |
| `axios`    | ^1.13.6 | Requêtes HTTP (utilisé côté seed)             |
| `nodemon`  | ^3.1.14 | Rechargement automatique en développement     |

### Client (`client/`)

| Package            | Version | Rôle                                                                      |
| ------------------ | ------- | ------------------------------------------------------------------------- |
| `react`            | ^19.2.4 | Bibliothèque UI                                                           |
| `react-dom`        | ^19.2.4 | Rendu React dans le DOM                                                   |
| `react-router-dom` | ^7.13.1 | Routing SPA (navigation entre les pages)                                  |
| `axios`            | ^1.13.6 | Requêtes HTTP vers l'API Express                                          |
| `react-scripts`    | 5.0.1   | Scripts CRA (start, build, test)                                          |
| `sass`             | ^1.x    | Compilateur Dart Sass — requis par CRA pour compiler les fichiers `.scss` |

> **Extension VS Code requise** : installer **Live Sass Compiler** (Glenn Marks) pour la compilation SCSS en temps réel lors du développement hors CRA.

---

## 5. Conseils — `package.json` et nodemon

### `"type": "module"` dans `server/package.json`

Le serveur utilise les **ES Modules** (`import`/`export`). Cette ligne est indispensable dans `server/package.json` :

```json
{
  "type": "module"
}
```

> Sans elle, Node.js interprète les fichiers `.js` comme CommonJS et les `import` échouent.

### Scripts `npm run dev` et `npm start`

Les scripts sont définis dans `server/package.json` :

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

| Commande      | Comportement                                                                      |
| ------------- | --------------------------------------------------------------------------------- |
| `npm start`   | Lance le serveur une seule fois — à redémarrer manuellement à chaque modification |
| `npm run dev` | Lance le serveur avec **nodemon** — redémarre automatiquement à chaque sauvegarde |

> Toujours utiliser `npm run dev` en développement.

### Comment fonctionne nodemon

nodemon surveille les fichiers du projet. Dès qu'un fichier `.js` est sauvegardé, il redémarre automatiquement le serveur Node.

```bash
cd server
npm run dev
# → [nodemon] starting `node server.js`
# → Server is running http://localhost:8000
# (à chaque sauvegarde)
# → [nodemon] restarting due to changes...
```

> Si nodemon n'est pas reconnu, vérifier qu'il est bien installé : `npm install` dans `server/`.

---

## 6. Installer les dépendances

```bash
# Dépendances du serveur
cd server
npm install

# Dépendances du client (nouveau terminal)
cd client
npm install
```

---

## 7. Lancer le projet

### Étape 1 — Démarrer MongoDB

Sur Windows, s'assurer que le service MongoDB est actif.  
Si ce n'est pas le cas, le lancer depuis les **Services Windows** ou via :

```bash
mongod --dbpath "C:\data\db"
```

### Étape 2 — Démarrer le serveur Express

```bash
cd server
npm run dev
# → Serveur disponible sur http://localhost:8000
```

### Étape 3 — Lancer le client React (nouveau terminal)

```bash
cd client
npm start
# → Application disponible sur http://localhost:3000
```

---

## 8. (Optionnel) Importer les données produits

Si la collection `products` est vide, lancer le script de seed :

```bash
cd server
node seed.js
# → Importe les produits depuis jsonFile/products.json dans MongoDB
```

> Le script est idempotent : il peut être relancé plusieurs fois sans créer de doublons.

---

## 9. Vérification rapide

| Vérification                | URL / Commande                               |
| --------------------------- | -------------------------------------------- |
| Serveur API en ligne        | http://localhost:8000/api/product            |
| Client React en ligne       | http://localhost:3000                        |
| Liste des users             | http://localhost:8000/api/users              |
| MongoDB Compass (optionnel) | Se connecter sur `mongodb://127.0.0.1:27017` |

---

## 10. Ports utilisés

| Service       | Port  |
| ------------- | ----- |
| MongoDB local | 27017 |
| Serveur API   | 8000  |
| Client React  | 3000  |

---

## 11. Résumé des commandes

```bash
# Terminal 1 — Serveur
cd server && npm run dev

# Terminal 2 — Client
cd client && npm start

# (Optionnel) Seed des données
cd server && node seed.js
```
