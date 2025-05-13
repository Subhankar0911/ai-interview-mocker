import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

const config = {
  temperature: 0.7,
  responseMimeType: 'text/plain',
};

const model = 'gemini-1.5-flash';

export async function generateInterviewQuestions(prompt) {
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let fullResponse = '';
  for await (const chunk of response) {
    fullResponse += chunk.text;
  }
  return fullResponse;
}
