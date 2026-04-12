"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;   // 0-based
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = currentPage * pageSize + 1;
  const end = Math.min((currentPage + 1) * pageSize, totalElements);

  const pages = buildPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Paginação dos resultados"
      className="flex flex-col items-center gap-4 py-4"
    >
      {/* Range label */}
      <p className="text-sm text-[var(--muted)]">
        Mostrando <span className="font-semibold text-[var(--foreground)]">{start}–{end}</span>{" "}
        de <span className="font-semibold text-[var(--foreground)]">{totalElements.toLocaleString("pt-BR")}</span> resultados
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous */}
        <PageButton
          id="pagination-prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          aria-label="Página anterior"
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </PageButton>

        {/* Page numbers */}
        {pages.map((p, idx) =>
          p === "…" ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-10 text-center text-[var(--muted)] text-sm select-none"
            >
              …
            </span>
          ) : (
            <PageButton
              key={p}
              id={`pagination-page-${p}`}
              onClick={() => onPageChange(Number(p) - 1)}
              active={Number(p) - 1 === currentPage}
              aria-label={`Ir para página ${p}`}
              aria-current={Number(p) - 1 === currentPage ? "page" : undefined}
            >
              {p}
            </PageButton>
          )
        )}

        {/* Next */}
        <PageButton
          id="pagination-next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          aria-label="Próxima página"
        >
          <ChevronRight size={18} strokeWidth={2} />
        </PageButton>
      </div>
    </nav>
  );
}

// ─── Page Button ──────────────────────────────────────────────

interface PageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  id: string;
}

function PageButton({ active, children, disabled, id, ...rest }: PageButtonProps) {
  return (
    <button
      id={id}
      disabled={disabled}
      {...rest}
      className={`
        relative inline-flex items-center justify-center
        w-10 h-10 rounded-xl text-sm font-semibold
        transition-all duration-150 select-none
        ${active
          ? "bg-[var(--primary)] text-white shadow-md shadow-purple-200"
          : disabled
          ? "text-[var(--border)] cursor-not-allowed"
          : "text-[var(--foreground)] hover:bg-[var(--primary-50)] hover:text-[var(--primary)]"
        }
      `}
    >
      {children}
    </button>
  );
}

// ─── Page number builder ──────────────────────────────────────

function buildPageNumbers(current: number, total: number): (number | "…")[] {
  // current is 0-based; display is 1-based
  const cur = current + 1;

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const result: (number | "…")[] = [1];

  if (cur > 3) result.push("…");

  for (let p = Math.max(2, cur - 1); p <= Math.min(total - 1, cur + 1); p++) {
    result.push(p);
  }

  if (cur < total - 2) result.push("…");

  result.push(total);

  return result;
}
