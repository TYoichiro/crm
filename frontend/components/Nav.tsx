"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";

const NAV_ITEMS = [
  { href: "/dashboard", label: "ダッシュボード" },
  { href: "/customers", label: "顧客一覧" },
  { href: "/deals", label: "商談パイプライン" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await api.logout();
    router.push("/login");
  }

  return (
    <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-3 dark:border-zinc-800">
      <nav className="flex items-center gap-6">
        <span className="font-semibold">CRM</span>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              pathname.startsWith(item.href)
                ? "text-sm font-medium text-foreground"
                : "text-sm font-medium text-zinc-500 hover:text-foreground"
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        onClick={handleLogout}
        className="text-sm text-zinc-500 hover:text-foreground"
      >
        ログアウト
      </button>
    </header>
  );
}
