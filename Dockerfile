FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY app ./app
COPY components ./components
COPY lib ./lib
COPY next.config.ts tsconfig.json next-env.d.ts postcss.config.js tailwind.config.ts ./
ARG NEXT_PUBLIC_AUTH_API_BASE_URL
ARG NEXT_PUBLIC_DATA_SERVER
ARG NEXT_PUBLIC_RAG_API
ARG NEXT_PUBLIC_DAG_API
ARG NEXT_PUBLIC_TAG_API
ENV NEXT_PUBLIC_AUTH_API_BASE_URL=$NEXT_PUBLIC_AUTH_API_BASE_URL \
    NEXT_PUBLIC_DATA_SERVER=$NEXT_PUBLIC_DATA_SERVER \
    NEXT_PUBLIC_RAG_API=$NEXT_PUBLIC_RAG_API \
    NEXT_PUBLIC_DAG_API=$NEXT_PUBLIC_DAG_API \
    NEXT_PUBLIC_TAG_API=$NEXT_PUBLIC_TAG_API
RUN npm run build

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
