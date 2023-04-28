ARG NODE_IMAGE=node:16-alpine3.15
ARG FINAL_IMAGE=alpine:3.15

# APP
FROM ${NODE_IMAGE} as app-builder

WORKDIR /traceo

COPY ./public .
RUN yarn workspace @traceo/app install --frozen-lockfile

ENV REACT_APP_API_URL=host.docker.internal \
    REACT_APP_SOCKET_URL=host.docker.internal \
    NODE_ENV=production \
    NODE_OPTIONS=--max_old_space_size=8000

RUN yarn workspace @traceo/app build:prod

# BACKEND
FROM ${NODE_IMAGE} as backend-builder

WORKDIR /traceo

RUN apk add curl

ENV NODE_ENV=production \
    NODE_OPTIONS=--max_old_space_size=8000 \
    APP_ORIGIN=host.docker.internal

COPY /lib/package*.json ./
COPY /public/packages/shared/traceo-types /public/packages/shared/traceo-types

RUN yarn install --production=true && yarn global add typescript

COPY /lib .

RUN tsc -p tsconfig.build.json

# RELAY WORKER
FROM ${NODE_IMAGE} as worker-builder

WORKDIR /traceo

RUN apk add curl

COPY /relay-worker/package*.json ./
COPY /public/packages/shared/traceo-types /public/packages/shared/traceo-types

RUN yarn install --production=true && yarn global add typescript

COPY /relay-worker .
RUN tsc -p tsconfig.build.json

# FINAL
FROM ${FINAL_IMAGE}

WORKDIR /traceo

# RUN apk add --no-cache ca-certificates bash tzdata musl-utils
# RUN apk add --no-cache openssl ncurses-libs ncurses-terminfo-base --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main

# RUN apk --no-cache add nodejs --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community
RUN apk --no-cache add nodejs --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community
RUN apk --no-cache add npm
RUN npm install -g pm2
    
ENV NODE_OPTIONS=--max_old_space_size=8000
ENV NODE_ENV=production

COPY --from=app-builder /traceo/packages/app/build ./app

COPY --from=backend-builder /traceo/dist ./dist
COPY --from=backend-builder /traceo/node_modules ./node_modules
COPY --from=backend-builder /public/packages/shared/traceo-types ./node_modules/@traceo/types

COPY --from=worker-builder /traceo/dist ./worker/dist
COPY --from=worker-builder /traceo/node_modules ./worker/node_modules

COPY ./bin ./bin/

EXPOSE 3000

CMD ["sh", "./bin/docker"]
