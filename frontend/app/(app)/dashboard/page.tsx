"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, DashboardSummary } from "@/lib/api";
import { ACTIVITY_TYPE_LABELS, DEAL_STATUSES, DEAL_STATUS_LABELS } from "@/lib/constants";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getDashboardSummary()
      .then(setSummary)
      .catch(() => setError("ダッシュボードの取得に失敗しました"));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!summary) return <p className="text-sm text-zinc-500">読み込み中...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">ダッシュボード</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <p className="text-sm text-zinc-500">商談件数</p>
          <p className="mt-1 text-2xl font-semibold">{summary.dealCount}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <p className="text-sm text-zinc-500">金額合計</p>
          <p className="mt-1 text-2xl font-semibold">
            ¥{summary.totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-zinc-500">ステータス別内訳</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {DEAL_STATUSES.map((status) => (
            <div
              key={status}
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <p className="text-sm text-zinc-500">{DEAL_STATUS_LABELS[status]}</p>
              <p className="mt-1 text-xl font-semibold">
                {summary.statusBreakdown[status]}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-zinc-500">直近の活動</h2>
        {summary.recentActivities.length === 0 ? (
          <p className="text-sm text-zinc-500">活動履歴はまだありません</p>
        ) : (
          <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {summary.recentActivities.map((activity) => (
              <li key={activity.id} className="flex items-center justify-between p-3 text-sm">
                <div>
                  <span className="mr-2 rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {ACTIVITY_TYPE_LABELS[activity.type]}
                  </span>
                  {activity.content}
                </div>
                <Link
                  href={`/customers/${activity.customerId}`}
                  className="text-zinc-500 hover:text-foreground"
                >
                  顧客を見る
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
