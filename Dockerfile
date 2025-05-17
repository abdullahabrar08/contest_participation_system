# Development Dockerfile (Dockerfile.dev)
FROM node:18.13.0-slim

# Set working directory
WORKDIR /app

# Install dependencies (including dev dependencies)
COPY package*.json  ./
# RUN npm ci
RUN npm install

# Copy the rest of the code
COPY . .

# Set permissions for the node user and switch to it
RUN chown -R node:node /app
USER node

# Expose necessary ports
EXPOSE 4019

# Set environment variable
ENV NODE_ENV=development

# Start the application
CMD ["npm", "run", "start:dev"]
