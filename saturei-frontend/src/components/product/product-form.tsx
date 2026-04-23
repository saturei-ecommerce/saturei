'use client'

import * as RadioGroup from '@radix-ui/react-radio-group'
import { useEffect, useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { RadioItem } from '@/components/ui/radio'
import { SelectField } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { TextAreaField } from '@/components/ui/text-area'
import { uploadFotosAction } from './actions'
import { TipsDialog } from './alert-atractive'
import { ConfirmPublishDialog } from './alert-publish'
import { PhotoSlot } from './photo-select'

// ─── Schema ───────────────────────────────────────────────────────────────────

const productSchema = z.object({
  title: z.string().min(1, 'título é obrigatório'),
  description: z.string().min(1, 'descrição é obrigatória'),
  price: z
    .string()
    .min(1, 'preço é obrigatório')
    .refine((val) => Number(val) > 0, 'preço deve ser maior que zero'),
  conservationState: z.enum(['USADO', 'NOVO']),
  category: z.string().min(1, 'categoria é obrigatória'),
  location: z.string().min(1, 'localização é obrigatória'),
  imageUrls: z.array(z.string()).min(1, 'adicione pelo menos uma foto'),
})

export type ProductFormData = z.infer<typeof productSchema>

interface OnSubmitProps {
  data: Omit<ProductFormData, 'imageUrls'>
}

interface OnSubmitResponse {
  listingId: string
}

interface ProductFormProps {
  onSubmit: ({ data }: OnSubmitProps) => Promise<OnSubmitResponse>
}

// ─── Upload helpers ───────────────────────────────────────────────────────────

function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, base64] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg'
  const binary = atob(base64)
  const array = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i)
  }
  return new File([array], filename, { type: mime })
}

async function uploadFotos(
  listingId: string,
  fotos: (string | null)[],
): Promise<string[]> {
  const formData = new FormData()

  for (const foto of fotos) {
    if (!foto) continue
    const file = dataUrlToFile(foto, `${crypto.randomUUID()}.jpg`)
    formData.append('files', file)
  }

  const response = await uploadFotosAction(listingId, formData)

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(
      `Erro ao fazer upload das imagens: ${response.status} - ${errorBody}`,
    )
  }

  return response.json() as Promise<string[]>
}

// ─── ProductForm ──────────────────────────────────────────────────────────────

export function ProductForm({ onSubmit }: ProductFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [conservationState, setConservationState] = useState<'USADO' | 'NOVO'>(
    'USADO',
  )
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [fotos, setFotos] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ])
  const [showExtraSlots, setShowExtraSlots] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const fileRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setShowExtraSlots(fotos[0] !== null)
  }, [fotos[0]])

  const handleAdd = (index: number, dataUrl: string) => {
    setFotos((prev) => {
      const u = [...prev]
      u[index] = dataUrl
      return u
    })
  }

  const handleRemove = (index: number) => {
    setFotos((prev) => {
      const u = [...prev]
      u[index] = null
      return u
    })
    const ref = fileRefs.current[index]
    if (ref) ref.value = ''
  }

  const formValues = useMemo(
    () => ({
      title,
      description,
      price,
      conservationState,
      category,
      location,
      imageUrls: fotos.filter((f): f is string => f !== null),
    }),
    [title, description, price, conservationState, category, location, fotos],
  )

  const isFormValid = useMemo(() => {
    return productSchema.safeParse(formValues).success
  }, [formValues])

  const handleSubmit = async () => {
    const result = productSchema.safeParse(formValues)
    if (!result.success) return

    try {
      setIsUploading(true)

      // 1. Cria o listing sem imagens
      const { listingId } = await onSubmit({
        data: result.data,
      })

      // 2. Envia as imagens como multipart/form-data para o backend
      await uploadFotos(listingId, fotos)
    } catch (err) {
      console.error('Erro ao publicar anúncio:', err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex gap-10">
      {/* LEFT: Fotos */}
      <div className="w-65 shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">fotos</p>
          <div className="size-4 rounded-full border border-gray-300" />
        </div>

        <PhotoSlot
          index={0}
          height="h-[180px]"
          foto={fotos[0]}
          onAdd={handleAdd}
          onRemove={handleRemove}
          fileRef={(el) => {
            fileRefs.current[0] = el
          }}
        />

        {showExtraSlots && (
          <div
            className="space-y-3"
            style={{ animation: 'fadeSlideIn 0.3s ease forwards' }}
          >
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <PhotoSlot
                  key={i}
                  index={i}
                  height="h-[90px]"
                  foto={fotos[i]}
                  onAdd={handleAdd}
                  onRemove={handleRemove}
                  fileRef={(el) => {
                    fileRefs.current[i] = el
                  }}
                />
              ))}
            </div>

            <div className="pt-1">
              <p className="text-sm font-semibold">você sabia?</p>
              <p className="text-sm text-muted-foreground mt-1">
                anúncios com 4 ou mais fotos dobram suas chances de venda.
              </p>
              <TipsDialog />
            </div>
          </div>
        )}

        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>

      {/* RIGHT: Form fields */}
      <div className="flex-1 space-y-5">
        {/* Título */}
        <div className="space-y-1">
          <p className="text-sm font-medium">título</p>
          <Input
            type="text"
            placeholder='ex: "Vestido farm sensação" ou "blusa adidas grito da moda"'
            className="h-10"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Descrição */}
        <TextAreaField
          label="descrição"
          placeholder="ex: vestido floral farm, coleção borboletas, em seda colorida, ótimo acabamento, você vai amar. faz muito frio em sp, quase não usei."
          value={description}
          onChange={setDescription}
          maxLength={350}
        />

        <Separator />

        {/* Condição */}
        <RadioGroup.Root
          className="flex items-center gap-8"
          value={conservationState}
          onValueChange={(val) => setConservationState(val as 'USADO' | 'NOVO')}
        >
          <RadioItem value="USADO" id="usado" label="produto usado" />
          <RadioItem value="NOVO" id="novo" label="produto novo" />
        </RadioGroup.Root>

        <Separator />

        {/* Categoria */}
        <SelectField
          label="categoria"
          value={category}
          onValueChange={setCategory}
          options={[
            { value: 'roupas', label: 'roupas' },
            { value: 'calcados', label: 'calçados' },
            { value: 'acessorios', label: 'acessórios' },
          ]}
        />

        <Separator />

        {/* Preço */}
        <div className="space-y-1">
          <p className="text-sm font-medium">preço</p>
          <div className="relative max-w-75">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              R$
            </span>
            <Input
              type="number"
              inputMode="numeric"
              className="h-10 pl-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <Separator />

        {/* Localização */}
        <div className="space-y-1">
          <p className="text-sm font-medium">localização</p>
          <Input
            type="text"
            placeholder='ex: "São Paulo, SP"'
            className="h-10 max-w-75"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <Separator />

        <ConfirmPublishDialog
          onConfirm={handleSubmit}
          disabled={!isMounted || !isFormValid || isUploading}
          isLoading={isUploading}
        />
      </div>
    </div>
  )
}
