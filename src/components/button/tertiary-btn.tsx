import Image from "next/image"

export default function TertiaryButton({
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
      className={`w-full text-sm bg-transparent flex items-center gap-3 text-grey-500 border-none focus:outline-none focus:shadow-outline hover:text-grey-900 hover:cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {label}
      <Image
        src="/icons/caret-right-fill.svg"
        alt=""
        width={12}
        height={12}
      />
    </button>
  )
}