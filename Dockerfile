FROM node:20.19.4

WORKDIR /app

COPY package*.json ./
RUN npm install


COPY . .

RUN npx expo export --platform web