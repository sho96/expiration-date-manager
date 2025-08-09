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

export async function addLeftover(name, expiration_date){
  return (await supabase.from('leftovers').insert({ name, expiration_date })).data;
}

export async function getLeftovers(){
  return (await supabase.from('leftovers').select()).data;
}

export async function deleteLeftover(leftover_id){
  return (await supabase.from("leftovers").delete().eq('id', leftover_id)).data;
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

export async function addExpiredItem(item_id){
  //return true if added return false if already exists

  const { data, error } = await supabase
    .from("expired")
    .select()
    .eq("item_id", item_id)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }
  if (data) {
    return false;
  }
  await supabase.from("expired").insert({ item_id });
  return true;
  //return (await supabase.from("expired").insert({ item_id })).data;
}

export async function addExpiredLeftover(leftover_id){
  const { data, error } = await supabase
    .from("expired")
    .select()
    .eq("leftover_id", leftover_id)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }
  if (data) {
    return false;
  }
  await supabase.from("expired").insert({ leftover_id });
  return true;
}

async function removeHistoryRecordOlderThan(date) {
  return (await supabase.from('history').delete().lt('date', date)).data;
}

export async function getOrCreateTodaysHistoryRecord(todayStr){ // YYYY-MM-DD
  //delete history records older than a year
  let yearAgoStr = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0];
  await removeHistoryRecordOlderThan(yearAgoStr);

  let { data, error } = await supabase
    .from('history')
    .select()
    .eq('date', todayStr)
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // not "No rows found"
    throw error;
  }

  if (!data) {
    const insertResult = await supabase
      .from('history')
      .insert({ date: todayStr, expired: 0, saved: 0 })
      .select()
      .single();
    if (insertResult.error) throw insertResult.error;
    data = insertResult.data;
  }

  return data;
}

export async function incrementNumberOfExpirations(dateStr, n=1){ // YYYY-MM-DD
  //increment history record's history.expired with today's history.date
  const history = await getOrCreateTodaysHistoryRecord(dateStr);
  console.log("history: ", JSON.stringify(history));
  const updateResult = await supabase
    .from('history')
    .update({ expired: history.expired + n })
    .eq('date', history.date)
    .select()
    .single();
  if (updateResult.error) throw updateResult.error;
  console.log("updateResult: ", JSON.stringify(updateResult));
  return updateResult.data;
}

export async function incrementNumberOfSaves(dateStr, n=1){ // YYYY-MM-DD
  //increment history record's history.saved with today's history.date
  const history = await getOrCreateTodaysHistoryRecord(dateStr);
  const updateResult = await supabase
    .from('history')
    .update({ saved: history.saved + n })
    .eq('date', history.date)
    .select()
    .single();
  if (updateResult.error) throw updateResult.error;
  return updateResult.data;
}



export async function getHistory(){
  return (await supabase.from('history').select()).data;
}

export async function getHistoryRange(startDateStr){
  return (await supabase.from('history').select().gte('date', startDateStr)).data;
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
  return (await supabase.from('product').select('type').eq('name', name).limit(1).single()).data?.type;
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

export async function getLeftoversFormatted(){
  //id name expirationDate
  const { data, error } = await supabase
    .from('leftovers')
    .select(`
      id,
      name,
      expiration_date
    `);

  if (error) {
    console.error(error);
    return [];
  }

  return data.map(leftover => {
    return {
      id: leftover.id,
      name: leftover.name,
      expirationDate: leftover.expiration_date ? new Date(leftover.expiration_date) : null
    }
  });
}

export default supabase 