FROM node:24-alpine

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY package*.json ./
RUN npm ci

COPY . .

RUN chown -R app:app /app

USER app

EXPOSE 5002

CMD ["node", "dist/index.js"]