import { addProduct, getProductFromCode, createOrGetTypeIdFromName, createOrGetProductIdFromName, addCode, getProductTypeFromProductName } from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();
  const { name, type, code } = data;
  console.log("Received: ", name, type, code);

  if (!name || !code) {
    return NextResponse.json({
      error: "Missing name or code"
    })
  }

  const codeExists = await getProductFromCode(code);
  if (codeExists) {
    return NextResponse.json({
      error: "Code already exists"
    })
  }

  let type_id;
  if (type === "") {
    type_id = await getProductTypeFromProductName(name);
    if (!type_id) {
      return NextResponse.json({
        error: "No registered product found. Enter product type to register as a new product"
      })
    }
  } else {
    type_id = await createOrGetTypeIdFromName(type);
  }

  console.log(type_id);

  const product_id = await createOrGetProductIdFromName(name, type_id);

  console.log(product_id);

  console.log(await addCode(code, product_id))

  return NextResponse.json({
    product_id,
    type_id,
  });
}