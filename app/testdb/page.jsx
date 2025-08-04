import { getProductTypes } from "@/utils/database";

export default async function Page() {

  const { data: todos } = await getProductTypes();

  return (
    <ul>
      {todos?.map((todo, i) => {
        console.log(i, todo);
        return <li key={i}>{JSON.stringify(todo)}</li>;
      })}
    </ul>
  );
}
