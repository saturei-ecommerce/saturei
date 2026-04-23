interface PhotoSlotProps {
  index: number;
  height: string;
  foto: string | null;
  onAdd: (index: number, dataUrl: string) => void;
  onRemove: (index: number) => void;
  fileRef: (el: HTMLInputElement | null) => void;
}
