#!/usr/bin/env bash

TAG=`date '+%Y-%m-%d-%H-%M-%S'`

docker build . -t hysunhe/odaqr:${TAG}
docker tag hysunhe/odaqr:${TAG}   hysunhe/odaqr:latest
