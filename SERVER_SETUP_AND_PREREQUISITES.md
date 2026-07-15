# IT Deployment Brief: SantumAI PWA

**Project Nature:** Next.js Production Server (Node.js)
**Deployment Mode:** Self-hosted SSR/streaming deployment, not a static export.

## 1. Infrastructure Requirements

| Requirement | Value |
| :--- | :--- |
| OS | Ubuntu 22.04 LTS or 24.04 LTS |
| Runtime | Node.js 20.9+ and npm 10+ |
| Process Manager | PM2 |
| Reverse Proxy | Nginx, required for SSL termination and streaming control |
| Database | MongoDB, with access to database `SantumAI` |
| Cache / Queue | Redis, required when Web Push notifications are enabled |
| SSL | Required for secure HTTP-only cookies, service worker, PWA installability, and Web Push |

## 2. External Dependencies

The production server must be able to reach these external services:

| Service | Environment Variable | Purpose |
| :--- | :--- | :--- |
| Santum Core API | `NEXT_PUBLIC_WP_API_URL` | Auth, profile, memberships, credits, billing sync |
| AI Backend | `NEXT_PUBLIC_AI_API_URL` | Chat streaming and summarization |
| MongoDB | `NEXT_PUBLIC_MONGODB_URI` | Chats, messages, mood check-ins, notifications, push subscriptions |
| Redis | `REDIS_URL` or `PUSH_QUEUE_REDIS_URL` | Push notification queue |

## 3. Required Environment Variables

Create `.env.production` before running the build.

> Important: variables prefixed with `NEXT_PUBLIC_` are baked into the client bundle during `npm run build`. Rebuild the app if any of these values change.

| Key | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Final HTTPS URL of the PWA, for example `https://pwa.company.com` |
| `NEXT_PUBLIC_WP_API_URL` | Santum Core API base URL |
| `NEXT_PUBLIC_AI_API_URL` | AI backend base URL |
| `NEXT_PUBLIC_MONGODB_URI` | MongoDB connection string |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Public VAPID key for Web Push |
| `VAPID_PRIVATE_KEY` | Private VAPID key for Web Push |
| `VAPID_CONTACT_EMAIL` | Contact email for VAPID, for example `mailto:it@company.com` |
| `REDIS_URL` | Redis connection string for push queue |

Alternative Redis configuration is also supported:

```env
PUSH_QUEUE_REDIS_URL=redis://...
# or
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

VAPID keys can be generated with:

```bash
npx web-push generate-vapid-keys
```

## 4. Deployment Sequence

### Step 1: Install Dependencies

```bash
npm ci
```

### Step 2: Build

```bash
npm run build
```

The current project build script uses Turbopack:

```bash
next build --turbopack
```

### Step 3: Start With PM2

Start the Next.js production server on the internal port used by Nginx.

> Note: `PORT` must be provided by the shell or PM2 environment. Do not rely on `.env.production` for `PORT`.

```bash
PORT=3000 pm2 start npm --name "santumai-pwa" -- start
```

If Web Push notifications are enabled, also start the queue worker:

```bash
pm2 start npm --name "santumai-push-worker" -- run worker
```

Persist PM2 processes:

```bash
pm2 save
pm2 startup
```

## 5. Nginx Reverse Proxy

The app must run behind HTTPS. Nginx should forward all traffic to the local Next.js server and must disable buffering on the chat stream route.

```nginx
server {
    listen 80;
    server_name pwa.company.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pwa.company.com;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    client_max_body_size 20m;

    location /api/chat/stream {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_buffering off;
        proxy_request_buffering off;
        proxy_cache off;
        add_header X-Accel-Buffering no always;

        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 6. Post-Deployment Checks

After deployment, verify:

- `https://pwa.company.com` loads successfully.
- Login sets the secure HTTP-only `token` cookie.
- `/manifest.json` and `/sw.js` return `200`.
- `/santumai-chat` opens for authenticated users.
- Chat streaming responds progressively and is not buffered by Nginx.
- MongoDB contains/uses database `SantumAI`.
- If Web Push is enabled, PM2 shows both `santumai-pwa` and `santumai-push-worker` online.
