# CRM Autumn

Projet scolaire — CRM léger orienté historique client, construit sur la stack **MERN** (MongoDB, Express, React, Node.js).

---

## Présentation

Application web fullstack permettant de :

- Consulter la liste complète des clients (triée par nom)
- Accéder à la fiche détaillée d'un client (photo, infos personnelles, produits achetés, produits consultés)
- Naviguer dans un catalogue de produits (mode, chaussures, accessoires)
- Enregistrer un achat ou une consultation de produit pour un client donné

Les données clients proviennent de l'API publique **randomuser.me** (208 utilisateurs fictifs) et les produits sont des données personnalisées stockées en JSON.

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
├── server/                     # Backend Express
│   ├── server.js               # Point d'entrée — Express, CORS, routes, MongoDB
│   ├── seed.js                 # Script de réinitialisation et import des produits
│   ├── .env                    # Variables d'environnement (non versionné)
│   ├── package.json
│   ├── controller/
│   │   ├── products.controller.js   # Handlers HTTP produits
│   │   └── users.controller.js      # Handlers HTTP users
│   ├── router/
│   │   ├── products.route.js        # Routes /api/product
│   │   └── users.route.js           # Routes /api/users
│   ├── service/
│   │   ├── products.service.js      # Requêtes Mongoose produits
│   │   └── users.service.js         # Requêtes Mongoose users
│   ├── model/
│   │   ├── schema.products.js       # Schéma Mongoose Product
│   │   └── schema.users.js          # Schéma Mongoose User
│   ├── jsonFile/
│   │   ├── products.json            # Catalogue produits (source seed)
│   │   └── users.json               # Utilisateurs fictifs (randomuser.me)
│   └── utils/
│       └── mongod.js
│
└── client/                     # Frontend React (Create React App)
    ├── package.json
    └── src/
        ├── App.js               # BrowserRouter + Routes
        ├── index.js
        ├── components/
        │   ├── Users.js         # Liste tous les users (fetch + tri)
        │   ├── UsersCard.js     # Carte cliquable d'un user (Link)
        │   ├── Products.js      # Liste tous les produits (fetch + tri)
        │   ├── ProductCard.js   # Carte d'un produit (image, marque, desc)
        │   ├── ProfilUser.js    # Page profil user (useParams + populate)
        │   └── ProfilProduct.js
        ├── pages/
        │   ├── Home.js          # Page d'accueil → <Users />
        │   └── Book.js
        └── style/
            ├── userscard.css
            └── productcard.css
```

---

## Installation et lancement

### Prérequis

| Outil                    | Rôle                            |
| ------------------------ | ------------------------------- |
| Node.js LTS              | Runtime JavaScript + npm        |
| MongoDB Community Server | Base de données locale          |
| MongoDB Compass          | Interface graphique (optionnel) |
| Git                      | Versionning                     |

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd CRM-Autumn
```

### 2. Backend

```bash
cd server
npm install
```

Créer le fichier `.env` à la racine du dossier `server/` :

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/crm-autumn
```

Importer les données en base :

```bash
node seed.js
```

Lancer le serveur en mode développement :

```bash
npm run dev
```

> Le serveur écoute sur `http://localhost:8000`

### 3. Frontend

```bash
cd client
npm install
npm start
```

> L'application React est accessible sur `http://localhost:3000`

### 4. Démarrer MongoDB

```bash
net start MongoDB
```

> Si MongoDB n'est pas démarré, la connexion échoue avec `ECONNREFUSED 127.0.0.1:27017`.

---

## API — Endpoints

### Users — `/api/users`

| Méthode | Route                         | Description                | Réponse                           |
| ------- | ----------------------------- | -------------------------- | --------------------------------- |
| GET     | `/api/users`                  | Tous les users             | `{ user: [...] }`                 |
| GET     | `/api/users/search/:lastname` | User(s) par nom de famille | `[...]` avec `populate`           |
| GET     | `/api/users/:id`              | User par `_id` MongoDB     | `{ user: {...} }` avec `populate` |

> Les routes `/search/:lastname` et `/:id` retournent les champs `purchasedProducts` et `viewedProducts` peuplés (`.populate()`) avec les documents `Product` complets.

### Products — `/api/product`

| Méthode | Route                              | Description                                  | Body requis             |
| ------- | ---------------------------------- | -------------------------------------------- | ----------------------- |
| GET     | `/api/product`                     | Tous les produits                            | —                       |
| GET     | `/api/product/search?brand=Gucci`  | Produits par marque (query string)           | —                       |
| PATCH   | `/api/product/:productId/purchase` | Ajoute un produit aux achats d'un user       | `{ "userId": "<_id>" }` |
| PATCH   | `/api/product/:productId/viewed`   | Ajoute un produit aux produits vus d'un user | `{ "userId": "<_id>" }` |

