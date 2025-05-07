export default function PrimaryButton({
  label,
  onClick,
  disabled = false,
  type = "button",
}: {
  label: string
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit"
}) {
  return (
    <button
      className={`w-full text-sm bg-grey-900 text-white font-bold p-4 rounded-lg focus:outline-none focus:shadow-outline hover:cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {label}
    </button>
  )
}