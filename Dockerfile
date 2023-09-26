FROM    nginx:1.13.8-alpine

# Environmental variables
ENV     USER=root HOME=/tmp

COPY    ./nginx.conf /etc/nginx/conf.d/default.conf
ADD     . .

ENTRYPOINT npm start

EXPOSE  8000
