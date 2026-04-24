import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // (optional) verify with WordPress
    // const res = await fetch(
    //   `${process.env.WP_API_URL}/wp-json/wp/v2/users/me`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   },
    // );

    // if (!res.ok) {
    //   return NextResponse.json({ authenticated: false }, { status: 401 });
    // }

    // const user = await res.json();

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
