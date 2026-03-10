# CRM Autumn

Projet scolaire â€” CRM lÃ©ger orientÃ© historique client, construit sur la stack **MERN** (MongoDB, Express, React, Node.js).

> Permet de gÃ©rer des clients, un catalogue produits, et d'enregistrer des sessions d'achat, de consultation et de remboursement par client.

---

## FonctionnalitÃ©s

- Consulter la liste complÃ¨te des clients (triÃ©e par nom, recherche dynamique)
- AccÃ©der au profil dÃ©taillÃ© d'un client (photo, infos personnelles, sessions d'achat / vue / remboursement)
- Naviguer dans un catalogue de produits (mode, chaussures, accessoires)
- Ajouter ou supprimer une session d'achat, de vue ou de remboursement sur le profil d'un client

Les donnÃ©es clients proviennent de l'API publique **randomuser.me** (208 utilisateurs fictifs).  
Les produits sont des donnÃ©es personnalisÃ©es stockÃ©es en JSON et importÃ©es via un script de seed.

---

## Stack technique

| CÃ´tÃ©                      | Technologie              | Version            |
| ------------------------- | ------------------------ | ------------------ |
| Runtime                   | Node.js                  | LTS                |
| Serveur HTTP              | Express                  | 5.x                |
| ODM                       | Mongoose                 | 9.x                |
| Base de donnÃ©es           | MongoDB Community Server | local (port 27017) |
| Frontend                  | React                    | 19.x               |
| Routing client            | React Router DOM         | 7.x                |
| RequÃªtes HTTP client      | Axios                    | 1.x                |
| Hot reload serveur        | Nodemon                  | 3.x                |
| Variables d'environnement | dotenv                   | 17.x               |
| Politique CORS            | cors                     | 2.x                |

---

## Structure du projet

```
CRM-Autumn/
â”œâ”€â”€ server/                          # Backend Express
â”‚   â”œâ”€â”€ server.js                    # Point d'entrÃ©e â€” Express, CORS, routes, MongoDB
â”‚   â”œâ”€â”€ seed.js                      # Import des produits JSON â†’ MongoDB (upsert)
â”‚   â”œâ”€â”€ .env                         # Variables d'environnement (non versionnÃ©)
â”‚   â”œâ”€â”€ package.json
â”‚   â”œâ”€â”€ controller/
â”‚   â”‚   â”œâ”€â”€ users.controller.js      # Handlers HTTP users (GET / PATCH / DELETE)
â”‚   â”‚   â””â”€â”€ products.controller.js   # Handlers HTTP produits (GET)
â”‚   â”œâ”€â”€ router/
â”‚   â”‚   â”œâ”€â”€ users.route.js           # Routes /api/users
â”‚   â”‚   â””â”€â”€ products.route.js        # Routes /api/product
â”‚   â”œâ”€â”€ service/
â”‚   â”‚   â”œâ”€â”€ users.service.js         # RequÃªtes Mongoose users
â”‚   â”‚   â””â”€â”€ products.service.js      # RequÃªtes Mongoose produits
â”‚   â”œâ”€â”€ model/
â”‚   â”‚   â”œâ”€â”€ schema.users.js          # SchÃ©ma Mongoose User (format randomuser.me)
â”‚   â”‚   â””â”€â”€ schema.products.js       # SchÃ©ma Mongoose Product
â”‚   â”œâ”€â”€ jsonFile/
â”‚   â”‚   â”œâ”€â”€ products.json            # Catalogue produits (source seed)
â”‚   â”‚   â””â”€â”€ users.json               # Utilisateurs fictifs (randomuser.me)
â”‚   â””â”€â”€ utils/
â”‚       â””â”€â”€ mongod.js
â”‚
â””â”€â”€ client/                          # Frontend React (Create React App)
    â”œâ”€â”€ package.json
    â””â”€â”€ src/
        â”œâ”€â”€ App.js                   # BrowserRouter + Routes
        â”œâ”€â”€ index.js
        â”œâ”€â”€ components/
        â”‚   â”œâ”€â”€ Navigation.js        # Barre de navigation (NavLink)
        â”‚   â”œâ”€â”€ Users.js             # Liste des users + recherche dynamique
        â”‚   â”œâ”€â”€ UsersCard.js         # Carte cliquable d'un user
        â”‚   â”œâ”€â”€ Products.js          # Liste des produits
        â”‚   â”œâ”€â”€ ProductCard.js       # Carte d'un produit
        â”‚   â””â”€â”€ ProfilUser.js        # Profil complet d'un user + gestion des sessions
        â”œâ”€â”€ pages/
        â”‚   â”œâ”€â”€ Home.js              # Page d'accueil
        â”‚   â”œâ”€â”€ Profil.js            # Page liste des users
        â”‚   â””â”€â”€ Book.js              # Page catalogue produits
        â””â”€â”€ style/
            â”œâ”€â”€ _settings.scss
            â”œâ”€â”€ index.scss
            â”œâ”€â”€ components/
            â”‚   â”œâ”€â”€ _navigation.scss
            â”‚   â”œâ”€â”€ _profilUser.scss
            â”‚   â”œâ”€â”€ _users.scss
            â”‚   â””â”€â”€ _products.scss
            â””â”€â”€ pages/
                â”œâ”€â”€ _home.scss
                â””â”€â”€ _profil.scss
```

