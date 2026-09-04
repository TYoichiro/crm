"use client";

import { useEffect, useState } from "react";
import { api, Customer } from "@/lib/api";
import Modal from "./Modal";

export default function DealFormModal({
  customerId,
  onClose,
  onCreated,
}: {
  customerId?: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState(customerId ?? "");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [expectedCloseDate, setExpectedCloseDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      api.getCustomers().then(setCustomers).catch(() => {});
    }
  }, [customerId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.createDeal({
        customerId: selectedCustomerId,
        title,
        amount: Number(amount),
        expectedCloseDate: expectedCloseDate || undefined,
      });
      onCreated();
      onClose();
    } catch {
      setError("作成に失敗しました");
      setSubmitting(false);
    }
  }

  return (
    <Modal title="商談の新規作成" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {!customerId && (
          <div>
            <label className="block text-sm font-medium">顧客</label>
            <select
              required
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-transparent"
            >
              <option value="" disabled>
                選択してください
              </option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>
        )}
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
          <label className="block text-sm font-medium">完了予定日</label>
          <input
            type="date"
            value={expectedCloseDate}
            onChange={(e) => setExpectedCloseDate(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-transparent"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !selectedCustomerId}
          className="w-full rounded bg-foreground py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          作成
        </button>
      </form>
    </Modal>
  );
}
