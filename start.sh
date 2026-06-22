echo "starting creating docker"
echo "list of running container"
docker ps
echo "building container"
docker compose build .
docker run -p 3000:3000 unisync-frontend:latest