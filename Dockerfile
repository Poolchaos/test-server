# Use nginx:1.13.8-alpine as a base image
FROM node:18.14.0-alpine
# FROM node:18.14.0

# Environmental variables
ENV USER=root HOME=/tmp

# WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy the rest of your project files
COPY . .

# Define the command to start your Node.js application
# CMD ["node", "."]
ENTRYPOINT ["node", "--inspect=0.0.0.0:9229", "."]

# Expose the port your application will run on
EXPOSE 8000

