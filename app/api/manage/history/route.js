import { NextResponse } from "next/server";
import { getHistory, getHistoryRange } from "@/utils/database";

export async function GET(req) {
  const url = new URL(req.url);
  const start = url.searchParams.get("start");

  if (start) {
    return NextResponse.json(await getHistoryRange(start));
  }
  return NextResponse.json(await getHistory());
}
