# Amigo GPT PWA

Amigo GPT is a standalone Progressive Web App for text-based emotional wellbeing support. The app combines mood check-ins, saved conversations, account security, memberships, notifications, and a streaming AI chat experience.

## Product Shape

- `Next.js 16` app-router PWA with protected onboarding and authenticated app flows
- Text chat, chat history, and conversation persistence backed by MongoDB models
- Daily mood check-ins that influence support tone before chat begins
- Membership and credit balance flows synced from external authenticated APIs
- Mobile-first UI for onboarding, account security, notifications, and settings

## Local Development

Run the app locally with:

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Main Areas

- `src/app/` contains app routes, API routes, onboarding screens, and settings pages
- `src/components/` contains reusable UI, onboarding, and app-shell components
- `src/lib/` contains API helpers, store setup, theme utilities, content maps, and domain helpers
- `src/models/` contains MongoDB schemas for chats, messages, mood check-ins, and notifications

## Notes

- The PWA keeps the current app name and route structure, including `/amigo-chat`
- Chat streaming is forwarded to the external AI service configured by `NEXT_PUBLIC_AI_API_URL`
- Membership checkout completes on Santum.net and syncs back into the PWA
