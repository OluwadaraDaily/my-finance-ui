export default function TextInput({
  label,
  type = 'text',
  name,
  placeholder,
  value,
  required = true,
  onChange,
  error,
}: {
  label: string
  type?: string
  name: string
  placeholder?: string
  value: string
  required?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}) {
  return (
    <div className="mb-4">
      <label className="block text-gray-500 text-xs font-bold mb-1" htmlFor={label}>
        {label}
      </label>
      <input
        className={`appearance-none border border-beige-500 rounded-lg w-full py-3 px-5 text-gray-500 leading-tight focus:outline-none ${
          error ? 'border-red-500' : ''
        }`}
        id={label}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete="off"
        aria-autocomplete="none"
      />
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </div>
  )
}