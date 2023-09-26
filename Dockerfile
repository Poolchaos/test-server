# Use nginx:1.13.8-alpine as a base image
FROM nginx:1.13.8-alpine

# Environmental variables
ENV USER=root HOME=/tmp

ADD . .

# Install Node.js and npm together
RUN apk add --no-cache nodejs

# Expose the port your application will run on
EXPOSE 8000

# Define the command to start your Node.js application
CMD ["node", "./bin/www"]
