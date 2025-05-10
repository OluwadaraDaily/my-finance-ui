export default function SecondaryButton({
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
      className={`w-full text-lg bg-beige-100 font-bold p-4 rounded-lg focus:outline-none focus:shadow-outline hover:cursor-pointer border-none hover:border-beige-500 hover:bg-white ${
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