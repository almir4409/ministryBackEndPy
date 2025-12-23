"use client"
import Image from "next/image";
import ChatBox from "@/components/ChatBox";
import { useState } from "react";
import ChatBoxMinimized from "@/components/ChatBotMinimized";

export default function Home() {
  // State for chat expansion
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="relative w-full h-screen ">
      <Image
        src="/image.png"
        alt="Background"
        fill
        priority // Add this if the image is at the top of the page
        className="object-cover -z-10" // -z-10 keeps it behind your content
      />

      {/*Minimized */}
      {!isChatOpen &&(
        <ChatBoxMinimized onOpen={() => setIsChatOpen(true)} />
      )}

      {/*Expanded*/}
      {isChatOpen && (
        <div className={`fixed p-6 transition-all duration-300 ease-in-out ${isExpanded ? "-bottom-6 -right-6" : "bottom-5 right-5"}`}>
          <ChatBox onClose={() => setIsChatOpen(false)} isExpanded={isExpanded} onToggleExpand={() => setIsExpanded(prev => !prev)} />
        </div>
      )}
    </div>
  );
}
