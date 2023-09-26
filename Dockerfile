FROM    nginx:1.13.8-alpine

# Environmental variables
ENV     USER=root HOME=/tmp

COPY    ./nginx.conf /etc/nginx/conf.d/default.conf
ADD     . .

RUN apt-get update && apt-get install -y curl

# Install Node.js and npm using NodeSource repository
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

# Verify the installed Node.js and npm versions
RUN node -v
RUN npm -v

ENTRYPOINT npm start

EXPOSE  8000
