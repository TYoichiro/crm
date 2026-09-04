const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type DealStatus = "NEW" | "IN_PROGRESS" | "WON" | "LOST";
export type ActivityType = "CALL" | "EMAIL" | "VISIT" | "NOTE";

export type Customer = {
  id: string;
  companyName: string;
  contactName: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
};

export type Deal = {
  id: string;
  customerId: string;
  title: string;
  amount: number;
  status: DealStatus;
  expectedCloseDate: string | null;
};

export type Activity = {
  id: string;
  customerId: string;
  dealId: string | null;
  type: ActivityType;
  content: string;
  createdAt: string;
};

export type CustomerDetail = Customer & { deals: Deal[]; activities: Activity[] };
export type DealDetail = Deal & { customer: Customer; activities: Activity[] };
export type DealWithCustomer = Deal & { customer: Customer };

export type DashboardSummary = {
  dealCount: number;
  totalAmount: number;
  statusBreakdown: Record<DealStatus, number>;
  recentActivities: Activity[];
};

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json();
}

export const api = {
  login: (id: string) =>
    apiFetch<{ id: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
  logout: () => apiFetch<void>("/api/auth/logout", { method: "POST" }),

  getCustomers: (q?: string) =>
    apiFetch<Customer[]>(`/api/customers${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  getCustomer: (id: string) => apiFetch<CustomerDetail>(`/api/customers/${id}`),
  createCustomer: (data: { companyName: string; contactName: string; email?: string; phone?: string }) =>
    apiFetch<Customer>("/api/customers", { method: "POST", body: JSON.stringify(data) }),
  updateCustomer: (
    id: string,
    data: Partial<{ companyName: string; contactName: string; email: string; phone: string }>
  ) => apiFetch<Customer>(`/api/customers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCustomer: (id: string) => apiFetch<void>(`/api/customers/${id}`, { method: "DELETE" }),

  getDeals: (status?: DealStatus) =>
    apiFetch<DealWithCustomer[]>(`/api/deals${status ? `?status=${status}` : ""}`),
  getDeal: (id: string) => apiFetch<DealDetail>(`/api/deals/${id}`),
  createDeal: (data: {
    customerId: string;
    title: string;
    amount: number;
    status?: DealStatus;
    expectedCloseDate?: string;
  }) => apiFetch<Deal>("/api/deals", { method: "POST", body: JSON.stringify(data) }),
  updateDeal: (
    id: string,
    data: Partial<{
      customerId: string;
      title: string;
      amount: number;
      status: DealStatus;
      expectedCloseDate: string;
    }>
  ) => apiFetch<Deal>(`/api/deals/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteDeal: (id: string) => apiFetch<void>(`/api/deals/${id}`, { method: "DELETE" }),

  getActivities: (params: { customerId?: string; dealId?: string }) => {
    const query = new URLSearchParams();
    if (params.customerId) query.set("customerId", params.customerId);
    if (params.dealId) query.set("dealId", params.dealId);
    const qs = query.toString();
    return apiFetch<Activity[]>(`/api/activities${qs ? `?${qs}` : ""}`);
  },
  createActivity: (data: { customerId: string; dealId?: string; type: ActivityType; content: string }) =>
    apiFetch<Activity>("/api/activities", { method: "POST", body: JSON.stringify(data) }),
  updateActivity: (id: string, data: Partial<{ dealId: string; type: ActivityType; content: string }>) =>
    apiFetch<Activity>(`/api/activities/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteActivity: (id: string) => apiFetch<void>(`/api/activities/${id}`, { method: "DELETE" }),

  getDashboardSummary: () => apiFetch<DashboardSummary>("/api/dashboard/summary"),
};
