"use client";
import Image from "next/image";
import ChatBox from "@/components/ChatBox";
import { useEffect, useState } from "react";
import ChatBoxMinimized from "@/components/ChatBotMinimized";
import MobileChatWrapper from "@/components/MobileChatWrapper";

export default function Home() {
  // State for chat expansion
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleClose = () => {
    setIsChatOpen(false);
    if (isMobile) {
      setIsExpanded(false); // Reset expansion state on mobile close
    }
  };

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
      {!isChatOpen && <ChatBoxMinimized onOpen={() => setIsChatOpen(true)} />}

      {/*Expanded*/}
      {isChatOpen && (
        <>
          {isMobile ? (
            // Mobile version with swipe and back button support
            <MobileChatWrapper
              isExpanded={isExpanded}
              onToggleExpand={() => setIsExpanded((prev) => !prev)}
              onClose={handleClose}
            >
              <ChatBox
                onClose={handleClose}
                isExpanded={isExpanded}
                onToggleExpand={() => setIsExpanded((prev) => !prev)}
              />
            </MobileChatWrapper>
          ) : (
            // Desktop version (original behavior)
            <div
              className={`fixed md:p-6 transition-all duration-300 ease-in-out ${
                isExpanded ? "-bottom-6 -right-6" : "md:-bottom-3 md:-right-3"
              }`}
            >
              <ChatBox
                onClose={handleClose}
                isExpanded={isExpanded}
                onToggleExpand={() => setIsExpanded((prev) => !prev)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
