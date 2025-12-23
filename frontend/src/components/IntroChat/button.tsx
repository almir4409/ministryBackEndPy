type Props = {
  att?: string;
  children: string;
  selected?: boolean;
  onClick?: () => void;
};

export default function Button({
  att = "",
  children,
  selected,
  onClick,
}: Props) {
  const selectionClasses =
    selected === undefined
      ? ""
      : selected
      ? "bg-[#3A63AF] text-white"
      : "bg-white";
  return (
    <div
      className={`${selectionClasses} ${att} border-2 text-center border-[#3A63AF] px-8 py-2 rounded-full cursor-pointer font-medium`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
