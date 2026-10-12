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

## Sample shops

A new database has no florists and no products, and the homepage hides the sections it cannot fill. `seed/demo-shop.json` holds five sample florists with four products each and six short community articles, and `seed/demo-shop/` their photos. From `florea-api` on your machine:

```bash
node seed/seed-demo-shop.mjs http://SERVER:3001/graphql PASSWORD_FOR_THE_FLORIST_ACCOUNTS
```

The password (5 to 12 characters) is set on the five accounts and is not kept anywhere by the script. Running it again creates nothing twice. These shops are samples, not real businesses: an order placed with them reaches an account that you hold, and nobody delivers it.

## Updating

Do not unpack the new code over the old folder. `tar` adds and replaces files, and a file that was deleted in git stays on the server; the client build type-checks every `.ts` and `.tsx` file it finds, so one leftover file can fail it. The code goes into a fresh folder, the two settings files are carried over, and the folders are swapped after the build has passed.

```bash
# on your machine, from the repo root
git -c core.autocrlf=false archive --format=tar HEAD | ssh USER@SERVER 'rm -rf /root/apps/florea.new && mkdir -p /root/apps/florea.new && tar -x -C /root/apps/florea.new'

# on the server: the settings, then the build; the running site is not touched yet
cd /root/apps
cp -p florea/deploy/.env florea.new/deploy/.env
cp -p florea/florea-api/.env florea.new/florea-api/.env
cd florea.new
docker compose -f docker-compose.prod.yml --env-file deploy/.env build florea-next

# the build passed: swap the folders and start the new client
cd /root/apps && mv florea florea.old && mv florea.new florea && cd florea
docker compose -f docker-compose.prod.yml --env-file deploy/.env up -d --no-deps florea-next

# the site has been checked
rm -rf /root/apps/florea.old
```

These are the steps of the update of 2026-10-12, where only the client had changed: the API and the batch jobs kept running. When the API changed too, leave out `florea-next` and `--no-deps` in the two `docker compose` lines (not tried yet).

Start `up` from `/root/apps/florea`, the folder the containers were first started from, not from `florea.new`.

To be able to go back, tag the running image before the build (`docker tag florea-next:latest florea-next:prev`) and remove the tag when the new site has been checked (`docker rmi florea-next:prev`).

`florea-api/.env`, `deploy/.env` and the uploaded pictures (the `florea_uploads` volume) are kept. On this server the Docker build cache is shared with the other projects: do not run `docker system prune` or `docker builder prune`.

## Looking at it

```bash
docker ps
docker logs -f florea-api
docker compose -f docker-compose.prod.yml --env-file deploy/.env restart florea-api
```
