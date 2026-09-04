"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, api, DealDetail, DealStatus } from "@/lib/api";
import { DEAL_STATUSES, DEAL_STATUS_LABELS } from "@/lib/constants";
import ActivityTimeline from "@/components/ActivityTimeline";
import ActivityModal from "@/components/ActivityModal";

export default function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [deal, setDeal] = useState<DealDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activityModal, setActivityModal] = useState<{ activity?: Activity } | null>(null);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<DealStatus>("NEW");
  const [expectedCloseDate, setExpectedCloseDate] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api
      .getDeal(id)
      .then((d) => {
        setDeal(d);
        setTitle(d.title);
        setAmount(String(d.amount));
        setStatus(d.status);
        setExpectedCloseDate(d.expectedCloseDate ? d.expectedCloseDate.slice(0, 10) : "");
      })
      .catch(() => setError("商談情報の取得に失敗しました"));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateDeal(id, {
        title,
        amount: Number(amount),
        status,
        expectedCloseDate: expectedCloseDate || undefined,
      });
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("この商談を削除しますか？")) return;
    await api.deleteDeal(id);
    router.push("/deals");
  }

  async function handleDeleteActivity(activityId: string) {
    if (!confirm("この活動を削除しますか？")) return;
    await api.deleteActivity(activityId);
    load();
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!deal) return <p className="text-sm text-zinc-500">読み込み中...</p>;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/customers/${deal.customer.id}`}
          className="text-sm text-zinc-500 hover:text-foreground"
        >
          {deal.customer.companyName}
        </Link>
        <h1 className="text-xl font-semibold">{deal.title}</h1>
      </div>

      <form
        onSubmit={handleSave}
        className="max-w-md space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
      >
        <div>
          <label className="block text-sm font-medium">商談名</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">金額（円）</label>
          <input
            required
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">ステータス</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as DealStatus)}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-transparent"
          >
            {DEAL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {DEAL_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">完了予定日</label>
          <input
            type="date"
            value={expectedCloseDate}
            onChange={(e) => setExpectedCloseDate(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded bg-foreground py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            保存
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded border border-red-300 px-4 py-2 text-sm text-red-600 dark:border-red-900"
          >
            削除
          </button>
        </div>
      </form>

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
          activities={deal.activities}
          onEdit={(activity) => setActivityModal({ activity })}
          onDelete={handleDeleteActivity}
        />
      </div>

      {activityModal && (
        <ActivityModal
          customerId={deal.customer.id}
          dealId={deal.id}
          activity={activityModal.activity}
          onClose={() => setActivityModal(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}
