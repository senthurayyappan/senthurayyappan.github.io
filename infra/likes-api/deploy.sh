#!/usr/bin/env bash
# Deploy the likes API from this directory. Run with: sudo bash deploy.sh
set -Eeuo pipefail

app_dir=/opt/senthur-likes-api
source_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required. Install Docker Engine and the Docker Compose plugin first."
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "The Docker Compose plugin is required (docker compose)."
  exit 1
fi

if ! command -v openssl >/dev/null 2>&1; then
  echo "openssl is required to create the service secrets."
  exit 1
fi

install -d -m 0755 "$app_dir"
# cp -a is intentionally non-destructive: it updates application files but keeps
# the generated .env and the Docker volume containing existing like totals.
cp -a "$source_dir/." "$app_dir/"
cd "$app_dir"

if [[ ! -f .env ]]; then
  umask 077
  cat > .env <<EOF
POSTGRES_PASSWORD=$(openssl rand -hex 32)
VISITOR_SALT=$(openssl rand -hex 32)
EOF
  echo "Created $app_dir/.env with fresh secrets."
fi

chmod 600 .env
docker compose up -d --build

echo
echo "Container status:"
docker compose ps
echo
echo "Local health check:"
curl --fail --silent --show-error \
  'http://127.0.0.1:8791/v1/posts/ballbot-always-wins/likes?viewer=00000000-0000-4000-8000-000000000000'
echo
echo
echo "Next: add the api.senthurayyappan.com Caddy site block from Caddyfile.example."
