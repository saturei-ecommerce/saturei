'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const checkoutSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  paymentMethod: z.enum(['PIX', 'CARD', 'CASH'] as const),
})

export type CheckoutValues = z.infer<typeof checkoutSchema>

export function CheckoutForm({
  onPlaceOrder,
  isPlacing,
}: {
  onPlaceOrder: (values: CheckoutValues) => void | Promise<void>
  isPlacing: boolean
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      address: '',
      paymentMethod: 'PIX',
    },
    mode: 'onSubmit',
  })

  return (
    <form
      onSubmit={handleSubmit(onPlaceOrder)}
      className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-6 flex flex-col gap-5"
    >
      <div>
        <h2 className="text-lg font-extrabold text-[var(--foreground)]">
          Dados para entrega e pagamento
        </h2>
        <p className="text-sm text-[var(--muted)] mt-1">
          Preencha os campos obrigatórios para finalizar.
        </p>
      </div>

      <Field label="Nome" error={errors.name?.message}>
        <input
          {...register('name')}
          type="text"
          autoComplete="name"
          className="
            w-full h-12 px-4 rounded-xl
            bg-white border-2 border-[var(--border)]
            text-[var(--foreground)] text-sm font-medium
            placeholder:text-[var(--muted)] placeholder:font-normal
            focus:outline-none focus:border-[var(--primary)]
            transition-colors
          "
          placeholder="Seu nome completo"
        />
      </Field>

      <Field label="Endereço" error={errors.address?.message}>
        <input
          {...register('address')}
          type="text"
          autoComplete="street-address"
          className="
            w-full h-12 px-4 rounded-xl
            bg-white border-2 border-[var(--border)]
            text-[var(--foreground)] text-sm font-medium
            placeholder:text-[var(--muted)] placeholder:font-normal
            focus:outline-none focus:border-[var(--primary)]
            transition-colors
          "
          placeholder="Rua, número, bairro, cidade"
        />
      </Field>

      <Field label="Forma de pagamento" error={errors.paymentMethod?.message}>
        <select
          {...register('paymentMethod')}
          className="
            w-full h-12 px-4 rounded-xl
            bg-[var(--muted-bg)] border border-[var(--border)]
            text-[var(--foreground)] text-sm font-semibold
            focus:outline-none focus:border-[var(--primary)] focus:bg-white
            transition-colors cursor-pointer
          "
        >
          <option value="PIX">PIX</option>
          <option value="CARD">Cartão</option>
          <option value="CASH">Dinheiro</option>
        </select>
      </Field>

      <button
        type="submit"
        disabled={isPlacing}
        className={`
          h-12 rounded-xl font-semibold transition-colors
          ${
            isPlacing
              ? 'bg-[var(--muted-bg)] text-[var(--muted)] cursor-not-allowed'
              : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]'
          }
        `}
      >
        {isPlacing ? 'Finalizando…' : 'Finalizar pedido'}
      </button>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex flex-col gap-2">
        <span className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-bold text-[var(--foreground)]">
            {label}
          </span>
          {error && (
            <span className="text-xs font-semibold text-red-600">{error}</span>
          )}
        </span>
        {children}
      </label>
    </div>
  )
}
