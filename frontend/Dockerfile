# ✅ Version optimisée pour Railway
FROM node:20-alpine

WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer toutes les dépendances (dev + prod pour le build)
RUN npm ci

# Copier tout le code source
COPY . .

# Variables d'environnement pour optimiser le build
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV GENERATE_SOURCEMAP=false

# Build de production (plus léger)
RUN npm run build

# Installer serve pour servir les fichiers statiques
RUN npm install -g serve

# Railway utilise la variable PORT automatiquement
EXPOSE $PORT

# ✅ Servir les fichiers buildés (pas le dev server)
CMD ["sh", "-c", "serve -s build -p $PORT"]