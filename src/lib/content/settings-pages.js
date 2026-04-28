export const SETTINGS_PAGE_CONTENT = {
  "banks-cards": {
    title: "Banks & Cards",
    badge: "Wallet Hub",
    heroTitle: "Keep every card neatly in one secure place",
    description:
      "A clean dummy wallet view with balances, expiry dates, and trusted institutions styled to match the app.",
    imageSrc: "/icons/plus-robort.png",
    imageAlt: "Wallet robot",
    sections: [
      {
        type: "list",
        title: "Saved Cards",
        items: [
          {
            title: "Amigo Black Card",
            description: "Primary spending card ending in 4821",
            meta: "Expires 09/28",
            badge: "Default",
          },
          {
            title: "Travel Rewards Visa",
            description: "Used for flights, hotels, and reward points",
            meta: "Expires 01/29",
          },
        ],
      },
      {
        type: "list",
        title: "Linked Banks",
        items: [
          {
            title: "Kotak Mahindra Bank",
            description: "Checking account linked for top-ups and withdrawals",
            meta: "Synced 15 min ago",
          },
          {
            title: "HDFC Salary Account",
            description: "Available as a backup payout destination",
            meta: "Healthy connection",
          },
        ],
      },
    ],
    footerActions: [
      { label: "Add Dummy Card", toast: "Dummy card added to your wallet.", variant: "primary" },
      { label: "Payment Methods", href: "/settings/payment-methods", variant: "secondary" },
    ],
  },
  "payment-methods": {
    title: "Payment Methods",
    badge: "Checkout Ready",
    heroTitle: "Choose how Amigo should charge and pay",
    description:
      "A smoother payment surface for subscriptions, add-ons, and future wallet flows.",
    imageSrc: "/icons/robot-slider-img3.png",
    imageAlt: "Payment method preview",
    sections: [
      {
        type: "list",
        title: "Available Methods",
        items: [
          {
            title: "Instant Wallet",
            description: "Fastest checkout using your in-app balance",
            meta: "Preferred",
            badge: "Recommended",
          },
          {
            title: "UPI AutoPay",
            description: "Hands-free renewals for Amigo Plus and future plans",
            meta: "Active",
          },
          {
            title: "Debit / Credit Card",
            description: "Fallback method for subscriptions and premium add-ons",
            meta: "2 cards saved",
          },
        ],
      },
      {
        type: "toggles",
        title: "Payment Preferences",
        items: [
          {
            key: "autopay",
            label: "Auto-pay recurring plans",
            description: "Let active subscriptions renew automatically.",
            enabled: true,
          },
          {
            key: "lowBalance",
            label: "Warn when wallet is low",
            description: "Receive a prompt before a payment fails.",
            enabled: true,
          },
          {
            key: "receipts",
            label: "Email detailed receipts",
            description: "Share plan and billing details to your inbox.",
            enabled: false,
          },
        ],
      },
    ],
    footerActions: [
      { label: "Save Preferences", toast: "Payment preferences updated in demo mode.", variant: "primary" },
      { label: "Back To Wallet", href: "/settings/banks-cards", variant: "secondary" },
    ],
  },
  subscriptions: {
    title: "Subscriptions",
    badge: "Plan Control",
    heroTitle: "Track every plan, renewal, and premium perk",
    description:
      "This dummy subscription center shows how plan management can feel more intentional inside your current theme.",
    imageSrc: "/icons/plus-robort.png",
    imageAlt: "Subscription preview",
    sections: [
      {
        type: "stats",
        title: "Current Snapshot",
        items: [
          { label: "Plan", value: "Free" },
          { label: "Renewal", value: "May 12" },
          { label: "Saved", value: "18%" },
        ],
      },
      {
        type: "list",
        title: "Included In Plus",
        items: [
          {
            title: "Longer conversations",
            description: "Keep more context available in each discussion.",
          },
          {
            title: "Priority replies",
            description: "Move premium users to the faster response lane.",
          },
          {
            title: "Workspace presets",
            description: "Save tones, prompts, and reusable command packs.",
          },
        ],
      },
    ],
    footerActions: [
      { label: "Upgrade To Plus", href: "/plus-subscription", variant: "primary" },
      { label: "Home", href: "/home", variant: "secondary" },
    ],
  },
  security: {
    title: "Security",
    badge: "Account Shield",
    heroTitle: "Layer up protection without losing the friendly flow",
    description:
      "A calm, modern security hub for PINs, passkeys, biometrics, and alerts.",
    imageSrc: "/icons/finger-print-img-green.png",
    imageAlt: "Security fingerprint",
    sections: [
      {
        type: "list",
        title: "Protection Stack",
        items: [
          {
            title: "4-digit security PIN",
            description: "Used when you return to sensitive areas of the app.",
            meta: "Suggested next step",
          },
          {
            title: "Fingerprint unlock",
            description: "Fast sign-in on supported devices with local biometrics.",
            meta: "Device ready",
          },
          {
            title: "New device alerts",
            description: "Get notified when the account is opened somewhere new.",
            meta: "Enabled",
            badge: "Live",
          },
        ],
      },
      {
        type: "toggles",
        title: "Security Controls",
        items: [
          {
            key: "loginAlerts",
            label: "Instant sign-in alerts",
            description: "Know right away when a new session is created.",
            enabled: true,
          },
          {
            key: "weeklyDigest",
            label: "Weekly activity digest",
            description: "Receive a simple recap of account activity.",
            enabled: false,
          },
          {
            key: "biometricPrompt",
            label: "Prompt for biometrics on app open",
            description: "Add an extra step before conversations appear.",
            enabled: true,
          },
        ],
      },
    ],
    footerActions: [
      { label: "Create PIN", href: "/create-pin", variant: "primary" },
      { label: "Scan Fingerprint", href: "/finger-scan", variant: "secondary" },
    ],
  },
  "marketing-preferences": {
    title: "Marketing Preferences",
    badge: "Message Control",
    heroTitle: "Choose the updates that actually feel useful",
    description:
      "A friendlier preferences page for product drops, offers, launches, and curated ideas.",
    imageSrc: "/icons/robot-slider-img2.png",
    imageAlt: "Marketing preferences",
    sections: [
      {
        type: "toggles",
        title: "Channels & Topics",
        items: [
          {
            key: "featureDrops",
            label: "Feature announcements",
            description: "Hear about important launches and big product changes.",
            enabled: true,
          },
          {
            key: "promos",
            label: "Offers and limited-time plans",
            description: "Receive promo pricing and invitation-only upgrades.",
            enabled: true,
          },
          {
            key: "tips",
            label: "Weekly prompt tips",
            description: "Small ideas to get more out of Amigo every week.",
            enabled: false,
          },
          {
            key: "partnerNews",
            label: "Partner announcements",
            description: "Optional news from integrations and ecosystem launches.",
            enabled: false,
          },
        ],
      },
    ],
    footerActions: [
      { label: "Save Choices", toast: "Marketing preferences saved for the demo.", variant: "primary" },
      { label: "Contact Support", href: "/settings/contact-us", variant: "secondary" },
    ],
  },
  "notification-options": {
    title: "Notification Options",
    badge: "Stay Updated",
    heroTitle: "Shape the pace and type of alerts you receive",
    description:
      "A polished notification settings layer with room for future product, billing, and chat activity alerts.",
    imageSrc: "/icons/robot-slider-img3.png",
    imageAlt: "Notifications settings",
    sections: [
      {
        type: "toggles",
        title: "Push & Inbox Preferences",
        items: [
          {
            key: "chatReplies",
            label: "Chat reply alerts",
            description: "See when an important response is ready to review.",
            enabled: true,
          },
          {
            key: "productNews",
            label: "Product and release updates",
            description: "Get the newest feature changes in a lightweight feed.",
            enabled: true,
          },
          {
            key: "billingUpdates",
            label: "Billing updates",
            description: "Know when renewals, invoices, or failures happen.",
            enabled: true,
          },
          {
            key: "quietHours",
            label: "Quiet hours",
            description: "Reduce notifications between 10 PM and 8 AM.",
            enabled: false,
          },
        ],
      },
      {
        type: "list",
        title: "Delivery Channels",
        items: [
          {
            title: "Push notifications",
            description: "Best for time-sensitive updates while you are away.",
          },
          {
            title: "In-app inbox",
            description: "A cleaner archive for product and account changes.",
          },
          {
            title: "Email fallback",
            description: "Used only when something needs a longer summary.",
          },
        ],
      },
    ],
    footerActions: [
      { label: "Save Notification Rules", toast: "Notification options updated in demo mode.", variant: "primary" },
      { label: "Open Inbox", href: "/notifications", variant: "secondary" },
    ],
  },
  currency: {
    title: "Currency",
    badge: "Regional Setup",
    heroTitle: "Preview pricing in the currency that feels natural to you",
    description:
      "A simple selector for plans, credits, and receipts while backend localization is still in progress.",
    imageSrc: "/icons/robot-slider-img2.png",
    imageAlt: "Currency selection",
    sections: [
      {
        type: "choices",
        key: "currency",
        title: "Preferred Currency",
        selected: "USD",
        items: [
          {
            label: "USD",
            description: "Best for current global pricing previews.",
          },
          {
            label: "INR",
            description: "Useful for local plan positioning and invoices.",
          },
          {
            label: "EUR",
            description: "Cleaner for European team and subscription demos.",
          },
          {
            label: "GBP",
            description: "Handy for UK testing and proposal screens.",
          },
        ],
      },
    ],
    footerActions: [
      { label: "Update Currency", toast: "Preferred currency updated for the demo.", variant: "primary" },
      { label: "View Plans", href: "/plus-subscription", variant: "secondary" },
    ],
  },
  faqs: {
    title: "FAQs",
    badge: "Quick Answers",
    heroTitle: "Make help feel fast, calm, and self-serve",
    description:
      "This FAQ layout gives your support content a real product surface instead of a wall of plain text.",
    imageSrc: "/icons/plus-robort.png",
    imageAlt: "Help and faq",
    sections: [
      {
        type: "faq",
        items: [
          {
            question: "Can I chat with Amigo without buying a plan?",
            answer:
              "Yes. The base experience stays open in this demo, while premium plans unlock faster replies and extra workspace tools.",
          },
          {
            question: "Will my chat history stay synced across devices?",
            answer:
              "Your saved conversations now load from the real history screen, so returning to the same account should keep recent chats available across sessions.",
          },
          {
            question: "How does biometric unlock fit into the app?",
            answer:
              "Biometrics are presented as an optional comfort-and-security layer on top of your sign-in and PIN flow.",
          },
          {
            question: "Can I change my language or currency later?",
            answer:
              "Yes. Those preferences live in settings and can be updated at any time without affecting your core profile.",
          },
        ],
      },
    ],
    footerActions: [
      { label: "Still Need Help?", href: "/settings/contact-us", variant: "primary" },
      { label: "Send Feedback", href: "/settings/send-feedback", variant: "secondary" },
    ],
  },
  "privacy-policy": {
    title: "Data & Privacy Policy",
    badge: "Trust Layer",
    heroTitle: "Show users what you collect without the legal wall",
    description:
      "A readable privacy summary with enough structure to feel trustworthy, even before final legal copy lands.",
    imageSrc: "/icons/finger-print-img-white.png",
    imageAlt: "Privacy shield",
    sections: [
      {
        type: "text",
        title: "How This Demo Handles Data",
        items: [
          {
            heading: "Profile basics",
            body: "Name, language, interests, and onboarding preferences are presented as lightweight user data for the UI flow.",
          },
          {
            heading: "Conversation context",
            body: "Chats, saved prompts, and quick summaries are displayed as placeholders so the screens feel production-ready.",
          },
          {
            heading: "Security preferences",
            body: "PIN and biometric surfaces are shown as opt-in controls designed to protect access on shared devices.",
          },
        ],
      },
      {
        type: "list",
        title: "Privacy Principles",
        items: [
          {
            title: "Clarity first",
            description: "Tell people what happens, why it matters, and where they can change it.",
          },
          {
            title: "Control by default",
            description: "Settings pages should make edits obvious and reversible.",
          },
          {
            title: "Minimal surprise",
            description: "Sensitive actions should always be explained before they happen.",
          },
        ],
      },
    ],
    footerActions: [
      { label: "Contact About Privacy", href: "/settings/contact-us", variant: "primary" },
      { label: "Back To Settings", href: "/home", variant: "secondary" },
    ],
  },
  "about-amigo": {
    title: "About Amigo GPT",
    badge: "Product Story",
    heroTitle: "A warmer AI companion built around clarity and flow",
    description:
      "This page introduces the product, the release state, and the personality behind the current experience.",
    imageSrc: "/icons/logo.png",
    imageAlt: "Amigo logo",
    sections: [
      {
        type: "stats",
        title: "Current Snapshot",
        items: [
          { label: "Version", value: "v2.0.2" },
          { label: "Theme", value: "Mint Core" },
          { label: "Mode", value: "PWA" },
        ],
      },
      {
        type: "steps",
        title: "What Amigo Is Designed To Do",
        items: [
          "Make AI onboarding feel less technical and more human.",
          "Support fast conversations, guided prompts, and simple personalization.",
          "Create room for security, subscriptions, and team-friendly polish.",
        ],
      },
    ],
    footerActions: [
      { label: "Send Product Feedback", href: "/settings/send-feedback", variant: "primary" },
      { label: "Back To Home", href: "/home", variant: "secondary" },
    ],
  },
  "send-feedback": {
    title: "Send Feedback",
    badge: "Your Voice",
    heroTitle: "Capture ideas, friction, and feature requests in one place",
    description:
      "A simple in-app feedback form that feels native to the theme and useful even with dummy handling.",
    imageSrc: "/icons/robot-slider-img3.png",
    imageAlt: "Feedback form",
    sections: [
      {
        type: "form",
        key: "feedback",
        title: "What should we improve?",
        placeholder:
          "Tell us what felt great, what felt confusing, or what you want next...",
        submitLabel: "Submit Feedback",
        submitToast: "Feedback saved locally for the demo.",
        categories: ["Design", "Speed", "Chat Quality", "Payments", "Security"],
      },
      {
        type: "list",
        title: "You Can Use Feedback For",
        items: [
          {
            title: "Bug reports",
            description: "Flag broken navigation, visual bugs, or incomplete states.",
          },
          {
            title: "Feature ideas",
            description: "Suggest new chat tools, assistant modes, or account controls.",
          },
          {
            title: "UX polish",
            description: "Share friction points in onboarding or settings flows.",
          },
        ],
      },
    ],
    footerActions: [
      { label: "Contact Team", href: "/settings/contact-us", variant: "secondary" },
    ],
  },
  "contact-us": {
    title: "Contact Us",
    badge: "Support Team",
    heroTitle: "Offer multiple ways to reach the team without making support feel cold",
    description:
      "This dummy contact hub makes escalation feel intentional and accessible inside the app.",
    imageSrc: "/icons/robot-slider-img2.png",
    imageAlt: "Contact support",
    sections: [
      {
        type: "list",
        title: "Support Channels",
        items: [
          {
            title: "Live chat support",
            description: "Typical response time under 10 minutes during work hours.",
            meta: "Mon-Fri",
            badge: "Fastest",
          },
          {
            title: "Email support",
            description: "best for billing questions, larger bug reports, and attachments",
            meta: "support@amigo.app",
          },
          {
            title: "Priority callback",
            description: "Book a short product call for enterprise or partnership questions.",
            meta: "By request",
          },
        ],
      },
      {
        type: "steps",
        title: "What Happens Next",
        items: [
          "Your request is tagged by topic and urgency.",
          "We guide you toward the fastest matching support channel.",
          "Complex issues roll into a tracked product or engineering follow-up.",
        ],
      },
    ],
    footerActions: [
      { label: "Open Feedback Form", href: "/settings/send-feedback", variant: "primary" },
      { label: "Back To FAQs", href: "/settings/faqs", variant: "secondary" },
    ],
  },
  "invite-friends": {
    title: "Invite Friends",
    badge: "Growth Loop",
    heroTitle: "Turn referrals into a screen people actually want to share",
    description:
      "A friendlier invite flow with a clear code, a simple reward, and enough warmth to feel believable.",
    imageSrc: "/icons/friend10.jpg",
    imageAlt: "Invite friends",
    sections: [
      {
        type: "referral",
        title: "Your Invite Code",
        code: "AMIGO-2026",
        reward: "Give friends 14 days of Plus preview and unlock bonus prompts for yourself.",
      },
      {
        type: "steps",
        title: "How It Works",
        items: [
          "Share the code with a friend.",
          "They sign up and complete onboarding.",
          "Both sides unlock the demo reward automatically.",
        ],
      },
    ],
    footerActions: [
      { label: "Copy Invite Code", copyText: "AMIGO-2026", toast: "Invite code copied.", variant: "primary" },
      { label: "Back To Home", href: "/home", variant: "secondary" },
    ],
  },
  "account-management": {
    title: "Delete or Deactivate Account",
    badge: "Sensitive Action",
    heroTitle: "Make hard account decisions feel clear and reversible where possible",
    description:
      "This screen frames destructive actions carefully so users understand the difference between pausing and fully leaving.",
    imageSrc: "/icons/finger-print-img-black.png",
    imageAlt: "Account control",
    sections: [
      {
        type: "destructive",
        title: "Account Actions",
        items: [
          {
            title: "Deactivate account for 30 days",
            description: "Hide your account temporarily and keep the option to return.",
            buttonLabel: "Deactivate",
          },
          {
            title: "Export my chat archive",
            description: "Prepare a downloadable copy of your saved conversations and settings.",
            buttonLabel: "Request Export",
          },
          {
            title: "Delete account permanently",
            description: "Remove access and begin a permanent account removal workflow.",
            buttonLabel: "Delete Forever",
          },
        ],
      },
      {
        type: "text",
        title: "Before You Continue",
        items: [
          {
            heading: "Use clear language",
            body: "Deactivation should feel reversible. Deletion should feel permanent and carefully explained.",
          },
          {
            heading: "Offer exports first",
            body: "Give users a chance to take their information before leaving.",
          },
        ],
      },
    ],
    footerActions: [
      { label: "Talk To Support First", href: "/settings/contact-us", variant: "primary" },
      { label: "Back To Security", href: "/settings/security", variant: "secondary" },
    ],
  },
};
