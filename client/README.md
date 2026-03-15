# CRM Autumn — Client React

Frontend du projet CRM-Autumn, développé avec **Create React App**.

---

## Fonctionnalités principales

- Navigation SPA (React Router)
- Recherche dynamique des utilisateurs
- Affichage du profil détaillé d'un utilisateur (sessions d'achat, vue, remboursement)
- Catalogue produits
- Ajout / suppression de sessions via boutons (intégration API Express)

---

## Structure du dossier `src/`

```
src/
├── App.js           # Routing principal (BrowserRouter + Routes)
├── index.js         # Point d'entrée React
├── components/
│   ├── Navigation.js    # Barre de navigation
│   ├── Users.js         # Liste des utilisateurs + recherche
│   ├── UsersCard.js     # Carte cliquable d'un utilisateur
│   ├── Products.js      # Liste des produits
│   ├── ProductCard.js   # Carte d'un produit
│   ├── settingsBtn.js   # Fonctions API PATCH/DELETE centralisées
│   └── ProfilUser.js    # Profil complet d'un utilisateur + gestion des sessions
├── pages/
│   ├── Home.js      # Page d'accueil
│   ├── Profil.js    # Page liste des utilisateurs
│   └── Book.js      # Page catalogue produits
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

## Démarrage

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Lancer le serveur React :
   ```bash
   npm start
   ```
   Accès sur [http://localhost:3000](http://localhost:3000)

---

## Points d'intégration backend

- Toutes les requêtes API sont faites sur `http://localhost:8000/api/...`
- Les endpoints sont détaillés dans le README du backend
- Les fonctions d'ajout/suppression de sessions sont centralisées dans `settingsBtn.js`

---

## Navigation

| Route        | Composant    | Description                           |
| ------------ | ------------ | ------------------------------------- |
| `/`          | `Home`       | Page d'accueil                        |
| `/Profil`    | `Profil`     | Liste des utilisateurs avec recherche |
| `/Book`      | `Book`       | Catalogue des produits                |
| `/users/:id` | `ProfilUser` | Profil détaillé d'un utilisateur      |
| `*`          | `Home`       | Fallback — toute URL inconnue         |
