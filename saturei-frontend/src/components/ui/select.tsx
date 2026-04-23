import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

function SelectField({
  label,
  options,
  placeholder = "selecione",
  value,
  onValueChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  value?: string;
  onValueChange?: (val: string) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">{label}</p>
      <Select.Root value={value} onValueChange={onValueChange}>
        <Select.Trigger className="h-10 w-full rounded-md bg-gray-100 px-3 text-sm text-muted-foreground flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-ring data-placeholder:text-muted-foreground">
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDown size={16} className="text-muted-foreground" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={4}
            style={{ width: "var(--radix-select-trigger-width)" }}
            className="z-50 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden"
          >
            <Select.Viewport className="max-h-55">
              {options.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt.value}
                  className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-0"
                >
                  <Select.ItemText>{opt.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

export { SelectField };
