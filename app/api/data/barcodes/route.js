import { deleteCode, getCodesFormatted } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(){
  return NextResponse.json(await getCodesFormatted());
}

export async function DELETE( request){
  const { code } = await request.json();
  await deleteCode(code);
  return NextResponse.json(await getCodesFormatted());
}