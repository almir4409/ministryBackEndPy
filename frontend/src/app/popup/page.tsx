import Card from "@/components/IntroChat/card"
import Image from "next/image";

function Home() {
  return (
    <>
      <div className="bg-gray-200 h-screen"></div>
      <div className="fixed bottom-5 right-10 z-50 bg-white w-1/4 p-8.5 rounded-4xl">
        <Card src={"/Pop Up_Icon Componenet.svg"} width={24} height={24}/>
      </div>
    </>
  );
}

export default Home;
