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

## 12. Structure finale du projet

```
CRM-Autumn/
├── .env
├── package.json
├── seed.js
├── seedUsers.js
├── jsonFile/
│   ├── users.json
│   └── products.json
├── __test__/
│   ├── index.html
│   └── index.js
└── src/
    ├── server.js
    ├── utils/
    │   └── mongod.js
    ├── products/
    │   ├── schemaProducts.js
    │   ├── products.service.js
    │   ├── products.controller.js
    │   └── route.products.js
    └── users/
        ├── schemaUsers.js
        ├── users.service.js
        ├── users.controller.js
        └── route.users.js
```

---

## 13. Création des schémas Mongoose

### `src/products/schemaProducts.js`

Champs définis : `id`, `title`, `brand`, `category` (enum), `price`, `currency`, `stock`, `description`, `image`, `tags`, `timestamps`.

### `src/users/schemaUsers.js`

Champs définis : `id`, `firstName`, `lastName`, `age`, `gender`, `email`, `phone`, `username`, `password`, `birthDate`, `image`, `address` (sous-document), `purschasedProducts` (ref Product), `viewedProducts` (ref Product), `timestamps`.

Les champs `purschasedProducts` et `viewedProducts` sont des tableaux d'`ObjectId` référençant la collection `Product`, permettant le `.populate()`.

---

## 14. Création des services et controllers

### Products

**`products.service.js`** — 3 fonctions :

- `listProducts()` → `Products.find({}, champs)`
- `getProductByBrand(brand)` → `Products.find({ brand }, champs)`
- `addPurchasedProduct(userId, productId)` → `User.findByIdAndUpdate` avec `$addToSet`

> **Erreur rencontrée** : utilisation de `findMany()` et `findUnique()` (méthodes Prisma).  
> **Cause** : confusion entre Prisma et Mongoose.  
> **Solution** : remplacer par `find()` et `findOne()`.

**`products.controller.js`** — 3 handlers :

- `handleListProducts` → appelle `listProducts()`
- `handleGetProductsByBrand` → lit `req.query.brand`, appelle `getProductByBrand()`
- `handlePostChoiceProducts` → lit `req.params.productId` + `req.body.userId`, appelle `addPurchasedProduct()`

> **Erreur rencontrée** : `req.params.brand` au lieu de `req.query.brand`.  
> **Cause** : la route `/search` n'a pas de paramètre dynamique.  
> **Solution** : utiliser `req.query` pour les query strings.

### Users

**`users.service.js`** — 1 fonction :

- `findUserByLastName(lastName)` → `User.findOne()` avec `.populate("purschasedProducts").populate("viewedProducts")`

> **Erreur rencontrée** : `.polulate()` (typo) et mauvais nom de champ `PurchasedProducts`.  
> **Solution** : corriger en `.populate("purschasedProducts")`.

---

## 15. Création des routes

### `src/products/route.products.js`

```
GET  /api/product/                        → liste tous les produits
GET  /api/product/search?brand=Gucci      → produits par marque
POST /api/product/:productId/purchase     → ajoute un produit aux achats d'un user
```

> **Erreur rencontrée** : `routerProducts.post(User.purschasedProducts)` — syntaxe invalide.  
> **Solution** : définir un vrai chemin `"/:productId/purchase"` + handler.

> **Erreur rencontrée** : param `/:productID` (majuscule D) mais controller lisait `req.params.productId` (minuscule d).  
> **Solution** : uniformiser en `/:productId`.

### `src/users/route.users.js`

```
GET /api/users/search/:lastName   → user par nom de famille (avec produits peuplés)
```

---

## 16. Scripts de seed

### `seed.js` — Peupler les produits

```bash
node seed.js
```

Lit `jsonFile/products.json`, vide la collection `products`, insère tous les produits.

### `seedUsers.js` — Peupler les utilisateurs

```bash
node seedUsers.js
```

Lit `jsonFile/users.json`, mappe uniquement les champs du schéma (évite les champs inconnus), vide la collection `users`, insère 208 utilisateurs.

> **Important** : toujours lancer les seeds **avant** de démarrer le serveur.

---

## 17. Installation de nodemon

```bash
npm install nodemon
```

Ajout dans `package.json` :

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

Lancer le serveur en mode développement (redémarrage automatique) :

```bash
npm run dev
```

---

## 18. Installation de CORS

Nécessaire pour que les fichiers HTML (client) puissent appeler l'API :

```bash
npm install cors
```

Ajout dans `src/server.js` :

```js
import cors from "cors";
app.use(cors()); // avant les routes
```

---

## 19. Tests côté client

