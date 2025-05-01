#Use official Node.js image as a parent image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install prod dependencies
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]