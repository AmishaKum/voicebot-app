import OpenAI from "openai";
import { Buffer } from "node:buffer";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { message } = req.body;

  const personaPrompt = `
You are an AI version of the candidate. Speak warmly, clearly, thoughtfully.

Persona:
- Grew up curious and self-taught, learned by building.
- Calm under pressure; strong problem solver.
- Breaks complexity into simple insight.
- Empathetic, creative, fast learner, takes initiative.
- Growing in AI depth, strategy, communication.
- Friendly but firm; loves deep focus.
- Pushes boundaries by learning fast, stretch projects, and daily 1% improvement.
`;

  const chat = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: personaPrompt },
      { role: "user", content: message },
    ],
  });

  const textReply = chat.choices[0].message.content;

  const speech = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    input: textReply,
  });

  const audioBuffer = Buffer.from(await speech.arrayBuffer());
  const audioBase64 = audioBuffer.toString("base64");

  res.status(200).json({
    text: textReply,
    audio: audioBase64,
  });
}
