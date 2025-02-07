# Use the official Node.js 18 image
FROM node:18

# Set the working directory inside the container
WORKDIR /NODEAPP

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"]
