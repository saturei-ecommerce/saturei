import type { Metadata } from "next";
import { SearchPageClientWrapper } from "./SearchPageClient";

export const metadata: Metadata = {
  title: "Pesquisar Anúncios",
  description:
    "Pesquise anúncios no Saturei com filtros por palavra-chave, categoria, localização e faixa de preço. Encontre o melhor negócio.",
  openGraph: {
    title: "Pesquisar Anúncios | Saturei",
    description: "Encontre produtos novos e usados com filtros poderosos no Saturei.",
    type: "website",
  },
};

export default function SearchPage() {
  return <SearchPageClientWrapper />;
}