Fichier `__test__/index.js` — utilise `fetch()` (pas d'import Mongoose côté client) :

```js
fetch("http://localhost:3000/api/product/")
  .then((res) => res.json())
  .then((data) => data.products.forEach((p) => console.log(p.title, p.brand)));
```

---

## 20. URLs disponibles

| Méthode | URL                                                     | Description         |
| ------- | ------------------------------------------------------- | ------------------- |
| GET     | `http://localhost:3000/api/product/`                    | Tous les produits   |
| GET     | `http://localhost:3000/api/product/search?brand=Gucci`  | Produits par marque |
| POST    | `http://localhost:3000/api/product/:productId/purchase` | Acheter un produit  |
| GET     | `http://localhost:3000/api/users/search/:lastName`      | User + ses achats   |

> Pour le POST, utiliser **Postman** ou **Thunder Client** (extension VS Code) avec le body : `{ "userId": "<_id du user>" }`

---

## 21. Ajout des routes viewedProducts et achat (PATCH)

Les routes `POST` ont été remplacées par `PATCH` — plus sémantique car on modifie partiellement un user existant.

### `src/products/route.products.js`

```
PATCH /api/product/:productId/purchase  → ajoute le produit aux achats du user
PATCH /api/product/:productId/viewed    → ajoute le produit aux produits vus du user
```

### `src/products/products.controller.js`

Deux handlers ajoutés :

- `handlePatchBuyProducts` → lit `req.params.productId` + `req.body.userId`, appelle `addPurchasedProduct()`
- `handlePatchViewProducts` → lit `req.params.productId` + `req.body.userId`, appelle `addViewedProduct()`

### `src/products/products.service.js`

Deux fonctions ajoutées :

- `addPurchasedProduct(userId, productId)` → `User.findByIdAndUpdate` avec `$addToSet: { purchasedProducts: productId }`
- `addViewedProduct(userId, productId)` → `User.findByIdAndUpdate` avec `$addToSet: { viewedProducts: productId }`

> `$addToSet` évite les doublons — si le produit est déjà dans le tableau, il n'est pas ajouté une deuxième fois.

---

## 22. Ajout de la route GET tous les users

### `src/users/route.users.js`

```
GET /api/users/           → liste tous les users
GET /api/users/search/:lastName  → user par nom de famille
```

> **Erreur rencontrée** : deux routes avec le même chemin `/search/:param` — Express prenait toujours la première.  
> **Solution** : séparer en `GET /` pour tous les users et `GET /search/:lastName` pour la recherche.

> **Erreur rencontrée** : `handleGetAllUser` lisait `req.params._id` mais la route `GET /` n'a pas de paramètre → retournait toujours 400.  
> **Solution** : supprimer le paramètre, appeler `User.find({})` sans filtre.

### `src/users/users.service.js`

Fonction ajoutée :

- `findAllUsers()` → `User.find({}, "firstName lastName email username")`

---

## 23. Interface de test HTML/JS

### `__test__/index.html`

Fichier HTML minimal avec un `<ul class="result">` pour afficher les produits et un `<script type="module">` pointant vers `index.js`.

### `__test__/index.js`

Utilise `fetch()` côté navigateur (pas d'import Mongoose) :

```js
const USER_ID = "69ac1fdfc8ca3d2dc1b8ea15"; // _id MongoDB de l'user de test

function productDisplay() {
  fetch("http://localhost:3000/api/product/")
    .then((res) => res.json())
    .then((data) => {
      data.products.forEach((product) => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.dataset.id = product._id;
        button.textContent = product.title;
        button.addEventListener("click", () => addToUser(product._id));
        li.appendChild(button);
        result.appendChild(li);
      });
    });
}

async function addToUser(productId) {
  const res = await fetch(
    `http://localhost:3000/api/product/${productId}/purchase`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID }),
    },
  );
  const data = await res.json();
  console.log("Produits achetés :", data.purchasedProducts);
}
```

> **Erreurs rencontrées et corrigées :**
>
> - `data.Products` (majuscule P) → corrigé en `data.products`
> - `method: "PATH"` → corrigé en `method: "PATCH"`
> - `:${productId}` dans l'URL → les `:` sont pour Express, pas pour fetch, corrigé en `${productId}`
> - Options `fetch` dans une parenthèse séparée → syntaxe corrigée
> - `USER_ID` non défini → ajouté en constante en haut du fichier
> - `data.purchaseProducts` → corrigé en `data.purchasedProducts`

> **Ouverture** : clic droit sur `index.html` → **Open with Live Server**. Le serveur Express doit tourner en parallèle.

---

## 24. URLs disponibles (version finale)

| Méthode | URL                                                     | Description                       |
| ------- | ------------------------------------------------------- | --------------------------------- |
| GET     | `http://localhost:8000/api/product/`                    | Tous les produits                 |
| GET     | `http://localhost:8000/api/product/search?brand=Gucci`  | Produits par marque               |
| PATCH   | `http://localhost:8000/api/product/:productId/purchase` | Acheter un produit                |
| PATCH   | `http://localhost:8000/api/product/:productId/viewed`   | Marquer un produit comme vu       |
| GET     | `http://localhost:8000/api/users/`                      | Tous les users                    |
| GET     | `http://localhost:8000/api/users/search/:lastName`      | User par nom + ses achats peuplés |

> Pour les PATCH, utiliser **Postman**, **Thunder Client** ou `fetch()` avec `body: JSON.stringify({ userId: "..." })`

---

## Ordre de lancement à chaque session

```
1. net start MongoDB   ← démarrer la base de données
2. npm run dev         ← démarrer le serveur Express
3. Live Server         ← ouvrir le HTML (clic droit sur __test__/index.html)
```

---

## Prochaines étapes

- Sécuriser le `userId` via un token JWT (authentification)
- Brancher le front React (Vite)
