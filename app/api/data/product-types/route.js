import { getProductTypes } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(){
  return NextResponse.json(await getProductTypes());
}