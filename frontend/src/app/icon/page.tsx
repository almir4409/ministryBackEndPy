import Image from "next/image";

function Home() {
  return (
    <>
      <Image
        src="/image.png"
        alt="Background"
        fill
        priority 
        className="object-cover -z-10" 
      />
      
    </>
  );
}

export default Home;
