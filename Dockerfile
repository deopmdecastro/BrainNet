FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY . .
RUN npm run build:workflows
CMD ["npm", "test"]
