import {
  AlignLeft,
  Clock,
  DollarSign,
  ImageIcon,
  Sparkles,
  Tag,
  Truck,
} from 'lucide-react'
import { AlertDialog } from 'radix-ui'

const tips = [
  {
    id: 'fotos',
    icon: ImageIcon,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    title: '4 fotos ou mais',
    description:
      'Use boa iluminação natural e fundo neutro. Fotografe frente, costas, etiqueta e detalhes. Anúncios com 4+ fotos vendem o dobro.',
  },
  {
    id: 'titulo',
    icon: Tag,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    title: 'título objetivo e completo',
    description:
      '"Vestido Farm Floral Midi Azul Tam M" converte muito mais que "vestido bonito". Inclua marca, modelo e característica principal.',
  },
  {
    id: 'descricao',
    icon: AlignLeft,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    title: 'descrição honesta',
    description:
      'Mencione o estado real, medidas exatas e eventuais defeitos. Transparência evita devoluções e gera avaliações positivas.',
  },
  {
    id: 'preco',
    icon: DollarSign,
    color: 'text-green-500',
    bg: 'bg-green-50',
    title: 'preço competitivo',
    description:
      'Pesquise produtos similares antes de definir o valor. Um preço levemente abaixo da concorrência acelera muito a venda.',
  },
  {
    id: 'frete',
    icon: Truck,
    color: 'text-pink-500',
    bg: 'bg-pink-50',
    title: 'ofereça frete acessível',
    description:
      'Calcule o peso corretamente e considere absorver parte do frete. Vendedores com frete grátis têm 40% mais cliques.',
  },
  {
    id: 'resposta',
    icon: Clock,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
    title: 'responda rápido',
    description:
      'Vendedores que respondem em menos de 1 hora têm taxa de conversão 3x maior. Ative as notificações do aplicativo.',
  },
]
function TipsDialog() {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          type="button"
          className="text-sm font-semibold text-orange-500 mt-1 inline-block cursor-pointer hover:text-orange-600 transition-colors"
        >
          como deixar o anúncio mais atrativo
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <AlertDialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-200">
          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <Sparkles size={18} className="text-orange-500" />
              </div>
              <div>
                <AlertDialog.Title className="text-base font-semibold text-gray-900 leading-tight">
                  como deixar o anúncio mais atrativo
                </AlertDialog.Title>
                <AlertDialog.Description className="text-xs text-gray-400 mt-0.5">
                  siga essas dicas e venda muito mais rápido
                </AlertDialog.Description>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
            {tips.map((tip, i) => {
              const Icon = tip.icon
              return (
                <div key={tip.id} className="flex gap-3 items-start">
                  <div
                    className={`shrink-0 size-9 rounded-xl ${tip.bg} flex items-center justify-center mt-0.5`}
                  >
                    <Icon size={16} className={tip.color} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {tip.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                      {tip.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100">
            <AlertDialog.Action asChild>
              <button
                type="button"
                className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white text-sm font-semibold transition-all"
              >
                entendi, vou melhorar meu anúncio!
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

export { TipsDialog }
