# IT Deployment Brief: SantumAI PWA

**Project Nature:** Next.js Production Server (Node.js)
**Deployment Mode:** Self-hosted (SSR/Streaming), not a static export.

## 1. Infrastructure Requirements
*   **OS:** Ubuntu 22.04 LTS or 24.04 LTS
*   **Runtime:** Node.js `20.9+`, npm `10+`
*   **Process Manager:** PM2
*   **Reverse Proxy:** Nginx (Required for SSL termination and stream buffering control)
*   **Database:** MongoDB (Instance must allow access to a database named `AmigoChat`)
*   **SSL:** Required (Mandatory for HTTP-only secure cookies and PWA functionality)

## 2. External Dependencies
The IT team must ensure the following endpoints are reachable from the production server:
1.  **Santum Core API:** `NEXT_PUBLIC_WP_API_URL` (Auth, Profile, Credits)
2.  **AI Backend:** `NEXT_PUBLIC_AI_API_URL` (Chat streaming and summarization)

## 3. Required Environment Variables (`.env.production`)
The following keys **must** be defined before the build process:

| Key | Description |
| :--- | :--- |
| `NEXT_PUBLIC_BASE_URL` | The final HTTPS URL of the PWA (e.g., `[https://pwa.company.com](https://pwa.company.com)`) |
| `NEXT_PUBLIC_WP_API_URL` | Endpoint for the Santum Core API |
| `NEXT_PUBLIC_AI_API_URL` | Endpoint for the AI Chat service |
| `NEXT_PUBLIC_MONGODB_URI` | MongoDB Connection String |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Public key for Web Push |
| `VAPID_PRIVATE_KEY` | Private key for Web Push |

> **Note:** VAPID keys can be generated via `npx web-push generate-vapid-keys`.

## 4. Deployment Sequence

### Step 1: Build Phase
**Critical:** `NEXT_PUBLIC` variables are baked into the build. Re-build is required if any URL changes.
```bash
npm ci
npm run build
```

### Step 2: Process Management (PM2)
Start the service on an internal port (default `3000`):
```bash
pm2 start npm --name "santumai-pwa" -- start
```

### Step 3: Nginx Configuration (Reverse Proxy)
Ensure `proxy_buffering off` is applied specifically to the chat route to allow AI streaming.

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Critical for AI Streaming
location /api/chat/stream {
    proxy_pass http://127.0.0.1:3000;
    proxy_buffering off;
    proxy_cache off;
    add_header X-Accel-Buffering no;
}
```