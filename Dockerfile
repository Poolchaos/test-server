# Use node:18.14.0-alpine as a base image
FROM node:18.14.0-alpine

# Environmental variables
ENV USER=root HOME=/tmp

# Update the package list and install necessary packages
RUN apk --no-cache update
RUN apk --no-cache upgrade
RUN apk --no-cache add udev
RUN apk --no-cache add ttf-freefont
RUN apk --no-cache add curl
RUN apk --no-cache add unzip
RUN apk --no-cache add xvfb
RUN apk --no-cache add libxi
RUN apk --no-cache add chromium
RUN apk --no-cache add chromium-chromedriver

# Set environment variables for Chromium
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/lib/chromium/

ADD ./dist /
ADD ./package.json /package.json

RUN npm install

# Expose the port your application will run on
EXPOSE 9000

# Define the command to start your Node.js application
ENTRYPOINT ["node", "--inspect=0.0.0.0:9229", "./index.js"]
