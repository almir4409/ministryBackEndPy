import React from "react";
import Image from "next/image";
import { HiOutlineUser } from "react-icons/hi";
import ReactMarkdown from "react-markdown";
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

        <div className="max-w-[75%]">
          {/* Main Answer */}
          <div className="bg-white rounded-lg border border-gray-300 p-4 text-gray-700 shadow-sm">
            <div className="text-sm prose prose-slate max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>

          {/* Sources with Relevance */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <div className="text-xs font-semibold text-blue-700 mb-2">
                📚 Извори (подредени по релевантност):
              </div>
              <div className="space-y-2">
                {message.sources.map((source, index) => {
                  const relevancePercent = Math.round(source.relevance * 100);
                  const rankEmoji = index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉";
                  const colorClass =
                    relevancePercent > 80
                      ? "text-green-600"
                      : relevancePercent > 60
                      ? "text-orange-600"
                      : "text-red-600";

                  return (
                    <div
                      key={index}
                      className="text-xs text-gray-600 flex items-center gap-2"
                    >
                      <span>{rankEmoji}</span>
                      <span className="font-medium">{source.pdf}</span>
                      {source.article && (
                        <span className="text-gray-500">
                          - Член {source.article}
                        </span>
                      )}
                      <span className={`font-bold ${colorClass}`}>
                        ({relevancePercent}% точност)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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