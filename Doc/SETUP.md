# Guide de mise en place — CRM-Autumn

Récapitulatif complet de toutes les étapes réalisées depuis le début du projet.

---

## Table des matières

- [PARTIE 1 — Backend (Express + MongoDB)](#partie-1--backend-express--mongodb)
- [PARTIE 2 — Client (React)](#partie-2--client-react)
- [PARTIE 3 — Évolutions & Refactoring](#partie-3--évolutions--refactoring)
- [PARTIE 4 — Démarrage & erreurs rencontrées](#partie-4--démarrage--erreurs-rencontrées)

---

# PARTIE 1 — Backend (Express + MongoDB)

## 1. Prérequis

Avant tout code, ces outils doivent être installés sur la machine :

| Outil                    | Rôle                        | Lien                                           |
| ------------------------ | --------------------------- | ---------------------------------------------- |
| VS Code                  | Éditeur de code             | https://code.visualstudio.com                  |
| Node.js LTS              | Runtime JavaScript + npm    | https://nodejs.org                             |
| Git                      | Versionning                 | https://git-scm.com                            |
| MongoDB Community Server | Base de données locale      | https://www.mongodb.com/try/download/community |
| MongoDB Compass          | Interface graphique MongoDB | https://www.mongodb.com/try/download/compass   |

---

## 2. Initialisation du projet

Dans le dossier `server/` :

```bash
npm init -y
npm install express mongoose dotenv cors
npm install --save-dev nodemon
```

| Package    | Rôle                                              |
| ---------- | ------------------------------------------------- |
| `express`  | Framework HTTP                                    |
| `mongoose` | ODM pour MongoDB                                  |
| `dotenv`   | Variables d'environnement                         |
| `cors`     | Autorise les requêtes cross-origin (client React) |
| `nodemon`  | Redémarrage automatique en développement          |

---

## 3. Fichier `.env`

À la racine du dossier `server/` :

```
PORT=8000
MONGO_URI=mongodb://localhost:27017/crm
```

> **Erreurs rencontrées :**
>
> - `MONGO_URI=MONGO_URI=mongodb://...` → clé dupliquée, corrigée en `MONGO_URI=mongodb://...`
> - `MONGO_URI=localhost:...` → préfixe `mongodb://` manquant

---

## 4. Fichier `package.json`

`"type": "module"` est indispensable pour la syntaxe `import/export` (ES Modules) :

```json
{
  "name": "crm-autumn",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "mongoose": "^9.2.4"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```

---

## 5. Architecture MVC

Le projet suit une architecture **MVC** avec une couche **service** intermédiaire :

```
server/
├── .env
├── package.json
├── server.js           ← point d'entrée
├── seed.js             ← import des données JSON → MongoDB
├── jsonFile/
│   ├── users.json
│   └── products.json
├── model/              ← schémas Mongoose
│   ├── schema.users.js
│   └── schema.products.js
├── service/            ← requêtes MongoDB
│   ├── users.service.js
│   └── products.service.js
├── controller/         ← validation req/res, délègue au service
│   ├── users.controller.js
│   └── products.controller.js
├── router/             ← déclaration des routes HTTP
│   ├── users.route.js
│   └── products.route.js
└── utils/
    └── mongod.js
```

> **Principe** : chaque couche a une responsabilité unique. Le router reçoit la requête HTTP, le controller valide les données, le service interagit avec la base via le modèle Mongoose.

---

## 6. Fichier `server.js`

```js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./router/users.route.js";
import productRoutes from "./router/products.route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/product", productRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB successfull"))
  .catch((err) => console.error("Error connection :", err.message));

app.get("/", (req, res) => res.send("Hell world!"));

const port = process.env.PORT || 8000;
app.listen(port, () =>
  console.log(`Server is running http://localhost:${port}`),
);
```

> **Points clés :**
>
> - `app.use(cors())` → avant toutes les routes, autorise le client React (port 3000)
> - Port `8000` pour éviter le conflit avec React (port 3000 par défaut)

---

## 7. Modèle — `model/schema.users.js`

Schéma au format **randomuser.me** avec **deux** tableaux de sessions référençant des produits via `ObjectId`. Le tableau `purchaseSessions` couvre les trois types de transactions grâce à un champ `type` :

```js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    name: {
      title: { type: String, trim: true },
      first: { type: String, required: true, trim: true },
      last: { type: String, required: true, trim: true },
    },
    location: {
      street: { number: { type: Number }, name: { type: String, trim: true } },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      postcode: { type: String, trim: true },
      coordinates: { latitude: { type: String }, longitude: { type: String } },
      timezone: {
        offset: { type: String },
        description: { type: String, trim: true },
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    login: {
      uuid: { type: String, unique: true },
      username: { type: String, unique: true, trim: true },
      password: { type: String },
      salt: { type: String },
      md5: { type: String },
      sha1: { type: String },
      sha256: { type: String },
    },
    dob: { date: { type: Date }, age: { type: Number } },
    registered: { date: { type: Date }, age: { type: Number } },
    phone: { type: String, trim: true },
    cell: { type: String, trim: true },
    picture: {
      large: { type: String, trim: true },
      medium: { type: String, trim: true },
      thumbnail: { type: String, trim: true },
    },
    nat: { type: String, uppercase: true, trim: true },

    // Sessions d'achat — le champ `type` distingue les trois sous-types
    purchaseSessions: [
      {
        type: { type: String, enum: ["buyShop", "buyNet", "refund"] },
        date: { type: Date, default: Date.now },
        products: [
          { product: { type: Schema.Types.ObjectId, ref: "Product" } },
        ],
      },
    ],
    // Sessions de sélection/consultation
    viewSessions: [
      {
        date: { type: Date, default: Date.now },
        products: [
          { product: { type: Schema.Types.ObjectId, ref: "Product" } },
        ],
      },
    ],
  },
  { timestamps: true },
);

const User = model("User", userSchema);
export default User;
```

> **Points clés :**
>
> - `purchaseSessions.type` → enum `"buyShop"` (achat en magasin), `"buyNet"` (achat en ligne), `"refund"` (remboursement) — remplace l'ancien `refundSessions` séparé
> - `ref: "Product"` → permet le `.populate()` pour récupérer les documents produits complets
> - `timestamps: true` → ajoute automatiquement `createdAt` et `updatedAt`
> - `email`, `login.uuid`, `login.username` → champs `unique`

---

## 8. Modèle — `model/schema.products.js`

```js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "EUR", uppercase: true, trim: true },
    stock: { type: Number, default: 0 },
    description: { type: String, trim: true },
    image: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    ref: { type: String, trim: true, unique: true },
    sizes: [{ type: String, trim: true }],
    colors: [
      {
        name: { type: String, trim: true },
        hex: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true },
);

const Product = model("Product", productSchema);
export default Product;
```

---

## 9. Script de seeding produits — `seed.js`

Importe les produits depuis le fichier JSON. Utilise `findOneAndUpdate` avec `upsert: true` pour éviter les doublons si le script est relancé :

```js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./model/schema.products.js";
import { readFile } from "fs/promises";

dotenv.config();

const products = JSON.parse(await readFile("./jsonFile/products.json"));

await mongoose.connect(process.env.MONGO_URI);

for (const product of products) {
  await Product.findOneAndUpdate(
    { ref: product.ref }, // recherche par référence unique
    { $set: product }, // met à jour tous les champs
    { upsert: true, new: true }, // crée si inexistant
  );
}

console.log("Produits importés!");
await mongoose.disconnect();
```

Lancement :

```bash
node seed.js
```

> Le top-level `await` est autorisé grâce à `"type": "module"` dans `package.json`.

---

## 10. Script de seeding utilisateurs — `seedUsers.js`

Identique à `seed.js` mais dédié aux utilisateurs. La clé d'unicité utilisée est `email` :

```js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Users from "./model/schema.users.js";
import { readFile } from "fs/promises";

dotenv.config();

const users = JSON.parse(await readFile("./jsonFile/users.json"));

await mongoose.connect(process.env.MONGO_URI);

for (const user of users) {
  await Users.findOneAndUpdate(
    { email: user.email }, // recherche par email unique
    { $set: user },
    { upsert: true, new: true },
  );
}

console.log("Utilisateurs importés!");
await mongoose.disconnect();
```

Lancement :

```bash
node seedUsers.js
```

> **Pourquoi deux scripts séparés ?** Les données produits et utilisateurs proviennent de sources différentes (`products.json` et `users.json`) et ont des clés d'unicité différentes (`ref` pour les produits, `email` pour les utilisateurs).

---

## 11. Service — `service/users.service.js`

La projection `champs` est étendue pour inclure tous les champs login et les données de localisation complètes. Les fonctions `addPurchasedProduct` et `deletePurchasedProduct` acceptent désormais un `sessionType` en troisième paramètre. Les anciennes fonctions `addRefundProduct` et `deleteRefundProduct` ont été supprimées (les remboursements passent maintenant par `purchaseSessions` avec `type: "refund"`) :

```js
import User from "../model/schema.users.js";

const champs = {
  _id: true,
  gender: true,
  email: true,
  phone: true,
  cell: true,
  nat: true,
  name: { title: true, first: true, last: true },
  location: {
    street: { number: true, name: true },
    city: true,
    state: true,
    country: true,
    postcode: true,
    coordinates: { latitude: true, longitude: true },
    timezone: { offset: true, description: true },
  },
  login: {
    uuid: true,
    username: true,
    password: true,
    salt: true,
    md5: true,
    sha1: true,
    sha256: true,
  },
  dob: { date: true, age: true },
  registered: { date: true, age: true },
  picture: { large: true, medium: true, thumbnail: true },
  purchaseSessions: true,
  viewSessions: true,
};

// READ
export async function findUserByLastName(lastName) {
  return User.find({ "name.last": { $regex: lastName, $options: "i" } }, champs)
    .populate("purchaseSessions.products.product")
    .populate("viewSessions.products.product");
}

export async function findAllUser() {
  return User.find({}, champs);
}

export async function findUserById(_id) {
  return User.findById(_id, champs)
    .populate("purchaseSessions.products.product")
    .populate("viewSessions.products.product");
}

// PATCH — Ajout d'une session
export async function addPurchasedProduct(userId, productId, sessionType) {
  return User.findByIdAndUpdate(
    userId,
    {
      $push: {
        purchaseSessions: {
          type: sessionType, // "buyShop" | "buyNet" | "refund"
          date: new Date(),
          products: [{ product: productId }],
        },
      },
    },
    { returnDocument: "after" },
  );
}

export async function addViewedProduct(userId, productId) {
  return User.findByIdAndUpdate(
    userId,
    {
      $push: {
        viewSessions: { date: new Date(), products: [{ product: productId }] },
      },
    },
    { returnDocument: "after" },
  );
}

// DELETE — Suppression d'une session
export async function deletePurchasedProduct(userId, productId, sessionType) {
  return User.findByIdAndUpdate(
    userId,
    {
      $pull: {
        purchaseSessions: { type: sessionType, "products.product": productId },
      },
    },
    { returnDocument: "after" },
  );
}

export async function deleteViewedProduct(userId, productId) {
  return User.findByIdAndUpdate(
    userId,
    { $pull: { viewSessions: { "products.product": productId } } },
    { returnDocument: "after" },
  );
}
```

> **Points clés :**
>
> - `sessionType` → troisième paramètre de `addPurchasedProduct` et `deletePurchasedProduct`, transmis depuis l'URL via `req.params`
> - `$pull` avec `type: sessionType` → supprime uniquement la session du bon type (évite de supprimer une session `buyNet` en ciblant une session `buyShop`)
> - `refundSessions` retiré de la projection — les remboursements sont des `purchaseSessions` filtrées par `type: "refund"`
> - `returnDocument: "after"` → retourne le document après modification

---

## 12. Service — `service/products.service.js`

La recherche par marque utilise désormais `$regex` pour être insensible à la casse (comme pour la recherche par nom d'utilisateur) :

```js
import Products from "../model/schema.products.js";

const champs = {
  _id: true,
  title: true,
  brand: true,
  category: true,
  price: true,
  currency: true,
  stock: true,
  description: true,
  image: true,
  tags: true,
  ref: true,
  sizes: true,
  colors: true,
};

export async function listProducts() {
  return Products.find({}, champs);
}

export async function getProductByBrand(brand) {
  return Products.find({ brand: { $regex: brand, $options: "i" } }, champs);
}
```

> `$regex` + `$options: "i"` → `?brand=gucci` retrouvera les produits `Gucci`, `GUCCI`, etc.

---

## 13. Controller — `controller/users.controller.js`

Les handlers `handlePatchRefundProducts` et `handleDeleteRefundProducts` ont été supprimés. Les handlers d'achat extraient désormais `sessionType` depuis `req.params` (transmis depuis l'URL) :

```js
import {
  findUserByLastName,
  findAllUser,
  findUserById,
  addPurchasedProduct,
  addViewedProduct,
  deletePurchasedProduct,
  deleteViewedProduct,
} from "../service/users.service.js";

// GET
export async function handleGetAllUser(req, res) {
  try {
    const user = await findAllUser();
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function handleGetUser(req, res) {
  try {
    const { lastname } = req.params;
    if (!lastname)
      return res.status(400).json({ message: "Missing user last name" });
    const user = await findUserByLastName(lastname);
    if (!user) return res.status(404).json({ message: "User not found !" });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function handleGetUserById(req, res) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Missing user Id" });
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ message: "User not found !" });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// PATCH
export async function handlePatchBuyProducts(req, res) {
  try {
    const { sessionType, productId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "Missing userId" });
    const updated = await addPurchasedProduct(userId, productId, sessionType);
    if (!updated) return res.status(404).json({ message: "User not found !" });
    return res.status(200).json({ purchaseSessions: updated.purchaseSessions });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function handlePatchViewProducts(req, res) {
  try {
    const { productId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "Missing userId" });
    const updated = await addViewedProduct(userId, productId);
    if (!updated) return res.status(404).json({ message: "User not found !" });
    return res.status(200).json({ viewSessions: updated.viewSessions });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// DELETE
export async function handleDeletePurchaseProducts(req, res) {
  try {
    const { sessionType, productId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "Missing userId" });
    const updated = await deletePurchasedProduct(
      userId,
      productId,
      sessionType,
    );
    if (!updated) return res.status(404).json({ message: "User not found !" });
    return res.status(200).json({ purchaseSessions: updated.purchaseSessions });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function handleDeleteViewProducts(req, res) {
  try {
    const { productId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "Missing userId" });
    const updated = await deleteViewedProduct(userId, productId);
    if (!updated) return res.status(404).json({ message: "User not found !" });
    return res.status(200).json({ viewSessions: updated.viewSessions });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

> **Points clés :**
>
> - `sessionType` provient de `req.params`, transmis dans l'URL (`/:sessionType/:productId/purchase`)
> - `userId` provient de `req.body` pour les PATCH et DELETE
> - Pattern systématique dans chaque handler : extraire → valider → appeler le service → vérifier → répondre

---

## 14. Controller — `controller/products.controller.js`

La vérification "not found" contrôle désormais `products.length === 0` (un tableau vide n'est pas `null`), et la réponse retourne `{ products }` de manière cohérente :

```js
import {
  listProducts,
  getProductByBrand,
} from "../service/products.service.js";

export async function handleListProducts(req, res) {
  try {
    const products = await listProducts();
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function handleGetProductsByBrand(req, res) {
  try {
    const { brand } = req.query; // paramètre d'URL : ?brand=Gucci
    if (!brand)
      return res.status(400).json({ message: "Missing product Brand" });
    const products = await getProductByBrand(brand);
    if (!products || products.length === 0)
      return res.status(404).json({ message: "Product not found !" });
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

> `req.query` (et non `req.params`) car la route `/search` n'a pas de segment dynamique.

---

## 15. Router — `router/users.route.js`

Les routes PATCH et DELETE intègrent désormais `:sessionType` dans l'URL. Les routes `/refund` dédiées ont été supprimées — les remboursements passent par `/:sessionType/:productId/purchase` avec `sessionType = "refund"` :

```js
import { Router } from "express";
import {
  handleGetUser,
  handleGetAllUser,
  handleGetUserById,
  handlePatchBuyProducts,
  handlePatchViewProducts,
  handleDeletePurchaseProducts,
  handleDeleteViewProducts,
} from "../controller/users.controller.js";

const router = Router();

// GET
router.get("/", handleGetAllUser);
router.get("/search/:lastname", handleGetUser); // avant /:id !
router.get("/:id", handleGetUserById);

// PATCH
router.patch("/:sessionType/:productId/purchase", handlePatchBuyProducts);
router.patch("/:productId/viewed", handlePatchViewProducts);

// DELETE
router.delete(
  "/:sessionType/:productId/purchase",
  handleDeletePurchaseProducts,
);
router.delete("/:productId/viewed", handleDeleteViewProducts);

export default router;
```

> **Points clés :**
>
> - `/search/:lastname` doit être déclaré **avant** `/:id`, sinon Express capturerait `"search"` comme un `id`
> - `/:sessionType/:productId/purchase` → le type de session (`buyShop`, `buyNet`, `refund`) fait partie de l'URL, ce qui permet de gérer les trois cas avec un seul handler

---

## 16. Router — `router/products.route.js`

```js
import { Router } from "express";
import {
  handleGetProductsByBrand,
  handleListProducts,
} from "../controller/products.controller.js";

const routerProducts = Router();

routerProducts.get("/", handleListProducts);
routerProducts.get("/search", handleGetProductsByBrand);

export default routerProducts;
```

---

## 17. Endpoints API — Récapitulatif

| Méthode  | URL                                           | Body (JSON)  | Description                                          |
| -------- | --------------------------------------------- | ------------ | ---------------------------------------------------- |
| `GET`    | `/api/users`                                  | —            | Liste tous les utilisateurs                          |
| `GET`    | `/api/users/search/:lastname`                 | —            | Recherche par nom (regex insensible)                 |
| `GET`    | `/api/users/:id`                              | —            | Utilisateur par `_id` + sessions peuplées            |
| `PATCH`  | `/api/users/:sessionType/:productId/purchase` | `{ userId }` | Ajoute une session (`buyShop`, `buyNet` ou `refund`) |
| `PATCH`  | `/api/users/:productId/viewed`                | `{ userId }` | Ajoute une session de sélection                      |
| `DELETE` | `/api/users/:sessionType/:productId/purchase` | `{ userId }` | Supprime une session du type indiqué                 |
| `DELETE` | `/api/users/:productId/viewed`                | `{ userId }` | Supprime une session de sélection                    |
| `GET`    | `/api/product`                                | —            | Liste tous les produits                              |
| `GET`    | `/api/product/search?brand=Gucci`             | —            | Produits filtrés par marque (insensible à la casse)  |

---

# PARTIE 2 — Client (React)

## 18. Initialisation du client React

Dans le dossier racine du projet :

```bash
npx create-react-app client
cd client
npm install axios react-router-dom
```

| Package            | Rôle                             |
| ------------------ | -------------------------------- |
| `axios`            | Requêtes HTTP vers l'API Express |
| `react-router-dom` | Navigation entre les pages (SPA) |

---

## 19. Structure `client/src/`

```
src/
├── App.js
├── index.js
├── components/
│   ├── Navigation.js
│   ├── Users.js
│   ├── UsersCard.js
│   ├── Products.js
│   ├── ProductCard.js
│   ├── settingsBtn.js      ← fonctions API PATCH/DELETE centralisées
│   └── ProfilUser.js
├── pages/
│   ├── Home.js
│   ├── Profil.js
│   └── Book.js
└── style/
    ├── _settings.scss
    ├── index.scss
    ├── components/
    │   ├── _navigation.scss
    │   ├── _profilUser.scss
    │   ├── _users.scss
    │   └── _products.scss
    └── pages/
        ├── _home.scss
        └── _profil.scss
```

---

## 20. Routing — `src/App.js`

```js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profil from "./pages/Profil";
import Book from "./pages/Book";
import ProfilUser from "./components/ProfilUser";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Profil" element={<Profil />} />
      <Route path="/Book" element={<Book />} />
      <Route path="/users/:id" element={<ProfilUser />} />
      <Route path="*" element={<Home />} />
    </Routes>
  </BrowserRouter>
);

export default App;
```

| Route        | Page/Composant | Description                           |
| ------------ | -------------- | ------------------------------------- |
| `/`          | `Home`         | Page d'accueil                        |
| `/Profil`    | `Profil`       | Liste des utilisateurs avec recherche |
| `/Book`      | `Book`         | Catalogue des produits                |
| `/users/:id` | `ProfilUser`   | Profil détaillé d'un utilisateur      |
| `*`          | `Home`         | Fallback — toute URL inconnue         |

---

## 21. Composant `Navigation.js`

Barre de navigation commune à toutes les pages. `NavLink` applique automatiquement une classe `active` sur le lien courant :

```js
import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => (
  <ul className="nav-bar">
    <li className="nav-item">
      <NavLink to="/">Acceuil</NavLink>
    </li>
    <li className="nav-item">
      <NavLink to="/Profil">Profil</NavLink>
    </li>
    <li className="nav-item">
      <NavLink to="/Book">Catalogue</NavLink>
    </li>
  </ul>
);

export default Navigation;
```

---

## 22. Pages — `Home`, `Profil`, `Book`

Chaque page intègre `<Navigation />` et le composant métier correspondant :

```js
// pages/Home.js
const Home = () => (
  <div className="body-home">
    <Navigation />
  </div>
);

// pages/Profil.js — liste des utilisateurs
const Profil = () => (
  <div className="body-profil">
    <Navigation />
    <Users />
  </div>
);

// pages/Book.js — catalogue produits
const Book = () => (
  <div className="body-book">
    <Navigation />
    <Products />
  </div>
);
```

---

## 23. Composant `Users.js`

Récupère les utilisateurs via Axios. Le `useEffect` se relance à chaque frappe dans le champ de recherche :

```js
import React, { useEffect, useState } from "react";
import axios from "axios";
import UsersCard from "./UsersCard";

const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const url = userName
      ? `http://localhost:8000/api/users/search/${userName}`
      : `http://localhost:8000/api/users`;
    axios.get(url).then((res) => setUsersData(res.data.user));
  }, [userName]);

  return (
    <div className="users-container">
      <input
        type="text"
        placeholder="Recherche"
        onChange={(e) => setUserName(e.target.value.toLowerCase())}
      />
      {usersData &&
        usersData
          .sort((a, b) => a.name.last.localeCompare(b.name.last))
          .map((user) => <UsersCard key={user._id} user={user} />)}
    </div>
  );
};

export default Users;
```

---

## 24. Composant `UsersCard.js`

Carte cliquable vers le profil de l'utilisateur :

```js
import React from "react";
import { Link } from "react-router-dom";

const UsersCard = ({ user }) => (
  <Link to={`/users/${user._id}`} className="card-user-container">
    <img
      src={user.picture.medium}
      alt={`${user.name.first} ${user.name.last}`}
    />
    <h3>
      {user.name.title} | {user.name.first} {user.name.last}
    </h3>
  </Link>
);

export default UsersCard;
```

---

## 25. Composant `Products.js`

```js
import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const Products = () => {
  const [productsData, setProdctsData] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/product`)
      .then((res) => setProdctsData(res.data.products));
  }, []);

  return (
    <div className="card-product-container">
      {productsData.length > 0 &&
        productsData.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
    </div>
  );
};

export default Products;
```

---

## 26. Composant `ProductCard.js`

```js
import React from "react";

const ProductCard = ({ product }) => (
  <div className="card-product">
    <img src={product.image} alt="" className="img-product" />
    <div className="description-container">
      <h3>
        {product.brand} | {product.title}
      </h3>
      <p className="description">{product.description}</p>
    </div>
  </div>
);

export default ProductCard;
```

---

## 27. Composant `settingsBtn.js`

Centralise toutes les fonctions Axios PATCH/DELETE liées aux sessions utilisateur. Ce fichier extrait la logique des appels API du composant `ProfilUser.js` pour le garder lisible :

```js
import axios from "axios";

// Ajoute une session d'achat (type = "buyShop" | "buyNet" | "refund")
export function addPurchase(addId, userId, typeSes) {
  axios
    .patch(`http://localhost:8000/api/users/${typeSes}/${addId}/purchase`, {
      userId: userId,
    })
    .then((res) => console.log(res.data));
}

// Ajoute une session de sélection/vue
export function addview(addId, userId) {
  axios
    .patch(`http://localhost:8000/api/users/${addId}/viewed`, {
      userId: userId,
    })
    .then((res) => console.log(res.data));
}

// Supprime une session d'achat par type
export function deletePurchase(productId, userId, typeSes) {
  axios
    .delete(
      `http://localhost:8000/api/users/${typeSes}/${productId}/purchase`,
      { data: { userId: userId } },
    )
    .then((res) => console.log(res.data));
}

// Supprime une session de sélection/vue
export function deleteView(productId, userId) {
  axios
    .delete(`http://localhost:8000/api/users/${productId}/viewed`, {
      data: { userId: userId },
    })
    .then((res) => console.log(res.data));
}
```

> **Points clés :**
>
> - `typeSes` est injecté dans l'URL → correspond exactement au `:sessionType` de la route Express
> - Pour les DELETE avec body en Axios, il faut `{ data: { ... } }` comme second argument — comportement spécifique d'Axios

---

## 28. Composant `ProfilUser.js`

Page accessible via `/users/:id`. Entièrement refactorisé avec une **navigation par onglets** (`GÉNÉRAL` / `HISTORIQUE`).

**State et chargement des données :**

```js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navigation from "./Navigation";
import {
  addPurchase,
  deletePurchase,
  addview,
  deleteView,
} from "./settingsBtn.js";

const ProfilUser = () => {
  const { id } = useParams();
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const [userRegistered, setUserRegistered] = useState(null);
  const [userBorn, setUserBorn] = useState(null);
  const [viewData, setViewData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [valueType, setValueType] = useState(""); // type radio sélectionné
  const [activeSection, setActiveSection] = useState("general"); // onglet actif

  const options = { year: "numeric", month: "long", day: "numeric" };

  // Chargement de tous les produits disponibles
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/product`)
      .then((res) => setProductsData(res.data.products));
  }, []);

  // Chargement du profil — se relance si l'id dans l'URL change
  useEffect(() => {
    axios.get(`http://localhost:8000/api/users/${id}`).then((res) => {
      const date = new Date(res.data.user.registered.date);
      const born = new Date(res.data.user.dob.date);
      setUserData(res.data.user);
      setUserId(res.data.user._id);
      setViewData(res.data.user.viewSessions);
      setPurchaseData(res.data.user.purchaseSessions);
      setUserRegistered(date);
      setUserBorn(born);
    });
  }, [id]);
  // ...
};
```

**Structure JSX — onglets et sections :**

```
body-user
├── <Navigation />
├── profil-container          ← carte identité (photo, nom, KPIs CA)
└── main-container
    ├── main-title             ← boutons onglets GÉNÉRAL / HISTORIQUE
    ├── [activeSection === "general"]
    │   ├── card-user-main    ← infos : date d'inscription, tél, email, dob, pays…
    │   └── like-container    ← graphiques préférences marques / marchés (statiques)
    └── [activeSection === "histo"]
        ├── buy-container     ← purchaseData filtrés par type "buyShop" puis "buyNet" puis "refund"
        ├── view-container    ← viewData (sélections)
        └── container-book    ← catalogue complet pour assigner de nouvelles sessions
