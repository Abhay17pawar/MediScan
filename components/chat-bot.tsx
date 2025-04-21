"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Pill } from "lucide-react";
import OpenAI from 'openai';

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isPrescription?: boolean;
};

export default function MedicalChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI medical assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize OpenAI client
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY as string,
    dangerouslyAllowBrowser: true,
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function runChat(prompt: string) {
    let finalPrompt = prompt;
    let isPrescriptionQuery = false;

    // Check for prescription query
    if (/my (prescription|medication|medicine|rx)/i.test(prompt)) {
      isPrescriptionQuery = true;
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        try {
          const res = await fetch(
            `http://localhost:8000/user-prescriptions?user_email=${encodeURIComponent(userEmail)}`
          );
          const data = await res.json();
          if (data?.prescriptions?.[0]?.cleaned_text) {
            finalPrompt = `The user is asking about their prescription. Here are the details:\n${data.prescriptions[0].cleaned_text}\n\nProvide a concise, beautifully formatted response with: 
            - A green prescription card-style presentation
            - Key medications in bold
            - Dosage in italics
            - Dates in small text
            - No extra explanations unless asked`;
          }
        } catch (error) {
          console.error("Prescription fetch error:", error);
        }
      }
    } else {
      finalPrompt = `Respond concisely in markdown format to: ${prompt}`;
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "google/gemini-pro",
        messages: [
          {
            role: "system",
            content: isPrescriptionQuery 
              ? `Format prescription information as a beautiful green card with:
                 - **Medication Name** in bold
                 - *Dosage* in italics
                 - Dates in small text
                 - No extra text unless asked`
              : "Provide concise, professional medical information in markdown format"
          },
          {
            role: "user",
            content: finalPrompt
          }
        ],
      });

      return {
        content: completion.choices[0]?.message?.content || "I couldn't generate a response.",
        isPrescription: isPrescriptionQuery
      };
    } catch (error) {
      console.error("API Error:", error);
      return {
        content: "I'm having trouble responding. Please try again later.",
        isPrescription: false
      };
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const { content, isPrescription } = await runChat(input);
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content,
      timestamp: new Date(),
      isPrescription
    };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <Bot className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Medical Assistant</h1>
        </div>
      </header>

      <div className="flex-1 overflow-hidden max-w-4xl w-full mx-auto py-4 px-4">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto pb-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-lg px-4 py-3 ${message.isPrescription 
                  ? "bg-green-50 border border-green-200" 
                  : message.role === "user" 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-white text-gray-800 rounded-bl-none shadow"}`}
                >
                  <div className="flex items-center mb-1">
                    {message.role === "assistant" ? (
                      message.isPrescription ? (
                        <Pill className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <Bot className="h-4 w-4 mr-2 text-blue-500" />
                      )
                    ) : (
                      <User className="h-4 w-4 mr-2 text-blue-200" />
                    )}
                    <span className="text-xs font-medium">
                      {message.isPrescription ? "Your Prescription" : message.role === "assistant" ? "Assistant" : "You"}
                    </span>
                    <span className="text-xs ml-2 opacity-70">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className={`prose prose-sm max-w-none ${message.isPrescription ? "text-green-800" : ""}`} 
                    dangerouslySetInnerHTML={{
                      __html: message.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-green-700">$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/^### (.*$)/gm, '<h3 class="text-green-700">$1</h3>')
                        .replace(/^## (.*$)/gm, '<h2 class="text-green-700">$1</h2>')
                        .replace(/^# (.*$)/gm, '<h1 class="text-green-700">$1</h1>')
                        .replace(/^- (.*$)/gm, '<li class="flex items-start"><span class="mr-2">•</span>$1</li>')
                        .replace(/\n/g, '<br/>')
                    }} 
                  />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] bg-white text-gray-800 rounded-lg rounded-bl-none px-4 py-3 shadow">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="mt-4 bg-white rounded-xl shadow-md p-3">
            <div className="flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your prescription or health question..."
                className="flex-1 border-0 focus:ring-0 focus:outline-none px-4 py-2 text-gray-800"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="ml-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 disabled:opacity-50 transition"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 px-2">
              For informational purposes only. Consult a doctor for medical advice.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}