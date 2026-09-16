# Node.js LTS lightweight image
FROM node:20-alpine

# Working directory
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Expose backend API port
EXPOSE 5000

# Start Express server
CMD ["npm", "start"]
