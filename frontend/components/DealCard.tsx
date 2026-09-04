import Link from "next/link";
import { Deal } from "@/lib/api";

export default function DealCard({
  deal,
  customerName,
}: {
  deal: Deal;
  customerName?: string;
}) {
  return (
    <Link
      href={`/deals/${deal.id}`}
      className="block rounded-lg border border-zinc-200 p-3 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
    >
      <p className="font-medium">{deal.title}</p>
      {customerName && <p className="text-sm text-zinc-500">{customerName}</p>}
      <p className="mt-2 text-sm font-semibold">¥{deal.amount.toLocaleString()}</p>
      {deal.expectedCloseDate && (
        <p className="mt-1 text-xs text-zinc-400">
          完了予定: {new Date(deal.expectedCloseDate).toLocaleDateString("ja-JP")}
        </p>
      )}
    </Link>
  );
}
