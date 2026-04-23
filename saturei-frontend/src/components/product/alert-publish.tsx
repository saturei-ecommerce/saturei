import { Check, Loader2 } from "lucide-react";
import { AlertDialog } from "radix-ui";

interface ConfirmPublishDialogProps {
  onConfirm: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

function ConfirmPublishDialog({
  onConfirm,
  disabled,
  isLoading,
}: ConfirmPublishDialogProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="w-full h-11 rounded-md bg-primary text-white text-sm font-medium hover:bg-purple-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              enviando...
            </>
          ) : (
            "publicar anúncio"
          )}
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <AlertDialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-200">
          <div className="flex flex-col items-center text-center gap-3 mb-6">
            <div className="size-14 rounded-full bg-green-50 flex items-center justify-center">
              <Check size={28} className="text-green-500" />
            </div>
            <AlertDialog.Title className="text-lg font-semibold text-gray-900">
              tudo pronto para publicar?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-sm text-gray-500 leading-relaxed">
              seu anúncio ficará visível para todos os compradores do Saturei
              assim que confirmado.
            </AlertDialog.Description>
          </div>

          <div className="flex flex-col gap-2">
            <AlertDialog.Action asChild>
              <button
                type="button"
                onClick={onConfirm}
                className="w-full h-11 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-purple-700 active:scale-[0.98] transition-all"
              >
                sim, publicar agora
              </button>
            </AlertDialog.Action>
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                className="w-full h-11 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 active:scale-[0.98] transition-all"
              >
                voltar e revisar
              </button>
            </AlertDialog.Cancel>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export { ConfirmPublishDialog };
