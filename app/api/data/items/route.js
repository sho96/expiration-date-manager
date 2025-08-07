import { NextRequest, NextResponse } from "next/server";
import { deleteItem, getAllItemsFormatted } from "@/utils/database";

export async function GET(){
  const items = await getAllItemsFormatted();
  console.log("Returning: ", items);
  return NextResponse.json(items);
}

export async function DELETE( request ){
  const { item_id } = await request.json();

  await deleteItem(item_id);

  const items = await getAllItemsFormatted();
  console.log("Deleted : ", items);
  return NextResponse.json(items);
}