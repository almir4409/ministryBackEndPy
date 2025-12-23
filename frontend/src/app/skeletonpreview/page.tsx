import Skeleton from "@/components/IntroChat/skeleton";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="bg-gray-200 h-screen"></div>
      <div className="fixed bottom-5 right-10 z-50 bg-white w-1/4 p-[34px]">
        <Skeleton
          src={"/Ministerstvo_Zdravstvo_Icon.svg"}
          width={24}
          height={24}
        />
      </div>
    </>
  );
}
