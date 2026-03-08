## Plan: Bootstrap CRM Shopper Node + MongoDB

Mettre en place un socle MERN leger (Node.js/Express + MongoDB/Mongoose + front React) oriente CRM pour consultation rapide de l'historique client, puis alimenter la base via des APIs publiques (users + catalogue textile/chaussant/accessoires). L'objectif est un MVP propre, testable et extensible pour un projet scolaire.

**Installations (ordre chronologique)**

1. Phase 0 - Base de travail (a faire avant tout code)

- Telecharger `VS Code` (editeur principal).
- Telecharger `Git` (versionning et sauvegarde du projet).
- Telecharger `Node.js LTS` (inclut `npm`).
- Commentaire timing: fais cette phase en premier, avant de creer les dossiers `backend` et `frontend`.

2. Phase 1 - Base de donnees (juste apres Node.js)

- Option A (simple en local): telecharger `MongoDB Community Server`.
- Option B (si tu preferes conteneur): telecharger `Docker Desktop` puis image `mongo`.
- Optionnel mais recommande: telecharger `MongoDB Compass` pour visualiser les collections.
- Commentaire timing: installe ca avant d'ecrire les modeles Mongoose (etape 4).

3. Phase 2 - Outils de test API (avant integration front)

- Telecharger `Postman` ou `Insomnia` pour tester les endpoints REST.
- Commentaire timing: installe-le avant de brancher le front pour verifier que le backend repond bien.

