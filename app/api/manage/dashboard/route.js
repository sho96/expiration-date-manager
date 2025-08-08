import { NextRequest, NextResponse } from "next/server";
import { getAllItemsFormatted, getLeftovers, getLeftoversFormatted } from "@/utils/database";

export async function GET(){
  const items = await getAllItemsFormatted();
  const leftovers = await getLeftoversFormatted();
  console.log("Returning: ", { items, leftovers });
  return NextResponse.json({ items, leftovers });
}