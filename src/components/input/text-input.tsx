export default function TextInput({
  label,
  type = 'text',
  name,
  placeholder,
  value,
  required = true,
  onChange,
  error,
  withPrefix = false,
  prefix = "",
}: {
  label: string
  type?: string
  name: string
  placeholder?: string
  value: string
  required?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  withPrefix?: boolean
  prefix?: string
}) {
  return (
    <div>
      <label className="block text-gray-500 text-xs font-bold mb-1" htmlFor={label}>
        {label}
      </label>
      <div className="relative">
        {withPrefix && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {prefix}
          </div>
        )}
        <input
          className={`appearance-none border border-beige-500 rounded-lg w-full py-3 px-5 text-gray-500 leading-tight focus:outline-none ${
            error ? 'border-red-500' : ''
          } ${withPrefix ? 'pl-10' : ''}`}
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
      </div>
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </div>
  )
}