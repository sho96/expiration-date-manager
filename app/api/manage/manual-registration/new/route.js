import { createOrGetProductIdFromName, createOrGetTypeIdFromName, getProductsFormatted, getProductTypeFromProductName } from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();
  const { name, type } = data;
  console.log("Received: ", name, type);

  if (!name || !type) {
    return NextResponse.json({
      error: "Missing name or type"
    })
  }

  const exists = (await getProductTypeFromProductName(type));
  if (exists) {
    return NextResponse.json({
      error: "Product already exists"
    })
  }

  const type_id = await createOrGetTypeIdFromName(type);
  const product_id = await createOrGetProductIdFromName(name, type_id);

  console.log(product_id, type_id);

  return NextResponse.json(await getProductsFormatted());

}
