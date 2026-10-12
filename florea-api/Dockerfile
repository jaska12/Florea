# One image for both backend apps: florea-api and florea-batch. The compose file picks which one runs.
FROM node:24-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
# the compiled apps load their packages from node_modules at run time
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
# uploaded photos; the compose file keeps this folder in a volume
RUN mkdir -p uploads/member uploads/product uploads/article
EXPOSE 3007 3008
CMD ["node", "dist/apps/florea-api/main"]
