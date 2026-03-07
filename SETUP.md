# Guide de mise en place du projet CRM-Autumn

Récapitulatif complet de toutes les étapes réalisées depuis le début du projet.

---

## 1. Prérequis installés

Avant tout code, ces outils doivent être installés sur la machine :

| Outil                    | Rôle                        | Lien                                           |
| ------------------------ | --------------------------- | ---------------------------------------------- |
| VS Code                  | Éditeur de code             | https://code.visualstudio.com                  |
| Node.js LTS              | Runtime JavaScript + npm    | https://nodejs.org                             |
| Git                      | Versionning                 | https://git-scm.com                            |
| MongoDB Community Server | Base de données locale      | https://www.mongodb.com/try/download/community |
| MongoDB Compass          | Interface graphique MongoDB | https://www.mongodb.com/try/download/compass   |

---

## 2. Initialisation du projet Node.js

Dans le dossier du projet :

```bash
npm init -y
```

Installation des dépendances :

```bash
npm install express mongoose dotenv
```

---

## 3. Structure du projet

```
CRM-Autumn/
├── .env
├── package.json
├── db.js
├── jsonFile/
│   ├── users.json
│   └── products.json
└── src/
    └── server.js
```

---

## 4. Fichier `package.json`

Le `type: "module"` est indispensable pour utiliser la syntaxe `import/export` (ES Modules) :

```json
{
  "name": "crm-autumn",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node src/server.js"
  },
  "dependencies": {
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "mongoose": "^9.2.4"
  }
}
```

> **Important** : grâce au script `"start"`, on peut lancer le serveur avec `npm start` plutôt que d'écrire le chemin complet.

---

## 5. Fichier `.env`

À la racine du projet (jamais dans `src/`) :

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/crm
```

> **Erreurs rencontrées et corrigées :**
>
> - `MONGO_URI=MONGO_URI=mongodb://...` → clé dupliquée par erreur, corrigée en `MONGO_URI=mongodb://...`
> - `MONGO_URI=localhost:...` → préfixe `mongodb://` manquant, rajouté

---

## 6. Fichier `src/server.js`

```js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB successfull"))
  .catch((err) => console.error("Error connection :", err.message));

app.get("/", (req, res) => {
  res.send("Hell world!");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

---

## 7. Lancer le serveur

```bash
npm start
```

> **Erreur rencontrée** : `node server.js` depuis la racine échouait car le fichier est dans `src/`.  
> **Solution** : utiliser `npm start` (le script pointe automatiquement vers `src/server.js`).

---

## 8. Démarrer MongoDB

Après l'installation de MongoDB Community Server, démarrer le service :

```bash
net start MongoDB
```

> **Erreur rencontrée** : `connect ECONNREFUSED 127.0.0.1:27017`  
> **Cause** : MongoDB n'était pas installé, puis pas démarré.  
> **Solution** : installer MongoDB Community Server puis lancer `net start MongoDB`.

> **Erreur rencontrée** : `Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"`  
> **Cause** : `.env` mal formé (clé dupliquée ayant supprimé le préfixe).  
> **Solution** : corriger le `.env` (voir étape 5).

---

## 9. Vérifier la connexion dans le terminal

Quand tout fonctionne, `npm start` doit afficher :

```
[dotenv] injecting env (2) from .env
MongoDB successfull
Server is running on http://localhost:3000
```

---

## 10. Importer les données JSON dans MongoDB

Via **MongoDB Compass** :

1. Ouvrir Compass et se connecter à `mongodb://localhost:27017`
2. Cliquer sur `+` pour créer une base de données nommée `crm`
3. Créer une collection `users` → `ADD DATA` → `Import JSON or CSV file` → sélectionner `jsonFile/users.json`
4. Créer une collection `products` → `ADD DATA` → `Import JSON or CSV file` → sélectionner `jsonFile/products.json`

---

## 11. Données de test disponibles

| Fichier                  | Contenu                                                                       |
| ------------------------ | ----------------------------------------------------------------------------- |
| `jsonFile/users.json`    | Utilisateurs fictifs (nom, email, adresse, etc.) — source dummyjson.com       |
| `jsonFile/products.json` | Produits fictifs (titre, prix, stock, catégorie, etc.) — source dummyjson.com |

---

## Prochaines étapes

- Créer les modèles Mongoose (`User.js`, `Product.js`)
- Créer les routes API REST (`/api/users`, `/api/products`)
- Ajouter un script de seed automatique (`npm run seed`)
- Brancher le front React (Vite)
