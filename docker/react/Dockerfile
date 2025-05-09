# Use Node.js 18 Alpine as base image for smaller size  
FROM node:18-alpine  

# Set working directory  
WORKDIR /app  

# Copy package files first for better layer caching  
COPY ./frontend/tam_website/package*.json ./  

# Install dependencies and add node_modules/.bin to PATH
RUN npm install && \
    npm install -g vite && \
    export PATH=$PATH:/app/node_modules/.bin

# Copy application code  
COPY ./frontend/tam_website .  

# Expose Vite development server port  
EXPOSE 5173  

# Start Vite development server with host flag
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]