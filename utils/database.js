import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
}
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export async function addProductType(name) {
  return (await supabase.from('product_type').insert({ name })).data;
}

export async function getProductTypes() {
  return (await supabase.from('product_type').select()).data;
}

export async function addProduct(name, productTypeId) {
  return (await supabase.from('product').insert({ name, type: productTypeId })).data;
}

export async function getProducts() {
  return (await supabase.from('product').select()).data;
}

export async function registerItem(product_id, expiration_date) {
  return (await supabase.from('item').insert({ product_id, expiration_date })).data;
}

export async function deleteItem(item_id){
  return (await supabase.from("item").delete().eq('id', item_id)).data;
}

export async function addCode(code, product_id){
  return (await supabase.from('code_to_product').insert({ id: code, product_id }));
}

export async function deleteCode(code){
  return (await supabase.from("code_to_product").delete().eq("id", code)).data;
}

export async function getCodes(){
  return (await supabase.from('code_to_product').select()).data;
}

export async function getProductFromCode(code){
  const { data, error } = await supabase
  .from('code_to_product')
  .select(`
    id,
    created_at,
    product:product_id (
      id,
      name,
      type,
      created_at
    )
  `)
  .eq('id', code);

  if (error) {
    console.error(error);
    return null;
  }
  if (data.length > 0) {
    return data[0].product;
  }
  return null;
}

async function getTypeIdFromName(name){
  const data = (await supabase.from('product_type').select().eq('name', name).limit(1).single()).data;
  console.log("getTypeIdFromName: ", name, data);
  return data ? data.id : null;
}

export async function createOrGetTypeIdFromName(name) {
  const type_id = await getTypeIdFromName(name);
  if (type_id) {
    return type_id;
  } else {
    await addProductType(name);
    return await getTypeIdFromName(name);
  }
}

async function getProductIdFromName(name) {
  const data = (await supabase.from('product').select().eq('name', name).limit(1).single())?.data;
  console.log("getProductIdFromName: ", name, data);
  return data ? data.id : null;
}

export async function createOrGetProductIdFromName(name, type_id){
  const product_id = await getProductIdFromName(name);
  if (product_id) {
    return product_id;
  } else {
    await addProduct(name, type_id);
    return await getProductIdFromName(name);
  }
}

export async function getProductTypeFromProductName(name) {
  return (await supabase.from('product_type').select().eq('name', name).limit(1).single()).data;
}

export async function getAllItemsFormatted(){
  //id name typeName expirationDate
  const { data, error } = await supabase
    .from('item')
    .select(`
      id,
      expiration_date,
      product (
        id,
        name,
        type:product_type (
          id,
          name
        )
      )
    `);

  console.log(data);

  if (error) {
    console.error(error);
    return [];
  }

  return data.map(item => {
    console.log(item.product?.type?.name);
    console.log(item)
    return {
      id: item.id,
      name: item.product?.name,
      category: item.product?.type?.name,
      expirationDate: item.expiration_date ? new Date(item.expiration_date) : null
    }
  });

}

export async function getProductsFormatted(){
  //id name type.name
  const { data, error } = await supabase
    .from('product')
    .select(`
      id,
      name,
      type:product_type (
        id,
        name
      )
    `);

  if (error) {
    console.error(error);
    return [];
  }

  return data.map(product => {
    return {
      id: product.id,
      name: product.name,
      category: product.type?.name
    }
  });
}

export async function getCodesFormatted(){
  //id product.name
  const { data, error } = await supabase
    .from('code_to_product')
    .select(`
      id,
      product:product_id (
        name
      )
    `);

  if (error) {
    console.error(error);
    return [];
  }

  return data.map(code => {
    return {
      id: code.id,
      name: code.product?.name
    }
  });
}

export default supabase 