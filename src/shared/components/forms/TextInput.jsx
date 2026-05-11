export default function TextInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  helpText = "",
  error = "",
  required = false,
}) {
  return (
    <div>
      {label && (
        <label htmlFor={name} className="mb-2 block text-sm font-medium">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
      />

      {helpText && !error && (
        <p className="mt-2 text-xs text-muted-foreground">{helpText}</p>
      )}

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}