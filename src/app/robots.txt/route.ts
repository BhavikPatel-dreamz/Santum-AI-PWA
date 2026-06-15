import { NextResponse } from "next/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://santum-ai-pwa.vercel.app";

export function GET() {
  const content = `User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
