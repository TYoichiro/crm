"use client";

import { useCallback, useEffect, useState } from "react";
import { api, Customer } from "@/lib/api";
import CustomerCard from "@/components/CustomerCard";
import CustomerFormModal from "@/components/CustomerFormModal";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const load = useCallback((query?: string) => {
    api
      .getCustomers(query)
      .then(setCustomers)
      .catch(() => setError("顧客一覧の取得に失敗しました"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    load(q || undefined);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">顧客一覧</h1>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          新規顧客
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="会社名・担当者名で検索"
          className="w-full max-w-sm rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-transparent"
        />
        <button
          type="submit"
          className="rounded border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
        >
          検索
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {customers.length === 0 ? (
        <p className="text-sm text-zinc-500">顧客がいません</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CustomerFormModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => load(q || undefined)}
        />
      )}
    </div>
  );
}
