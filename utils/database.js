import { createClient } from '@supabase/supabase-js'

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

export async function addCode(code, product_id){
  return (await supabase.from('code_to_product').insert({ id: code, product_id }));
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
  return (await supabase.from('product_type').select().eq('name', name).limit(1).single()).data;
}

export async function createOrGetTypeIdFromName(name) {
  const type_id = await getTypeIdFromName(name);
  if (type_id) {
    return type_id.id;
  } else {
    return await addProductType(name);
  }
}

async function getProductIdFromName(name) {
  return (await supabase.from('product').select().eq('name', name).limit(1).single()).data;
}

export async function createOrGetProductIdFromName(name, type_id){
  const product_id = await getProductIdFromName(name);
  if (product_id) {
    return product_id.id;
  } else {
    return await addProduct(name, type_id);
  }
}

export async function getProductTypeFromProductName(name) {
  return (await supabase.from('product_type').select().eq('name', name).limit(1).single()).data;
}

console.log(await getProductTypes())

export default supabase 