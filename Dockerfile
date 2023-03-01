FROM node:18-alpine

ENV PORT=3000
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .
RUN yarn build

EXPOSE 3000

ENTRYPOINT ["sh", "-c", "yarn start"]
