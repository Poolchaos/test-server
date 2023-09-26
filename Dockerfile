# Use nginx:1.13.8-alpine as a base image
FROM nginx:1.13.8-alpine

# Environmental variables
ENV USER=root HOME=/tmp

WORKDIR /test-server

ADD . .

# Install Node.js and npm together
RUN apk add --no-cache wget && \
    apk add --no-cache --virtual .build-deps curl && \
    wget -qO- https://nodejs.org/dist/v18.14.0/node-v18.14.0-linux-x64.tar.xz | tar -xJf - -C /usr/local --strip-components=1 && \
    apk del .build-deps

# Define the command to start your Node.js application
CMD ["node", "index.js"]

# Expose the port your application will run on
EXPOSE 8000

