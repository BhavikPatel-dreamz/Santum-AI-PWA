export const SETTINGS_PAGE_CONTENT = {
  "banks-cards": {
    title: "Billing Methods",
    badge: "Membership Billing",
    heroTitle: "Keep your renewal methods organized and easy to review",
    description:
      "Use this space to review the cards or accounts linked to Amigo memberships and chat-credit top-ups.",
    imageSrc: "/icons/plus-robort.png",
    imageAlt: "Billing methods",
    sections: [
      {
        type: "list",
        title: "Saved Methods",
        items: [
          {
            title: "Primary debit card",
            description: "Used for membership renewals and one-tap credit top-ups.",
            meta: "Ending in 4821",
            badge: "Default",
          },
          {
            title: "UPI AutoPay",
            description: "Available for recurring membership charges when enabled.",
            meta: "Ready",
          },
        ],
      },
      {
        type: "list",
        title: "Billing Notes",
        items: [
          {
            title: "Secure checkout",
            description: "Payments are completed on Santum.net before the PWA syncs the latest membership state.",
          },
          {
            title: "Receipts and renewals",
            description: "Membership renewals and balance changes are reflected in your notification inbox.",
          },
        ],
      },
    ],
    footerActions: [
      {
        label: "Add Billing Method",
        toast: "Billing method saved in this session.",
        variant: "primary",
      },
      {
        label: "Payment Preferences",
        href: "/settings/payment-methods",
        variant: "secondary",
      },
    ],
  },
  "payment-methods": {
    title: "Payment Preferences",
    badge: "Checkout Ready",
    heroTitle: "Choose how Amigo should handle renewals and receipts",
    description:
      "These settings shape recurring membership charges, low-balance reminders, and receipt delivery.",
    imageSrc: "/icons/robot-slider-img3.png",
    imageAlt: "Payment preferences",
    sections: [
      {
        type: "list",
        title: "Available Methods",
        items: [
          {
            title: "UPI AutoPay",
            description: "A smooth option for recurring membership renewals.",
            meta: "Recommended",
            badge: "Fastest",
          },
          {
            title: "Debit or credit card",
            description: "Reliable fallback for memberships and chat-credit purchases.",
            meta: "Saved",
          },
          {
            title: "Netbanking",
            description: "Helpful when you prefer manual checkout on the web.",
            meta: "Available at checkout",
          },
        ],
      },
      {
        type: "toggles",
        title: "Billing Preferences",
        items: [
          {
            key: "autopay",
            label: "Auto-renew active membership",
            description: "Let your current plan renew without interrupting support access.",
            enabled: true,
          },
          {
            key: "lowBalance",
            label: "Warn when balance runs low",
            description: "Get notified before credits are too low for another chat.",
            enabled: true,
          },
          {
            key: "receipts",
            label: "Send detailed receipts",
            description: "Share billing summaries and plan updates to your chosen inbox.",
            enabled: false,
          },
        ],
      },
    ],
    footerActions: [
      {
        label: "Save Preferences",
        toast: "Payment preferences saved in this session.",
        variant: "primary",
      },
      {
        label: "Back To Billing",
        href: "/settings/banks-cards",
        variant: "secondary",
      },
    ],
  },
  subscriptions: {
    title: "Subscriptions",
    badge: "Plan Control",
    heroTitle: "Track your membership, renewal cycle, and support access",
    description:
      "Review your current plan, understand what it unlocks, and jump back to live membership checkout when needed.",
    imageSrc: "/icons/plus-robort.png",
    imageAlt: "Membership overview",
    sections: [
      {
        type: "stats",
        title: "Current Snapshot",
        items: [
          { label: "Plan", value: "Free" },
          { label: "Renewal", value: "Monthly" },
          { label: "Check-ins", value: "Daily" },
        ],
      },
      {
        type: "list",
        title: "What Premium Adds",
        items: [
          {
            title: "Longer conversations",
            description: "Keep more context available while you unpack harder moments.",
          },
          {
            title: "Priority responses",
            description: "Move active members into a faster reply lane.",
          },
          {
            title: "Guided reflections",
            description: "Unlock deeper prompts and calmer support flows.",
          },
        ],
      },
    ],
    footerActions: [
      {
        label: "Upgrade To Plus",
        href: "/plus-subscription",
        variant: "primary",
      },
      { label: "Home", href: "/home", variant: "secondary" },
    ],
  },
  security: {
    title: "Security",
    badge: "Account Shield",
    heroTitle: "Protect private conversations without making access feel heavy",
    description:
      "A calm security hub for PINs, biometrics, alerts, and account-protection habits.",
    imageSrc: "/icons/finger-print-img-green.png",
    imageAlt: "Security fingerprint",
    sections: [
      {
        type: "list",
        title: "Protection Stack",
        items: [
          {
            title: "4-digit security PIN",
            description: "Adds a quick privacy check before returning to sensitive screens.",
            meta: "Suggested next step",
          },
          {
            title: "Fingerprint unlock",
            description: "Use local biometrics on supported devices for faster re-entry.",
            meta: "Device ready",
          },
          {
            title: "New device alerts",
            description: "Get notified when your account is opened somewhere new.",
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
            label: "Weekly account summary",
            description: "Receive a simple recap of recent account activity.",
            enabled: false,
          },
          {
            key: "biometricPrompt",
            label: "Prompt for biometrics on app open",
            description: "Add another layer before private conversations appear.",
            enabled: true,
          },
        ],
      },
    ],
    footerActions: [
      { label: "Create PIN", href: "/create-pin", variant: "primary" },
      {
        label: "Scan Fingerprint",
        href: "/finger-scan",
        variant: "secondary",
      },
    ],
  },
  "marketing-preferences": {
    title: "Message Preferences",
    badge: "Message Control",
    heroTitle: "Choose the updates that actually feel useful",
    description:
      "Control which product, wellbeing, and membership messages you want to receive from Amigo.",
    imageSrc: "/icons/robot-slider-img2.png",
    imageAlt: "Message preferences",
    sections: [
      {
        type: "toggles",
        title: "Channels And Topics",
        items: [
          {
            key: "featureDrops",
            label: "Feature announcements",
            description: "Hear about important product changes and major releases.",
            enabled: true,
          },
          {
            key: "promos",
            label: "Membership offers",
            description: "Receive pricing updates or limited membership campaigns.",
            enabled: true,
          },
          {
            key: "tips",
            label: "Weekly reflection tips",
            description: "Get small ideas for journaling, emotional check-ins, and calmer routines.",
            enabled: false,
          },
          {
            key: "partnerNews",
            label: "Community updates",
            description: "Optional news about guided programs, resources, or partner initiatives.",
            enabled: false,
          },
        ],
      },
    ],
    footerActions: [
      {
        label: "Save Choices",
        toast: "Message preferences saved in this session.",
        variant: "primary",
      },
      {
        label: "Contact Support",
        href: "/settings/contact-us",
        variant: "secondary",
      },
    ],
  },
  currency: {
    title: "Currency",
    badge: "Regional Setup",
    heroTitle: "Choose the currency that feels most natural for billing",
    description:
      "This affects how plans, credits, and receipts are presented inside the membership flow.",
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
            description: "Useful for global pricing and cross-border billing.",
          },
          {
            label: "INR",
            description: "Helpful when you prefer local pricing and invoices.",
          },
          {
            label: "EUR",
            description: "A clean fit for European billing and receipts.",
          },
          {
            label: "GBP",
            description: "A good match for UK-based membership payments.",
          },
        ],
      },
    ],
    footerActions: [
      {
        label: "Update Currency",
        toast: "Preferred currency updated in this session.",
        variant: "primary",
      },
      { label: "View Plans", href: "/plus-subscription", variant: "secondary" },
    ],
  },
  faqs: {
    title: "FAQs",
    badge: "Quick Answers",
    heroTitle: "Make support feel clear, calm, and easy to self-serve",
    description:
      "Short answers for common questions about support chats, privacy, memberships, and safety.",
    imageSrc: "/icons/plus-robort.png",
    imageAlt: "Help and FAQ",
    sections: [
      {
        type: "faq",
        items: [
          {
            question: "Can I chat with Amigo without buying a plan?",
            answer:
              "Yes. Access depends on your active plan and available chat credits, and the core experience can still work on the free tier when credits are available.",
          },
          {
            question: "Is Amigo a replacement for therapy or emergency care?",
            answer:
              "No. Amigo is designed for everyday emotional support and reflection, not emergency or crisis response. If you are in immediate danger or need urgent help, contact local emergency services or a licensed crisis resource right away.",
          },
          {
            question: "Will my chat history stay synced across devices?",
            answer:
              "Your saved conversations are tied to your account, so returning on the same account should keep recent sessions available across supported devices.",
          },
          {
            question: "How do mood check-ins affect replies?",
            answer:
              "Mood check-ins help Amigo adapt tone, pacing, and encouragement so the conversation feels more appropriate for your day.",
          },
        ],
      },
    ],
    footerActions: [
      {
        label: "Still Need Help?",
        href: "/settings/contact-us",
        variant: "primary",
      },
      {
        label: "Send Feedback",
        href: "/settings/send-feedback",
        variant: "secondary",
      },
    ],
  },
  "privacy-policy": {
    title: "Data & Privacy Policy",
    badge: "Trust Layer",
    heroTitle: "Explain how support data is handled without hiding it in legal language",
    description:
      "A readable privacy summary for profile data, mood check-ins, conversation history, and account controls.",
    imageSrc: "/icons/finger-print-img-white.png",
    imageAlt: "Privacy shield",
    sections: [
      {
        type: "text",
        title: "How Amigo Handles Data",
        items: [
          {
            heading: "Profile basics",
            body: "Name, language, and interests help tailor onboarding, settings, and the overall support experience.",
          },
          {
            heading: "Conversation context",
            body: "Saved chats and summaries help you return to past reflections and let the app keep a lighter sense of continuity.",
          },
          {
            heading: "Mood check-ins",
            body: "Daily mood scores help Amigo adjust tone, pacing, and support style before a conversation starts.",
          },
        ],
      },
      {
        type: "list",
        title: "Privacy Principles",
        items: [
          {
            title: "Clarity first",
            description: "Tell people what is stored, why it matters, and where they can change it.",
          },
          {
            title: "Control by default",
            description: "Make key account, security, and messaging choices easy to review and update.",
          },
          {
            title: "Respect sensitive moments",
            description: "Private conversation features should never feel surprising or careless.",
          },
        ],
      },
    ],
    footerActions: [
      {
        label: "Contact About Privacy",
        href: "/settings/contact-us",
        variant: "primary",
      },
      { label: "Back To Settings", href: "/home", variant: "secondary" },
    ],
  },
  "about-amigo": {
    title: "About Amigo GPT",
    badge: "Product Story",
    heroTitle: "A calmer AI companion for text-based emotional wellbeing support",
    description:
      "Amigo is designed to offer supportive conversation, gentle reflection, and a more human-feeling daily check-in flow.",
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
          "Offer gentle text-based support for everyday emotional wellbeing.",
          "Use mood check-ins to adapt tone before a conversation begins.",
          "Keep private, mobile-friendly conversations accessible inside a standalone PWA.",
        ],
      },
    ],
    footerActions: [
      {
        label: "Send Product Feedback",
        href: "/settings/send-feedback",
        variant: "primary",
      },
      { label: "Back To Home", href: "/home", variant: "secondary" },
    ],
  },
  "send-feedback": {
    title: "Send Feedback",
    badge: "Your Voice",
    heroTitle: "Capture what felt supportive, unclear, or emotionally off",
    description:
      "Use feedback to improve reply quality, safety, onboarding clarity, and the overall wellbeing experience.",
    imageSrc: "/icons/robot-slider-img3.png",
    imageAlt: "Feedback form",
    sections: [
      {
        type: "form",
        key: "feedback",
        title: "What should we improve?",
        placeholder:
          "Tell us what felt helpful, what felt confusing, or what would make support feel safer and more human...",
        submitLabel: "Submit Feedback",
        submitToast: "Feedback captured in this session.",
        categories: [
          "Support Quality",
          "Design",
          "Speed",
          "Billing",
          "Trust & Safety",
        ],
      },
      {
        type: "list",
        title: "Useful Feedback Topics",
        items: [
          {
            title: "Reply quality",
            description: "Share when a response felt especially helpful, flat, or off-target.",
          },
          {
            title: "Feature ideas",
            description: "Suggest new tools for reflection, mood tracking, or support routines.",
          },
          {
            title: "Trust and safety",
            description: "Flag moments where wording, pacing, or product behavior should feel more careful.",
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
    heroTitle: "Offer clear paths to help without making support feel cold",
    description:
      "Reach the team for billing questions, account issues, product concerns, or care-experience feedback.",
    imageSrc: "/icons/robot-slider-img2.png",
    imageAlt: "Contact support",
    sections: [
      {
        type: "list",
        title: "Support Channels",
        items: [
          {
            title: "In-app support",
            description: "The fastest path for account access, billing, and app-navigation issues.",
            meta: "Fastest",
            badge: "Recommended",
          },
          {
            title: "Care experience review",
            description: "Use this for feedback on tone, reply quality, or how emotionally safe the app feels.",
            meta: "Thoughtful follow-up",
          },
          {
            title: "Membership and billing help",
            description: "Best for plan questions, credit issues, or checkout follow-up.",
            meta: "Business hours",
          },
        ],
      },
      {
        type: "steps",
        title: "What Happens Next",
        items: [
          "Your request is grouped by topic and urgency.",
          "The team directs you to the fastest helpful path.",
          "Complex issues can roll into a tracked product or support follow-up.",
        ],
      },
    ],
    footerActions: [
      {
        label: "Open Feedback Form",
        href: "/settings/send-feedback",
        variant: "primary",
      },
      { label: "Back To FAQs", href: "/settings/faqs", variant: "secondary" },
    ],
  },
  "invite-friends": {
    title: "Invite Friends",
    badge: "Share Support",
    heroTitle: "Make referrals feel warm, clear, and easy to pass along",
    description:
      "Invite someone who might benefit from a calmer space for reflection and everyday emotional support.",
    imageSrc: "/icons/friend10.jpg",
    imageAlt: "Invite friends",
    sections: [
      {
        type: "referral",
        title: "Your Invite Code",
        code: "AMIGO-2026",
        reward:
          "Give friends 14 days of guided support features and unlock bonus reflections for yourself.",
      },
      {
        type: "steps",
        title: "How It Works",
        items: [
          "Share the code with a friend.",
          "They sign up and complete onboarding.",
          "Referral rewards unlock automatically once the eligibility steps are met.",
        ],
      },
    ],
    footerActions: [
      {
        label: "Copy Invite Code",
        copyText: "AMIGO-2026",
        toast: "Invite code copied.",
        variant: "primary",
      },
      { label: "Back To Home", href: "/home", variant: "secondary" },
    ],
  },
  "account-management": {
    title: "Delete or Deactivate Account",
    badge: "Sensitive Action",
    heroTitle: "Make hard account decisions feel clear and carefully explained",
    description:
      "This screen helps people understand the difference between taking a break, exporting data, and leaving permanently.",
    imageSrc: "/icons/finger-print-img-black.png",
    imageAlt: "Account control",
    sections: [
      {
        type: "destructive",
        title: "Account Actions",
        items: [
          {
            title: "Deactivate account for 30 days",
            description: "Hide your account temporarily while keeping the option to return.",
            buttonLabel: "Deactivate",
          },
          {
            title: "Export my chat archive",
            description: "Prepare a downloadable copy of saved conversations and account preferences.",
            buttonLabel: "Request Export",
          },
          {
            title: "Delete account permanently",
            description: "Remove access and begin a permanent account-removal workflow.",
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
      {
        label: "Talk To Support First",
        href: "/settings/contact-us",
        variant: "primary",
      },
      { label: "Back To Security", href: "/settings/security", variant: "secondary" },
    ],
  },
};
