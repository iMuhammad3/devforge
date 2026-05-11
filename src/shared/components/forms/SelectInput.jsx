export default function SelectInput({
  label,
  name,
  value,
  onChange,
  options = [],
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

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        {options.map((option) => {
          const optionValue =
            typeof option === "string" ? option : option.value;

          const optionLabel =
            typeof option === "string" ? option : option.label;

          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>

      {helpText && !error && (
        <p className="mt-2 text-xs text-muted-foreground">{helpText}</p>
      )}

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}