import { addExpiredItem, addExpiredLeftover, getAllItemsFormatted, getLeftoversFormatted, incrementNumberOfExpirations } from "@/utils/database";

export async function GET(){
  const allItems = await getAllItemsFormatted();
  const allLeftovers = await getLeftoversFormatted();

  const expiredItems = allItems.filter(item => item.expirationDate < new Date());
  const expiredLeftovers = allLeftovers.filter(leftover => leftover.expirationDate < new Date());

  const newlyExpiredItems = await expiredItems.map(async item => {
    await addExpiredItem(item.id);
  });

  const newlyExpiredLeftovers = await expiredLeftovers.map(async leftover => {
    await addExpiredLeftover(leftover.id);
  });

  const totalExpired = newlyExpiredItems.length + newlyExpiredLeftovers.length;
  
  incrementNumberOfExpirations(new Date().toISOString().split('T')[0], totalExpired);
  
  console.log("Expired items: ", newlyExpiredItems);
  console.log("Expired leftovers: ", newlyExpiredLeftovers);

  return NextResponse.json({ success: true });
}