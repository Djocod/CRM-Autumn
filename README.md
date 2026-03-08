# CRM Autumn

Projet scolaire — CRM léger orienté historique client, construit sur la stack **MERN** (MongoDB, Express, React, Node.js).

## Présentation

Application permettant de consulter rapidement les fiches clients, leurs produits achetés et visualisés, ainsi qu'un catalogue de produits mode/chaussant/accessoires.

## Stack technique

| Côté | Technologie |
|------|-------------|
| Backend | Node.js, Express 5, Mongoose |
| Base de données | MongoDB |
| Frontend | React 19, React Router DOM, Axios |
| Outils | Nodemon, dotenv, CORS |

## Structure du projet

```
CRM-Autumn/
├── server.js               # Point d'entrée du serveur Express
├── seed.js                 # Script d'import des données en base
├── router/                 # Définition des routes
├── controller/             # Logique des requêtes HTTP
├── service/                # Logique métier / accès base de données
├── model/                  # Schémas Mongoose
├── jsonFile/               # Données JSON (users, products)
├── utils/                  # Connexion MongoDB
└── client/                 # Application React
    └── src/
        ├── components/     # ProductCard, UsersCard, ProfilUser...
        └── pages/          # Home
```

## Installation

### Prérequis

- Node.js LTS
- MongoDB Community Server (local) ou MongoDB Atlas
- Postman / Insomnia (optionnel, pour tester les routes)

### Backend

```bash
# Installer les dépendances
npm install

# Créer le fichier .env
MONGO_URI=mongodb://localhost:27017/crm-autumn
PORT=8000

# Importer les données
node seed.js

# Lancer le serveur
npm run dev
```

### Frontend

```bash
cd client
npm install
npm start
```

## API Endpoints

### Users

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/users` | Récupérer tous les users |
| GET | `/api/users/search/:lastname` | Rechercher un user par nom |
| GET | `/api/users/:id` | Récupérer un user par son ID |

### Products

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/product` | Récupérer tous les produits |
| GET | `/api/product/search?brand=Gucci` | Rechercher par marque |
| PATCH | `/api/product/:productId/purchase` | Enregistrer un achat |
| PATCH | `/api/product/:productId/viewed` | Enregistrer une vue produit |

## Scripts disponibles

```bash
npm run dev      # Lancer le serveur en mode développement (nodemon)
npm start        # Lancer le serveur en production
node seed.js     # Réinitialiser et importer les données produits
```