4. Phase 3 - Packages backend (a faire dans `backend/` a l'etape 3)

- Installer dependances runtime: `express`, `mongoose`, `dotenv`, `cors`, `helmet`, `morgan`, `zod`.
- Installer dependances dev: `nodemon`.
- Commentaire timing: installe ces packages juste apres `npm init -y` dans `backend`.

5. Phase 4 - Packages ingestion data (a faire pendant l'etape 6)

- Installer `axios` (ou `node-fetch`) pour appeler les APIs externes.
- Optionnel: installer `pino` ou `winston` pour logs d'import plus clairs.
- Commentaire timing: fais-le quand tu commences les scripts `seed`/ETL, pas avant.

6. Phase 5 - Packages frontend (a faire dans `frontend/` a l'etape 9)

- Initialiser avec `Vite` + `React`.
- Installer `react-router-dom`, `axios`, `@tanstack/react-query`.
- Commentaire timing: commence cette phase quand les routes backend principales sont deja stables.

7. Phase 6 - Packages qualite/tests (a l'etape 11)

- Backend tests: `vitest` (ou `jest`) + `supertest`.
- Optionnel docs API: `swagger-ui-express` + `swagger-jsdoc`.
- Commentaire timing: ajoute ces outils une fois les endpoints critiques termines (`/clients/:id/history`).

8. Phase 7 - Option de deploiement/demo distante (en fin de projet)

- Creer un compte `MongoDB Atlas` (si tu dois montrer une demo hors de ton PC).
- Optionnel: `Render`/`Railway`/`Vercel` pour heberger backend/frontend.
- Commentaire timing: fais cette phase a la toute fin, une fois le MVP valide en local.

**Steps**

1. Cadrer le MVP fonctionnel CRM: definir les ecrans et endpoints indispensables pour repondre a la problematique (fiche client, timeline interactions, recherche client, detail produit). Fixer le perimetre inclus/exclu pour eviter le hors-sujet. Fichier propose: `mvp-scope.md`

2. Phase 1 - Initialisation projet (fondation): creer la structure backend/frontend, initialiser Node.js et scripts de demarrage, definir conventions de nommage, gestion des environnements (`dev`, `test`, `prod`). Fichier propose: `package.json`

3. Installer le socle backend: `express`, `mongoose`, `dotenv`, `cors`, `helmet`, `morgan`, `zod` (ou `joi`) pour validation, et `nodemon` en dev. Configurer une API REST versionnee (`/api/v1`) avec gestion d'erreurs centralisee. Fichier propose: `app.js` _depend de 2_

4. Concevoir le modele MongoDB (Mongoose): collections `users`, `products`, `interactions` avec index adaptes (email, telephone, `userId + date`, categorie produit). Prevoir references entre documents pour reconstruire rapidement l'historique complet d'un client. Fichier propose: `interaction.model.js` _depend de 3_

5. Mettre en place la strategie MongoDB: demarrage local via MongoDB Community ou Docker, puis option Atlas pour demonstration distante. Ajouter variables `.env` (`MONGODB_URI`, `PORT`) et politique de secrets. Fichier propose: `.env` _depend de 3_

6. Creer le pipeline d'ingestion de donnees (ETL leger): scripts backend qui recuperent les APIs externes, normalisent les schemas, dedoublonnent, puis injectent dans MongoDB. Prevoir logs d'import et relance idempotente. Fichier propose: `seed-products.js` _depend de 4 et 5_

7. APIs gratuites recommandees - Users (3): Fichier propose: `users.sources.json`

- `Random User API` (`https://randomuser.me/api/`) pour profils realistes.
- `DummyJSON Users` (`https://dummyjson.com/users`) pour dataset structure et pagination.
- `JSONPlaceholder Users` (`https://jsonplaceholder.typicode.com/users`) pour base simple et stable.

8. APIs gratuites recommandees - Articles textile/chaussant/accessoires (3): Fichier propose: `products.sources.json`

- `DummyJSON Products` (`https://dummyjson.com/products`) avec categories mode incluant vetements/chaussures/accessoires selon datasets.
- `Fake Store API` (`https://fakestoreapi.com/products`) utile pour vetements/accessoires (jewelry) et demonstration e-commerce.
- `EscuelaJS Fake Store API` (`https://api.escuelajs.co/api/v1/products`) avec categories distinctes (`clothes`, `shoes`, etc.).

9. Construire le front MVP: React + Vite, `react-router-dom`, `axios`, `tanstack-query` (ou `swr`) pour recuperation/cache API interne. Ecrans: liste clients, fiche client, timeline interactions, catalogue produits filtrable. Fichier propose: `ClientHistoryPage.jsx` _parallel avec 6 une fois contrat API defini_

10. Optimiser l'acces rapide a l'historique: endpoint backend dedie (`/clients/:id/history`) qui agrege interactions + achats + vues produits triees par date, pagination chronologique, et recherche texte. Fichier propose: `client.routes.js` _depend de 4 et 9_

11. Renforcer qualite et robustesse: tests API (`vitest`/`jest` + `supertest`), validation des payloads, gestion erreurs HTTP standard, et documentation OpenAPI/Swagger minimale. Fichier propose: `client.routes.test.js` _depend de 10_

12. Preparer la demonstration scolaire: seed command (`npm run seed`), reset DB (`npm run db:reset`), jeu de donnees coherent, scenario de demo oriente problematique "acces rapide historique client". Fichier propose: `demo-scenario.md` _depend de 6, 9, 10_

**Relevant files**

- `c:\Users\jorda\OneDrive\Bureau\CRM-atutomne\CRM.md` - document principal de cadrage et feuille de route projet.
- `c:\Users\jorda\OneDrive\Bureau\CRM-atutomne\backend\package.json` - scripts `dev`, `start`, `seed`, `test`.
- `c:\Users\jorda\OneDrive\Bureau\CRM-atutomne\backend\src\app.js` - configuration Express, middlewares, routing v1.
- `c:\Users\jorda\OneDrive\Bureau\CRM-atutomne\backend\src\config\db.js` - connexion MongoDB/Mongoose.
- `c:\Users\jorda\OneDrive\Bureau\CRM-atutomne\backend\src\models\User.js` - schema utilisateur CRM.
- `c:\Users\jorda\OneDrive\Bureau\CRM-atutomne\backend\src\models\Product.js` - schema catalogue produit.
- `c:\Users\jorda\OneDrive\Bureau\CRM-atutomne\backend\src\models\Interaction.js` - schema historique interactions.
- `c:\Users\jorda\OneDrive\Bureau\CRM-atutomne\backend\src\routes\client.routes.js` - endpoints clients et historique.
- `c:\Users\jorda\OneDrive\Bureau\CRM-atutomne\backend\src\services\ingest\usersIngest.service.js` - ingestion utilisateurs depuis APIs externes.
- `c:\Users\jorda\OneDrive\Bureau\CRM-atutomne\backend\src\services\ingest\productsIngest.service.js` - ingestion catalogue produits externes.
- `c:\Users\jorda\OneDrive\Bureau\CRM-atutomne\frontend\package.json` - scripts front et dependances.
- `c:\Users\jorda\OneDrive\Bureau\CRM-atutomne\frontend\src\pages\ClientHistoryPage.jsx` - vue historique client optimisee.

**Verification**

1. Verifier la connexion MongoDB en local/Atlas et la creation automatique des collections au lancement.
2. Executer l'ingestion users + produits et controler le volume importe, les doublons et les categories attendues.
3. Tester les endpoints cles avec Postman/Insomnia: recherche client, detail client, historique agrege.
4. Verifier cote front: chargement rapide de la timeline client, filtres produits, navigation sans erreur.
5. Executer les tests backend (`npm test`) et valider les cas d'erreur (payload invalide, client introuvable, DB indisponible).
6. Faire une repetition de demo: partir d'un client donne et prouver l'acces rapide a son historique complet en moins de quelques clics.

**Decisions**

- Approche recommandee: REST API + MongoDB document store, suffisante pour MVP CRM scolaire sans complexite microservices.
- Front recommande: React + Vite pour productivite et integration simple avec backend Node.
- Scope inclus: bootstrap technique, ingestion data, historique client, interface MVP.
- Scope exclu: authentification avancee, roles complexes, deploiement cloud complet CI/CD.

**Further Considerations**

1. Choix MongoDB local vs Atlas des le depart: recommande local pour dev rapide puis Atlas pour demo.
2. Preferer `tanstack-query` plutot que appels Axios bruts pour cache, retry et UX fluide sur l'historique.
3. Si une API produit manque de categories mode selon periode, conserver l'ETL multi-source pour completer les trous de donnees.
