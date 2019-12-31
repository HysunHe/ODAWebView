#!/usr/bin/env bash

# Building the UI part
cd ../webviewApp

npm run build

cd -

TAG=`date '+%Y-%m-%d-%H-%M-%S'`

docker build . -t hysunhe/odaqr:${TAG}
docker tag hysunhe/odaqr:${TAG}   hysunhe/odaqr:latest
