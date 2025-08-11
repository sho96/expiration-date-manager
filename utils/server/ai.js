import Cerebras from "@cerebras/cerebras_cloud_sdk";

const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY, // This is the default and can be omitted
});

export async function generate(prompt, model="qwen-3-32b", format=null) {
  const stream = await client.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    response_format: format,
    model: model,
    stream: true,
  });

  if (stream.error) {
    throw new Error(stream.error.message);
  }
  console.log("Stream: ", stream);

  return chatCompletionToReadableStream(stream);
}

async function *chatCompletionToReadableStream(chatCompletionStream){
  for await (const chunk of chatCompletionStream) {
    yield chunk.choices[0]?.delta?.content || '';
  }
}