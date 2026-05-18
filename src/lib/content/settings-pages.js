export const SETTINGS_PAGE_CONTENT = {
  "banks-cards": {
    title: "Billing Methods",
    badge: "Membership Billing",
    heroTitle: "Keep your renewal methods organized and easy to review",
    description:
      "Use this space to review the cards or accounts linked to SantumAI memberships and chat-credit top-ups.",
    imageSrc: "/icons/plus-robort.png",
    imageAlt: "Billing methods",
    sections: [
      {
        type: "list",
        title: "Saved Methods",
        items: [
          {
            title: "Primary debit card",
            description:
              "Used for membership renewals and one-tap credit top-ups.",
            meta: "Ending in 4821",
            badge: "Default",
          },
          {
            title: "UPI AutoPay",
            description:
              "Available for recurring membership charges when enabled.",
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
            description:
              "Payments are completed on Santum.net before the PWA syncs the latest membership state.",
          },
          {
            title: "Receipts and renewals",
            description:
              "Membership renewals and balance changes are reflected in your notification inbox.",
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
    heroTitle: "Choose how SantumAI should handle renewals and receipts",
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
            description:
              "Reliable fallback for memberships and chat-credit purchases.",
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
            description:
              "Let your current plan renew without interrupting support access.",
            enabled: true,
          },
          {
            key: "lowBalance",
            label: "Warn when balance runs low",
            description:
              "Get notified before credits are too low for another chat.",
            enabled: true,
          },
          {
            key: "receipts",
            label: "Send detailed receipts",
            description:
              "Share billing summaries and plan updates to your chosen inbox.",
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
    title: "Current Plan",
    badge: "Plan Control",
    heroTitle: "Track your membership, renewal cycle, and support access",
    description:
      "Review your current plan, understand what it unlocks, and jump back to live membership checkout when needed.",
    imageSrc: "/icons/plus-robort.png",
    imageAlt: "Membership overview",
    sections: [
      {
        type: "stats",
        title: "Plan Snapshot",
        items: [
          { label: "Plan", value: "Free" },
          { label: "Renewal", value: "Monthly" },
          { label: "Check-ins", value: "Daily" },
        ],
      },
      {
        type: "list",
        title: "Plan Upgrade Gets You:",
        items: [
          {
            title: "Longer conversations",
            description:
              "Keep more context available while you unpack harder moments.",
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
        label: "Upgrade to Standard",
        href: "/plus-subscription",
        variant: "primary",
      },
      { label: "Home", href: "/home", variant: "secondary" },
    ],
  },
  security: {
    title: "Protection",
    badge: "Account Shield",
    heroTitle: "Protect private conversations without making access feel heavy",
    description:
      "A calm security hub for PINs, biometrics, alerts, and account-protection habits.",
    imageSrc: "/icons/finger-print-img-green.png",
    imageAlt: "Security fingerprint",
    sections: [
      {
        type: "list",
        title: "Additional Security",
        items: [
          // {
          //   title: "4-digit security PIN",
          //   description:
          //     "Adds a quick privacy check before returning to sensitive screens.",
          //   meta: "Suggested next step",
          // },
          {
            title: "Fingerprint unlock",
            description:
              "Use local biometrics on supported devices for faster re-entry.",
            meta: "Device ready",
          },
          // {
          //   title: "New device alerts",
          //   description:
          //     "Get notified when your account is opened somewhere new.",
          //   meta: "Enabled",
          //   badge: "Live",
          // },
        ],
      },
      {
        type: "toggles",
        title: "Security Controls",
        items: [
          // {
          //   key: "loginAlerts",
          //   label: "Instant sign-in alerts",
          //   description: "Know right away when a new session is created.",
          //   enabled: true,
          // },
          // {
          //   key: "weeklyDigest",
          //   label: "Weekly account summary",
          //   description: "Receive a simple recap of recent account activity.",
          //   enabled: false,
          // },
          {
            key: "biometricPrompt",
            label: "Fingerprint lock",
            description: "Sign in with fingerprint.",
            enabled: true,
          },
        ],
      },
    ],
    footerActions: [
      // { label: "Create PIN", href: "/create-pin", variant: "secondary" },
      {
        label: "Scan Fingerprint",
        href: "/finger-scan",
        variant: "primary",
      },
    ],
  },
  "marketing-preferences": {
    title: "Message Preferences",
    badge: "Message Control",
    heroTitle: "Choose the updates that actually feel useful",
    description:
      "Control which product, wellbeing, and membership messages you want to receive from SantumAI.",
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
            description:
              "Hear about important product changes and major releases.",
            enabled: true,
          },
          {
            key: "promos",
            label: "Membership offers",
            description:
              "Receive pricing updates or limited membership campaigns.",
            enabled: true,
          },
          {
            key: "tips",
            label: "Weekly reflection tips",
            description:
              "Get small ideas for journaling, emotional check-ins, and calmer routines.",
            enabled: false,
          },
          {
            key: "partnerNews",
            label: "Community updates",
            description:
              "Optional news about guided programs, resources, or partner initiatives.",
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
            question: "'Who', what is Sai?",
            answer:
              "Sai is short for Santum AI. it is an AI-powered mental wellness and psychotherapy support chatbot which provides private conversations to help you manage emotional challenges, and everyday mental wellbeing.",
          },
          {
            question: "Can I chat with SantumAI without buying a plan?",
            answer:
              "Yes. Access depends on your active plan and available chat credits, and the core experience can still work on the free tier when credits are available.",
          },
          {
            question:
              "Is SantumAI a replacement for therapy or emergency care?",
            answer:
              "No. SantumAI is designed for everyday emotional support and reflection, not emergency or crisis response. If you are in immediate danger or need urgent help, contact local emergency services or a licensed crisis resource right away.",
          },
          {
            question: "Will my chat history stay synced across devices?",
            answer:
              "Your saved conversations are tied to your account, so returning on the same account should keep recent sessions available across supported devices.",
          },
          {
            question: "How do mood check-ins affect replies?",
            answer:
              "Mood check-ins help SantumAI adapt tone, pacing, and encouragement so the conversation feels more appropriate for your day.",
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
    heroTitle:
      "Explain how support data is handled without hiding it in legal language",
    description:
      "A readable privacy summary for profile data, mood check-ins, conversation history, and account controls.",
    imageSrc: "/icons/finger-print-img-white.png",
    imageAlt: "Privacy shield",
    sections: [
      {
        type: "text",
        title: "How SantumAI Handles Data",
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
            body: "Daily mood scores help SantumAI adjust tone, pacing, and support style before a conversation starts.",
          },
        ],
      },
      {
        type: "list",
        title: "Privacy Principles",
        items: [
          {
            title: "Clarity first",
            description:
              "Tell people what is stored, why it matters, and where they can change it.",
          },
          {
            title: "Control by default",
            description:
              "Make key account, security, and messaging choices easy to review and update.",
          },
          {
            title: "Respect sensitive moments",
            description:
              "Private conversation features should never feel surprising or careless.",
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
  "about-santumai": {
    title: "About SantumAI",
    badge: "Product Story",
    heroTitle:
      "A calmer AI companion for text-based emotional wellbeing support",
    description:
      "SantumAI is designed to offer supportive conversation, gentle reflection, and a more human-feeling daily check-in flow.",
    imageSrc: "/Logo Source files 21-4/Icon/SVG/Artboard1.svg",
    imageAlt: "SantumAI logo",
    sections: [
      {
        type: "stats",
        title: "Technical Snapshot",
        items: [
          { label: "Model", value: "GPT-4.1" },
          { label: "Version", value: "v2.0.2" },
          { label: "Theme", value: "JSON" },
        ],
      },
      {
        type: "steps",
        title: "What Santum AI Does",
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
  legal: {
    title: "Legal",
    badge: "Terms & Privacy",
    heroTitle: "Review Santum AI terms, conditions, and privacy details",
    description:
      "View the current legal documents that explain Santum AI usage terms, privacy commitments, and data handling.",
    imageSrc: "/Logo Source files 21-4/Icon/SVG/Artboard1.svg",
    imageAlt: "SantumAI logo",
    sections: [
      {
        type: "legal-content",
        title: "Terms Of Use And Privacy Policy",
        description:
          "Read the key legal documents that apply when you use Santum AI.",
        documents: [
          {
            key: "terms",
            label: "Terms",
            title: "Terms Of Use",
            description:
              "These Terms and Conditions govern your access to and use of Santum AI, including the website, applications, AI chatbot, and related services.",
            sections: [
              {
                heading: "1. Acceptance Of Terms And Conditions",
                paragraphs: [
                  "By accessing or using Santum AI in any manner, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions, together with the Privacy Policy and any additional policies referenced here.",
                  "These Terms form a legally binding agreement between you and Santum AI. If you do not agree, you may not use the Services. Continued use of the Services constitutes ongoing acceptance of these Terms.",
                ],
              },
              {
                heading: "2. Nature Of The Services And Important Limitations",
                paragraphs: [
                  "Santum AI is a digital self-guided wellbeing and mental wellness support tool designed to provide general informational content, reflective prompts, and automated responses to support personal wellbeing.",
                  "The Services do not provide medical care, psychological treatment, psychiatric diagnosis, or any other form of regulated professional healthcare advice. Nothing provided through Santum AI should be interpreted as a substitute for consultation with a qualified and registered healthcare professional.",
                  "The Services are not intended for emergency use, crisis intervention, real-time monitoring, or emergency response. If you are experiencing a medical or mental health emergency, or feel at risk of harm to yourself or others, immediately contact emergency services or an appropriate qualified professional.",
                ],
                items: [
                  "Santum AI is not intended for clinical diagnosis requiring an in-office evaluation.",
                  "You should not use Santum AI if you need medication, official documentation, or advice about which drugs or medical treatment may be appropriate for you.",
                  "You should disregard any such medical treatment advice if it is delivered through the Santum AI platform.",
                ],
              },
              {
                heading: "3. Legal Status And User Responsibility",
                paragraphs: [
                  "Santum AI is an informational and self-help platform only and is not a licensed healthcare provider.",
                  "To the fullest extent permitted under South African law, Santum AI disclaims liability for any loss, harm, or damages arising from use of or reliance on the Services.",
                ],
                items: [
                  "Your use of the Services is at your own discretion and risk.",
                  "You are solely responsible for how you interpret and apply any content generated.",
                  "Santum AI does not control or guarantee outcomes based on your use of the Services.",
                ],
              },
              {
                heading: "4. Use Of The Services, Content, And User Responsibility",
                paragraphs: [
                  "All content, outputs, and responses provided through Santum AI are for general informational and educational purposes only and are not professional advice of any kind.",
                  "You confirm that information you provide through Santum AI is accurate, true, current, and complete. You agree to maintain and update this information so it remains accurate, current, and complete.",
                  "You are responsible for maintaining the confidentiality of your device, password, email address, and other security information related to your account. You agree to notify Santum AI immediately of unauthorized use of your device or account.",
                  "You agree that Santum AI will not be liable for loss or damage caused by someone else using your device or account, with or without your consent or knowledge. You are responsible for all activities performed using your account access.",
                ],
                items: [
                  "You are responsible for all inputs, prompts, and content you submit.",
                  "You must ensure you have lawful rights to submit such content.",
                  "You must comply with applicable laws, including POPIA.",
                  "You must not use another person's Santum AI account or use the Services on behalf of another person or organization.",
                  "You must not interfere with Santum AI systems, services, servers, networks, or infrastructure.",
                  "You must not use Santum AI to post, send, or deliver unsolicited advertising, malicious code, unlawful content, abusive content, privacy-invading content, infringing content, or content that may cause harm or encourage criminal activity.",
                  "You must not violate any applicable local, national, or international law, statute, regulation, or ethical code.",
                  "You agree to indemnify Santum AI against claims, losses, liabilities, costs, or expenses arising from your access to or use of the Services, your account activity, your breach of these Terms, non-payment, or your violation of third-party rights.",
                  "You confirm that payment methods used through Santum AI are authorized, accurate, current, and correct, and you authorize Santum AI to bill and charge applicable fees and plan charges.",
                ],
              },
              {
                heading: "5. Use Of Artificial Intelligence",
                paragraphs: [
                  "Santum AI uses automated systems, including artificial intelligence and machine learning models, to provide features such as conversational support, content generation, user interaction analysis, and service personalisation.",
                  "By using Santum AI, you acknowledge that your interactions may be processed by AI Systems and not exclusively by human professionals. AI-generated responses are produced algorithmically and may not always be accurate, complete, or appropriate to your specific circumstances.",
                  "AI Systems do not constitute licensed medical, psychological, or healthcare professionals unless explicitly stated. Any information provided by AI Systems is informational and supportive only and does not replace professional advice, diagnosis, or treatment.",
                ],
                items: [
                  "Information you provide, including potentially sensitive or health-related data, may be processed to generate responses, improve contextual understanding, and enhance performance, safety, and quality.",
                  "Where information constitutes special personal information under POPIA, Santum AI processes it with explicit consent and/or as otherwise permitted by law.",
                  "Santum AI may use automated processing to personalise user experience, recommend content or services, and optimise system performance.",
                  "Santum AI does not make legally binding decisions about users solely based on automated processing without appropriate safeguards.",
                  "De-identified, aggregated, or anonymised interaction data may be used to train and improve AI models and service quality.",
                  "Human oversight may include quality and safety review or escalation pathways where necessary, but not all interactions are monitored in real time.",
                  "AI outputs may contain errors, omissions, or unintended content, may not fully understand context or nuance, and may vary in performance.",
                  "Users must not rely on Santum AI for emergency situations, psychiatric or medical diagnosis without professional verification, or decisions where inaccurate information could result in harm.",
                  "Users are responsible for the information they share and should avoid disclosing unnecessary or excessive sensitive personal data.",
                ],
              },
              {
                heading: "6. Third-Party Services And External Links",
                paragraphs: [
                  "The Services may include links or references to third-party websites or services not owned or controlled by Santum AI. These are provided for convenience only.",
                  "Santum AI does not endorse or control third-party services, is not responsible for their content, accuracy, security, or privacy practices, and is not liable for loss or damage arising from use of such services.",
                  "Your interactions with third parties are solely between you and those parties. You are responsible for reviewing their terms and policies before use.",
                ],
              },
              {
                heading: "7. Privacy And Protection Of Personal Information",
                paragraphs: [
                  "Santum AI processes personal information in accordance with its Privacy Policy and applicable South African law, including POPIA.",
                  "By using the Services, you consent to such processing where lawful and necessary for service delivery and improvement. The Privacy Policy is deemed part of these Terms of Use.",
                ],
                items: [
                  "You are encouraged to review what data is collected.",
                  "You are encouraged to review how data is used.",
                  "You are encouraged to review your rights regarding access, correction, and deletion.",
                ],
              },
              {
                heading: "8. Use By Minors",
                paragraphs: [
                  "The Services are intended for users aged 18 and older. Users under 18 may only use the Services with appropriate parental or guardian consent where required by law.",
                  "Santum AI does not knowingly collect personal information from children under 18. If such data is discovered, it will be deleted where required by law.",
                ],
              },
              {
                heading: "9. Subscription Plans And Usage Limits",
                paragraphs: [
                  "Santum AI offers access through Free, Standard, and Premium plans. Features, pricing, and usage allowances may be described on the Santum AI platform and are incorporated into these Terms by reference.",
                  "The Free Plan provides limited access at no cost and may be subject to limits on session duration, frequency of access, token volume, or message volume. Santum AI may modify or suspend Free Plan access at any time.",
                  "The Standard Plan is a paid monthly subscription with enhanced access relative to the Free Plan, but remains subject to defined usage limits that may be adjusted from time to time upon reasonable notice.",
                  "The Premium Plan is marketed as providing unlimited access. Unlimited refers to the absence of fixed session duration caps, but use remains subject to a reasonable use standard.",
                  "Reasonable use may consider typical user behavior, system integrity, fair access for other users, and prevention of misuse. Excessive use may include continuous conversations, automated interactions, bulk querying, disproportionate prompting, or activity that places undue load on the system.",
                  "Santum AI may modify plan features, pricing, and usage limits at any time, subject to applicable law. Continued use after changes constitutes acceptance of updated terms.",
                ],
              },
              {
                heading: "10. Account Suspension And Termination",
                paragraphs: [
                  "You may stop using the Services at any time and may request account deactivation where applicable.",
                  "Santum AI may suspend or terminate access at its discretion, including where you breach these Terms, where misuse is suspected, or where security, legal, or operational risks arise.",
                  "Santum AI may delete associated data upon termination, subject to legal obligations under POPIA. Certain provisions, including liability, indemnity, and intellectual property provisions, survive termination.",
                ],
              },
              {
                heading: "11. Changes And Disruptions To The Services",
                paragraphs: [
                  "Santum AI may update, modify, suspend, or discontinue parts of the Services at any time to improve functionality, security, compliance, or user experience.",
                  "Where reasonably possible, Santum AI will provide notice of material changes, though this may not always be practical. Santum AI may also remove content where required for safety, legal compliance, or policy enforcement.",
                  "Santum AI depends on power, software, hardware, tools, equipment, and suppliers. While effort is made to maintain reliability and accessibility, no online platform can be guaranteed to be uninterrupted, consistent, timely, accessible, or error-free at all times.",
                ],
              },
              {
                heading: "12. Copyright Disclaimer",
                paragraphs: [
                  "Santum AI website content is developed, serviced, and maintained by affiliated and outsourced providers such as developers, coders, designers, copywriters, ISPs, maintenance providers, hosting providers, and IT support companies.",
                  "Although effort is made to ensure content is authentic and copyright free, Santum AI will not be held liable for erroneous, unauthorized, or unsanctioned material posted on its site.",
                  "Santum AI respects the intellectual property rights of others and expects users to do the same. In accordance with the DMCA, Santum AI will respond promptly to notices of alleged infringement reported to it.",
                ],
              },
              {
                heading: "13. Notices Of Alleged Infringement",
                paragraphs: [
                  "If you are a copyright owner or authorized to act on behalf of one, you may report alleged copyright infringements taking place on or through the website by sending a notice that complies with the following requirements.",
                ],
                items: [
                  "Identify the copyrighted works claimed to have been infringed.",
                  "Identify the material or link claimed to be infringing, including the URL where it may be found where applicable.",
                  "Provide your mailing address, telephone number, and email address if available.",
                  "Include a good faith statement that the disputed use is not authorized by the copyright owner, its agent, or the law.",
                  "Include a statement that the information in the notice is accurate and, under penalty of perjury, that you are the owner or authorized to act on behalf of the owner.",
                  "Provide your full legal name and electronic or physical signature.",
                ],
              },
              {
                heading: "14. Changes To These Terms",
                paragraphs: [
                  "Santum AI may update these Terms from time to time. Where material changes occur, reasonable notice may be provided via platform notifications, website updates, email, or similar communication where appropriate.",
                  "Continued use of the Services after changes become effective constitutes acceptance of the updated Terms. If you do not agree, you must stop using the Services.",
                ],
              },
              {
                heading: "15. Integration With Santum.net",
                paragraphs: [
                  "Santum.net is provided and operated as a separate and independent service from Santum AI, notwithstanding any integration, interoperability, shared branding, or access pathways that may exist between the platforms.",
                  "Access to and use of Santum.net are governed exclusively by the Santum.net Terms of Use and Santum.net Privacy Policy, which are separate from and in addition to these Terms.",
                  "Santum AI and Santum.net may act as separate data controllers or independent responsible parties under relevant data protection laws, including POPIA. Any sharing of personal information between the services will be conducted in accordance with applicable law and each party's privacy policies.",
                  "Santum AI does not assume responsibility or liability for Santum.net operation, availability, content, outputs, or data handling practices except where required by applicable law. In the event of conflict, the Santum.net agreement applies solely to Santum.net, while these Terms continue to govern Santum AI.",
                ],
              },
              {
                heading: "16. Legal Disclaimers, Liability, And Indemnity",
                paragraphs: [
                  "The Services are provided as is and as available. Santum AI makes no warranties, express or implied, regarding accuracy, reliability, availability, or fitness for any purpose.",
                  "To the fullest extent permitted under South African law, Santum AI is not liable for indirect, incidental, consequential, or punitive damages, including loss of data or profits. Where liability cannot be excluded, it is limited to the maximum extent permitted by applicable law.",
                ],
                items: [
                  "You agree to indemnify and hold harmless Santum AI, its directors, employees, and affiliates from claims, damages, losses, or legal costs arising from your use or misuse of the Services.",
                  "You agree to indemnify Santum AI for claims arising from your breach of these Terms.",
                  "You agree to indemnify Santum AI for claims arising from content you submit or share.",
                ],
              },
              {
                heading: "17. General Provisions",
                paragraphs: [
                  "You may not transfer or assign your rights under these Terms without prior written consent. Santum AI may assign its rights where necessary for business or operational reasons.",
                  "If any provision is found unenforceable under South African law, the remaining provisions remain valid and enforceable.",
                ],
              },
            ],
          },
          {
            key: "privacy",
            label: "Privacy",
            title: "Privacy Policy",
            description:
              "This Privacy Policy explains how Santum AI collects, uses, stores, shares, and protects personal information when you use the Services.",
            sections: [
              {
                heading: "1. Introduction And Scope",
                paragraphs: [
                  "Santum AI is committed to protecting your privacy and ensuring that personal information is collected and processed lawfully, transparently, and securely in accordance with the Protection of Personal Information Act, 2013 (POPIA) and other applicable laws.",
                  "This Privacy Policy forms part of the Terms and Conditions of Use. By accessing or using Santum AI, you acknowledge that you have read, understood, and agree to the Terms and Conditions and this Privacy Policy.",
                ],
              },
              {
                heading: "2. Responsible Party",
                paragraphs: [
                  "For purposes of POPIA, Santum AI acts as the Responsible Party for personal information processed through the Services, unless otherwise stated.",
                ],
              },
              {
                heading: "3. Personal Information We Collect",
                paragraphs: [
                  "Santum AI may collect and process several categories of personal information. Some of this may constitute special personal information under POPIA and is processed only with your consent or where permitted by law.",
                ],
                items: [
                  "Identification information such as name, surname, identity number, or passport number.",
                  "Contact information such as email address and phone number.",
                  "Account information such as login credentials and profile data.",
                  "Billing information such as payment and transaction details.",
                  "Technical data such as IP address, device information, and log data.",
                  "Usage data such as interactions with the platform.",
                  "Health and special personal information shared during counselling or chatbot interactions, including mental health-related data.",
                  "Communications data such as messages, session records, and interactions with therapists or the AI system.",
                ],
              },
              {
                heading: "4. Purpose Of Processing",
                paragraphs: [
                  "Santum AI processes personal information to operate, maintain, improve, and personalize the Services, and to comply with legal and regulatory requirements.",
                ],
                items: [
                  "Create and manage user accounts.",
                  "Provide and operate the Services.",
                  "Facilitate AI-based interactions and, where applicable, therapy-related services.",
                  "Communicate with users, including support and service updates.",
                  "Process payments and manage billing.",
                  "Match users with appropriate services or professionals.",
                  "Monitor, maintain, and improve service quality and effectiveness.",
                  "Personalise user experience and content.",
                  "Conduct analytics and platform optimisation.",
                  "Comply with legal and regulatory obligations and respond to lawful requests from authorities.",
                ],
              },
              {
                heading: "5. Lawful Basis For Processing",
                paragraphs: [
                  "Santum AI processes personal information in accordance with POPIA on lawful grounds.",
                ],
                items: [
                  "Your consent.",
                  "Performance of a contract with you.",
                  "Compliance with a legal obligation.",
                  "Protection of your legitimate interests or those of Santum AI.",
                ],
              },
              {
                heading: "6. Sharing Of Personal Information",
                paragraphs: [
                  "Santum AI does not sell personal information. Personal information may be shared only where appropriate for service delivery, compliance, or support.",
                  "All third parties are bound by confidentiality and data protection obligations.",
                ],
                items: [
                  "Service providers and contractors, including hosting, analytics, and payment processors.",
                  "Professional service providers, including legal, audit, and compliance providers.",
                  "Authorities or regulators where required by law.",
                  "Therapists or professionals where applicable to service delivery.",
                ],
              },
              {
                heading: "7. AI Processing Of Personal Information",
                paragraphs: [
                  "Santum AI uses automated systems, including AI and machine learning models, to provide conversational support, content generation, user interaction analysis, and service personalisation.",
                  "By using Santum AI, you acknowledge that interactions with the platform may be processed by AI Systems and not exclusively by human professionals.",
                ],
                items: [
                  "Information shared during interactions, including sensitive or health-related data, may be processed to generate responses and facilitate conversations.",
                  "Information may be processed to improve relevance and contextual understanding.",
                  "Information may be processed to enhance system performance, safety, and quality.",
                  "Where information is special personal information under POPIA, Santum AI processes it with explicit consent and/or as otherwise permitted by law.",
                ],
              },
              {
                heading: "8. International Transfers",
                paragraphs: [
                  "Personal information may be transferred to and stored outside South Africa. Where this occurs, Santum AI will ensure the recipient is subject to laws or agreements providing an adequate level of protection, or that you have consented to the transfer.",
                ],
              },
              {
                heading: "9. Data Security",
                paragraphs: [
                  "Santum AI implements appropriate technical and organisational measures to protect personal information, including encryption, access controls, and secure infrastructure.",
                  "No system is completely secure. While Santum AI takes reasonable steps, absolute security of information transmitted electronically cannot be guaranteed.",
                ],
              },
              {
                heading: "10. Data Breach And Risk Acknowledgment",
                paragraphs: [
                  "In the event of a security compromise, Santum AI will comply with POPIA requirements, including notification to affected users and the Information Regulator where applicable.",
                ],
              },
              {
                heading: "11. Indemnity And Limitation Of Liability For Data Breach",
                paragraphs: [
                  "Santum AI implements reasonable technical and organisational measures to safeguard personal information in accordance with applicable data protection laws, including POPIA.",
                  "You acknowledge that no method of transmission over the internet or electronic storage is completely secure, and that use of digital services involves inherent risks.",
                  "Santum AI shall not be liable for indirect, incidental, consequential, or special damages arising from unauthorised access to or disclosure of personal information, provided Santum AI has complied with applicable legal obligations and implemented reasonable safeguards.",
                  "Nothing in this clause excludes or limits liability where it cannot be excluded under applicable law, including liability arising from gross negligence, wilful misconduct, or breach of statutory obligations under POPIA.",
                ],
                items: [
                  "You agree to indemnify Santum AI for claims arising from failure to maintain account credential confidentiality.",
                  "You agree to indemnify Santum AI for unauthorized access resulting from your own actions or omissions.",
                  "You agree to indemnify Santum AI for unlawful or improper use of the Services.",
                  "You agree to indemnify Santum AI for third-party claims arising from information you provide through the Services.",
                ],
              },
              {
                heading: "12. Data Retention",
                paragraphs: [
                  "Santum AI retains personal information only for as long as necessary to fulfil the purposes outlined in this Policy, comply with legal obligations, resolve disputes, and enforce agreements.",
                ],
              },
              {
                heading: "13. Cookies And Tracking Technologies",
                paragraphs: [
                  "Santum AI uses cookies and similar technologies to enable platform functionality, authenticate users, and analyse usage and performance.",
                  "You may disable cookies via browser settings, but doing so may impact functionality.",
                ],
              },
              {
                heading: "14. Your Rights Under POPIA",
                paragraphs: [
                  "You have rights under POPIA regarding your personal information. Requests can be submitted via the contact details below.",
                ],
                items: [
                  "Access your personal information.",
                  "Request correction or deletion.",
                  "Object to processing.",
                  "Withdraw consent.",
                  "Lodge a complaint with the Information Regulator of South Africa.",
                ],
              },
              {
                heading: "15. Minors",
                paragraphs: [
                  "Santum AI does not knowingly collect personal information from individuals under 18 without appropriate parental or guardian consent.",
                ],
              },
              {
                heading: "16. Third-Party Links And Services",
                paragraphs: [
                  "The Services may contain links to third-party platforms. Santum AI is not responsible for their privacy practices.",
                ],
              },
              {
                heading: "17. Professional Disclosure Obligations",
                paragraphs: [
                  "Where services involve licensed professionals, they may be legally required to disclose information in certain circumstances.",
                ],
                items: [
                  "Risk of harm to self or others.",
                  "Abuse of vulnerable persons.",
                  "Court orders or legal requirements.",
                ],
              },
              {
                heading: "18. Limitation Of Liability",
                paragraphs: [
                  "To the maximum extent permitted by South African law, Santum AI shall not be liable for indirect or consequential damages arising from use of the Services or processing of personal information, except where such limitation is not permitted by law.",
                ],
              },
              {
                heading: "19. Updates To This Policy",
                paragraphs: [
                  "Santum AI may update this Privacy Policy from time to time. Continued use of the Services constitutes acceptance of the updated version.",
                ],
              },
              {
                heading: "20. Contact Information",
                paragraphs: [
                  "For privacy-related queries or to exercise your rights, please contact Santum AI at admin@santumai.co.za.",
                ],
              },
            ],
          },
        ],
      },
    ],
    footerActions: [
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
          "Tell us what felt helpful, what felt confusing, or what would make Sai feel safer and more human...",
        submitLabel: "Submit Feedback",
        submitToast: "Feedback captured in this session.",
        categories: [
          "Talk Time",
          "Design",
          "Speed",
          "Billing",
          "Trust & Safety",
          "Chat Quality",
        ],
      },
      {
        type: "list",
        title: "Useful Feedback Topics",
        items: [
          {
            title: "Reply quality",
            description:
              "Share when a response felt especially helpful, flat, or off-target.",
          },
          {
            title: "Feature ideas",
            description:
              "Suggest new tools for reflection, mood tracking, or support routines.",
          },
          {
            title: "Trust and safety",
            description:
              "Flag moments where wording, pacing, or product behavior should feel more careful.",
          },
        ],
      },
    ],
    footerActions: [
      {
        label: "Contact Team",
        href: "/settings/contact-us",
        variant: "secondary",
      },
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
            description:
              "The fastest path for account access, billing, and app-navigation issues.",
            meta: "Fastest",
            badge: "Recommended",
          },
          {
            title: "Care experience review",
            description:
              "Use this for feedback on tone, reply quality, or how emotionally safe the app feels.",
            meta: "Thoughtful follow-up",
          },
          {
            title: "Membership and billing help",
            description:
              "Best for plan questions, credit issues, or checkout follow-up.",
            meta: "Business hours",
          },
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
        code: "SANTUMAI-2026",
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
        copyText: "SANTUMAI-2026",
        toast: "Invite code copied.",
        variant: "primary",
      },
      { label: "Back To Home", href: "/home", variant: "secondary" },
    ],
  },
  "account-management": {
    title: "Pause or Delete",
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
            title: "Pause account for 30 days",
            description:
              "Hide your account temporarily while keeping the option to return.",
            buttonLabel: "Pause",
          },
          {
            title: "Export my chat archive",
            description:
              "Prepare a downloadable copy of saved conversations and account preferences.",
            buttonLabel: "Request Export",
          },
          {
            title: "Delete account permanently",
            description:
              "Remove access and begin a permanent account-removal workflow.",
            buttonLabel: "Delete Forever",
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
      {
        label: "Back To Home",
        href: "/home",
        variant: "secondary",
      },
    ],
  },
};
