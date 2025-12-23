"use client";
import Image from "next/image";
import { useState } from "react";
import Button from "./button";

type Props = {
  src: string;
  width: number;
  height: number;
};

export default function Card({ src, width, height }: Props) {
  const [selected, setSelected] = useState<string>("2");

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="h-[22px] font-light flex items-center justify-center">
          New Feature!
        </div>
        <div className="w-[34px] h-[34px] flex items-center justify-center cursor-pointer">
          <Image src={"/Vector.svg"} width={24} height={24} alt="" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-around gap-11  transition-all duration-300 delay-150">
        <div className="w-full h-[329px] flex flex-col items-center justify-center gap-[22px]">
          <div className="w-ful flex flex-col items-center justify-center gap-3.5 font-bold p-5">
            <Image
              src={src}
              width={width}
              height={height}
              alt=""
              className="bg-gray-200 w-[109px] h-[111px] rounded-full"
            />
            <div className="w-full h-[22px] text-center">
              <p>{selected === "2" ? "Hello!" : selected === "1" ? "Здраво!" : ""}</p>
              <p>{selected === "2" ? "I'm, your AI Health Assistant" : selected === "1" ? "Јас сум АИ здравствен асистент" : ""}</p>
            </div>
          </div>
          <div className="w-full h-17 text-center">
            {/* I can help you find information about health service, documents,
            vaccines and more. */}
            {selected === "2" ? "I can help you find information about health service, documents,vaccines and more." :
            selected === "1" ? "Можам да ти помогнам да најдеш информации за здравствени услуги, документи, вакцини и многу повеќе." :
            ""
            }
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-3.5">
            <div className="h-[22px] font-bold">{selected === "2" ? "Select Language" : selected === "1" ? "Одберете јазик" : ""}</div>
            <div className="w-full h-[34px] flex gap-5.5 items-center justify-center">
              <Button
                att="w-1/2"
                selected={selected === "1"}
                onClick={() => setSelected("1")}
              >
                Македонски
              </Button>

              <Button
                att="w-1/2"
                selected={selected === "2"}
                onClick={() => setSelected("2")}
              >
                English
              </Button>
            </div>
          </div>
        </div>
        <Button att="w-full bg-[#3A63AF] text-white border-[#3A63AF]">
          Start Chat!
        </Button>
      </div>
    </>
  );
}
