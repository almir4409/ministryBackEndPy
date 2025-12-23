import Image from "next/image";

interface Props {
  onOpen: () => void;
}

const ChatBoxMinimized: React.FC<Props> = ({ onOpen }) => {
  return (
    <div
      className="fixed bottom-5 right-5 cursor-pointer shadow-lg"
      onClick={onOpen}
    >
      <div className="group bg-white px-5 py-4 flex items-center gap-0 hover:gap-3 rounded-xl shadow-lg overflow-hidden transition-all duration-800">
        <Image
          src="/assistant-avatar-noborder.svg"
          alt="Assistant"
          width={28}
          height={36}
        />
        <p className="text-black whitespace-nowrap opacity-0 translate-x-2 max-w-0 overflow-hidden transition-all duration-800 group-hover:opacity-100 group-hover:translate-x-0 group-hover:max-w-50">
          Ви асистент
        </p>
      </div>
    </div>
  );
};

export default ChatBoxMinimized;
