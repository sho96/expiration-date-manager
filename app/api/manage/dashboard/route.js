import { NextRequest, NextResponse } from "next/server";
import { getAllItemsFormatted } from "@/utils/database";

export async function GET(){
  const items = await getAllItemsFormatted();
  console.log("Returning: ", items);
  return NextResponse.json(items);
}