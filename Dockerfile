# See https://docs.docker.com/build/ci/github-actions/ for best practices

# Base image for both stages
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# --- Development image ---
FROM base AS dev
ENV NODE_ENV=development
# Install all deps (dev included)
COPY package*.json ./
RUN npm install
# App source
COPY . .
# Ensure logs directory exists for Winston file transports
RUN mkdir -p logs
EXPOSE 3000
CMD ["npm","run","dev"]

# --- Production image ---
FROM base AS prod
ENV NODE_ENV=production
# Only install production deps
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force
# App source
COPY . .
# Ensure logs directory exists for Winston file transports
RUN mkdir -p logs
EXPOSE 3000
CMD ["node","src/index.js"]
