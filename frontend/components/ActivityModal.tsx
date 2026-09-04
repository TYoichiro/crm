"use client";

import { useState } from "react";
import { Activity, ActivityType, api } from "@/lib/api";
import { ACTIVITY_TYPES, ACTIVITY_TYPE_LABELS } from "@/lib/constants";
import Modal from "./Modal";

export default function ActivityModal({
  customerId,
  dealId,
  activity,
  onClose,
  onSaved,
}: {
  customerId: string;
  dealId?: string;
  activity?: Activity;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [type, setType] = useState<ActivityType>(activity?.type ?? "CALL");
  const [content, setContent] = useState(activity?.content ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (activity) {
        await api.updateActivity(activity.id, { type, content });
      } else {
        await api.createActivity({ customerId, dealId, type, content });
      }
      onSaved();
      onClose();
    } catch {
      setError("保存に失敗しました");
      setSubmitting(false);
    }
  }

  return (
    <Modal title={activity ? "活動を編集" : "活動を追加"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">種別</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ActivityType)}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-transparent"
          >
            {ACTIVITY_TYPES.map((t) => (
              <option key={t} value={t}>
                {ACTIVITY_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">内容</label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-transparent"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-foreground py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          保存
        </button>
      </form>
    </Modal>
  );
}
