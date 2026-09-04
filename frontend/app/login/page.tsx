"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.login(id.trim());
      router.push("/dashboard");
    } catch {
      setError("ログインに失敗しました");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-zinc-200 p-8 dark:border-zinc-800"
      >
        <div>
          <h1 className="text-xl font-semibold">CRM ログイン</h1>
          <p className="mt-1 text-sm text-zinc-500">
            任意のIDを入力してください（パスワードは不要です）
          </p>
        </div>
        <div>
          <label htmlFor="id" className="block text-sm font-medium">
            ID
          </label>
          <input
            id="id"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-transparent"
            placeholder="例: yamada"
            autoFocus
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !id.trim()}
          className="w-full rounded bg-foreground py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          ログイン
        </button>
      </form>
    </div>
  );
}
