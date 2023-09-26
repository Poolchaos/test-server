FROM node:14

# Environmental variables
ENV     USER=root HOME=/tmp

COPY    ./nginx.conf /etc/nginx/conf.d/default.conf
ADD     . .

# Install Node.js and npm
RUN apk update && apk upgrade && apk add nodejs npm

# Expose the port your application will run on
EXPOSE 3000

# Define the command to start your Node.js application
CMD ["npm", "start"]