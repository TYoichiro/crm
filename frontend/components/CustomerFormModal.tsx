"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import Modal from "./Modal";

export default function CustomerFormModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.createCustomer({
        companyName,
        contactName,
        email: email || undefined,
        phone: phone || undefined,
      });
      onCreated();
      onClose();
    } catch {
      setError("作成に失敗しました");
      setSubmitting(false);
    }
  }

  return (
    <Modal title="顧客の新規作成" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">会社名</label>
          <input
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">担当者名</label>
          <input
            required
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">メール</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">電話番号</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-transparent"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-foreground py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          作成
        </button>
      </form>
    </Modal>
  );
}
