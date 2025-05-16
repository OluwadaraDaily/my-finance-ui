export default function DestroyButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="w-full text-sm p-4 rounded-lg bg-app-red text-white font-bold hover:opacity-80 text-center"
      onClick={onClick}
    >
      {label}
    </button>
  );
}