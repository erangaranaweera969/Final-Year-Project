import { OpenAI } from "openai";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getChatResponse = async (transcript) => {
  const response = await openaiClient.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful AI assistant." },
      { role: "user", content: transcript },
    ],
  });
  return response.choices[0].message.content;
};