import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET( request ) {
  (await cookies()).set({
    name: "session",
    value: "",
    httpOnly: true, // prevents client-side JS from reading it
    secure: true,
    path: "/",
  });

  return NextResponse.redirect(new URL('/', request.nextUrl))
}