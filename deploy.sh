git pull

docker compose -f docker/production/docker-compose.yml down

docker compose -f docker/production/docker-compose.yml up -d --build 