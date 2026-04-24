import Link from 'next/link'
import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center p-5">
      <div className="max-w-lg w-full space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold">Bem-vindo de volta!</h1>
          <p className="text-foreground/60">
            Compre, venda e acompanhe tudo em um só lugar
          </p>
        </div>
        {/* <SocialLogin /> */}
        {/* <Separator /> */}
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="text-sm text-muted-foreground text-center">
          Ainda não tem uma conta?{' '}
          <Link
            href={'/register'}
            className="text-accent hover:text-accent/80 transition-colors duration-200"
          >
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
