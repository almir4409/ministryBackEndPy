"use client"

import React, { useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import Image from "next/image";

interface ChatBoxHeaderProps {
  language: "MK" | "EN";
  onLanguageToggle: (lang: "MK" | "EN") => void;
  onExpansionToggle: () => void;
  onClose: () => void;
}

const ChatBoxHeader: React.FC<ChatBoxHeaderProps> = ({
  language,
  onLanguageToggle,
  onExpansionToggle,
  onClose
}) => {
  // This is for hovering on expand icon, not for expansion
  const [isHoveringExpand, setIsHoveringExpand] = useState(false);

  

  return (
    <header className="flex justify-between items-center p-4  after:bg-gray-200 after:h-px after:w-[80%] after:absolute  after:top-full after:left-1/2 after:-translate-x-1/2 relative ">
      {/* Language Toggle */}
      <div className="flex items-center text-sm ml-4 mr-auto text-gray-500 ">
        <span
          onClick={() => onLanguageToggle("MK")}
          className={`cursor-pointer transition duration-100 mr-1 ${
            language === "MK"
              ? `text-grey-text bg-backgroupnd-gray px-1 py-0.5 rounded`
              : "hover:text-gray-700"
          }`}
        >
          MK
        </span>
        /
        <span
          onClick={() => onLanguageToggle("EN")}
          className={` cursor-pointer transition duration-100 ml-1 ${
            language === "EN"
              ? `text-grey-text bg-backgroupnd-gray px-1 py-0.5 rounded`
              : "hover:text-gray-700"
          }`}
        >
          EN
        </span>
      </div>

      {/* Maximize and Close Icons */}
      <div className="flex space-x-3 text-gray-400">
        <div
          className="w-5 h-5 cursor-pointer flex items-center justify-center"
          onMouseEnter={() => setIsHoveringExpand(true)}
          onMouseLeave={() => setIsHoveringExpand(false)}
          onClick={onExpansionToggle} 
        >
          <Image
            className={`${isHoveringExpand ? "h-10 w-10" : "h-4 w-4"} transition-all duration-300`}
            src={
              isHoveringExpand
              ? "/expand-arrows-hover.svg"
              : "/expand-arrows.svg"
            }
            alt="Expand Arrows Icon"
            width={32}
            height={32}
          />
        </div>
        <HiOutlineX onClick={onClose} className="w-6 h-6 p-0.5 text-component-gray cursor-pointer rounded-full" />
      </div>
    </header>
  );
};

export default ChatBoxHeader;
