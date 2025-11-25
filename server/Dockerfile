FROM node:18
WORKDIR /server
COPY src/ /server/src
COPY prisma/ /server/prisma
COPY package.json package-lock.json /server/
RUN npm ci
RUN npx prisma generate