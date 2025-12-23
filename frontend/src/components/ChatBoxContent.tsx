import React from "react";
import Image from "next/image";
import ChatBoxMessage from "./ChatBoxMessage";
import type { Message } from "../types/message";

interface ChatBoxContentProps {
  messages: Message[];
  language: "MK" | "EN";
  onSendMessage: (message: string) => void;
}

const  ChatBoxContent: React.FC<ChatBoxContentProps> = ({
  messages,
  language,
  onSendMessage,
}) => {
  // Helper to determine the welcome text based on language
  const welcomeText =
    language === "MK"
      ? {
          title: "Ви Асистент",
          body: "Прашај ме се што те интересира за здравство!",
        }
      : {
          title: "AI Assistant",
          body: "Ask me anything you are interested in regarding healthcare!",
        };

  return (
    <div className="grow p-5 overflow-y-auto bg-gray-50">
      {messages.length === 0 ? (
        <>
          <div className="relative flex flex-col items-start mb-5 after:bg-gray-200 after:h-px after:w-[90%] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2">
            <div className="flex  items-center space-x-1.5">
              <Image
                className=""
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
            <button
              onClick={() =>
                onSendMessage(
                  language === "MK"
                    ? "Како да аплицирам за платена специјализација или пракса?"
                    : "How can I apply for a paid specialization or practice?"
                )
              }
              className="flex items-center w-full p-3 group hover:bg-alt-bg-blue transition-colors duration-500 ease-in bg-bg-light border border-gray-200 rounded-2xl text-left text-sm font-medium text-gray-700"
            >
              <Image
                className="bg-alt-bg-blue group-hover:bg-bg-light  rounded-xl p-2"
                src="/stethoscope.svg"
                alt="Stethoscope"
                width={32}
                height={32}
              />
              <div className="flex flex-col">
                <p className=" font-normal text-gray-600 ml-2">
                  Специјализации и Пракса
                </p>
                <p className="text-xs font-normal text-component-gray ml-2">
                  Како да аплицирам за платена специјализација или пракса?
                </p>
              </div>
            </button>
            <button
              onClick={() =>
                onSendMessage(
                  language === "MK"
                    ? "Зошто е важно да се следи Календарот за имунизација?"
                    : "Why is it important to follow the Immunization Calendar?"
                )
              }
              className="flex items-center w-full p-3 group hover:bg-alt-bg-blue transition-colors duration-500 ease-in bg-bg-light border border-gray-200 rounded-lg text-left text-sm font-medium text-gray-700"
            >
              <Image
                className="bg-alt-bg-blue  group-hover:bg-bg-light rounded-xl p-2"
                src="/cross.svg"
                alt="Cross"
                width={32}
                height={32}
              />
              <div className="flex flex-col">
                <p className=" font-normal text-gray-600 ml-2">Иминизација</p>
                <p className="text-xs font-normal text-component-gray ml-2">
                  Зошто е важно да се следи Календарот за имунизација?
                </p>
              </div>
            </button>
            <button
              onClick={() =>
                onSendMessage(
                  language === "MK"
                    ? "Кој има право да поведе постапка на БПО со гестациски носител?"
                    : "Who has the right to initiate a surrogacy procedure?"
                )
              }
              className="flex items-center group w-full p-3 bg-bg-light border hover:bg-alt-bg-blue transition-colors duration-500 ease-in border-gray-200 rounded-lg text-left text-sm font-medium text-gray-700"
            >
              <Image
                className="bg-alt-bg-blue group-hover:bg-bg-light rounded-xl p-2 transition-colors duration-300"
                src="/heart.svg"
                alt="Heart"
                width={32}
                height={32}
              />
              <div className="flex flex-col">
                <p className=" font-normal text-gray-600 ml-2">
                  Гестациски носител (БПО)
                </p>
                <p className="text-xs font-normal text-component-gray ml-2">
                  Кој има право да поведе постапка на БПО со гестациски носител?
                </p>
              </div>
            </button>
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
