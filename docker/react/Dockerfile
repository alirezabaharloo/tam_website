# Use Node.js 18 Alpine as base image for smaller size  
FROM node:18-alpine  

# Set working directory  
WORKDIR /app  

# Copy package files first for better layer caching  
COPY ./frontend/tam_website/package*.json ./  

# Install dependencies, including Vite if it's in package.json  
RUN npm install
RUN npm install framer-motion
RUN npm install react-icons 
RUN npm install vite --save-dev  

# Copy application code  
COPY ./frontend/tam_website .  

# Expose Vite development server port  
EXPOSE 5173  

# Start Vite development server  
CMD ["npm", "run", "dev", "--", "--host"] 