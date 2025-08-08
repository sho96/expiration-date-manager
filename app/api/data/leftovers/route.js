import { addLeftover, deleteLeftover, getLeftovers, getLeftoversFormatted } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(){
  const leftovers = await getLeftoversFormatted();
  console.log("Returning: ", leftovers);
  return NextResponse.json(leftovers);

}

export async function DELETE( request ){
  const { id } = await request.json();

  await deleteLeftover(id);
  
  return NextResponse.json(await getLeftoversFormatted());
}

export async function POST(request) {
  const { name, expiration_date } = await request.json();
  await addLeftover(name, expiration_date);

  const data = await getLeftoversFormatted();
  return NextResponse.json(data);
}