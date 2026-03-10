# CRM-Autumn — Document de cadrage projet

## Contexte

Projet scolaire de type **CRM e-commerce** développé en stack MERN (MongoDB, Express, React, Node.js).  
L'objectif est de permettre la consultation rapide de l'historique client : produits achetés, consultés et remboursés, organisés par sessions datées.

---

## Stack technique

| Couche          | Technologie                  | Version |
| --------------- | ---------------------------- | ------- |
| Base de données | MongoDB Community (local)    | 27017   |
| ODM             | Mongoose                     | 9.x     |
| Serveur         | Node.js LTS + Express        | 5.x     |
| Frontend        | React (Create React App)     | 19.x    |
| Routing SPA     | React Router DOM             | 7.x     |
| Requêtes        | Axios                        | 1.x     |
| Style           | SCSS (partials + index.scss) | —       |
| Dev server      | nodemon                      | —       |

---

## Architecture

Le projet suit une architecture **MVC avec couche service** :

```
Requête HTTP
    └── router/          → définit les routes Express
        └── controller/  → reçoit req/res, orchestre la logique
            └── service/ → logique métier, appels Mongoose
                └── model/ (Mongoose) → schéma + accès MongoDB
```

### Structure des dossiers

```
server/
├── server.js                  → point d'entrée Express
├── seed.js                    → import initial des données produits
├── router/
│   ├── products.route.js
│   └── users.route.js
├── controller/
│   ├── products.controller.js
│   └── users.controller.js
├── service/
│   ├── products.service.js
│   └── users.service.js
├── model/
│   ├── schema.products.js
│   └── schema.users.js
├── jsonFile/
│   └── products.json          → données initiales produits
└── utils/
    └── mongod.js              → connexion Mongoose

client/
├── src/
│   ├── App.js
│   ├── components/
│   │   ├── Navigation.js
│   │   ├── Products.js
│   │   ├── ProductCard.js
│   │   ├── Users.js
│   │   ├── UsersCard.js
│   │   └── ProfilUser.js
│   └── pages/
│       ├── Home.js
│       ├── Book.js
│       └── Profil.js
└── style/
    └── index.scss             → importe tous les partials SCSS
```

---

## Modèles de données

### Product

| Champ         | Type       | Requis | Description                      |
| ------------- | ---------- | ------ | -------------------------------- |
| `title`       | String     | Oui    | Nom du produit                   |
| `brand`       | String     | Oui    | Marque                           |
| `category`    | String     | Oui    | Catégorie                        |
| `price`       | Number     | Oui    | Prix                             |
| `currency`    | String     | Non    | Devise (défaut : `"EUR"`)        |
| `stock`       | Number     | Non    | Quantité en stock (défaut : `0`) |
| `description` | String     | Non    | Description courte               |
| `image`       | String     | Non    | URL de l'image                   |
| `tags`        | `[String]` | Non    | Tags associés                    |
| `ref`         | String     | Non    | Référence unique                 |
| `sizes`       | `[String]` | Non    | Tailles disponibles              |
| `colors`      | `[Object]` | Non    | Couleurs `{ name, hex }`         |

### User

| Champ                                                  | Type                           | Description                                |
| ------------------------------------------------------ | ------------------------------ | ------------------------------------------ |
| `gender`                                               | String (enum)                  | `"male"` / `"female"` / `"other"`          |
| `name`                                                 | `{ title, first, last }`       | Nom complet                                |
| `location`                                             | sous-document                  | Adresse (ville, pays, coordonnées GPS…)    |
| `email`                                                | String unique                  | Email normalisé en lowercase               |
| `login`                                                | `{ uuid, username, password…}` | Identifiants (données fictives)            |
| `dob`                                                  | `{ date, age }`                | Date et âge de naissance                   |
| `registered`                                           | `{ date, age }`                | Date et ancienneté d'inscription           |
| `phone` / `cell`                                       | String                         | Numéros de téléphone                       |
| `picture`                                              | `{ large, medium, thumbnail }` | URLs des photos                            |
| `nat`                                                  | String                         | Nationalité (ex : `"FR"`)                  |
| `purchaseSessions` / `viewSessions` / `refundSessions` | `[{ date, products[] }]`       | Sessions d'achat, de vue, de remboursement |

> Chaque session contient une `date` et un tableau `products` avec des `ObjectId` référençant la collection `Product`.

---

## API — Endpoints

### Users — `/api/users`

| Méthode  | Route                                    | Description                                   |
| -------- | ---------------------------------------- | --------------------------------------------- |
| `GET`    | `/api/users`                             | Tous les users                                |
| `GET`    | `/api/users/search/:lastname`            | User(s) par nom de famille (avec `.populate`) |
| `GET`    | `/api/users/:id`                         | User par `_id` (avec `.populate`)             |
| `PATCH`  | `/api/users/:productId/purchase`         | Ajoute une session d'achat                    |
| `PATCH`  | `/api/users/:productId/viewed`           | Ajoute une session de vue                     |
| `PATCH`  | `/api/users/:productId/refund`           | Ajoute une session de remboursement           |
| `DELETE` | `/api/users/:userId/purchase/:sessionId` | Supprime une session d'achat                  |
| `DELETE` | `/api/users/:userId/viewed/:sessionId`   | Supprime une session de vue                   |
| `DELETE` | `/api/users/:userId/refund/:sessionId`   | Supprime une session de remboursement         |

### Products — `/api/product`

| Méthode | Route                             | Description                 |
| ------- | --------------------------------- | --------------------------- |
| `GET`   | `/api/product`                    | Tous les produits           |
| `GET`   | `/api/product/search?brand=Gucci` | Produits filtrés par marque |

---

## Données initiales

Les données produits sont stockées dans `jsonFile/products.json` et injectées dans MongoDB via `seed.js`.

Le script utilise `findOneAndUpdate` avec `upsert: true` — il est donc **idempotent** (relançable sans créer de doublons).

Les données utilisateurs proviennent de **Random User API** (`https://randomuser.me/api/`) et ont été intégrées directement dans la base lors du développement.

---

## Lancement du projet

### Prérequis

- MongoDB Community Server (local, port `27017`)
- Node.js LTS

### Démarrage

```bash
# 1. Démarrer MongoDB (en arrière-plan)

# 2. Lancer le serveur Express
cd server
npm run dev        # port 8000

# 3. Lancer le client React (nouveau terminal)
cd client
npm start          # port 3000

# 4. (Optionnel) Importer les produits
cd server
node seed.js
```

---

## Ports utilisés

| Service       | Port  |
| ------------- | ----- |
| MongoDB local | 27017 |
| Serveur API   | 8000  |
| Client React  | 3000  |
