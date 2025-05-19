FROM node:22-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build
###

FROM node:22-alpine

WORKDIR /usr/src/app     

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=builder /usr/src/app/dist dist
COPY --from=builder /usr/src/app/typeorm typeorm
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/yarn.lock ./
COPY --from=builder /usr/src/app/tsconfig.json ./

RUN yarn install --production
RUN yarn add --dev tsconfig-paths

ENV NODE_OPTIONS=--max-old-space-size=1024

CMD pnpm migration:run && pnpm start:prod