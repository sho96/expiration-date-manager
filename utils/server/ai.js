import { OpenAI } from "openai";

const openai = new OpenAI({
  baseURL: "https://api.cerebras.ai/v1",
  apiKey: process.env.CEREBRAS_API_KEY,
});

export async function* generate(
  prompt,
  model = "text-davinci-003",
  format = null
) {
  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      response_format: format,
      model: model,
      stream: true,
    });

    for await (const chunk of response) {
      yield chunk.choices[0]?.delta?.content || "";
    }
  } catch (error) {
    console.error(error);
    // You can also yield an error message or throw a new error
    yield `Error: ${error.message}`;
  }
}

export async function getModels() {
  return (await openai.models.list()).data.sort();
}
