# Blog engagement API

This is the only stateful part of the blog. GitHub Pages stays fully static; browser requests go to `api.senthurayyappan.com`.

## What it records

- one view for each anonymous browser and post pair;
- one optional like for each anonymous browser and post pair;
- the aggregate like total;
- the aggregate view total;
- no name, email, account, or raw visitor identifier is stored.

The API uses a small in-memory IP rate limit as a basic abuse guard. The counts are approximate engagement signals. A new browser, device, or cleared browser store creates a new identifier.

## VPS deployment

1. Copy this directory to the VPS and run `sudo bash deploy.sh`. The script keeps the existing database and secrets.
2. Add the `Caddyfile.example` site block to the VPS Caddy configuration, then reload Caddy. Keep port 8791 bound only to localhost.
3. Verify `https://api.senthurayyappan.com/v1/posts/ballbot-always-wins/likes?viewer=<uuid>` returns JSON with `likes`, `liked`, and `views`.
4. Keep the Actions secret `LIKES_API_URL` set to `https://api.senthurayyappan.com`, then redeploy Pages.

Back up the Docker volume `likes-postgres`; it contains all engagement records. The website still renders if this API is unavailable.
