import OpenAI from "https://deno.land/x/openai@v4.53.0/mod.ts";

export default function createOpenAi() {
  return new OpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY")!, // This is the default and can be omitted
  });
}
