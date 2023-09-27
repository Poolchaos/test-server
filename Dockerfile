# Use node:18.14.0-alpine as a base image
FROM node:18.14.0-alpine

# Environmental variables
ENV USER=root HOME=/tmp

# # Create a directory to store your application files
# WORKDIR /app

ADD     ./dist                  /
ADD     ./package.json          /package.json

RUN npm install

# Expose the port your application will run on
EXPOSE 9000

# Define the command to start your Node.js application
ENTRYPOINT ["node", "--inspect=0.0.0.0:9229", "./index.js"]
