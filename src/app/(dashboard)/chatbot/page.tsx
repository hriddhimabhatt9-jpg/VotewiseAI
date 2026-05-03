"use client";

import { useAuthStore, useLangStore } from "@/store";
import { translations } from "@/lib/data";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatbotPage() {
  const { user } = useAuthStore();
  const { lang } = useLangStore();
  const t = translations[lang];

  const greeting =
    lang === "hi"
      ? `नमस्ते ${user?.fullName?.split(" ")[0] || "जी"}! मैं आपका वोटवाइज एआई सहायक हूँ। मैं मतदाता पंजीकरण, उम्मीदवार की जानकारी और चुनाव संबंधी प्रश्नों में आपकी सहायता कर सकता हूँ।`
      : `Hello ${user?.fullName?.split(" ")[0] || "there"}! I'm your VoteWise AI Assistant. I can help you with voter registration, candidate information, polling locations, and general election queries. How can I assist you today?`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
          🤖 {t.aiAssistant}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {lang === "hi"
            ? "मतदान प्रक्रिया, उम्मीदवारों या अपने अधिकारों के बारे में कुछ भी पूछें।"
            : "Ask anything about the voting process, candidates, or your rights."}
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <ChatWindow
          greeting={greeting}
          userName={user?.fullName || "User"}
          userAvatar={user?.photoURL}
        />
      </div>
    </div>
  );
}
