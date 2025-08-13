import { addRecipe, getRecipes } from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST( request ){
  const { title, content } = await request.json();
  if (!title || !content) {
    return NextResponse.json({
      error: "Missing title or content"
    })
  }
  await addRecipe(title, content);
  return NextResponse.json({});
}

export async function GET(){
  return NextResponse.json(await getRecipes());
}