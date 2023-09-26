FROM    nginx:1.13.8-alpine

# Environmental variables
ENV     USER=root HOME=/tmp

COPY    ./nginx.conf /etc/nginx/conf.d/default.conf
ADD     . .

FROM node:18.14.0

EXPOSE  3000

CMD ["npm", "start"]