# Zai Test Server

# Prerequisites
- Start Docker
- Should be on vpn to connect to dev mongo

## Build the container
$ `docker build -t zai-test-server:18.14.0 .`

## Start the container
$ `docker run -d -p 8000:8000 --name zailab zai-test-server:18.14.0`

### Use Host Network Mode (Linux only)
$ `--network host`

### Use the Host Machine's IP addess
$ `ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}'`

### Use Docker's Bridge Network (Windows)
$ `docker network create zai-test`

$ `docker run --network=zai-test zai-test-server:18.14.0`

## Restart the container
$ `docker restart zai-test-server:18.14.0`

## Purge the container

$ `docker stop zailab`

$ `docker rm zailab`

## Check config
$ `docker inspect zailab`

## Check errors
$ `docker exec -it zai-test-server:18.14.0 /bin/sh`




Check container contents:
- docker exec -it <container-id> /bin/sh

- which google-chrome
- which chromium
- find / -type f -name 'chromium*' 2>/dev/null

View file content
- cat <filename>

To exit container:
- exit