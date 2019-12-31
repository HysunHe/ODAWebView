#!/usr/bin/env bash

docker run -d \
    --restart=always \
    --name=odaqr \
    -p 8890:3001 \
    hysunhe/odaqr:latest