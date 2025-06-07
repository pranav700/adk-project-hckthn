import { BASE } from "@/lib/constants";

export type DashboardEntry = {
  request_id: string;
  quote_id: string;
  company_name: string;
  status: string;
  last_updated: string;
};

export async function fetchDashboardData(): Promise<DashboardEntry[]> {
  const response = await fetch(`${BASE}/dashboard-data`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return await response.json();
}
