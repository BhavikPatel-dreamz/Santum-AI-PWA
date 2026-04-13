import type { NextConfig } from 'next';
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /\.(?:js|css|woff2?|ico|png|jpg|jpeg|svg|webp)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'staticAssetsCache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^https:\/\/jsonplaceholder\.typicode\.com/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'apiCache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {},
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withPWA(nextConfig as any);
