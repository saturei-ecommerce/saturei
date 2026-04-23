"use client";
import * as Popover from "@radix-ui/react-popover";
import { LogIn, Package, Plus, ShoppingBag, User } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href="/search"
          className="shrink-0 text-xl font-serif font-bold bg-linear-to-br from-primary to-accent bg-clip-text text-transparent"
        >
          Saturei
        </Link>

        {/* Actions */}
        <nav className="flex items-center gap-2 shrink-0">
          <Link
            href="/product"
            className="flex items-center gap-1.5 h-9 px-4 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 active:scale-[0.97] transition-all"
          >
            <Plus size={15} />
            vender
          </Link>

          <Link
            href="/cart"
            className="size-9 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="pedidos"
          >
            <ShoppingBag size={18} />
          </Link>

          <Popover.Root>
            <Popover.Trigger asChild>
              <button
                type="button"
                className="size-9 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="perfil"
              >
                <User size={18} />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                align="end"
                sideOffset={8}
                className="z-50 w-52 bg-white rounded-xl border border-gray-100 shadow-lg p-1.5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 duration-150"
              >
                <Link
                  href="/login"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <LogIn size={15} className="text-gray-400" />
                  entrar na conta
                </Link>
                <Link
                  href="/mylistings"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Package size={15} className="text-gray-400" />
                  meus anúncios
                </Link>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
