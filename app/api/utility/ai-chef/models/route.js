import { getModels } from "@/utils/server/ai";
import { NextResponse } from "next/server";

export async function GET( request ) {
  const models = await getModels();

  const url = new URL(request.url);
  const detailed = url.searchParams.get('detailed');

  if (!detailed) return NextResponse.json(models.map(modelData => modelData.id).sort());

  return NextResponse.json(models);
}