---

## Installation et lancement

### PrÃ©requis

| Outil                    | RÃ´le                            |
| ------------------------ | ------------------------------- |
| Node.js LTS              | Runtime JavaScript + npm        |
| MongoDB Community Server | Base de donnÃ©es locale          |
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

CrÃ©er le fichier `.env` Ã  la racine du dossier `server/` :

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/crm
```

Importer les produits en base (Ã  faire une fois, ou pour rÃ©initialiser) :

```bash
node seed.js
```

Lancer le serveur :

```bash
npm run dev    # dÃ©veloppement â€” rechargement automatique (nodemon)
npm start      # production â€” lancement simple (node)
```

> Le serveur Ã©coute sur `http://localhost:8000`

### 3. Frontend

```bash
cd client
npm install
npm start
```

> L'application React est accessible sur `http://localhost:3000`

### 4. DÃ©marrer MongoDB (Windows)

```bash
net start MongoDB
```

> Si MongoDB n'est pas dÃ©marrÃ©, la connexion Ã©choue avec `ECONNREFUSED 127.0.0.1:27017`.

### Ordre de lancement Ã  chaque session

```
1. net start MongoDB        â† dÃ©marrer la base de donnÃ©es
2. cd server && npm run dev â† dÃ©marrer le serveur Express  â†’ http://localhost:8000
3. cd client && npm start   â† dÃ©marrer React               â†’ http://localhost:3000
```

---

## API â€” Endpoints

### Users â€” `/api/users`

| MÃ©thode  | Route                            | Body JSON    | Description                               |
| -------- | -------------------------------- | ------------ | ----------------------------------------- |
| `GET`    | `/api/users`                     | â€”            | Liste tous les utilisateurs               |
| `GET`    | `/api/users/search/:lastname`    | â€”            | Recherche par nom de famille (regex)      |
| `GET`    | `/api/users/:id`                 | â€”            | Utilisateur par `_id` + sessions peuplÃ©es |
| `PATCH`  | `/api/users/:productId/purchase` | `{ userId }` | Ajoute une session d'achat                |
| `PATCH`  | `/api/users/:productId/viewed`   | `{ userId }` | Ajoute une session de vue                 |
| `PATCH`  | `/api/users/:productId/refund`   | `{ userId }` | Ajoute une session de remboursement       |
| `DELETE` | `/api/users/:productId/purchase` | `{ userId }` | Supprime une session d'achat              |
| `DELETE` | `/api/users/:productId/viewed`   | `{ userId }` | Supprime une session de vue               |
| `DELETE` | `/api/users/:productId/refund`   | `{ userId }` | Supprime une session de remboursement     |

