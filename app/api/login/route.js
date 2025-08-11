import { cookies } from "next/headers";

export async function POST( request ) {
  const { session, nDays } = await request.json();

  (await cookies()).set({
    name: "session",
    value: session,
    httpOnly: true, // prevents client-side JS from reading it
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * Math.min(nDays, 7)
  });

  return new Response("Cookie set!", { status: 200 });
}