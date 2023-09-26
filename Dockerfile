FROM    nginx:1.13.8-alpine

# Environmental variables
ENV     USER=root HOME=/tmp

COPY    ./nginx.conf /etc/nginx/conf.d/default.conf
ADD     . .

# Install Node.js and npm
RUN apk update && apk upgrade && apk add nodejs npm

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application source code to the container
COPY . .

# Expose the port your application will run on
EXPOSE 3000

# Define the command to start your Node.js application
CMD ["npm", "start"]