#!/usr/bin/env bash

echo "Deleting old code..."
rm -rf /home/oracle/hysun-workspace/ODAWebView

sleep 1

echo "pull latest code"
cd /home/oracle/hysun-workspace
git clone https://github.com/HysunHe/ODAWebView.git

sleep 1

echo "npm install webviewApp"
cd /home/oracle/hysun-workspace/ODAWebView/webviewApp
chmod +x *.sh
npm install

sleep 1

echo "Producing new image..."
cd /home/oracle/hysun-workspace/ODAWebView/webviewServer
chmod +x *.sh
npm install
./build-image.sh

sleep 1

echo "Starting odaqr..."

./start.sh

sleep 1

echo "Done!"

cd