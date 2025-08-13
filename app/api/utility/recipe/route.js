import { getRecipes } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(){
  return NextResponse.json(await getRecipes());
}