> Les routes GET `/:id` et `/search/:lastname` retournent les sessions avec les documents `Product` peuplÃ©s via `.populate()`.

> Pour les requÃªtes `DELETE` avec Axios, le body doit Ãªtre passÃ© dans `{ data: { userId } }`.

### Products â€” `/api/product`

| MÃ©thode | Route                             | Description                                |
| ------- | --------------------------------- | ------------------------------------------ |
| `GET`   | `/api/product`                    | Liste tous les produits                    |
| `GET`   | `/api/product/search?brand=Gucci` | Produits filtrÃ©s par marque (query string) |

---

## ModÃ¨les de donnÃ©es

### Product

| Champ         | Type       | Requis | Description                      |
| ------------- | ---------- | ------ | -------------------------------- |
| `title`       | String     | Oui    | Nom du produit                   |
| `brand`       | String     | Oui    | Marque                           |
| `category`    | String     | Oui    | CatÃ©gorie                        |
| `price`       | Number     | Oui    | Prix                             |
| `currency`    | String     | Non    | Devise (dÃ©faut : `"EUR"`)        |
| `stock`       | Number     | Non    | QuantitÃ© en stock (dÃ©faut : `0`) |
| `description` | String     | Non    | Description courte               |
| `image`       | String     | Non    | URL de l'image                   |
| `tags`        | `[String]` | Non    | Tags associÃ©s                    |
| `ref`         | String     | Non    | RÃ©fÃ©rence unique                 |
| `sizes`       | `[String]` | Non    | Tailles disponibles              |
| `colors`      | `[Object]` | Non    | Couleurs `{ name, hex }`         |

### User

| Champ              | Type                           | Description                                         |
| ------------------ | ------------------------------ | --------------------------------------------------- |
| `gender`           | String (enum)                  | `"male"` / `"female"` / `"other"`                   |
| `name`             | `{ title, first, last }`       | Nom complet                                         |
| `location`         | sous-document                  | Adresse (ville, pays, coordonnÃ©es GPSâ€¦)             |
| `email`            | String unique                  | Email normalisÃ© en lowercase                        |
| `login`            | `{ uuid, username, passwordâ€¦}` | Identifiants (donnÃ©es fictives)                     |
| `dob`              | `{ date, age }`                | Date et Ã¢ge de naissance                            |
| `registered`       | `{ date, age }`                | Date et anciennetÃ© d'inscription                    |
| `phone` / `cell`   | String                         | NumÃ©ros de tÃ©lÃ©phone                                |
| `picture`          | `{ large, medium, thumbnail }` | URLs des photos                                     |
| `nat`              | String                         | NationalitÃ© (ex : `"FR"`)                           |
| `purchaseSessions` | `[{ date, products[] }]`       | Sessions d'achat (chaque session = date + produits) |
| `viewSessions`     | `[{ date, products[] }]`       | Sessions de vue                                     |
| `refundSessions`   | `[{ date, products[] }]`       | Sessions de remboursement                           |

> Chaque session contient une `date` et un tableau `products` avec des `ObjectId` rÃ©fÃ©renÃ§ant la collection `Product`.

---

## Scripts disponibles

### Serveur (`server/`)

| Commande       | Description                                          |
| -------------- | ---------------------------------------------------- |
| `npm run dev`  | DÃ©marre le serveur avec nodemon (rechargement auto)  |
| `npm start`    | DÃ©marre le serveur sans nodemon                      |
| `node seed.js` | Importe les produits depuis `jsonFile/products.json` |

### Client (`client/`)

| Commande        | Description                                   |
| --------------- | --------------------------------------------- |
| `npm start`     | Lance React en mode dÃ©veloppement (port 3000) |
| `npm run build` | Compile l'application pour la production      |

