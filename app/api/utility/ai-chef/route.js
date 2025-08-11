import { NextResponse } from "next/server";
import { generate } from "@/utils/server/ai";
import { getAllItemsFormatted, getLeftoversFormatted } from "@/utils/database";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  convertToModelMessages,
  
} from "ai";

const termTable = {
  name: {
    en: "name",
    es: "nombre",
    ja: "名前",
  },
  "expiration date": {
    en: "expiration date",
    es: "fecha de caducidad",
    ja: "賞味期限",
  },
  category: {
    en: "category",
    es: "categoría",
    ja: "種類",
  },
  items: {
    en: "items",
    es: "articulos",
    ja: "品目",
  },
  leftovers: {
    en: "leftovers",
    es: "residuos",
    ja: "残り物",
  },
  prompt: {
    en: "Generate a recipe for the given items and leftovers",
    es: "Genera una receta para los artículos y residuos dados",
    ja: "下の品目と残り物を使ってレシピを生成してください",
  },
};

function formattedItemsToString(items, language = "en") {
  return items
    .map(
      (item) =>
        `${termTable["name"][language]}: ${item.name}, ${termTable["category"][language]}: ${item.category}, ${termTable["expiration date"][language]}: ${item.expirationDate}`
    )
    .join("\n");
}

function formattedLeftoversToString(leftovers, language = "en") {
  return leftovers
    .map(
      (leftover) =>
        `${termTable["name"][language]}: ${leftover.name}, ${termTable["expiration date"][language]}: ${leftover.expirationDate}`
    )
    .join("\n");
}

function getPrompt(items, leftovers, language = "en") {
  return `${termTable["prompt"][language]}\n\n${
    termTable["items"][language]
  }:\n${formattedItemsToString(items, language)}\n\n${
    termTable["leftovers"][language]
  }:\n${formattedLeftoversToString(leftovers, language)}`;
}

export async function GET(request) {
  const url = new URL(request.url);
  const language = url.searchParams.get("language") || "en";
  const model = url.searchParams.get("model") || "gpt-oss-120b";

  const items = await getAllItemsFormatted();
  const leftovers = await getLeftoversFormatted();

  //console.log("Items: ", JSON.stringify(items));
  //console.log("Leftovers: ", JSON.stringify(leftovers));

  const prompt = getPrompt(items, leftovers, language);

  console.log("Prompt: ", prompt);
  //console.log("Model: ", model);
  const stream = await generate(prompt, model);


    // TextEncoder objects turn text content
  // into streams of UTF-8 characters.
  // You'll add this encoder to your stream
  const encoder = new TextEncoder();
  // This is the stream object, which clients can read from
  // when you send it as a Function response
  const readableStream = new ReadableStream({
    // The start method is where you'll add the stream's content
    start: async function(controller) {
      for await (const chunk of stream) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
 
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk);
    },
  });
 
  // Finally, send the streamed response. Result:
  // "STREAM ME!" will be displayed in the client
  return new Response(readableStream.pipeThrough(transformStream), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}