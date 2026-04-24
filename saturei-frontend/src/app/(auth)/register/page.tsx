import Link from 'next/link'
import { RegisterForm } from '@/components/auth/register-form'
import { Separator } from '@/components/ui/separator'

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center p-5">
      <div className="max-w-lg w-full space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold">
            Comece agora <br /> sua jornada no{' '}
            <span className="bg-linear-to-br from-primary to-accent bg-clip-text text-transparent">
              Saturei
            </span>
          </h1>
          <p className="text-foreground/60">
            Cadastre-se para comprar e vender de forma simples e segura
          </p>
        </div>
        {/* <SocialLogin /> */}
        <Separator />
        <RegisterForm />
        <p className="text-sm text-muted-foreground text-center">
          Já tem uma conta?{' '}
          <Link
            href={'/login'}
            className="text-accent hover:text-accent/80 transition-colors duration-200"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