```

**Filtrage des sessions par type dans l'onglet Historique :**

```js
// Affiche uniquement les achats en magasin
purchaseData
  .filter((session) => session.type === "buyShop")
  .map((session) =>
    session.products.map((item) =>
      item.product ? <ProductCardUser ... /> : null
    )
  )

// Même logique pour "buyNet" et "refund"
```

**Ajout / suppression depuis le catalogue intégré :**

```js
// Boutons dans le catalogue :
<button onClick={() => addPurchase(product._id, userId, valueType)}>purchase</button>
<button onClick={() => addview(product._id, userId)}>view</button>

// Bouton suppression sur chaque carte (radio pour choisir le type) :
<button onClick={() => deletePurchase(item.product._id, userId, valueType)}>deletePurchase</button>
<button onClick={() => deleteView(item.product._id, userId)}>Deleteview</button>
```

> **Points clés :**
>
> - `activeSection` → state string qui contrôle quel bloc JSX est rendu
> - `valueType` → state radio partagé entre le catalogue et les cartes, détermine le `sessionType` envoyé à l'API
> - `userRegistered` et `userBorn` → dates formatées avec `toLocaleDateString("fr-FR", options)`
> - `purchaseData` remplace l'ancien triplet `purchaseData` + `viewData` + `refundData` — les remboursements sont isolés via `.filter(session => session.type === "refund")`
> - Les fonctions API sont importées depuis `settingsBtn.js` pour garder le composant lisible

---

## 29. Styles SCSS

`src/style/index.scss` importe tous les partials dans l'ordre :

```scss
@import "./settings"; // variables globales (couleurs, typographie…)
@import "./pages/home";
@import "./pages/profil";
@import "./components/navigation";
@import "./components/profilUser";
@import "./components/users";
@import "./components/products";
```

> Les fichiers préfixés `_` (underscore) sont des **partials SCSS** — ils ne génèrent pas de fichier CSS autonome, ils sont conçus pour être importés.

---

# PARTIE 3 — Évolutions & Refactoring

## 30. Refactoring du modèle de sessions

**Problème initial :** trois tableaux de sessions distincts (`purchaseSessions`, `viewSessions`, `refundSessions`) obligeaient à dupliquer les routes, les services, les handlers et la logique front-end.

**Solution adoptée :** fusionner les trois types de transactions dans `purchaseSessions` via un champ `type` :

| Avant              | Après                                  |
| ------------------ | -------------------------------------- |
| `purchaseSessions` | `purchaseSessions` (type: `"buyShop"`) |
| `refundSessions`   | `purchaseSessions` (type: `"refund"`)  |
| `viewSessions`     | `viewSessions` (inchangé)              |

**Impact :**

- Schéma Mongoose : suppression de `refundSessions`, ajout de `type: { enum: ["buyShop", "buyNet", "refund"] }` dans `purchaseSessions`
- Service : `addPurchasedProduct` et `deletePurchasedProduct` prennent un 3ème argument `sessionType`
- Routes : `/:productId/purchase`, `/:productId/refund` → `/:sessionType/:productId/purchase`
- Front-end : filtrage par `session.type` pour distinguer achats / remboursements dans l'affichage

---

## 31. Ajout du script `seedUsers.js`

Besoin de peupler la base avec des utilisateurs de test. Créé sur le même modèle que `seed.js` (top-level await, `findOneAndUpdate` + upsert) en utilisant `email` comme clé d'unicité.

```bash
node seedUsers.js
```

---

## 32. Refactoring de `ProfilUser.js` — navigation par onglets

**Avant :** page unique affichant toutes les informations à la suite.

**Après :** deux onglets contrôlés par le state `activeSection` :

- **GÉNÉRAL** — informations personnelles du client (inscription, contact, date de naissance, nationalité, identifiants internes) + bloc préférences (graphiques marques / marchés, statiques pour l'instant)
- **HISTORIQUE** — sessions d'achat filtrées par type (`buyShop`, `buyNet`, `refund`) + sélections (`viewSessions`) + catalogue produits intégré pour assigner de nouvelles sessions

**Extraction de `settingsBtn.js`** : les fonctions Axios PATCH/DELETE ont été extraites dans un fichier dédié importé par `ProfilUser.js`, séparant la logique d'appel API du rendu JSX.

---

## 33. Correction `products.controller.js` — cohérence de la réponse

- Ancienne réponse : `res.status(200).json(product)` (sans enveloppe, clé `product` au singulier)
- Nouvelle réponse : `res.status(200).json({ products })` (enveloppe cohérente avec `handleListProducts`)
- Vérification "not found" : `products.length === 0` au lieu de `!product` (un tableau vide n'est jamais `null`)

---

# PARTIE 4 — Démarrage & erreurs rencontrées

## 34. Lancement du projet complet

**Terminal 1 — Démarrer MongoDB :**

```bash
net start MongoDB
```

**Terminal 2 — Serveur backend :**

```bash
cd server
npm run dev       # nodemon (redémarrage auto à chaque modification)
# ou
npm start         # node (sans redémarrage)
```

**Terminal 3 — Seeding (première fois ou base vide) :**

```bash
cd server
node seed.js        # importe les produits
node seedUsers.js   # importe les utilisateurs
```

**Terminal 4 — Client React :**

```bash
cd client
npm start         # démarre sur http://localhost:3000
```

Quand tout fonctionne, le backend affiche :

```
MongoDB successfull
Server is running http://localhost:8000
```

---

## 35. Erreurs rencontrées et solutions

| Erreur                                      | Cause                                        | Solution                                               |
| ------------------------------------------- | -------------------------------------------- | ------------------------------------------------------ |
| `connect ECONNREFUSED 127.0.0.1:27017`      | MongoDB non démarré                          | `net start MongoDB`                                    |
| `Invalid scheme, expected "mongodb://"`     | `.env` mal formé (clé dupliquée)             | Corriger `MONGO_URI=mongodb://localhost:27017/crm`     |
| `findMany() is not a function`              | Confusion avec Prisma                        | Utiliser `find()` / `findOne()` (Mongoose)             |
| `.polulate()` non reconnu                   | Faute de frappe                              | Corriger en `.populate()`                              |
| `req.params.brand` retourne `undefined`     | Route sans segment dynamique                 | Utiliser `req.query.brand` pour `?brand=Gucci`         |
| Express capture `"search"` comme un `id`    | Mauvais ordre de déclaration des routes      | Déclarer `/search/:lastname` **avant** `/:id`          |
| `DELETE` Axios n'envoie pas le body         | Comportement spécifique d'Axios              | Passer `{ data: { userId } }` comme second argument    |
| `method: "PATH"` dans fetch                 | Typo                                         | Corriger en `method: "PATCH"`                          |
| `data.Products` retourne `undefined`        | Majuscule incorrecte                         | Corriger en `data.products`                            |
| `handleGetAllUser` retournait toujours 400  | Lisait `req.params._id` sur une route `/`    | Supprimer le paramètre, appeler `User.find({})` direct |
| `deletePurchase` supprimait le mauvais type | `$pull` sans filtre sur `type`               | Ajouter `type: sessionType` dans le `$pull`            |
| Recherche marque insensible à la casse      | Comparaison exacte de chaîne                 | Utiliser `{ $regex: brand, $options: "i" }`            |
| `data.products` undefined côté React        | Réponse sans enveloppe (`res.json(product)`) | Normaliser en `res.json({ products })`                 |
