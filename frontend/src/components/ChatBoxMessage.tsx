import React from "react";
import Image from "next/image";
import { HiOutlineUser } from "react-icons/hi";
import ReactMarkdown from "react-markdown"; // 1. Import the library
import type { Message } from "../types/message";

interface ChatBoxMessageProps {
  message: Message;
}

const ChatBoxMessage: React.FC<ChatBoxMessageProps> = ({ message }) => {
  const isAssistant = message.role === "assistant";

  if (isAssistant) {
    return (
      <div className="flex items-end mb-4">
        <div className="shrink-0 mr-3">
          <Image
            src="/assistant-avatar.png"
            alt="Assistant Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>

        <div className="bg-white rounded-lg max-w-[75%] border border-gray-300 p-4 text-gray-700 shadow-sm">
          {/* 2. Use ReactMarkdown here */}
          <div className="text-sm prose prose-slate max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end justify-end mb-4">
      <div className="bg-primary text-white p-3 rounded-lg max-w-[75%] text-sm shadow-sm">
        {message.content}
      </div>
      <div className="ml-3 shrink-0 flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
        <HiOutlineUser className="text-white w-4 h-4" />
      </div>
    </div>
  );
};

export default ChatBoxMessage;
