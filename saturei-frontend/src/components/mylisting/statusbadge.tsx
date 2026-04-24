import type { ListingStatus } from "@/http/mylistings/my-listings";

function StatusBadge({ status }: { status: ListingStatus }) {
  const styles: Record<ListingStatus, string> = {
    ACTIVE: "bg-green-50 text-green-600 border-green-100",
    PAUSED: "bg-yellow-50 text-yellow-600 border-yellow-100",
    SOLD: "bg-gray-50 text-gray-500 border-gray-100",
  };

  const labels: Record<ListingStatus, string> = {
    ACTIVE: "ativo",
    PAUSED: "pausado",
    SOLD: "vendido",
  };

  return <span className={`... ${styles[status]}`}>{labels[status]}</span>;
}

export { StatusBadge };
