FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm install instead of npm ci)
RUN npm install

# Copy application files
COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