> `$addToSet` est utilisé pour éviter les doublons : un produit déjà présent dans le tableau ne sera pas ajouté une deuxième fois.

---

## Modèles de données

### Product

| Champ         | Type     | Requis | Description                      |
| ------------- | -------- | ------ | -------------------------------- |
| `title`       | String   | Oui    | Nom du produit                   |
| `brand`       | String   | Oui    | Marque                           |
| `category`    | String   | Oui    | Catégorie                        |
| `price`       | Number   | Oui    | Prix                             |
| `currency`    | String   | Non    | Devise (défaut : `"EUR"`)        |
| `stock`       | Number   | Non    | Quantité en stock (défaut : `0`) |
| `description` | String   | Non    | Description courte               |
| `image`       | String   | Non    | URL de l'image                   |
| `tags`        | [String] | Non    | Tags associés                    |

### User

| Champ               | Type                              | Description                                              |
| ------------------- | --------------------------------- | -------------------------------------------------------- |
| `gender`            | String (enum)                     | `"male"` / `"female"` / `"other"`                        |
| `name`              | `{ title, first, last }`          | Nom complet                                              |
| `location`          | sous-document                     | Adresse complète (ville, pays, coordonnées GPS…)         |
| `email`             | String unique                     | Email normalisé en lowercase                             |
| `login`             | `{ uuid, username, password, … }` | Identifiants (mot de passe non hashé — données fictives) |
| `dob`               | `{ date, age }`                   | Date et âge de naissance                                 |
| `registered`        | `{ date, age }`                   | Date et ancienneté d'inscription                         |
| `phone` / `cell`    | String                            | Numéros de téléphone                                     |
| `picture`           | `{ large, medium, thumbnail }`    | URLs des photos                                          |
| `nat`               | String                            | Nationalité (ex : `"FR"`)                                |
| `purchasedProducts` | `[ObjectId → Product]`            | Produits achetés (référence)                             |
| `viewedProducts`    | `[ObjectId → Product]`            | Produits consultés (référence)                           |

---

## Scripts disponibles

### Serveur (`server/`)

```bash
npm run dev      # Démarre le serveur avec nodemon (rechargement automatique)
npm start        # Démarre le serveur sans nodemon (production)
node seed.js     # Vide la collection products et réimporte depuis jsonFile/products.json
```

### Client (`client/`)

```bash
npm start        # Lance React en mode développement sur http://localhost:3000
npm run build    # Compile l'application pour la production
```

---

## Ordre de lancement à chaque session

```
1. net start MongoDB        ← démarrer la base de données (service Windows)
2. cd server && npm run dev ← démarrer le serveur Express  → http://localhost:8000
3. cd client && npm start   ← démarrer React               → http://localhost:3000
```

---

## Dernières modifications

### Restructuration de l'architecture serveur

Le projet a migré d'une structure `src/products/` + `src/users/` vers une organisation plate par **type de fichier** (`controller/`, `router/`, `service/`, `model/`), standard dans les projets Express.

### Ajout de la route GET `/api/users/:id`

Retourne un user complet par son `_id` MongoDB avec ses `purchasedProducts` et `viewedProducts` peuplés via `.populate()`. Utilisé par le composant `ProfilUser` côté React.

### Passage des routes POST → PATCH

Les routes d'achat et de consultation produit utilisent désormais `PATCH` (modification partielle d'une ressource existante) au lieu de `POST`, ce qui est plus sémantiquement correct selon REST.

### Création du client React (Create React App)

- **`App.js`** — routing avec `BrowserRouter`, routes `/` (Home) et `/users/:id` (ProfilUser)
- **`Users.js`** — récupère et affiche tous les users triés par nom
- **`UsersCard.js`** — carte cliquable avec `<Link>` vers le profil du user
- **`Products.js`** — récupère et affiche tous les produits triés par marque
- **`ProductCard.js`** — affiche image, marque, titre et description d'un produit
- **`ProfilUser.js`** — profil complet d'un user via `useParams()` + `useEffect()`

### Port serveur 8000

Le port a été changé de `3000` à `8000` pour éviter les conflits avec React qui utilise `3000` par défaut.

---

## Prochaines étapes

- Afficher `purchasedProducts` et `viewedProducts` dans la page `ProfilUser`
- Ajouter un bouton "Acheter" sur chaque `ProductCard` (appel PATCH `/purchase`)
- Authentification via JWT (sécuriser le `userId` dans les requêtes PATCH)
