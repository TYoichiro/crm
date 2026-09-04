"use client";

import { useCallback, useEffect, useState } from "react";
import { api, DealStatus, DealWithCustomer } from "@/lib/api";
import { DEAL_STATUSES, DEAL_STATUS_LABELS } from "@/lib/constants";
import DealCard from "@/components/DealCard";
import DealFormModal from "@/components/DealFormModal";

export default function DealsPage() {
  const [deals, setDeals] = useState<DealWithCustomer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const load = useCallback(() => {
    api
      .getDeals()
      .then(setDeals)
      .catch(() => setError("商談の取得に失敗しました"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStatusChange(dealId: string, status: DealStatus) {
    await api.updateDeal(dealId, { status });
    load();
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">商談パイプライン</h1>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          新規商談
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {DEAL_STATUSES.map((status) => {
          const columnDeals = deals.filter((d) => d.status === status);
          return (
            <div key={status} className="w-72 shrink-0">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-medium">{DEAL_STATUS_LABELS[status]}</h2>
                <span className="text-xs text-zinc-500">{columnDeals.length}件</span>
              </div>
              <div className="space-y-3">
                {columnDeals.map((deal) => (
                  <div key={deal.id} className="space-y-2">
                    <DealCard deal={deal} customerName={deal.customer.companyName} />
                    <select
                      value={deal.status}
                      onChange={(e) => handleStatusChange(deal.id, e.target.value as DealStatus)}
                      className="w-full rounded border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-transparent"
                    >
                      {DEAL_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {DEAL_STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <DealFormModal onClose={() => setShowCreateModal(false)} onCreated={load} />
      )}
    </div>
  );
}
