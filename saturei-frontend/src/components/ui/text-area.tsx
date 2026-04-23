import { useState } from "react";

interface TextAreaFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  maxLength?: number;
}

function TextAreaField({
  label,
  placeholder,
  value,
  onChange,
  maxLength = 350,
}: TextAreaFieldProps) {
  const [touched, setTouched] = useState(false);
  const hasError = touched && value.length === 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          {value.length} de {maxLength}
        </p>
      </div>
      <textarea
        placeholder={placeholder}
        className={`w-full resize-none h-27.5 rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
          hasError
            ? "border-red-500 focus:ring-red-500"
            : "border-input focus:ring-orange-500"
        }`}
        maxLength={maxLength}
        value={value}
        onBlur={() => setTouched(true)}
        onChange={(e) => {
          onChange(e.target.value);
          if (e.target.value.length > 0) setTouched(false);
        }}
      />
      {hasError && (
        <div className="flex items-center gap-1 text-red-500 text-sm">
          <span className="inline-flex items-center justify-center size-4 rounded-full bg-red-500 text-white text-xs font-bold">
            ✕
          </span>
          não pode ficar em branco
        </div>
      )}
    </div>
  );
}

export { TextAreaField };
