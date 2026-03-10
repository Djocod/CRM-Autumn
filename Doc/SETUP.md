# Guide de mise en place — CRM-Autumn

Récapitulatif complet de toutes les étapes réalisées depuis le début du projet.

---

## Table des matières

- [PARTIE 1 — Backend (Express + MongoDB)](#partie-1--backend-express--mongodb)
- [PARTIE 2 — Client (React)](#partie-2--client-react)
- [PARTIE 3 — Démarrage & erreurs rencontrées](#partie-3--démarrage--erreurs-rencontrées)

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

Schéma au format **randomuser.me** avec trois tableaux de sessions référençant des produits via `ObjectId` :

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

    // Sessions — chaque session contient une date et une liste de produits référencés
    purchaseSessions: [
      {
        date: { type: Date, default: Date.now },
        products: [
          { product: { type: Schema.Types.ObjectId, ref: "Product" } },
        ],
      },
    ],
    viewSessions: [
      {
        date: { type: Date, default: Date.now },
        products: [
          { product: { type: Schema.Types.ObjectId, ref: "Product" } },
        ],
      },
    ],
    refundSessions: [
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

## 9. Script de seeding — `seed.js`

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

## 10. Service — `service/users.service.js`

La projection `champs` limite les données retournées. `.populate()` récupère les documents produits liés dans chaque session :

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
  },
  login: { uuid: true, username: true },
  dob: { date: true, age: true },
  registered: { date: true, age: true },
  picture: { large: true, medium: true, thumbnail: true },
  purchaseSessions: true,
  viewSessions: true,
  refundSessions: true,
};

// READ
export async function findUserByLastName(lastName) {
  return User.find({ "name.last": { $regex: lastName, $options: "i" } }, champs)
    .populate("purchaseSessions.products.product")
    .populate("viewSessions.products.product")
    .populate("refundSessions.products.product");
}

export async function findAllUser() {
  return User.find({}, champs);
}

export async function findUserById(_id) {
  return User.findById(_id, champs)
    .populate("purchaseSessions.products.product")
    .populate("viewSessions.products.product")
    .populate("refundSessions.products.product");
}

// PATCH — Ajout d'une session
export async function addPurchasedProduct(userId, productId) {
  return User.findByIdAndUpdate(
    userId,
    {
      $push: {
        purchaseSessions: {
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

export async function addRefundProduct(userId, productId) {
  return User.findByIdAndUpdate(
    userId,
    {
      $push: {
        refundSessions: {
          date: new Date(),
          products: [{ product: productId }],
        },
      },
    },
    { returnDocument: "after" },
  );
}

// DELETE — Suppression d'une session
export async function deletePurchasedProduct(userId, productId) {
  return User.findByIdAndUpdate(
    userId,
    { $pull: { purchaseSessions: { "products.product": productId } } },
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

export async function deleteRefundProduct(userId, productId) {
  return User.findByIdAndUpdate(
    userId,
    { $pull: { refundSessions: { "products.product": productId } } },
    { returnDocument: "after" },
  );
}
```

> **Points clés :**
>
> - `$regex` + `$options: "i"` → recherche insensible à la casse
> - `$push` → ajoute un sous-document sans écraser les sessions existantes
> - `$pull` → supprime les sessions dont le produit correspond à l'`ObjectId`
> - `returnDocument: "after"` → retourne le document après modification (= `new: true` Mongoose 7+)

---

## 11. Service — `service/products.service.js`

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
  return Products.find({ brand: brand }, champs);
}
```

---

## 12. Controller — `controller/users.controller.js`

Pattern systématique dans chaque handler : extraire → valider → appeler le service → vérifier → répondre.

```js
import {
  findUserByLastName,
  findAllUser,
  findUserById,
  addPurchasedProduct,
  addViewedProduct,
  addRefundProduct,
  deleteRefundProduct,
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
    const { productId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "Missing userId" });
    const updated = await addPurchasedProduct(userId, productId);
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

export async function handlePatchRefundProducts(req, res) {
  try {
    const { productId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "Missing userId" });
    const updated = await addRefundProduct(userId, productId);
    if (!updated) return res.status(404).json({ message: "User not found !" });
    return res.status(200).json({ refundSessions: updated.refundSessions });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// DELETE
export async function handleDeletePurchaseProducts(req, res) {
  try {
    const { productId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "Missing userId" });
    const updated = await deletePurchasedProduct(userId, productId);
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

export async function handleDeleteRefundProducts(req, res) {
  try {
    const { productId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "Missing userId" });
    const updated = await deleteRefundProduct(userId, productId);
    if (!updated) return res.status(404).json({ message: "User not found !" });
    return res.status(200).json({ refundSessions: updated.refundSessions });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

---

## 13. Controller — `controller/products.controller.js`

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
    const product = await getProductByBrand(brand);
    if (!product)
      return res.status(404).json({ message: "Product not found !" });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

> `req.query` (et non `req.params`) car la route `/search` n'a pas de segment dynamique.

---

## 14. Router — `router/users.route.js`

```js
import { Router } from "express";
import {
  handleGetUser,
  handleGetAllUser,
  handleGetUserById,
  handlePatchBuyProducts,
  handlePatchViewProducts,
  handlePatchRefundProducts,
  handleDeleteRefundProducts,
  handleDeletePurchaseProducts,
  handleDeleteViewProducts,
} from "../controller/users.controller.js";

const router = Router();

// GET
router.get("/", handleGetAllUser);
router.get("/search/:lastname", handleGetUser); // avant /:id !
router.get("/:id", handleGetUserById);

// PATCH
router.patch("/:productId/purchase", handlePatchBuyProducts);
router.patch("/:productId/viewed", handlePatchViewProducts);
router.patch("/:productId/refund", handlePatchRefundProducts);

// DELETE
router.delete("/:productId/purchase", handleDeletePurchaseProducts);
router.delete("/:productId/viewed", handleDeleteViewProducts);
router.delete("/:productId/refund", handleDeleteRefundProducts);

export default router;
```

> `/search/:lastname` doit être déclaré **avant** `/:id`, sinon Express capturerait `"search"` comme un `id`.

---

## 15. Router — `router/products.route.js`

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

## 16. Endpoints API — Récapitulatif

| Méthode  | URL                               | Body (JSON)  | Description                               |
| -------- | --------------------------------- | ------------ | ----------------------------------------- |
| `GET`    | `/api/users`                      | —            | Liste tous les utilisateurs               |
| `GET`    | `/api/users/search/:lastname`     | —            | Recherche par nom (regex insensible)      |
| `GET`    | `/api/users/:id`                  | —            | Utilisateur par `_id` + sessions peuplées |
| `PATCH`  | `/api/users/:productId/purchase`  | `{ userId }` | Ajoute une session d'achat                |
| `PATCH`  | `/api/users/:productId/viewed`    | `{ userId }` | Ajoute une session de vue                 |
| `PATCH`  | `/api/users/:productId/refund`    | `{ userId }` | Ajoute une session de remboursement       |
| `DELETE` | `/api/users/:productId/purchase`  | `{ userId }` | Supprime une session d'achat              |
| `DELETE` | `/api/users/:productId/viewed`    | `{ userId }` | Supprime une session de vue               |
| `DELETE` | `/api/users/:productId/refund`    | `{ userId }` | Supprime une session de remboursement     |
| `GET`    | `/api/product`                    | —            | Liste tous les produits                   |
| `GET`    | `/api/product/search?brand=Gucci` | —            | Produits filtrés par marque               |

---

# PARTIE 2 — Client (React)

## 17. Initialisation du client React

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

## 18. Structure `client/src/`

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

## 19. Routing — `src/App.js`

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

## 20. Composant `Navigation.js`

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

## 21. Pages — `Home`, `Profil`, `Book`

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

## 22. Composant `Users.js`

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

## 23. Composant `UsersCard.js`

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

## 24. Composant `Products.js`

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

## 25. Composant `ProductCard.js`

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

## 26. Composant `ProfilUser.js`

Page accessible via `/users/:id`. Charge le profil + les sessions, et permet d'ajouter ou supprimer des sessions via PATCH/DELETE :

```js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navigation from "./Navigation";

const ProfilUser = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState("");
  const [viewData, setViewData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [refundData, setRefundData] = useState([]);
  const [productsData, setProdctsData] = useState([]);

  // Chargement de tous les produits disponibles
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/product`)
      .then((res) => setProdctsData(res.data.products));
  }, []);

  // Chargement du profil utilisateur — se relance si l'id dans l'URL change
  useEffect(() => {
    axios.get(`http://localhost:8000/api/users/${id}`).then((res) => {
      setUserData(res.data.user);
      setUserId(res.data.user._id);
      setViewData(res.data.user.viewSessions);
      setPurchaseData(res.data.user.purchaseSessions);
      setRefundData(res.data.user.refundSessions);
    });
  }, [id]);

  // PATCH — ajout de sessions
  function addPurchase(productId) {
    axios.patch(`http://localhost:8000/api/users/${productId}/purchase`, {
      userId,
    });
  }
  function addView(productId) {
    axios.patch(`http://localhost:8000/api/users/${productId}/viewed`, {
      userId,
    });
  }
  function addRefund(productId) {
    axios.patch(`http://localhost:8000/api/users/${productId}/refund`, {
      userId,
    });
  }

  // DELETE — suppression de sessions
  // Pour les DELETE avec body en Axios, il faut { data: { ... } }
  function deletePurchase(productId) {
    axios.delete(`http://localhost:8000/api/users/${productId}/purchase`, {
      data: { userId },
    });
  }
  function deleteView(productId) {
    axios.delete(`http://localhost:8000/api/users/${productId}/viewed`, {
      data: { userId },
    });
  }
  function deleteRefund(productId) {
    axios.delete(`http://localhost:8000/api/users/${productId}/refund`, {
      data: { userId },
    });
  }

  return (
    <div className="body-user">
      <Navigation />
      {/* Affichage du profil, des sessions et des actions */}
    </div>
  );
};

export default ProfilUser;
```

> **Point Axios** : pour envoyer un body dans une requête `DELETE`, il faut passer `{ data: { userId } }` comme second argument — comportement spécifique d'Axios.

---

## 27. Styles SCSS

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

# PARTIE 3 — Démarrage & erreurs rencontrées

## 28. Lancement du projet complet

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
node seed.js
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

## 29. Erreurs rencontrées et solutions

| Erreur                                     | Cause                                     | Solution                                               |
| ------------------------------------------ | ----------------------------------------- | ------------------------------------------------------ |
| `connect ECONNREFUSED 127.0.0.1:27017`     | MongoDB non démarré                       | `net start MongoDB`                                    |
| `Invalid scheme, expected "mongodb://"`    | `.env` mal formé (clé dupliquée)          | Corriger `MONGO_URI=mongodb://localhost:27017/crm`     |
| `findMany() is not a function`             | Confusion avec Prisma                     | Utiliser `find()` / `findOne()` (Mongoose)             |
| `.polulate()` non reconnu                  | Faute de frappe                           | Corriger en `.populate()`                              |
| `req.params.brand` retourne `undefined`    | Route sans segment dynamique              | Utiliser `req.query.brand` pour `?brand=Gucci`         |
| Express capture `"search"` comme un `id`   | Mauvais ordre de déclaration des routes   | Déclarer `/search/:lastname` **avant** `/:id`          |
| `DELETE` Axios n'envoie pas le body        | Comportement spécifique d'Axios           | Passer `{ data: { userId } }` comme second argument    |
| `method: "PATH"` dans fetch                | Typo                                      | Corriger en `method: "PATCH"`                          |
| `data.Products` retourne `undefined`       | Majuscule incorrecte                      | Corriger en `data.products`                            |
| `handleGetAllUser` retournait toujours 400 | Lisait `req.params._id` sur une route `/` | Supprimer le paramètre, appeler `User.find({})` direct |
