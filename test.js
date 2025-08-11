import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { configDotenv } from "dotenv";

configDotenv();

const client = new Cerebras({
  apiKey: process.env['CEREBRAS_API_KEY'], // This is the default and can be omitted
});

async function main() {
  const stream = await client.chat.completions.create({
    messages: [{ role: 'user', content: 'Why is fast inference important?' }],
    model: 'gpt-oss-120b',
    stream: true,
  });
  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
  }
}

main();