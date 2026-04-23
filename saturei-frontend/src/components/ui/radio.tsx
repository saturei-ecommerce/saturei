import { RadioGroup } from "radix-ui";

interface RadioItemProps {
  value: string;
  id: string;
  label: string;
}

function RadioItem({ value, id, label }: RadioItemProps) {
  return (
    <div className="flex items-center gap-2">
      <RadioGroup.Item
        value={value}
        id={id}
        className="size-6 rounded-full border-2 border-gray-300 bg-white focus:outline-none data-[state=checked]:border-primary"
      >
        <RadioGroup.Indicator className="flex items-center justify-center w-full h-full after:block after:size-3 after:rounded-full after:bg-primary" />
      </RadioGroup.Item>
      <label className="text-sm cursor-pointer" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

export { RadioItem };
