# Blog likes API

This is the only stateful part of the blog. GitHub Pages stays fully static; browser requests go to `api.senthurayyappan.com`.

## What it records

- one anonymous browser identifier per post, hashed server-side with `VISITOR_SALT`;
- the aggregate like total;
- no name, email, account, or raw visitor identifier is stored.

The API uses a small in-memory IP rate limit as a basic abuse guard. It is intentionally a light reception signal, not a vote that needs to be fraud-proof.

## VPS deployment

1. Copy this directory to the VPS and run `sudo bash deploy.sh`. It creates `/opt/senthur-likes-api/.env` with fresh secrets on the first run and starts the service.
3. Add the `Caddyfile.example` site block to the VPS Caddy configuration, then reload Caddy. Keep port 8791 bound only to localhost as the Compose file does.
4. Point the `api.senthurayyappan.com` DNS record at the VPS and verify `https://api.senthurayyappan.com/v1/posts/ballbot-always-wins/likes?viewer=<uuid>` returns JSON.
5. In GitHub repository settings, add the Actions secret `LIKES_API_URL` with the value `https://api.senthurayyappan.com`, then redeploy Pages.

Back up the Docker volume `likes-postgres`; it contains the aggregate counts. The public website never depends on this service to render: without the build-time URL secret, the control is omitted; if the API later has downtime, articles still render normally.
