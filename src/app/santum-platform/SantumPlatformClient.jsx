"use client";

import StepPageShell from "@/components/app/StepPageShell";

const platformOffers = [
  {
    title: "All-In-One",
    description:
      "Santum platform offers a complete all-in-one mental health service. In addition to your live scheduled sessions, you get access to self-help courses, free wellness apps and free wellness audio. The help you receive is from verified and experienced professionals. All of the therapists are licensed and matched with each individual's personal needs. You can rest assured that there is a designated therapist for you.",
  },
  {
    title: "Anonymity",
    description:
      "To remain anonymous, you can open your membership account with an alias or a nickname. Even if you use your proper name, Santum will never release your personal information. Online counselling allows you to conduct therapy away from prying eyes or potential outside interference, and get the results in a way that feels both discreet and natural.",
  },
  {
    title: "Convenience",
    description:
      "An in-depth online therapy session can rarely be achieved during our busy lives already packed with schedules. Many places of employments will not allow for the necessary time off each week. With online therapy you can work from a preferred location and within your own timeframe.",
  },
  {
    title: "Affordability",
    description:
      "In-office therapy can be very expensive. Your finances should not affect your access to a healthier and happier life. Santum recognizes that. When compared to the cost of the in-office therapy sessions which could be thousands of Rands, therapy online is significantly cheaper for the same outcome. Basic membership is free, and scheduled sessions are offered on affordable pay-as-you-go basis.",
  },
];

const platformFeatures = [
  "Choice of Therapist Expertise",
  "Therapist Matching",
  "Real-Time Video or Chat Sessions",
  "Anytime Messaging",
  "Professional Assessments",
  "Live Session Scheduling",
  "Free Wellness Apps",
  "Free Wellness Audio",
  "Self-Help Books",
];

function Bullet() {
  return <span className="mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#00D061]" />;
}

export default function SantumPlatformClient() {
  return (
    <StepPageShell title="Santum Platform" contentClassName="overflow-y-auto">
      <div className="space-y-5">
        <div className="space-y-3 px-1">
          <h2 className="theme-text-primary text-[18px] font-semibold leading-7">
            Get help from human therapist
          </h2>
          <h3 className="theme-text-primary text-[17px] font-semibold leading-6">
            What does Santum platform offer
          </h3>
        </div>

        <div className="space-y-4">
          {platformOffers.map((offer) => (
            <article
              key={offer.title}
              className="theme-card flex gap-4 rounded-[22px] border px-4 py-4 sm:px-5"
            >
              <Bullet />
              <div className="min-w-0 flex-1">
                <h4 className="theme-text-primary text-[15px] font-semibold leading-6">
                  {offer.title}
                </h4>
                <p className="theme-text-secondary mt-1 font-satoshi text-[14px] leading-5 sm:text-[15px] sm:leading-6">
                  {offer.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <section className="pt-1">
          <h3 className="theme-text-primary mb-4 px-1 text-[18px] font-semibold leading-7">
            What You Get
          </h3>

          <div className="theme-card rounded-[22px] border px-4 py-4 sm:px-5">
            <ul className="space-y-3">
              {platformFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-4">
                  <Bullet />
                  <span className="theme-text-primary min-w-0 font-satoshi text-[15px] font-semibold leading-6">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </StepPageShell>
  );
}
