import { Activity } from "@/lib/api";
import { ACTIVITY_TYPE_LABELS } from "@/lib/constants";

export default function ActivityTimeline({
  activities,
  onEdit,
  onDelete,
}: {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
}) {
  if (activities.length === 0) {
    return <p className="text-sm text-zinc-500">活動履歴はまだありません</p>;
  }

  const sorted = [...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
      {sorted.map((activity) => (
        <li key={activity.id} className="flex items-start justify-between gap-4 p-3 text-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {ACTIVITY_TYPE_LABELS[activity.type]}
              </span>
              <span className="text-xs text-zinc-400">
                {new Date(activity.createdAt).toLocaleString("ja-JP")}
              </span>
            </div>
            <p className="mt-1 whitespace-pre-wrap">{activity.content}</p>
          </div>
          <div className="flex shrink-0 gap-2 text-xs text-zinc-500">
            <button type="button" onClick={() => onEdit(activity)} className="hover:text-foreground">
              編集
            </button>
            <button type="button" onClick={() => onDelete(activity.id)} className="hover:text-red-600">
              削除
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
