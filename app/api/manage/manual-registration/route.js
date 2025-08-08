import { addProduct, getProducts, getProductsFormatted, registerItem } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(){
  return NextResponse.json(await getProductsFormatted());
}

export async function POST(request) {
  const { product_id, expiration_date } = await request.json();

  if (!product_id || !expiration_date) {
    return NextResponse.json({
      error: "Missing product_id or expiration_date"
    })
  }

  const data = await registerItem(product_id, expiration_date);

  return NextResponse.json(await getProductsFormatted());
}