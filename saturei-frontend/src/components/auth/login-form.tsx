'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { loginAction } from './actions'
import { ErrorMessage } from './error-message'

const loginSchema = z.object({
  email: z
    .email('Email inválido')
    .min(1, 'Email é obrigatório')
    .transform((email) => email.toLowerCase()),
  password: z
    .string('Senha obrigatória')
    .min(1, 'Senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const searchParams = useSearchParams()

  const emailAfterRegister = searchParams.get('email') ?? ''

  const [isOcult, setIsOcult] = useState(false)

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: emailAfterRegister,
      password: '',
    },
  })

  async function onSubmit({ email, password }: LoginFormData) {
    const { success, message } = await loginAction({ email, password })

    if (!success) {
      toast.error(message)
      return
    }

    loginForm.reset()

    toast.success(message)

    redirect('/')
  }

  const isSubmitting = loginForm.formState.isSubmitting

  return (
    <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="email"
        control={loginForm.control}
        render={({ field }) => {
          const emailError = loginForm.formState.errors.email

          return (
            <div className="relative space-y-0.5">
              <Mail className="absolute top-3 left-3 size-4 text-accent" />
              <Input
                type="email"
                placeholder="Digite seu email"
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
        control={loginForm.control}
        render={({ field }) => {
          const passwordError = loginForm.formState.errors.password

          return (
            <div className="relative space-y-0.5">
              <Lock className="absolute top-3 left-3 size-4 text-accent" />
              <Input
                type={isOcult ? 'text' : 'password'}
                placeholder="Digite sua senha"
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
              <div className="flex items-center">
                {passwordError && (
                  <ErrorMessage>{passwordError.message}</ErrorMessage>
                )}
                <Link
                  href={'/forgot-password'}
                  className="ml-auto text-xs text-accent hover:text-accent/80 transition-colors duration-200"
                >
                  Esqueci a senha
                </Link>
              </div>
            </div>
          )
        }}
      />

      <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Acessar conta'
        )}
      </Button>
    </form>
  )
}
