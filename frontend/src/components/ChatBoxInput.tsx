import React, { useState } from "react";
import { HiOutlinePaperAirplane } from "react-icons/hi";

interface ChatBoxInputProps {
  onSendMessage: (text: string) => void;
  language?: "MK" | "EN";
}

const ChatBoxInput: React.FC<ChatBoxInputProps> = ({
  onSendMessage,
  language,
}) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <footer className="flex p-4 ">
      <form onSubmit={handleSubmit} className="flex grow">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            language === "MK" ? "Внеси порака..." : "Type a message..."
          }
          className="grow py-2 text-grey-text px-4 border border-gray-400 rounded-xl text-sm focus:outline-none focus:border-primary mr-3"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-10 h-10 rounded-xl bg-alt-bg-blue text-primary flex justify-center items-center shrink-0 disabled:bg-gray-200 disabled:text-gray-300 transition-colors duration-300"
        >
          <HiOutlinePaperAirplane className="w-5 h-5   rotate-60" />
        </button>
      </form>
    </footer>
  );
};

export default ChatBoxInput;
