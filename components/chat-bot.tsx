"use client";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { useState } from "react";

const MODEL_NAME = process.env.NEXT_PUBLIC_GEMINI_MODEL as string;
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;

export default function Home() {
  const [data, setData] = useState<string>("");

  async function runChat(prompt: string) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.7,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [{ text: "HELLO" }],
        },
        {
          role: "model",
          parts: [{ text: "Hello there! How can I assist you today?" }],
        },
      ],
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    setData(response.text());
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = (event.target as HTMLFormElement)?.prompt?.value || "";
    runChat(prompt);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-start p-6">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-blue-900 mb-6 text-center">
          🩺 AI Medical Assistant
        </h1>

        <form
          onSubmit={onSubmit}
          className="bg-white p-6 rounded-xl shadow-md mb-8"
        >
          <label className="block text-gray-700 text-lg mb-2">
            Describe your symptoms or ask a medical question:
          </label>
          <input
            type="text"
            placeholder="e.g. I have a sore throat and mild fever"
            name="prompt"
            className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
          >
            Get Advice
          </button>
        </form>

        {data && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              🧾 Medical Advice
            </h2>
            <div
              className="prose prose-blue max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: formatResponse(data) }}
            />
          </div>
        )}
      </div>
    </main>
  );
}

function formatResponse(text: string) {
  // Add basic formatting for lists and bold text
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
    .replace(/\n/g, "<br/>") // line breaks
    .replace(/- (.*?)(<br\/>|$)/g, "<li>$1</li>") // list items
  return formatted;
}
