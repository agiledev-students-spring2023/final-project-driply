# Use an official Node runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY front-end/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files to the working directory
COPY front-end/ .

# Set the environment variable
ENV PORT=3000

# Expose port 3000
EXPOSE 3000

# Run the start script
CMD ["npm", "start"]
