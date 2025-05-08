#!/bin/bash
systemctl stop postgresql
systemctl stop redis
docker container prune
if [ "$(docker ps -aq -f name=backend)" ]; then
    docker rm -f backend
fi
if [ "$(docker ps -aq -f name=frontend)" ]; then
    docker rm -f backend
fi
if [ "$(docker ps -aq -f name=database)" ]; then
    docker rm -f database
fi
docker start database 
docker-compose up --build