import Link from "next/link";
import { Customer } from "@/lib/api";

export default function CustomerCard({ customer }: { customer: Customer }) {
  return (
    <Link
      href={`/customers/${customer.id}`}
      className="block rounded-lg border border-zinc-200 p-4 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
    >
      <p className="font-medium">{customer.companyName}</p>
      <p className="text-sm text-zinc-500">{customer.contactName}</p>
      <p className="mt-2 text-xs text-zinc-400">
        {customer.email ?? "-"} / {customer.phone ?? "-"}
      </p>
    </Link>
  );
}
