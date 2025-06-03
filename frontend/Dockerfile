# Étape 1: Build React avec mémoire allouée
FROM node:20-alpine AS builder

WORKDIR /app

# Install only needed files first (cache layer)
COPY package*.json ./

# Install all deps including dev (for build)
RUN npm ci

# Copy rest of app
COPY . .

# Augmenter la mémoire disponible pour Node.js pendant le build
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV GENERATE_SOURCEMAP=false

# Build production (React)
RUN npm run build

# Étape 2: Serveur ultra-léger avec serve
FROM node:20-alpine

WORKDIR /app

# Installer seulement serve
RUN npm install -g serve

# Copier uniquement le build
COPY --from=builder /app/build ./build

# Railway expose automatiquement la variable $PORT
EXPOSE 8080
ENV PORT 8080

# Commande de démarrage
CMD ["serve", "-s", "build", "-l", "8080"]
