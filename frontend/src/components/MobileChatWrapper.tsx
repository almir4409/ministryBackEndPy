/* eslint-disable react-hooks/immutability */
// components/MobileChatWrapper.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import ChatBox from "./ChatBox";

interface MobileChatWrapperProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

const MobileChatWrapper: React.FC<MobileChatWrapperProps> = ({
  isExpanded,
  onToggleExpand,
  onClose,
  children,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const chatWrapperRef = useRef<HTMLDivElement>(null);

  // Handle back button on mobile
  useEffect(() => {
    const handlePopState = () => {
      if (isVisible) {
        handleClose();
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Push state when chat opens to enable back button
    if (isVisible) {
      window.history.pushState({ chatOpen: true }, "");
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isVisible]);

  // Handle swipe down to close
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!chatWrapperRef.current) return;

    const touchCurrentY = e.touches[0].clientY;
    const touchCurrentX = e.touches[0].clientX;
    const deltaY = touchCurrentY - touchStartY.current;
    const deltaX = Math.abs(touchCurrentX - touchStartX.current);

    // Only trigger if vertical swipe (not horizontal) and swiping down
    if (deltaY > 50 && deltaX < 50) {
      chatWrapperRef.current.style.transform = `translateY(${deltaY}px)`;
      chatWrapperRef.current.style.opacity = `${1 - deltaY / 300}`;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!chatWrapperRef.current) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY.current;

    // If swiped down enough, close the chat
    if (deltaY > 100) {
      handleClose();
    } else {
      // Reset position
      chatWrapperRef.current.style.transform = "translateY(0)";
      chatWrapperRef.current.style.opacity = "1";
    }
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
      // Go back in history if we pushed a state
      if (window.history.state?.chatOpen) {
        window.history.back();
      }
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      ref={chatWrapperRef}
      className={`fixed inset-0 z-50 bg-white transition-all duration-300 ease-in-out ${
        isAnimating ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe indicator */}
      <div className="w-full flex justify-center pt-2 pb-1">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
      </div>
      
      {/* Close button for mobile (at top right) */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-gray-700 md:hidden"
        aria-label="Close chat"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {children}
    </div>
  );
};

export default MobileChatWrapper;