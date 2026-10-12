# Deploying Florea

One server runs three containers behind nginx:

| Container | What | Listens on the server |
|---|---|---|
| `florea-api` | GraphQL API, uploads, WebSocket | `127.0.0.1:3007` |
| `florea-batch` | scheduled jobs | not published |
| `florea-next` | the Next.js client | `127.0.0.1:3002` |

nginx (`deploy/nginx-florea.conf`) is the one public door: `/graphql`, `/uploads/` and WebSocket upgrades go to the API, everything else to the client.

## Settings on the server (not in git)

- `deploy/.env`: the public address and the local ports. Copy `deploy/.env.example`.
- `florea-api/.env`: `PORT_API=3007`, `PORT_BATCH=3008`, `MONGO_PROD`, `SECRET_TOKEN`. The compose file sets `NODE_ENV=production`, which makes the API use `MONGO_PROD`.

The client reads the public address while it is built. If the address changes, the client image has to be built again.

## First deploy

```bash
# on your machine, from the repo root: send the committed code
git -c core.autocrlf=false archive --format=tar HEAD | ssh USER@SERVER 'mkdir -p /root/apps/florea && tar -x -C /root/apps/florea'

# on the server
cd /root/apps/florea
cp deploy/.env.example deploy/.env        # then set the public address
nano florea-api/.env                      # the four settings above
docker compose -f docker-compose.prod.yml --env-file deploy/.env up -d --build

cp deploy/nginx-florea.conf /etc/nginx/sites-available/florea
ln -s /etc/nginx/sites-available/florea /etc/nginx/sites-enabled/florea
nginx -t && systemctl reload nginx
ufw allow 3001/tcp
```

## The first admin

In production the API refuses a signup as `ADMIN`. Sign up as a normal member on the site, then on the server:

```bash
docker exec -i florea-api node - <<'JS'
const m = require('mongoose');
m.connect(process.env.MONGO_PROD).then(async () => {
	const r = await m.connection.collection('members').updateOne({ memberNick: 'THE_NICK' }, { $set: { memberType: 'ADMIN' } });
	console.log('changed:', r.modifiedCount);
	process.exit(0);
});
JS
```

The member has to log in again to get the admin pages.

## Notices and FAQ

A new database is empty. From `florea-api` on your machine:

```bash
node seed/seed-notices.mjs http://SERVER:3001/graphql ADMIN_NICK ADMIN_PASSWORD
```

## Updating

Send the code again (the `git archive` line), then on the server:

```bash
cd /root/apps/florea
docker compose -f docker-compose.prod.yml --env-file deploy/.env up -d --build
```

`florea-api/.env`, `deploy/.env` and the uploaded pictures (the `florea_uploads` volume) are kept.

## Looking at it

```bash
docker ps
docker logs -f florea-api
docker compose -f docker-compose.prod.yml --env-file deploy/.env restart florea-api
```
