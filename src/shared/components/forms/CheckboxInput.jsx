export default function CheckboxInput({
  label,
  name,
  checked,
  onChange,
  helpText = "",
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background p-4 transition hover:bg-muted">
      <input
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 rounded border-input accent-primary"
      />

      <span>
        <span className="block text-sm font-medium">{label}</span>

        {helpText && (
          <span className="mt-1 block text-xs leading-5 text-muted-foreground">
            {helpText}
          </span>
        )}
      </span>
    </label>
  );
}