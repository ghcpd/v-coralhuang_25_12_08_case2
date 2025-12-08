FROM node:20-alpine
WORKDIR /usr/src/app

# Install deps
COPY package.json package-lock.json* ./
RUN npm install --production --no-audit --no-fund

# Copy app
COPY . .

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node","server.js"]
