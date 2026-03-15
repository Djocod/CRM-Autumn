# CRM Autumn

Projet scolaire — CRM léger orienté historique client, construit sur la stack **MERN** (MongoDB, Express, React, Node.js).

> Permet de gérer des clients, un catalogue produits, et d'enregistrer des sessions d'achat, de consultation et de remboursement par client.

---

## Fonctionnalités

- Consulter la liste complète des clients (triée par nom, recherche dynamique)
- Accéder au profil détaillé d'un client (photo, infos personnelles, sessions d'achat / vue / remboursement)
- Naviguer dans un catalogue de produits (mode, chaussures, accessoires)
- Ajouter ou supprimer une session d'achat, de vue ou de remboursement sur le profil d'un client

Les données clients proviennent de l'API publique **randomuser.me** (208 utilisateurs fictifs).
Les produits sont des données personnalisées stockées en JSON et importées via un script de seed.

---

## Stack technique

| Côté                      | Technologie              | Version            |
| ------------------------- | ------------------------ | ------------------ |
| Runtime                   | Node.js                  | LTS                |
| Serveur HTTP              | Express                  | 5.x                |
| ODM                       | Mongoose                 | 9.x                |
| Base de données           | MongoDB Community Server | local (port 27017) |
| Frontend                  | React                    | 19.x               |
| Routing client            | React Router DOM         | 7.x                |
| Requêtes HTTP client      | Axios                    | 1.x                |
| Hot reload serveur        | Nodemon                  | 3.x                |
| Variables d'environnement | dotenv                   | 17.x               |
| Politique CORS            | cors                     | 2.x                |

---

## Structure du projet

```
CRM-Autumn/
├── server/                          # Backend Express
│   ├── server.js                    # Point d'entrée — Express, CORS, routes, MongoDB
│   ├── seed.js                      # Import des produits JSON → MongoDB (upsert)
│   ├── seedUsers.js                 # Import des utilisateurs JSON → MongoDB (upsert)
│   ├── .env                         # Variables d'environnement (non versionné)
│   ├── package.json
│   ├── controller/
│   │   ├── users.controller.js      # Handlers HTTP users (GET / PATCH / DELETE)
│   │   └── products.controller.js   # Handlers HTTP produits (GET)
│   ├── router/
│   │   ├── users.route.js           # Routes /api/users
│   │   └── products.route.js        # Routes /api/product
│   ├── service/
│   │   ├── users.service.js         # Requêtes Mongoose users
│   │   └── products.service.js      # Requêtes Mongoose produits
│   ├── model/
│   │   ├── schema.users.js          # Schéma Mongoose User (format randomuser.me)
│   │   └── schema.products.js       # Schéma Mongoose Product
│   ├── jsonFile/
│   │   ├── products.json            # Catalogue produits (source seed)
│   │   └── users.json               # Utilisateurs fictifs (randomuser.me)
│   └── utils/
│       └── mongod.js
└── client/                          # Frontend React (Create React App)
    ├── package.json
    └── src/
        ├── App.js                   # BrowserRouter + Routes
        ├── index.js
        ├── components/
        │   ├── Navigation.js        # Barre de navigation (NavLink)
        │   ├── Users.js             # Liste des users + recherche dynamique
        │   ├── UsersCard.js         # Carte cliquable d'un user
        │   ├── Products.js          # Liste des produits
        │   ├── ProductCard.js       # Carte d'un produit
        │   └── ProfilUser.js        # Profil complet d'un user + gestion des sessions
        ├── pages/
        │   ├── Home.js              # Page d'accueil
        │   ├── Profil.js            # Page liste des users
        │   └── Book.js              # Page catalogue produits
```

---

## Démarrage

1. Démarrer MongoDB :
   ```bash
   net start MongoDB
   ```
2. Lancer le backend :
   ```bash
   cd server
   npm run dev
   ```
3. Importer les données (première fois ou base vide) :
   ```bash
   node seed.js        # produits
   node seedUsers.js   # utilisateurs
   ```
4. Lancer le frontend :
   ```bash
   cd client
   npm start
   ```

---

## Endpoints principaux

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

## Refactoring sessions

- Les sessions d'achat, de remboursement et de vue sont désormais gérées via deux tableaux :
  - `purchaseSessions` (avec champ `type`: `buyShop`, `buyNet`, `refund`)
  - `viewSessions`
- Les routes PATCH/DELETE utilisent `:sessionType` pour distinguer les types de session.
- Les scripts de seed sont séparés pour produits et utilisateurs.
