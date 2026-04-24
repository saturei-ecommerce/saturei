import { Sparkles } from 'lucide-react'

export function Banner() {
  return (
    <div className="auth-background min-h-125 p-8 flex flex-col justify-between items-center bg-cover bg-center rounded-lg">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="size-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="size-5 text-accent" />
          </div>
          <span className="text-white font-semibold tracking-wide">
            Saturei
          </span>
        </div>
        <span className="text-sm font-medium text-white/60">© Saturei</span>
      </div>
      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-3">
          <span className="text-5xl text-white tracking-tighter font-serif">
            Cada item tem uma história
          </span>
          <span className="text-4xl text-white tracking-tighter font-serif">
            aqui ela continua
          </span>
        </div>
        <div className="w-32 h-1 bg-linear-to-br from-primary to-accent rounded-full" />
      </div>
    </div>
  )
}
