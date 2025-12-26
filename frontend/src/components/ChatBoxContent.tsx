import React, { useState } from "react";
import Image from "next/image";
import ChatBoxMessage from "./ChatBoxMessage";
import type { Message } from "../types/message";
import faqs from "../data/faqs.json";

interface ChatBoxContentProps {
  messages: Message[];
  language: "MK" | "EN";
  onSendMessage: (message: string) => void;
}

const ChatBoxContent: React.FC<ChatBoxContentProps> = ({
  messages,
  language,
  onSendMessage,
}) => {
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  const welcomeText =
    language === "MK"
      ? {
          title: "Ви Асистент",
          body: "Прашај ме се што те интересира за здравство!",
          faqTitle: "Повеќе прашања",
          faqBody: "Често поставени прашања",
          backButton: "Назад кон почеток",
        }
      : {
          title: "AI Assistant",
          body: "Ask me anything you are interested in regarding healthcare!",
          faqTitle: "More questions",
          faqBody: "Frequently Asked Questions",
          backButton: "Back to start",
        };

  return (
    <div className="grow p-5 overflow-y-auto bg-gray-50">
      {messages.length === 0 ? (
        <>
          <div className="relative flex flex-col items-start mb-5 after:bg-gray-200 after:h-px after:w-[90%] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2">
            <div className="flex items-center space-x-1.5">
              <Image
                src="/assistant-avatar.png"
                alt="Assistant Avatar"
                width={52}
                height={52}
              />
              <h2 className="text-sm text-gray-800 mb-1">
                {welcomeText.title}
              </h2>
            </div>
            <div className="bg-white px-1 py-3 rounded-lg mt-2">
              <p className="text-md font-bold text-black">{welcomeText.body}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {!showAllFaqs ? (
              <>
                {/* FAQ Button - Styled exactly like the others */}
                <button
                  onClick={() => setShowAllFaqs(true)}
                  className="flex items-center w-full p-3 group hover:bg-alt-bg-blue transition-colors duration-500 ease-in bg-bg-light border border-gray-200 rounded-2xl text-left text-sm font-medium text-gray-700"
                >
                  <Image
                    className="bg-alt-bg-blue group-hover:bg-bg-light rounded-xl p-2"
                    src="/faq.svg"
                    alt="Stethoscope"
                    width={32}
                    height={32}
                  />
                  <div className="flex flex-col ml-2">
                    <p className="font-normal text-gray-600">
                      {welcomeText.faqTitle}
                    </p>
                    <p className="text-xs font-normal text-component-gray">
                      {welcomeText.faqBody}
                    </p>
                  </div>
                </button>
              </>
            ) : (
              /* FAQ List View */
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-3">
                <button
                  onClick={() => setShowAllFaqs(false)}
                  className="text-xs text-blue-500 font-bold mb-4 flex items-center gap-1 hover:underline"
                >
                  ← {welcomeText.backButton}
                </button>

                {faqs.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => onSendMessage(faq.question)}
                    className="flex items-center w-full p-3 group hover:bg-alt-bg-blue transition-colors duration-300 bg-white border border-gray-200 rounded-2xl text-left text-sm font-medium text-gray-700"
                  >
                    <Image
                      className="bg-alt-bg-blue group-hover:bg-bg-light rounded-xl p-2"
                      src={faq.icon}
                      alt={faq.category}
                      width={32}
                      height={32}
                    />
                    <div className="flex flex-col ml-2">
                      <p className="font-normal text-gray-600">
                        {faq.category}
                      </p>
                      <p className="text-xs font-normal text-component-gray">
                        {faq.question}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatBoxMessage key={msg.id} message={msg} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatBoxContent;
