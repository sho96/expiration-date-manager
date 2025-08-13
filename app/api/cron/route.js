import {
  addExpiredItem,
  addExpiredLeftover,
  getAllItemsFormatted,
  getLeftoversFormatted,
  incrementNumberOfExpirations,
} from "@/utils/database";
import { NextResponse } from "next/server";
export async function GET() {
  const allItems = await getAllItemsFormatted();
  const allLeftovers = await getLeftoversFormatted();

  const previousDate = new Date()
  previousDate.setHours(previousDate.getHours() + 9, 0, 0, 0);
  previousDate.setHours(0, 0, 0, 0);
  console.log(previousDate);

  const expiredItems = allItems.filter(
    (item) => item.expirationDate < previousDate
  );
  const expiredLeftovers = allLeftovers.filter(
    (leftover) => leftover.expirationDate < previousDate
  );

  const newlyExpiredItems = (
    await Promise.all(
      expiredItems.map(async (item) => {
        const notAdded = await addExpiredItem(item.id);
        if (notAdded) {
          return {
            id: item.id,
            name: item.name,
          };
        }
        return null;
      })
    )
  ).filter((item) => item);

  const newlyExpiredLeftovers = (
    await Promise.all(
      expiredLeftovers.map(async (leftover) => {
        const notAdded = await addExpiredLeftover(leftover.id);
        if (notAdded) {
          return {
            id: leftover.id,
            name: leftover.name,
          };
        }
        return null;
      })
    )
  ).filter((leftover) => leftover);

  const totalExpired = newlyExpiredItems.length + newlyExpiredLeftovers.length;

  incrementNumberOfExpirations(
    new Date().toISOString().split("T")[0],
    totalExpired
  );

  console.log("Expired items: ", expiredItems);
  console.log("Expired leftovers: ", expiredLeftovers);
  console.log("Newly expired items: ", newlyExpiredItems);
  console.log("Newly expired leftovers: ", newlyExpiredLeftovers);
  console.log("Total expired: ", totalExpired);

  return NextResponse.json({ success: true });
}
