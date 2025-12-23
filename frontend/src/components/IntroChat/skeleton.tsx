import Image from "next/image";
type Props = {
  src: string;
  width: number;
  height: number;
}

export default function Skeleton({src,width,height}:Props) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="bg-gray-200 w-1/2 h-[22px] animate-pulse">
        </div>
        <div className="bg-gray-200 w-[34px] h-[34px] animate-pulse">
        </div>
      </div>
      <div className="flex flex-col items-center justify-around gap-11">
        <div className="w-full h-[329px] flex flex-col items-center justify-center gap-[22px]">
          <div className="w-ful flex flex-col items-center justify-center gap-3.5 font-bold p-5">
            <Image 
            src={src} 
            width={width}
            height={height}
            alt=""
            className="bg-gray-200 w-[109px] h-[111px] rounded-full" />
            <div className="w-full h-[22px] text-center">
                <p>Hello!</p>
                <p>I'm your AI Health Assistant</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 h-17 animate-pulse"></div>
          <div className="w-full flex flex-col items-center justify-center gap-3.5 animate-pulse">
            <div className="w-1/3 h-[22px] bg-gray-200"></div>
            <div className="w-full h-[34px] flex gap-5.5">
              <div className="bg-gray-200 w-1/2 h-full"></div>
              <div className="bg-gray-200 w-1/2 h-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-gray-200 h-12 w-full animate-pulse"></div>
      </div>
    </>
  );
}
