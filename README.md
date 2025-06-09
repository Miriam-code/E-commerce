# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


# CI/CD Pipeline – GitHub Actions + Docker + Railway

Ce document décrit le pipeline CI/CD utilisé pour le projet **Watch**. Il s'appuie sur GitHub Actions pour automatiser lint, tests, build des images Docker, push vers GitHub Container Registry, et déploiement sur Railway.

---

##  Structure des workflows

| Fichier                             | Fonction                                                 |
|-------------------------------------|----------------------------------------------------------|
| `.github/workflows/backend.yml`     | Lint & tests pour les PR avec label `backend`            |
| `.github/workflows/frontend.yml`    | Lint pour les PR avec label `frontend`                   |
| `.github/workflows/auto-label.yml`  | Ajoute des labels (`frontend`, `backend`, etc.) auto     |
| `.github/workflows/integration-and-build.yml` | Tests d'intégration, build & push Docker images  |
| `.github/workflows/deploy.yml`      | Déploiement sur Railway avec les images Docker           |
| `.github/workflows/check-title.yml` | Vérifie le format des titres de PR vers `develop`        |

---

##  Étapes CI (intégration continue)

### 🔹 Pull Request ouverte

1. `auto-label.yml` applique les labels automatiquement (selon les chemins touchés).
2. `check-title.yml` valide le format du titre de la PR (`feat`, `fix`, etc.).
3. Si le label `backend` est présent :
   - `backend.yml` :
     - Lint du code avec `npm run lint`
     - Tests unitaires avec `npm test` (avec MySQL via Docker)
4. Si le label `frontend` est présent :
   - `frontend.yml` :
     - Lint du code avec `npm run lint`

---

##  Étapes CD (déploiement continu)

### 🔹 Push sur `main`

1. `integration-and-build.yml` :
   - Lancement d’un environnement Docker Compose (`mysql`, `backend`, etc.)
   - Tests d’intégration (ex. : `docker exec backend_dev npm test`)
   - Build des images Docker `backend` et `frontend`
   - Push des images sur GitHub Container Registry (`ghcr.io/...`), taggées :
     - `latest`
     - `${{ github.sha }}` (commit précis)

2. `deploy.yml` :
   - Se déclenche après le build
   - Utilise le CLI Railway pour déployer les images Docker
   - Déploiement des images :
     - `ghcr.io/.../watch-backend:${{ github.sha }}`
     - `ghcr.io/.../watch-frontend:${{ github.sha }}`

---

##  Docker – Organisation

- Un seul `docker-compose.yml` pour l’environnement de développement.
- Chaque service (`backend`, `frontend`) a son propre `Dockerfile`.
- La base MySQL est partagée entre les tests et le développement local.

---

##  Secrets requis

| Nom              | Utilisation                  |
|------------------|------------------------------|
| `GITHUB_TOKEN`   | Authentification pour `ghcr` |
| `RAILWAY_TOKEN`  | Déploiement via Railway CLI  |

---

##  Exemple de flux

```mermaid
graph TD
  PR[Pull Request ouverte] --> AutoLabel
  AutoLabel -->|Label backend| BackendLintTest
  AutoLabel -->|Label frontend| FrontendLint
  PR --> CheckTitle
  main[Push sur main] --> IntegrationBuild
  IntegrationBuild -->|Images Docker| DeployRailway




