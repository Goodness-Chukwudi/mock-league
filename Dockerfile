FROM node:20-alpine
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
COPY . ./
RUN npm install
RUN npm install pm2 -g
EXPOSE ${PORT}

CMD ["npm", "docker_start"]