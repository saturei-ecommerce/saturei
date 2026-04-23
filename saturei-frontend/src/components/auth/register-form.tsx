'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { ErrorMessage } from '@/components/auth/error-message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registerAction } from './actions'

const registerSchema = z.object({
  name: z.string('Nome obrigatório').min(1, 'Nome é obrigatório'),
  email: z
    .email('Email inválido')
    .min(1, 'Email é obrigatório')
    .transform((email) => email.toLowerCase()),
  password: z
    .string('Senha obrigatória')
    .min(1, 'Senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [isOcult, setIsOcult] = useState(false)

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit({ name, email, password }: RegisterFormData) {
    const { success, message } = await registerAction({ name, email, password })

    if (!success) {
      toast.error(message)
      return
    }

    registerForm.reset()

    toast.success(message)

    const params = new URLSearchParams({
      email,
    })

    redirect(`/login?${params.toString()}`)
  }

  const isSubmitting = registerForm.formState.isSubmitting

  return (
    <form onSubmit={registerForm.handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="name"
        control={registerForm.control}
        render={({ field }) => {
          const nameError = registerForm.formState.errors.name

          return (
            <div className="relative space-y-0.5">
              <Mail className="absolute top-3 left-3 size-4 text-accent" />
              <Input
                type="text"
                placeholder="Como podemos te chamar?"
                className="h-10 pl-10"
                disabled={isSubmitting}
                {...field}
              />
              {nameError && <ErrorMessage>{nameError.message}</ErrorMessage>}
            </div>
          )
        }}
      />
      <Controller
        name="email"
        control={registerForm.control}
        render={({ field }) => {
          const emailError = registerForm.formState.errors.email

          return (
            <div className="relative space-y-0.5">
              <Mail className="absolute top-3 left-3 size-4 text-accent" />
              <Input
                type="email"
                placeholder="Digite seu melhor email"
                className="h-10 pl-10"
                disabled={isSubmitting}
                {...field}
              />
              {emailError && <ErrorMessage>{emailError.message}</ErrorMessage>}
            </div>
          )
        }}
      />
      <Controller
        name="password"
        control={registerForm.control}
        render={({ field }) => {
          const passwordError = registerForm.formState.errors.password

          return (
            <div className="relative space-y-0.5">
              <Lock className="absolute top-3 left-3 size-4 text-accent" />
              <Input
                type={isOcult ? 'text' : 'password'}
                placeholder="Digite sua senha segura"
                className="h-10 pl-10"
                disabled={isSubmitting}
                {...field}
              />
              <Button
                type="button"
                variant="ghost"
                className="absolute right-0 top-0 size-10"
                onClick={() => setIsOcult((prev) => !prev)}
              >
                {isOcult ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
              {passwordError && (
                <ErrorMessage>{passwordError.message}</ErrorMessage>
              )}
            </div>
          )
        }}
      />

      <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Criar conta'
        )}
      </Button>
    </form>
  )
}
