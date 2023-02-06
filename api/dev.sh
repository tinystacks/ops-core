version=$(cat ./package.json | jq -r .version);
appName=$(cat ./package.json | jq -r .name);
docker build --build-arg NODE_ENV=dev --build-arg CONFIG_PATH="./example/example.yml" -t "$appName:$version" . || exit 1;
docker container stop $appName || true
docker container rm $appName || true
docker run --name $appName -v $HOME/.aws:/root/.aws -d -p 8000:8000 "$appName:$version";