FROM ubuntu:latest
LABEL authors="ja810"

ENTRYPOINT ["top", "-b"]
# Use a Node.js image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the backend source code
COPY . .

# Expose the backend's port (e.g., 3000)
EXPOSE 3000

# Start the backend application
CMD ["npm", "start"]
