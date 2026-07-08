FROM node:20-alpine

RUN addgroup -S app && adduser -S -G app app

WORKDIR /app

COPY --chown=app:app package*.json ./

RUN npm install

RUN chown -R app:app /app

COPY --chown=app:app . .

USER app

EXPOSE 5000

CMD ["npm", "run", "start:dev"]
