import { addExpiredItem, addExpiredLeftover, getAllItemsFormatted, getLeftoversFormatted, incrementNumberOfExpirations } from "@/utils/database";
import { NextResponse } from "next/server";
export async function GET(){
  const allItems = await getAllItemsFormatted();
  const allLeftovers = await getLeftoversFormatted();

  const expiredItems = allItems.filter(item => item.expirationDate < new Date());
  const expiredLeftovers = allLeftovers.filter(leftover => leftover.expirationDate < new Date());

  const newlyExpiredItems = (await Promise.all(
    expiredItems.map(async item => {
      return await addExpiredItem(item.id);
    })
  )).filter(leftover => leftover);

  const newlyExpiredLeftovers = (await Promise.all(
    expiredLeftovers.map(async leftover => {
      return await addExpiredLeftover(leftover.id);
    })
  )).filter(leftover => leftover);

  const totalExpired = newlyExpiredItems.length + newlyExpiredLeftovers.length;
  
  incrementNumberOfExpirations(new Date().toISOString().split('T')[0], totalExpired);
  
  console.log("Expired items: ", newlyExpiredItems);
  console.log("Expired leftovers: ", newlyExpiredLeftovers);

  return NextResponse.json({ success: true });
}