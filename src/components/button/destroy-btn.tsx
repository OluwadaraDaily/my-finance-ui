export default function DestroyButton({
  label,
  onClick,
  ...props
}: {
  label: string;
  onClick: () => void;
  [key: string]: unknown;
}) {
  return (
    <button
      className="w-full text-sm p-4 rounded-lg bg-app-red text-white font-bold hover:opacity-80 text-center"
      onClick={onClick}
      {...props}
    >
      {label}
    </button>
  );
}