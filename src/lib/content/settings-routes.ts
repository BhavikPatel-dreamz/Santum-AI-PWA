export const SETTINGS_PAGE_ROUTES = {
  subscriptions: "/current-plan",
  security: "/protection",
  faqs: "/faqs",
  "about-santumai": "/about-santumai",
  "santum-platform": "/santum-platform",
  legal: "/legal",
  "send-feedback": "/feedback",
  "contact-us": "/contact-us",
  "account-management": "/account-management",
} as const;

export type SettingsPageKey = keyof typeof SETTINGS_PAGE_ROUTES;

export const SEO_SETTINGS_PAGE_KEYS: SettingsPageKey[] = [
  "security",
  "faqs",
  "about-santumai",
  "santum-platform",
  "legal",
  "contact-us",
];
