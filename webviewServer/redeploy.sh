# Build and remote deployment.

# Building the UI part
cd ../webviewApp

npm run build

cd -

# Building the proxy part
./build-image.sh

docker push hysunhe/odaqr:latest

# Remote deployment
ssh -i /home/hysun/projects/BetterBot/credentials/sehub/id_rsa opc@o100.odainfra.com -t "sudo su - oracle -c ./upgrade-odaqr2.sh"
