export default function TextareaInput({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  helpText = "",
  error = "",
  rows = 5,
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

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full resize-none rounded-lg border border-input bg-background px-3 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
      />

      {helpText && !error && (
        <p className="mt-2 text-xs text-muted-foreground">{helpText}</p>
      )}

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}