# The client reads the API addresses while it is built (next.config.js), so they are build arguments.
FROM node:24-slim AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
ARG REACT_APP_API_URL
ARG REACT_APP_API_GRAPHQL_URL
ARG REACT_APP_API_WS
ENV REACT_APP_API_URL=$REACT_APP_API_URL \
    REACT_APP_API_GRAPHQL_URL=$REACT_APP_API_GRAPHQL_URL \
    REACT_APP_API_WS=$REACT_APP_API_WS
RUN yarn build

FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
CMD ["yarn", "start", "-p", "3000"]
