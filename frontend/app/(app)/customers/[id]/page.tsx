"use client";

import { use, useCallback, useEffect, useState } from "react";
import { Activity, api, CustomerDetail } from "@/lib/api";
import DealCard from "@/components/DealCard";
import DealFormModal from "@/components/DealFormModal";
import ActivityTimeline from "@/components/ActivityTimeline";
import ActivityModal from "@/components/ActivityModal";

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDealModal, setShowDealModal] = useState(false);
  const [activityModal, setActivityModal] = useState<{ activity?: Activity } | null>(null);

  const load = useCallback(() => {
    api
      .getCustomer(id)
      .then(setCustomer)
      .catch(() => setError("顧客情報の取得に失敗しました"));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDeleteActivity(activityId: string) {
    if (!confirm("この活動を削除しますか？")) return;
    await api.deleteActivity(activityId);
    load();
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!customer) return <p className="text-sm text-zinc-500">読み込み中...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">{customer.companyName}</h1>
        <p className="text-sm text-zinc-500">{customer.contactName}</p>
        <p className="mt-1 text-sm text-zinc-400">
          {customer.email ?? "-"} / {customer.phone ?? "-"}
        </p>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-500">商談</h2>
          <button
            type="button"
            onClick={() => setShowDealModal(true)}
            className="rounded border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
          >
            新規商談
          </button>
        </div>
        {customer.deals.length === 0 ? (
          <p className="text-sm text-zinc-500">商談はまだありません</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {customer.deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-500">活動履歴</h2>
          <button
            type="button"
            onClick={() => setActivityModal({})}
            className="rounded border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
          >
            活動を追加
          </button>
        </div>
        <ActivityTimeline
          activities={customer.activities}
          onEdit={(activity) => setActivityModal({ activity })}
          onDelete={handleDeleteActivity}
        />
      </div>

      {showDealModal && (
        <DealFormModal
          customerId={customer.id}
          onClose={() => setShowDealModal(false)}
          onCreated={load}
        />
      )}

      {activityModal && (
        <ActivityModal
          customerId={customer.id}
          activity={activityModal.activity}
          onClose={() => setActivityModal(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}
