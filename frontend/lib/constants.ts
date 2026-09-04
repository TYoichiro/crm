import { ActivityType, DealStatus } from "./api";

export const DEAL_STATUSES: DealStatus[] = ["NEW", "IN_PROGRESS", "WON", "LOST"];

export const DEAL_STATUS_LABELS: Record<DealStatus, string> = {
  NEW: "新規",
  IN_PROGRESS: "商談中",
  WON: "受注",
  LOST: "失注",
};

export const ACTIVITY_TYPES: ActivityType[] = ["CALL", "EMAIL", "VISIT", "NOTE"];

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  CALL: "電話",
  EMAIL: "メール",
  VISIT: "訪問",
  NOTE: "メモ",
};
