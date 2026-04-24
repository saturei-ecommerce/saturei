import { Camera, X } from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'

interface PhotoSlotProps {
  index: number
  height: string
  foto: string | null
  onAdd: (index: number, dataUrl: string) => void
  onRemove: (index: number) => void
  fileRef: (el: HTMLInputElement | null) => void
}

function PhotoSlot({
  index,
  height,
  foto,
  onAdd,
  onRemove,
  fileRef,
}: PhotoSlotProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onAdd(index, ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className={`relative ${height} w-full group`}>
      <button
        type="button"
        className=" relative w-full h-full border border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={() => inputRef.current?.click()}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={(el) => {
            inputRef.current = el
            fileRef(el)
          }}
          onChange={handleChange}
        />
        {foto ? (
          <Image
            src={foto}
            alt={`foto ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 260px"
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <Camera />
          </div>
        )}
      </button>

      {foto && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(index)
          }}
          className="absolute top-1 right-1 z-10 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={12} />
        </button>
      )}
    </div>
  )
}

export { PhotoSlot }
