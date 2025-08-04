import { getCodes, getProductFromCode, getProducts, getProductTypes } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
  const product = await getProductFromCode(code);

  console.log(product);

  if (product) {
    return NextResponse.json({
      product_id: product.id,
      created_at: product.created_at,
      name: product.name,
      type: product.type 
    });
  }

  return NextResponse.json({
    product_id: null,
    allProducts: await getProducts(),
    allProductTypes: await getProductTypes()
  });
}