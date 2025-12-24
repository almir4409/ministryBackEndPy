"use client";

import React, { useState } from "react";
import ChatBoxHeader from "./ChatBoxHeader";
import ChatBoxContent from "./ChatBoxContent";
import ChatBoxInput from "./ChatBoxInput";
import type { Message } from "../types/message";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ChatBoxProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  isExpanded,
  onToggleExpand,
  onClose,
}) => {
  // State for language: 'MK' or 'EN'
  const [language, setLanguage] = useState<"MK" | "EN">("MK");

  // Conversation messages
  const [messages, setMessages] = useState<Message[]>([]);

  const handleLanguageToggle = (lang: "MK" | "EN") => {
    setLanguage(lang);
  };

  const handleSendMessage = async (text: string) => {
    const timestamp = Date.now();
    const userMsg: Message = {
      id: `user-${timestamp}`,
      role: "user",
      content: text,
      createdAt: timestamp,
    };

    setMessages((prev) => [...prev, userMsg]);

    // Add AI thinking message
    const thinkingMsg: Message = {
      id: `thinking-${Date.now()}`,
      role: "assistant",
      content: language === "MK" ? "Размислувам..." : "Thinking...",
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, thinkingMsg]);

    try {
      // 2. Send the message to the backend API
      const response = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          top_k: 5,
        }),
      });

      if (!response.ok) throw new Error("Server reached but returned an error");

      const data = await response.json();

      // 3. Add the bot response from the server
      const botReply: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.answer,
        createdAt: Date.now(),
      };

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== thinkingMsg.id).concat(botReply)
      );
    } catch (error: any) {
      // 4. Handle errors
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          language === "MK"
            ? "Грешка: " + error.message
            : "Error: " + error.message,
        createdAt: Date.now(),
      };
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== thinkingMsg.id).concat(errorMsg)
      );
    }
  };

  return (
    <div
      className={`${
        isExpanded
          ? "w-[40vw] h-screen bottom-0 rounded-l-3xl"
          : "w-[31vw] h-[85vh] rounded-3xl"
      } bg-white  shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out`}
    >
      <ChatBoxHeader
        language={language}
        onLanguageToggle={handleLanguageToggle}
        onExpansionToggle={onToggleExpand}
        onClose={onClose}
      />

      <ChatBoxContent
        messages={messages}
        language={language}
        onSendMessage={handleSendMessage}
      />

      <ChatBoxInput onSendMessage={handleSendMessage} language={language} />
    </div>
  );
};

export default ChatBox;
